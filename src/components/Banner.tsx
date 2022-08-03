import { styled } from "../stitches/stitches.config";

const Container = styled("div", {
  width: "100%",

  padding: "0.875rem 1.5rem",

  background: "$backgroundSecondary",

  marginBottom: "1rem",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const Message = styled("p", {
  fontSize: "1.2rem",

  textAlign: "center",

  "& a": {
    cursor: "pointer",

    color: "$colorPrimary",
    textDecoration: "none",
  },
});

const FlagDivider = styled("span", {
  paddingInline: "0.5rem",
});

export function Banner() {
  return (
    <Container>
      <Message>
        Ajude <strong>Ucrânia</strong>
        <FlagDivider>🇺🇦</FlagDivider>
        <a
          target={"_blank"}
          rel={"noreferrer"}
          href={"https://opensource.fb.com/support-ukraine"}
        >
          Clique aqui e apoie o povo ucraniano
        </a>
      </Message>
    </Container>
  );
}
