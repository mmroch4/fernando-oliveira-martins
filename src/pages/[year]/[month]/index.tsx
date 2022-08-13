import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import { TbAdjustments, TbMinus, TbPlus, TbSearch } from "react-icons/tb";
import { CategoriesContainer } from "../..";
import { Card } from "../../../components/Card";
import { Footer } from "../../../components/Footer";
import { Grid } from "../../../components/Grid";
import { Hero } from "../../../components/Hero";
import { Input } from "../../../components/Input";
import { Loading } from "../../../components/Loading";
import {
  Icon,
  Item,
  ItemContainerHeader,
  ItemContainerHeaderTitle,
  ItemContainerHeaderTypo,
  ItemContainerItem,
  Navigation,
  StyledInnerContainer,
} from "../../../components/Navigation";
import { Popover, StyledPopoverContent } from "../../../components/Popover";
import { Toolbar } from "../../../components/Toolbar";
import { StyledTooltipContent, Tooltip } from "../../../components/Tooltip";
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

interface Props {
  archive: Archive;
  categories: Category[];
}

const EmptyMessage = styled("h2", {
  width: "100%",

  textAlign: "center",
});

const Page: NextPage<Props> = ({ archive, categories }) => {
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
        </StyledInnerContainer>
      </Toolbar>

      {archive.posts.length > 0 ? (
        <Grid>
          {values.map(({ id, slug, title, publishedAt, categories }) => {
            return (
              <Card
                key={id}
                slug={slug}
                title={title}
                publishedAt={publishedAt}
                archive={archive}
                categories={categories}
              />
            );
          })}
        </Grid>
      ) : (
        <EmptyMessage>Nenhum conteúdo encontrado</EmptyMessage>
      )}

      <Footer />
    </>
  );
};

export default Page;
