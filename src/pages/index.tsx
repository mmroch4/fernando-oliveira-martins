import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import {
  TbAdjustments,
  TbFolders,
  TbMinus,
  TbPlus,
  TbSearch,
} from "react-icons/tb";
import { Card } from "../components/Card";
import { Footer } from "../components/Footer";
import { Grid } from "../components/Grid";
import { Hero } from "../components/Hero";
import { Input } from "../components/Input";
import {
  Icon,
  Item,
  ItemContainerHeader,
  ItemContainerHeaderTitle,
  ItemContainerHeaderTypo,
  ItemContainerItem,
  Navigation,
  StyledInnerContainer,
} from "../components/Navigation";
import { Popover, StyledPopoverContent } from "../components/Popover";
import { Toolbar } from "../components/Toolbar";
import { StyledTooltipContent, Tooltip } from "../components/Tooltip";
import {
  Archive,
  Category,
  GetAllArchivesDocument,
  GetAllArchivesQuery,
  GetAllCategoriesDocument,
  GetAllCategoriesQuery,
  GetAllPostsDocument,
  GetAllPostsQuery,
  Post,
} from "../graphql/schema";
import { useFilter } from "../hooks/useFilter";
import { useSearch } from "../hooks/useSearch";
import { apolloClient } from "../lib/apollo";
import { styled } from "../stitches/stitches.config";
import { months } from "../utils/months";

export const CategoriesContainer = styled("div", {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "0.25rem",
});

export const StyledArchives = styled("div", {
  "& h3": {
    marginBottom: "0.5rem",
  },

  "& ul": {
    listStylePosition: "inside",

    display: "flex",
    flexDirection: "column",
    gap: "0.4rem",
  },

  "& ul li": {
    cursor: "pointer",
  },

  "& ul li:hover": {
    color: "$colorPrimary",

    textDecoration: "underline",
  },
});

const LoadMoreButton = styled("button", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  width: "fit-content",
  background: "$backgroundColorPrimary20",

  padding: "1rem 2rem",

  border: "1px solid transparent",
  borderRadius: 10,

  textTransform: "lowercase",
  color: "$colorPrimary",

  cursor: "pointer",

  "&:hover": {
    background: "$backgroundColorPrimary30",
  },
});

interface IProps {
  posts: Post[];
  categories: Category[];
  archives: Archive[];
}

const skipBy = 10;

export const getStaticProps: GetStaticProps = async () => {
  const {
    data: { posts },
  } = await apolloClient.query<GetAllPostsQuery>({
    query: GetAllPostsDocument,
    variables: {
      skip: 0,
      first: skipBy,
    },
  });

  const {
    data: { archives },
  } = await apolloClient.query<GetAllArchivesQuery>({
    query: GetAllArchivesDocument,
  });

  const {
    data: { categories },
  } = await apolloClient.query<GetAllCategoriesQuery>({
    query: GetAllCategoriesDocument,
  });

  return {
    props: {
      posts,
      categories,
      archives: [...archives].sort((a, b) => {
        const [aMonth, aYear] = a.name.split(" ") as string[];
        const [bMonth, bYear] = b.name.split(" ") as string[];

        const aMonthNumber = Number(months.indexOf(aMonth.toLowerCase()) + 1);
        const bMonthNumber = Number(months.indexOf(bMonth.toLowerCase()) + 1);

        if (
          Number(aYear) > Number(bYear) &&
          (aMonthNumber > bMonthNumber ||
            aMonthNumber < bMonthNumber ||
            aMonthNumber === bMonthNumber)
        ) {
          return -1;
        } else if (
          Number(aYear) < Number(bYear) &&
          (aMonthNumber < bMonthNumber ||
            aMonthNumber > bMonthNumber ||
            aMonthNumber === bMonthNumber)
        ) {
          return 1;
        } else if (
          Number(aYear) === Number(bYear) &&
          aMonthNumber > bMonthNumber
        ) {
          return -1;
        } else if (
          Number(aYear) === Number(bYear) &&
          aMonthNumber < bMonthNumber
        ) {
          return 1;
        }

        return 0;
      }),
    },
    revalidate: 1 * 60, // 1 minute
  };
};

const Page: NextPage<IProps> = ({ posts, categories, archives }) => {
  const {
    values: searchedValues,
    search,
    setSearch,
  } = useSearch<Post>(posts, ({ title }) => {
    return title.toLowerCase().includes(search.toLowerCase());
  });

  const { values, handleClick, handleClearFilters, isFilter } = useFilter<Post>(
    searchedValues,
    []
  );

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
          message: "My awesome excerpt",
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
