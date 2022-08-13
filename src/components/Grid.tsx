import { HTMLAttributes } from "react";
import { styled } from "../stitches/stitches.config";

const Container = styled("main", {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",

  gap: "0.5rem",

  width: "100%",

  overflow: "auto",
});

interface Props {
  children: JSX.Element | JSX.Element[];
  props?: HTMLAttributes<HTMLDivElement>;
}

export const Grid = ({ children, props }: Props) => {
  return <Container {...props}>{children}</Container>;
};
