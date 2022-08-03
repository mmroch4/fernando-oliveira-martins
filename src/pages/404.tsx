import { NextPage } from "next";
import { Hero } from "../components/Hero";
import { Navigation } from "../components/Navigation";

const Page: NextPage = () => {
  return (
    <>
      <Navigation />

      <Hero
        share={{
          message: "",
          hide: true,
        }}
        content={{
          title: "Página não encontrada",
          subtitle:
            "A página que procura não existe, verifique se a URL está correta",
        }}
      />
    </>
  );
};

export default Page;
