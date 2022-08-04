import { createStitches } from "@stitches/react";

export const { styled, getCssText, createTheme, globalCss } = createStitches({
  theme: {
    colors: {
      colorPrimary: "#0D6EFD",
      backgroundColorPrimary20: "rgba(13, 110, 253, 0.2)",
      backgroundColorPrimary30: "rgba(13, 110, 253, 0.3)",

      colorSecondary: "#c70039",
      backgroundColorSecondary20: "rgba(199, 0, 57, 0.2)",
      backgroundColorSecondary30: "rgba(199, 0, 57, 0.3)",

      colorTertiary: "#44A735",
      backgroundColorTertiary20: "rgba(68, 167, 53, 0.2)",
      backgroundColorTertiary30: "rgba(68, 167, 53, 0.3)",
    },
  },
  media: {
    md1023: "(max-width: 1023px)",
    md767: "(max-width: 767px)",
    md599: "(max-width: 599px)",
    md399: "(max-width: 399px)",
  },
});
