import { differenceInMilliseconds, milliseconds } from "date-fns";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { Card } from "../../../components/Card";
import { Divider } from "../../../components/Divider";
import { Footer } from "../../../components/Footer";
import { Hero } from "../../../components/Hero";
import { Loading } from "../../../components/Loading";
import { Navigation } from "../../../components/Navigation";
import {
  Archive,
  GetAllArchivesWithPostsDocument,
  GetAllArchivesWithPostsQuery,
  GetAllPostsToSelectDocument,
  GetAllPostsToSelectQuery,
  GetPostDocument,
  GetPostQuery,
  Post,
} from "../../../graphql/schema";
import { apolloClient } from "../../../lib/apollo";
import { formatDate } from "../../../services/format-date";
import { RecommendPosts } from "../../../services/recommend-posts";
import { styled } from "../../../stitches/stitches.config";
import { months } from "../../../utils/months";

export const getStaticPaths: GetStaticPaths = async () => {
  const {
    data: { posts },
  } = await apolloClient.query<GetAllPostsToSelectQuery>({
    query: GetAllPostsToSelectDocument,
  });

  if (!posts || posts.length <= 0)
    return {
      paths: [],
      fallback: true,
    };

  const selectedPosts = posts.filter(({ publishedAt }) => {
    const diff = differenceInMilliseconds(new Date(), new Date(publishedAt));

    return diff <= milliseconds({ weeks: 1 });
  });

  if (selectedPosts.length <= 0)
    return {
      paths: [],
      fallback: true,
    };

  const paths = selectedPosts.map(({ slug, archive }) => {
    if (!archive) return;

    const [month, year] = archive.name.split(" ");

    return {
      params: {
        year,
        month: String(months.indexOf(month.toLowerCase()) + 1),
        slug,
      },
    };
  }) as Array<string | { params: ParsedUrlQuery; locale?: string }>;

  return {
    paths,
    fallback: true,
  };
};

interface IParams extends ParsedUrlQuery {
  year: string;
  month: string;
  slug: string;
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { year, month, slug } = params as IParams;

  const {
    data: { archives },
  } = await apolloClient.query<GetAllArchivesWithPostsQuery>({
    query: GetAllArchivesWithPostsDocument,
  });

  const selectedArchive = archives.find(({ name, posts }) => {
    const [archiveMonth, archiveYear] = name.split(" ");

    return (
      archiveYear === year &&
      archiveMonth.toLowerCase() === months[Number(month) - 1] &&
      posts.find((post) => post.slug === slug)
    );
  });

  if (!selectedArchive)
    return {
      notFound: true,
      revalidate: 10 * 60, // 10 minutes
    };

  const {
    data: { post },
  } = await apolloClient.query<GetPostQuery>({
    query: GetPostDocument,
    variables: {
      slug,
    },
  });

  if (!post)
    return {
      notFound: true,
      revalidate: 10 * 60, // 10 minutes
    };

  const recommendedPosts = await new RecommendPosts({
    number: 3,
    order: ["categories", "archive"],
    post: {
      id: post.id,
      archive: post.archive as { id: string },
      categories: post.categories,
    },
  }).recommend();

  return {
    props: {
      post,
      recommendedPosts: recommendedPosts,
    },
    revalidate: 10 * 60, // 10 minutes
  };
};

interface IProps {
  post: Post;
  recommendedPosts: Post[];
}

const StyledContent = styled("div", {
  flex: 1,

  width: "100%",

  "& ul, & ol": {
    listStylePosition: "inside",

    marginTop: "1rem",
  },

  "& li": {
    marginTop: "0.5rem",
  },

  "& li div": {
    display: "inline",
  },

  "& p": {
    marginTop: "0.6rem",
  },

  "& a": {
    color: "$colorPrimary",
    fontWeight: "bold",

    textDecoration: "none",
  },

  "& a:hover": {
    color: "$colorPrimary",

    textDecoration: "underline",
  },

  "& blockquote": {
    background: "$backgroundSecondary",

    borderLeft: "4px solid $colorPrimary",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,

    marginTop: "1rem",
    padding: "0.5rem 1rem",
  },

  "& code": {
    background: "$backgroundSecondary",

    borderRadius: 10,

    padding: "0.25rem 0.5rem",

    fontSize: "0.875rem",
    fontFamily: "inherit",
    letterSpacing: "0.1rem",
  },

  "& pre": {
    background: "$backgroundSecondary",

    borderRadius: 10,

    marginTop: "1rem",
    padding: "0.5rem 1rem",

    lineHeight: "1.2rem",
  },

  "& pre code": {
    background: "transparent",

    borderRadius: "none",

    padding: "none",
    letterSpacing: "normal",
  },

  "& table": {
    width: "100%",

    borderCollapse: "collapse",

    marginTop: "1rem",
  },

  "& table tr": {
    height: "2.5rem",
  },

  "& table td, & table th": {
    cursor: "pointer",

    padding: "0.2rem 0.4rem",

    border: "1px solid $borderPrimary",

    lineHeight: "100%",
    textAlign: "left",
  },

  "& table p": {
    margin: 0,
  },

  "& table th": {
    background: "$backgroundSecondary",
  },

  "& table tr:hover": {
    background: "$backgroundSecondary",
  },

  "& img": {
    maxWidth: "100%",
    height: "auto",

    marginTop: "1rem",
  },

  "& iframe": {
    width: "auto",
    height: "auto",

    marginTop: "1rem",
  },
});

const RecommendedPostsContainer = styled("div", {
  width: "100%",

  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",

  gap: "1rem",

  "@md1023": {
    flexDirection: "column",
  },
});

const Main = styled("main", {
  width: "100%",

  display: "flex",
  flexDirection: "column",
  alignItems: "center",

  gap: "1rem",
});

const StyledInfo = styled("div", {
  width: "100%",

  border: "1px solid $borderPrimary",
  borderRadius: 10,

  padding: "0.5rem 1rem",

  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",

  textAlign: "center",

  "& div": {
    height: "100%",

    display: "flex",
    flexDirection: "row",
    alignItems: "center",

    gap: "0.5rem",
  },

  "& div div": {
    height: "1rem",

    borderLeft: "1px solid $borderPrimary",
    borderRadius: 9999999999999,
  },

  "@md767": {
    flexDirection: "column",

    gap: "0.625rem",
  },
});

const StyledInfoBox = styled("span", {
  cursor: "pointer",

  borderRadius: 10,

  padding: "0.2rem 0.4rem",

  fontSize: "1rem",

  "&:hover": {
    textDecoration: "underline",
  },

  variants: {
    category: {
      true: {
        background: "$backgroundColorPrimary20",

        color: "$colorPrimary",

        "&:hover": {
          background: "$backgroundColorPrimary30",

          textDecoration: "none",
        },
      },
    },
  },
});

const Page: NextPage<IProps> = ({ post, recommendedPosts }) => {
  const { isFallback } = useRouter();

  if (isFallback) return <Loading size={"md"} />;

  const [archiveMonth, archiveYear] = post.archive?.name.split(" ") as string[];

  return (
    <>
      <Navigation />

      <Hero
        share={{
          message: "Super recomendo esse conteúdo",
        }}
        content={{
          title: post.title,
          subtitle: post.subtitle,
        }}
      />

      <Main>
        <StyledInfo>
          Publicado em {formatDate(post.publishedAt)}
          <div>
            <Link
              href={`/${archiveYear}/${String(
                months.indexOf(archiveMonth.toLowerCase()) + 1
              )}/`}
            >
              <StyledInfoBox>{post.archive?.name}</StyledInfoBox>
            </Link>
            <div></div>
            {post.categories.map((category) => {
              return (
                <Link
                  key={category.id}
                  href={`/tag/${category.name.toLowerCase()}`}
                >
                  <StyledInfoBox category>{category.name}</StyledInfoBox>
                </Link>
              );
            })}
          </div>
        </StyledInfo>

        <StyledContent
          dangerouslySetInnerHTML={{ __html: post.content.html }}
        />

        <Divider />

        <RecommendedPostsContainer>
          {recommendedPosts.map(
            ({ id, slug, title, publishedAt, archive, categories }) => {
              return (
                <Card
                  key={id}
                  slug={slug}
                  title={title}
                  publishedAt={publishedAt}
                  archive={archive as Archive}
                  categories={categories}
                />
              );
            }
          )}
        </RecommendedPostsContainer>
      </Main>

      <Footer />
    </>
  );
};

export default Page;
