import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useReadLocalStorage } from "usehooks-ts";
import { Fireworks } from "../../../components/Fireworks";
import { Hero } from "../../../components/Hero";
import { Navigation } from "../../../components/Navigation";

const Page: NextPage = () => {
  const email = useReadLocalStorage<string>("typed@email");
  const [str, setStr] = useState<string | null>("");

  useEffect(() => {
    setStr(email);
  }, [email]);

  return (
    <>
      <Fireworks />

      <Navigation />

      <Hero
        share={{
          hide: true,
          message: "",
        }}
        content={{
          title: "Sucesso!",
          subtitle: `${str} foi registrado com sucesso em nossa newsletter`,
        }}
      />
    </>
  );
};

export default Page;
