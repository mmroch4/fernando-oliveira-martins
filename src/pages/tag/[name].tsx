import { format } from "date-fns";
import PT from "date-fns/locale/pt";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { Footer } from "../../components/Footer";
import { Hero } from "../../components/Hero";
import { Loading } from "../../components/Loading";
import { Navigation } from "../../components/Navigation";
import {
  Category,
  GetAllCategoriesWithPostsDocument,
  GetAllCategoriesWithPostsQuery,
} from "../../graphql/schema";
import { apolloClient } from "../../lib/apollo";
import { styled } from "../../stitches/stitches.config";
import { months } from "../../utils/months";

const Main = styled("main", {
  width: "100%",

  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",

  gap: "1rem",
});

const StyledPostsContainer = styled("div", {
  flex: "1",

  width: "100%",

  display: "flex",
  flexDirection: "column",

  gap: "0.5rem",
});

const StyledPost = styled("div", {
  width: "100%",

  padding: "0.5rem 1rem",

  background: "transparent",

  border: "1px solid $borderPrimary",
  borderRadius: 10,

  "& h3": {
    cursor: "pointer",

    fontSize: "1.375rem",
  },

  "& h3:hover": {
    color: "$colorPrimary",
  },

  "& p": { margin: "0.2rem 0 0.4rem" },

  "& div": {
    display: "flex",
    flexDirection: "row",
    gap: "0.4rem",
  },

  "& div span": {
    cursor: "pointer",

    background: "transparent",

    border: "1px solid $borderPrimary",
    borderRadius: 10,

    padding: "0.2rem 0.4rem",

    fontSize: "1rem",
  },

  "& div span:hover": {
    background: "$backgroundSecondary",
  },
});

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

interface Params extends ParsedUrlQuery {
  name: string;
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { name } = params as Params;

  const {
    data: { categories },
  } = await apolloClient.query<GetAllCategoriesWithPostsQuery>({
    query: GetAllCategoriesWithPostsDocument,
  });

  const category = categories.find(
    (category) => category.name.toLowerCase() === name.toLowerCase()
  );

  if (!category) {
    return {
      notFound: true,
      revalidate: 1 * 60 * 60, // 1 hour
    };
  }

  return {
    props: {
      category,
    },
    revalidate: 10 * 60, // 10 minutes
  };
};

interface Props {
  category: Category;
}

const Page: NextPage<Props> = ({ category }) => {
  const { isFallback } = useRouter();

  const shareMessage = "Super recomendo esse conteúdo";

  if (isFallback)
    return (
      <>
        <Loading size={"md"} />
      </>
    );

  return (
    <>
      <Navigation />

      <Hero
        share={{
          message: shareMessage,
        }}
        content={{
          title: category.name,
          subtitle: category.description,
        }}
      />

      <Main>
        <StyledPostsContainer>
          {category.posts.map((value) => {
            const [month, year] = value.archive?.name.split(" ") as string[];

            return (
              <StyledPost key={value.id}>
                <Link
                  href={`/${year}/${months.indexOf(month.toLowerCase()) + 1}/${
                    value.slug
                  }`}
                >
                  <h3>{value.title}</h3>
                </Link>

                <p>
                  Publicado em{" "}
                  {format(
                    new Date(value.publishedAt),
                    "EEEE', 'd' de 'MMMM' às 'k':'mm",
                    { locale: PT }
                  )}
                </p>

                <div>
                  {value.categories.map((category) => {
                    return (
                      <Link
                        href={`/tag/${category.name.toLowerCase()}`}
                        key={category.id}
                      >
                        <span>{category.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </StyledPost>
            );
          })}
        </StyledPostsContainer>
      </Main>

      <Footer />
    </>
  );
};

export default Page;
