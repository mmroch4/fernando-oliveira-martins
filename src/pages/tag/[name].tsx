import * as LabelPrimitive from "@radix-ui/react-label";
import { format } from "date-fns";
import PT from "date-fns/locale/pt";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import {
  TbAdjustments,
  TbBookmark,
  TbFolders,
  TbMinus,
  TbPlus,
  TbSearch,
} from "react-icons/tb";
import { CategoriesContainer, StyledArchives } from "..";
import { Footer } from "../../components/Footer";
import { Hero } from "../../components/Hero";
import { Loading } from "../../components/Loading";
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
} from "../../components/Navigation";
import { Toolbar } from "../../components/Toolbar";
import { Popover, StyledPopoverContent } from "../../components/utils/Popover";
import { StyledTooltipContent, Tooltip } from "../../components/utils/Tooltip";
import {
  Archive,
  Category,
  GetAllCategoriesWithPostsDocument,
  GetAllCategoriesWithPostsQuery,
  Post,
} from "../../graphql/schema";
import { useFilter } from "../../hooks/useFilter";
import { useSearch } from "../../hooks/useSearch";
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
    fallback: "blocking",
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

  const archives: typeof category["posts"][0]["archive"][] = [];

  category.posts.forEach((post) => {
    let has: boolean = false;

    for (const archive of archives) {
      if (post.archive?.id === archive?.id) {
        has = true;
      }
    }

    if (!has) archives.push(post.archive);
  });

  return {
    props: {
      category,
      categories,
      archives,
    },
    revalidate: 10 * 60, // 10 minutes
  };
};

interface Props {
  category: Category;
  categories: Category[];
  archives: Archive[];
}

const Page: NextPage<Props> = ({ category, archives, categories }) => {
  const { isFallback } = useRouter();

  const shareMessage = "Super recomendo esse conteúdo";

  const {
    values: searchedValues,
    search,
    setSearch,
  } = useSearch<Post>(category.posts, ({ title }) => {
    return title.toLowerCase().includes(search.toLowerCase());
  });

  const { values, handleClick, handleClearFilters, isFilter } = useFilter<Post>(
    searchedValues,
    [category.name.toLowerCase()]
  );

  if (isFallback) return <Loading size={"md"} />;

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
                {categories.map((value) => {
                  return (
                    <ItemContainerItem
                      key={value.id}
                      active={
                        value.id !== category.id
                          ? isFilter(value.name.toLowerCase())
                          : false
                      }
                      locked={value.id === category.id}
                      onClick={() => {
                        if (value.id !== category.id) {
                          handleClick(value.name.toLowerCase());
                        }
                      }}
                    >
                      {value.name}
                      <Icon>
                        {value.id === category.id ? (
                          <TbBookmark />
                        ) : (
                          <>
                            {isFilter(value.name.toLowerCase()) ? (
                              <TbMinus />
                            ) : (
                              <TbPlus />
                            )}
                          </>
                        )}
                      </Icon>
                    </ItemContainerItem>
                  );
                })}
              </CategoriesContainer>
            </StyledPopoverContent>
          }
        />

        <Popover
          trigger={
            <Item>
              <TbFolders />
            </Item>
          }
          content={
            <StyledPopoverContent>
              <StyledArchives>
                <h3>Arquivos</h3>

                <ul>
                  {archives.map((archive) => {
                    const [month, year] = archive.name.split(" ") as string[];

                    return (
                      <Link
                        key={archive.id}
                        href={`/${year}/${
                          months.indexOf(month.toLowerCase()) + 1
                        }/`}
                      >
                        <li>{archive.name}</li>
                      </Link>
                    );
                  })}
                </ul>
              </StyledArchives>
            </StyledPopoverContent>
          }
        />
      </Navigation>

      <Hero
        share={{
          message: shareMessage,
        }}
        content={{
          title: category.name,
          subtitle: category.description,
        }}
      />

      <Toolbar>
        <StyledInnerContainer
          style={{
            flex: 1,
          }}
        >
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
                  {categories.map((value) => {
                    return (
                      <ItemContainerItem
                        key={value.id}
                        active={
                          value.id !== category.id
                            ? isFilter(value.name.toLowerCase())
                            : false
                        }
                        locked={value.id === category.id}
                        onClick={() => {
                          if (value.id !== category.id) {
                            handleClick(value.name.toLowerCase());
                          }
                        }}
                      >
                        {value.name}
                        <Icon>
                          {value.id === category.id ? (
                            <TbBookmark />
                          ) : (
                            <>
                              {isFilter(value.name.toLowerCase()) ? (
                                <TbMinus />
                              ) : (
                                <TbPlus />
                              )}
                            </>
                          )}
                        </Icon>
                      </ItemContainerItem>
                    );
                  })}
                </CategoriesContainer>
              </StyledPopoverContent>
            }
          />

          <Popover
            trigger={
              <Item>
                <TbFolders />
              </Item>
            }
            content={
              <StyledPopoverContent>
                <StyledArchives>
                  <h3>Arquivos</h3>

                  <ul>
                    {archives.map((archive) => {
                      const [month, year] = archive.name.split(" ") as string[];

                      return (
                        <Link
                          key={archive.id}
                          href={`/${year}/${
                            months.indexOf(month.toLowerCase()) + 1
                          }/`}
                        >
                          <li>{archive.name}</li>
                        </Link>
                      );
                    })}
                  </ul>
                </StyledArchives>
              </StyledPopoverContent>
            }
          />
        </StyledInnerContainer>
      </Toolbar>

      <Main>
        <StyledPostsContainer>
          {values.map((value) => {
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
