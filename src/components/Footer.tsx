import { styled } from "../stitches/stitches.config";

const Container = styled("footer", {
  display: "flex",
  flexDirection: "column",
  justifyItems: "center",
  alignItems: "center",

  width: "100%",
});

const Divider = styled("hr", {
  width: "4rem",
  background: "$backgroundSecondary",

  margin: "1.25rem 0 0.9375rem",

  border: "1px solid $borderPrimary",
  borderRadius: 9999999,
});

const Message = styled("p", {
  "& a": {
    cursor: "pointer",

    color: "$fontPrimary",
    fontWeight: "bold",
    textDecoration: "none",
  },

  "& a:hover": {
    textDecoration: "underline",
  },
});

export const Footer = () => {
  return (
    <Container>
      <Divider />

      <Message>
        Feito por{" "}
        <a href={"https://github.com/mmroch4"} target="_blank" rel="noreferrer">
          Miguel Rocha
        </a>
      </Message>
    </Container>
  );
};
