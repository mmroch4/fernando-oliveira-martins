import * as LabelPrimitive from "@radix-ui/react-label";
import { InputHTMLAttributes } from "react";
import { styled } from "../stitches/stitches.config";

const Container = styled("span", {
  cursor: "pointer",

  display: "flex",
  alignItems: "center",
  flexDirection: "row",
  justifyContent: "space-between",

  gap: "0.5rem",

  width: "fit-content",
  height: "100%",

  background: "transparent",

  border: "1px solid $borderPrimary",
  borderRadius: 10,

  padding: "0.5rem",

  "& svg": {
    width: "1.5rem",
    height: "1.5rem",

    fill: "none",
    stroke: "$fontPrimary",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  },

  "&:hover": {
    background: "$backgroundSecondary",
  },

  "@md399": {
    width: "100%",
  },
});

const StyledInput = styled("input", {
  cursor: "pointer",

  width: "100%",
  height: "100%",

  background: "transparent",

  outline: "none",
  border: "none",

  fontSize: "1rem",
  color: "$fontPrimary",

  "&::-webkit-search-cancel-button": {
    display: "none",
  },

  "&::placeholder": {
    color: "$fontPrimary",
  },
});

interface Props {
  id: string;
  icon: JSX.Element;

  props: InputHTMLAttributes<HTMLInputElement>;
}

export const Input = ({ id, icon, props }: Props) => {
  return (
    <LabelPrimitive.Root asChild htmlFor={id}>
      <Container>
        {icon}

        <StyledInput id={id} {...props} />
      </Container>
    </LabelPrimitive.Root>
  );
};
