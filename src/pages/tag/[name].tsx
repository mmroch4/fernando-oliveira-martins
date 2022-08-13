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
import { Card } from "../../components/Card";
import { Footer } from "../../components/Footer";
import { Grid } from "../../components/Grid";
import { Hero } from "../../components/Hero";
import { Input } from "../../components/Input";
import { Loading } from "../../components/Loading";
import {
  Icon,
  Item,
  ItemContainerHeader,
  ItemContainerHeaderTitle,
  ItemContainerHeaderTypo,
  ItemContainerItem,
  Navigation,
  StyledInnerContainer,
} from "../../components/Navigation";
import { Popover, StyledPopoverContent } from "../../components/Popover";
import { Toolbar } from "../../components/Toolbar";
import { StyledTooltipContent, Tooltip } from "../../components/Tooltip";
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
import { months } from "../../utils/months";

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
        <Input
          id="@search-input"
          icon={<TbSearch />}
          props={{
            type: "search",
            placeholder: "Pesquisar",
            value: search,
            onChange: (e) => setSearch(e.target.value),
          }}
        />

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
          <Input
            id="@search-input"
            icon={<TbSearch />}
            props={{
              type: "search",
              placeholder: "Pesquisar",
              value: search,
              onChange: (e) => setSearch(e.target.value),
            }}
          />
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

      <Grid>
        {values.map(({ id, slug, title, publishedAt, archive, categories }) => {
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
        })}
      </Grid>

      <Footer />
    </>
  );
};

export default Page;
