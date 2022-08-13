import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type { ReactNode } from "react";
import { styled } from "../stitches/stitches.config";

interface Props {
  trigger: ReactNode;
  content: ReactNode;
}

export function Tooltip({ trigger, content }: Props) {
  return (
    <TooltipPrimitive.Provider delayDuration={700} skipDelayDuration={250}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{trigger}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content asChild>{content}</TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

export const StyledTooltipContent = styled("div", {
  background: "$backgroundPrimary",
  border: "1px solid $borderPrimary",
  borderRadius: 10,

  marginBlock: "0.25rem",
  padding: "0.25rem 0.5rem",

  fontSize: "1rem",
});
