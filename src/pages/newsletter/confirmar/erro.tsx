import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { useReadLocalStorage } from "usehooks-ts";
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
      <Navigation />

      <Hero
        share={{
          hide: true,
          message: "",
        }}
        content={{
          title: "Erro!",
          subtitle: `${str} não pode ser registrado em nossa newsletter! Verifique se o email introduzido é um email válido ou se já está registrado em nossa newsletter`,
        }}
      />
    </>
  );
};

export default Page;
