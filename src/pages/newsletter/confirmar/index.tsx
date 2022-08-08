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
          title: "Confirmação pendente...",
          subtitle: `O email de confirmação foi enviado para ${str} e possivelmente caiu na caixa de Promoções ou Spam do seu email`,
        }}
      />
    </>
  );
};

export default Page;
