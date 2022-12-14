import * as PopoverPrimitive from "@radix-ui/react-popover";
import type { ReactNode } from "react";
import { styled } from "../stitches/stitches.config";

interface Props {
  trigger: ReactNode;
  content: ReactNode;
}

export function Popover({ trigger, content }: Props) {
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger>
      <PopoverPrimitive.Content asChild>{content}</PopoverPrimitive.Content>
    </PopoverPrimitive.Root>
  );
}

export const StyledPopoverContent = styled("div", {
  maxWidth: "300px",

  background: "$backgroundPrimary",
  border: "1px solid $borderPrimary",
  borderRadius: 10,

  padding: "0.5rem 1rem",
  margin: "0.5rem",
});
