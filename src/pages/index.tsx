import * as LabelPrimitive from "@radix-ui/react-label";
import { format } from "date-fns";
import PT from "date-fns/locale/pt";
import type { GetStaticProps, NextPage } from "next";
import Link from "next/link";
import {
  TbAdjustments,
  TbFolders,
  TbMinus,
  TbPlus,
  TbSearch,
} from "react-icons/tb";
import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
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
} from "../components/Navigation";
import { Toolbar } from "../components/Toolbar";
import { Popover, StyledPopoverContent } from "../components/utils/Popover";
import { StyledTooltipContent, Tooltip } from "../components/utils/Tooltip";
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

export const Main = styled("main", {
  width: "100%",

  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",

  gap: "1rem",
});

export const StyledAside = styled("aside", {
  height: "100%",

  padding: "0.5rem 1rem",

  border: "1px solid $borderPrimary",
  borderRadius: 10,

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

  "@md599": {
    display: "none",
  },
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

interface IProps {
  posts: Post[];
  categories: Category[];
  archives: Archive[];
}

export const getStaticProps: GetStaticProps = async () => {
  const {
    data: { posts },
  } = await apolloClient.query<GetAllPostsQuery>({
    query: GetAllPostsDocument,
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
