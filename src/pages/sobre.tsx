import { NextPage } from "next";
import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
import { Navigation } from "../components/Navigation";
import { styled } from "../stitches/stitches.config";

const Content = styled("main", {
  width: "100%",

  "& p": {
    textAlign: "center",

    fontSize: "1rem",
    lineHeight: "1.425rem",
  },

  "& p a": {
    cursor: "pointer",

    color: "$colorPrimary",
    fontWeight: "bold",
    textDecoration: "none",
  },

  "& p a:hover": {
    textDecoration: "underline",
  },
});

const Page: NextPage = () => {
  return (
    <>
      <Navigation />

      <Hero
        share={{
          message: "",
        }}
      />

      <Content>
        <p>
          Olá!! Chamo-me <strong>Fernando Oliveira Martins</strong>, sou geólogo
          e professor...
        </p>
      </Content>

      <Footer />
    </>
  );
};

export default Page;
