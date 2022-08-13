import { styled } from "../stitches/stitches.config";

const Container = styled("main", {
  width: "100%",

  "& p": {
    textAlign: "center",

    fontSize: "1rem",
    lineHeight: "1.425rem",
  },

  "& p a": {
    cursor: "pointer",

    color: "$colorPrimary",
    fontWeight: "bold",
    textDecoration: "none",
  },

  "& p a:hover": {
    textDecoration: "underline",
  },
});

interface Props {
  children: JSX.Element | JSX.Element[];
}

export const Text = ({ children }: Props) => {
  return <Container>{children}</Container>;
};
