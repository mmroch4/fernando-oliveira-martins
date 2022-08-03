import { format } from "date-fns";
import PT from "date-fns/locale/pt";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { Footer } from "../../../components/Footer";
import { Hero } from "../../../components/Hero";
import { Navigation } from "../../../components/Navigation";
import {
  Archive,
  GetAllArchivesWithPostsDocument,
  GetAllArchivesWithPostsQuery,
} from "../../../graphql/schema";
import { apolloClient } from "../../../lib/apollo";
import { styled } from "../../../stitches/stitches.config";
import { months } from "../../../utils/months";

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

interface Params extends ParsedUrlQuery {
  year: string;
  month: string;
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { year, month } = params as Params;

  const {
    data: { archives },
  } = await apolloClient.query<GetAllArchivesWithPostsQuery>({
    query: GetAllArchivesWithPostsDocument,
  });

  const selectedArchive = archives.find(({ name }) => {
    const [archiveMonth, archiveYear] = name.split(" ");

    return (
      archiveYear === year &&
      archiveMonth.toLowerCase() === months[Number(month) - 1]
    );
  });

  if (!selectedArchive)
    return {
      notFound: true,
      revalidate: 1 * 60 * 60, // 1 hour
    };

  return {
    props: {
      archive: selectedArchive,
    },
    revalidate: 10 * 60, // 10 minutes
  };
};

interface IProps {
  archive: Archive;
}

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

const EmptyMessage = styled("h2", {
  width: "100%",

  textAlign: "center",
});

const Page: NextPage<IProps> = ({ archive }) => {
  const { isFallback } = useRouter();

  const shareMessage = "Super recomendo esse conteúdo";

  if (isFallback) {
    return (
      <>
        <h1>Loading...</h1>
      </>
    );
  }

  const [archiveMonth, archiveYear] = archive.name.split(" ") as string[];

  return (
    <>
      <Navigation />

      <Hero
        share={{
          message: shareMessage,
        }}
        content={{
          title: archive.name,
          subtitle: `Conteúdos publicados nos arquivos de ${archive.name}`,
        }}
      />

      {archive.posts.length > 0 ? (
        <Main>
          <StyledPostsContainer>
            {archive.posts.map((post) => {
              return (
                <StyledPost key={post.id}>
                  <Link
                    href={`/${archiveYear}/${
                      months.indexOf(archiveMonth.toLowerCase()) + 1
                    }/${post.slug}`}
                  >
                    <h3>{post.title}</h3>
                  </Link>

                  <p>
                    Publicado em{" "}
                    {format(
                      new Date(post.publishedAt),
                      "EEEE', 'd' de 'MMMM' às 'k':'mm",
                      { locale: PT }
                    )}
                  </p>

                  <div>
                    {post.categories.map((category) => {
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
      ) : (
        <EmptyMessage>Nenhum conteúdo encontrado</EmptyMessage>
      )}

      <Footer />
    </>
  );
};

export default Page;
