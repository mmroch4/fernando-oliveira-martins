import {
  FacebookShareButton,
  RedditShareButton,
  TwitterShareButton,
} from "next-share";
import { useRouter } from "next/router";
import {
  TbBrandFacebook,
  TbBrandReddit,
  TbBrandTwitter,
  TbMail,
} from "react-icons/tb";
import { styled } from "../stitches/stitches.config";
import { domain } from "../utils/domain";
import { StyledTooltipContent, Tooltip } from "./Tooltip";

const Header = styled("header", {
  width: "100%",

  marginBlock: "1rem",

  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",

  gap: "0.4rem",
});

const Title = styled("h1", {
  fontSize: "2.25rem",

  textAlign: "center",
});

const Subtitle = styled("p", {
  fontSize: "1.2rem",

  textAlign: "center",
});

const Divider = styled("hr", {
  width: "4rem",
  background: "$backgroundSecondary",

  margin: "0.5rem 0 0.25rem",

  border: "1px solid $borderPrimary",
  borderRadius: 9999999,
});

const ShareContainer = styled("div", {
  width: "100%",

  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",

  gap: "0.5rem",
});

const ShareItem = styled("span", {
  width: "2.5rem",
  height: "2.5rem",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  background: "transparent",
  border: "none",
  borderRadius: "50%",

  cursor: "pointer",

  color: "$fontPrimary",

  "&:hover": {
    background: "$backgroundSecondary",
  },

  "& svg": {
    width: "1.5rem",
    height: "1.5rem",

    fill: "none",
    stroke: "$fontPrimary",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  },
});

interface Props {
  share: {
    hide?: boolean;
    message: string;
  };
  content?: {
    title: string;
    subtitle: string;
  };
}

export const Hero = ({ share: { message, hide }, content }: Props) => {
  const { asPath } = useRouter();

  const url = domain + asPath;

  return (
    <Header>
      <Title>{content?.title || "Fernando Oliveira Martins"}</Title>

      <Subtitle>
        {content?.subtitle ||
          "Site de apoio dos Blogues Geopedrados, GeoLeiria, XadrezLeiria e AstroLeiria"}
      </Subtitle>

      {hide ? (
        <></>
      ) : (
        <>
          <Divider />
          <ShareContainer>
            <TwitterShareButton url={url} title={message}>
              <Tooltip
                trigger={
                  <ShareItem>
                    <TbBrandTwitter />
                  </ShareItem>
                }
                content={
                  <StyledTooltipContent>
                    Compartilhar no Twitter
                  </StyledTooltipContent>
                }
              />
            </TwitterShareButton>

            <FacebookShareButton url={url} quote={message}>
              <Tooltip
                trigger={
                  <ShareItem>
                    <TbBrandFacebook />
                  </ShareItem>
                }
                content={
                  <StyledTooltipContent>
                    Compartilhar no Facebook
                  </StyledTooltipContent>
                }
              />
            </FacebookShareButton>

            <RedditShareButton url={url} title={message}>
              <Tooltip
                trigger={
                  <ShareItem>
                    <TbBrandReddit />
                  </ShareItem>
                }
                content={
                  <StyledTooltipContent>
                    Compartilhar no Reddit
                  </StyledTooltipContent>
                }
              />
            </RedditShareButton>

            <a
              style={{
                color: "inherit",
                textDecoration: "none",
              }}
              href={"mailto:mmrocha2112@gmail.com"}
            >
              <Tooltip
                trigger={
                  <ShareItem>
                    <TbMail />
                  </ShareItem>
                }
                content={
                  <StyledTooltipContent>
                    Envie-nos um email
                  </StyledTooltipContent>
                }
              />
            </a>
          </ShareContainer>
        </>
      )}
    </Header>
  );
};
