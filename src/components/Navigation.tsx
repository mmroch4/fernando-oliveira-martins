import { useTheme } from "next-themes";
import Link from "next/link";
import { TbFingerprint, TbHome, TbPalette, TbSettings } from "react-icons/tb";
import { styled } from "../stitches/stitches.config";
import { Popover, StyledPopoverContent } from "./utils/Popover";
import { StyledTooltipContent, Tooltip } from "./utils/Tooltip";

const StyledNav = styled("nav", {
  width: "100%",
  height: "2.5rem",

  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",

  gap: "0.4rem",
});

export const StyledInnerContainer = styled("div", {
  height: "100%",

  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",

  gap: "0.4rem",

  variants: {
    disable: {
      true: {
        "@md599": {
          display: "none",
        },
      },
    },
  },
});

export const Item = styled("span", {
  width: "2.5rem",
  height: "100%",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  background: "transparent",
  border: "1px solid $borderPrimary",
  borderRadius: 10,

  cursor: "pointer",

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

  variants: {
    input: {
      true: {
        flexDirection: "row",
        justifyContent: "space-between",

        gap: "0.5rem",

        width: "fit-content",

        padding: "0.5rem",

        "@md399": {
          width: "100%",
        },
      },
    },
  },
});

export const ItemContainerHeader = styled("div", {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",

  marginBottom: "0.5rem",
});

export const ItemContainerItem = styled("span", {
  cursor: "pointer",

  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",

  gap: "0.4rem",

  border: "1px solid $borderPrimary",
  borderRadius: 10,

  padding: "0.2rem 0.4rem",

  fontSize: "1rem",

  "&:hover": {
    background: "$backgroundSecondary",
  },

  variants: {
    active: {
      true: {
        "& span": {
          background: "$backgroundColorSecondary30",

          "& svg": {
            stroke: "$colorSecondary",
          },
        },
      },
    },
    locked: {
      true: {
        cursor: 'not-allowed',

        "& span": {
          background: "$backgroundColorTertiary30",

          "& svg": {
            stroke: "$colorTertiary",
          },
        },
      },
    },
  },
});

export const Icon = styled("span", {
  width: "1.25rem",
  height: "1.25rem",

  background: "$backgroundColorPrimary20",
  borderRadius: "50%",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  "& svg": {
    width: "1rem",
    height: "1rem",

    fill: "none",
    stroke: "$colorPrimary",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  },
});

export const Input = styled("input", {
  cursor: "pointer",

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

  "@md599": {
    width: "100%",
  },
});

export const ItemContainerHeaderTitle = styled("span", {
  fontSize: "1.2rem",

  fontWeight: "bold",
});

export const ItemContainerHeaderTypo = styled("span", {
  cursor: "pointer",

  "&:hover": {
    textDecoration: "underline",
  },
});

const ConfigBox = styled("span", {
  background: "transparent",

  padding: "0.2rem 0.4rem",

  border: "1px solid $borderPrimary",
  borderRadius: 10,
});

const ConfigContainer = styled("div", {
  width: "100%",

  display: "flex",
  flexDirection: "column",

  gap: "0.8rem",
});

const StyledLink = styled(Link, {
  width: "2.5rem",
  height: "100%",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  background: "transparent",
  border: "1px solid $borderPrimary",
  borderRadius: 10,

  cursor: "pointer",

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

  variants: {
    input: {
      true: {
        flexDirection: "row",
        justifyContent: "space-between",

        gap: "0.5rem",

        width: "fit-content",

        padding: "0.5rem",
      },
    },
  },
});

interface Props {
  children?: JSX.Element | JSX.Element[];
}

export const Navigation = ({ children }: Props) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <StyledNav>
      <StyledInnerContainer>
        <Tooltip
          trigger={
            <StyledLink href={"/"} legacyBehavior={false}>
              <TbHome />
            </StyledLink>
          }
          content={
            <StyledTooltipContent>Página principal</StyledTooltipContent>
          }
        />

        <Tooltip
          trigger={
            <StyledLink href={"/sobre"} legacyBehavior={false}>
              <TbFingerprint />
            </StyledLink>
          }
          content={<StyledTooltipContent>Página sobre</StyledTooltipContent>}
        />
      </StyledInnerContainer>

      <StyledInnerContainer disable={true}>{children}</StyledInnerContainer>

      <StyledInnerContainer>
        <Tooltip
          trigger={
            <Item onClick={toggleTheme}>
              <TbPalette />
            </Item>
          }
          content={<StyledTooltipContent>Mudar tema</StyledTooltipContent>}
        />

        <Popover
          trigger={
            <Item>
              <TbSettings />
            </Item>
          }
          content={
            <StyledPopoverContent>
              <ItemContainerHeader>
                <ItemContainerHeaderTitle>
                  Configurações
                </ItemContainerHeaderTitle>
              </ItemContainerHeader>

              <ConfigContainer>
                <p>
                  Idiomas <ConfigBox>Português</ConfigBox>
                </p>
                <p>
                  Versão <ConfigBox>1.7.2</ConfigBox>
                </p>
              </ConfigContainer>
            </StyledPopoverContent>
          }
        />
      </StyledInnerContainer>
    </StyledNav>
  );
};
