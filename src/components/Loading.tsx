import { keyframes } from "@stitches/react";
import { styled } from "../stitches/stitches.config";

const Rotate = keyframes({
  "100%": {
    transform: "rotate(1turn)",
  },
});

const Container = styled("div", {
  position: "fixed",

  top: "0",
  left: 0,

  width: "100%",
  height: "100vh",

  background: "transparent",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const Spinner = styled("div", {
  display: "grid",

  animation: `${Rotate} 4s infinite`,

  "&::before, &::after": {
    content: "",
    gridArea: "1/1",
    border: "12px solid",
    borderRadius: "50%",
    borderColor: "$colorPrimary $colorPrimary #0000 #0000",
    mixBlendMode: "darken",
    animation: `${Rotate} 1s infinite linear`,
  },

  "&::after": {
    borderColor: "#0000 #0000 $borderPrimary $borderPrimary",
    animationDirection: "reverse",
  },

  variants: {
    size: {
      sm: {
        width: "4rem",
        height: "4rem",
      },
      md: {
        width: "5rem",
        height: "5rem",
      },
      lg: {
        width: "6rem",
        height: "6rem",
      },
    },
  },
});

interface Props {
  size: "sm" | "md" | "lg";
}

export const Loading = ({ size = "md" }: Props) => {
  return (
    <Container>
      <Spinner size={size} />
    </Container>
  );
};
