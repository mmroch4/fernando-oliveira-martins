import Link from "next/link";
import { Archive, Category } from "../graphql/schema";
import { formatDate } from "../services/format-date";
import GetURL from "../services/get-url";
import { styled } from "../stitches/stitches.config";

const Container = styled("div", {
  width: "100%",

  padding: "0.5rem 1rem",

  background: "transparent",

  border: "1px solid $borderPrimary",
  borderRadius: 10,
});

const Title = styled("h3", {
  cursor: "pointer",

  fontSize: "1.375rem",

  "&:hover": {
    color: "$colorPrimary",
  },
});

const PublishedAt = styled("p", {
  margin: "0.2rem 0 0.4rem",
});

const Categories = styled("div", {
  display: "flex",
  flexDirection: "row",
  gap: "0.4rem",
});

const Category = styled("span", {
  cursor: "pointer",

  background: "transparent",

  border: "1px solid $borderPrimary",
  borderRadius: 10,

  padding: "0.2rem 0.4rem",

  fontSize: "1rem",

  "&:hover": {
    background: "$backgroundSecondary",
  },
});

interface Props {
  slug: string;
  title: string;
  publishedAt: Date;
  categories: Category[];
  archive: Archive;
}

export const Card = ({
  slug,
  title,
  publishedAt,
  archive,
  categories,
}: Props) => {
  const href = GetURL.post(slug, archive);

  return (
    <Container>
      <Link href={href}>
        <Title>{title}</Title>
      </Link>

      <PublishedAt>Publicado em {formatDate(publishedAt)}</PublishedAt>

      <Categories>
        {categories.map(({ id, name }) => {
          const categoryHref = GetURL.category(name);

          return (
            <Link href={categoryHref} key={id}>
              <Category>{name}</Category>
            </Link>
          );
        })}
      </Categories>
    </Container>
  );
};
