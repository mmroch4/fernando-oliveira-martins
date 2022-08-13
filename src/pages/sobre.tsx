import { NextPage } from "next";
import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
import { Navigation } from "../components/Navigation";
import { Text } from "../components/Text";

const Page: NextPage = () => {
  return (
    <>
      <Navigation />

      <Hero
        share={{
          message: "",
        }}
      />

      <Text>
        <p>
          Olá!! Chamo-me <strong>Fernando Oliveira Martins</strong>, sou geólogo
          e professor...
        </p>
      </Text>

      <Footer />
    </>
  );
};

export default Page;
