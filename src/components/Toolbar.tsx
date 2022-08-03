import { ReactNode } from "react";
import { styled } from "../stitches/stitches.config";

const Container = styled("div", {
  display: "none",

  "@md599": {
    width: "100%",
    height: "2.5rem",

    marginBlock: "1rem",

    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    gap: "0.4rem",
  },
});

interface Props {
  children: ReactNode;
}

export const Toolbar = ({ children }: Props) => {
  return <Container>{children}</Container>;
};
