import * as LabelPrimitive from "@radix-ui/react-label";
import { format } from "date-fns";
import PT from "date-fns/locale/pt";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { TbAdjustments, TbMinus, TbPlus, TbSearch } from "react-icons/tb";
import { CategoriesContainer } from "../..";
import { Footer } from "../../../components/Footer";
import { Hero } from "../../../components/Hero";
import { Loading } from "../../../components/Loading";
import {
  Icon,
  Input,
  Item,
  ItemContainerHeader,
  ItemContainerHeaderTitle,
  ItemContainerHeaderTypo,
  ItemContainerItem,
  Navigation,
  StyledInnerContainer,
} from "../../../components/Navigation";
import { Toolbar } from "../../../components/Toolbar";
import {
  Popover,
  StyledPopoverContent,
} from "../../../components/utils/Popover";
import {
  StyledTooltipContent,
  Tooltip,
} from "../../../components/utils/Tooltip";
import {
  Archive,
  Category,
  GetAllArchivesWithPostsDocument,
  GetAllArchivesWithPostsQuery,
  GetAllCategoriesDocument,
  GetAllCategoriesQuery,
  Post,
} from "../../../graphql/schema";
import { useFilter } from "../../../hooks/useFilter";
import { useSearch } from "../../../hooks/useSearch";
import { apolloClient } from "../../../lib/apollo";
import { styled } from "../../../stitches/stitches.config";
import { months } from "../../../utils/months";

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
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

  const {
    data: { categories },
  } = await apolloClient.query<GetAllCategoriesQuery>({
    query: GetAllCategoriesDocument,
  });

  return {
    props: {
      archive: selectedArchive,
      categories,
    },
    revalidate: 10 * 60, // 10 minutes
  };
};

interface IProps {
  archive: Archive;
  categories: Category[];
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

const Page: NextPage<IProps> = ({ archive, categories }) => {
  const { isFallback } = useRouter();

  const shareMessage = "Super recomendo esse conteúdo";

  const {
    values: searchedValues,
    search,
    setSearch,
  } = useSearch<Post>(archive.posts, ({ title }) => {
    return title.toLowerCase().includes(search.toLowerCase());
  });

  const { values, handleClick, handleClearFilters, isFilter } = useFilter<Post>(
    searchedValues,
    []
  );

  if (isFallback) return <Loading size={"md"} />;

  const [archiveMonth, archiveYear] = archive.name.split(" ") as string[];

  return (
    <>
      <Navigation>
        <LabelPrimitive.Root asChild htmlFor="search-input">
          <Item input>
            <TbSearch />

            <Input
              type="search"
              placeholder="Pesquisar"
              id="search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Item>
        </LabelPrimitive.Root>

        <Popover
          trigger={
            <Item>
              <TbAdjustments />
            </Item>
          }
          content={
            <StyledPopoverContent>
              <ItemContainerHeader>
                <ItemContainerHeaderTitle>Categorias</ItemContainerHeaderTitle>

                <Tooltip
                  trigger={
                    <ItemContainerHeaderTypo onClick={handleClearFilters}>
                      limpar
                    </ItemContainerHeaderTypo>
                  }
                  content={
                    <StyledTooltipContent>Limpar filtros</StyledTooltipContent>
                  }
                />
              </ItemContainerHeader>

              <CategoriesContainer>
                {categories.map((category) => {
                  return (
                    <ItemContainerItem
                      key={category.id}
                      active={isFilter(category.name.toLowerCase())}
                      onClick={() => handleClick(category.name.toLowerCase())}
                    >
                      {category.name}
                      <Icon>
                        {isFilter(category.name.toLowerCase()) ? (
                          <TbMinus />
                        ) : (
                          <TbPlus />
                        )}
                      </Icon>
                    </ItemContainerItem>
                  );
                })}
              </CategoriesContainer>
            </StyledPopoverContent>
          }
        />
      </Navigation>

      <Hero
        share={{
          message: shareMessage,
        }}
        content={{
          title: archive.name,
          subtitle: `Conteúdos publicados nos arquivos de ${archive.name}`,
        }}
      />

      <Toolbar>
        <StyledInnerContainer>
          <LabelPrimitive.Root asChild htmlFor="search-input">
            <Item input>
              <TbSearch />

              <Input
                type="search"
                placeholder="Pesquisar"
                id="search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Item>
          </LabelPrimitive.Root>
        </StyledInnerContainer>

        <StyledInnerContainer>
          <Popover
            trigger={
              <Item>
                <TbAdjustments />
              </Item>
            }
            content={
              <StyledPopoverContent>
                <ItemContainerHeader>
                  <ItemContainerHeaderTitle>
                    Categorias
                  </ItemContainerHeaderTitle>

                  <Tooltip
                    trigger={
                      <ItemContainerHeaderTypo onClick={handleClearFilters}>
                        limpar
                      </ItemContainerHeaderTypo>
                    }
                    content={
                      <StyledTooltipContent>
                        Limpar filtros
                      </StyledTooltipContent>
                    }
                  />
                </ItemContainerHeader>

                <CategoriesContainer>
                  {categories.map((category) => {
                    return (
                      <ItemContainerItem
                        key={category.id}
                        active={isFilter(category.name.toLowerCase())}
                        onClick={() => handleClick(category.name.toLowerCase())}
                      >
                        {category.name}
                        <Icon>
                          {isFilter(category.name.toLowerCase()) ? (
                            <TbMinus />
                          ) : (
                            <TbPlus />
                          )}
                        </Icon>
                      </ItemContainerItem>
                    );
                  })}
                </CategoriesContainer>
              </StyledPopoverContent>
            }
          />
        </StyledInnerContainer>
      </Toolbar>

      {archive.posts.length > 0 ? (
        <Main>
          <StyledPostsContainer>
            {values.map((post) => {
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
