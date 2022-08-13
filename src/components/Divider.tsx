import { styled } from "../stitches/stitches.config";

const StyledDivider = styled("hr", {
  width: "4rem",
  background: "$backgroundSecondary",

  margin: "0.5rem 0 0.25rem",

  border: "1px solid $borderPrimary",
  borderRadius: 9999999,
});

export const Divider = () => {
  return <StyledDivider />;
};
