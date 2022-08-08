import { AxiosError } from "axios";
import type { GetServerSideProps, NextPage } from "next";
import { Loading } from "../../../components/Loading";
import { api } from "../../../services/api";

interface DataVer {
  ok: boolean;
  message: string;
  payload?: {
    email: string;
  };
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { token } = ctx.query;

  try {
    await api.post<DataVer>(`/api/newsletter/confirm/${token}`, {});

    return {
      props: {},
      redirect: {
        destination: "/newsletter/confirmar/confirmado",
        permanent: false,
      },
    };
  } catch (error) {
    const err = error as AxiosError<DataVer>;

    console.log(err);

    return {
      props: {},
      redirect: {
        destination: "/newsletter/confirmar/erro",
        permanent: false,
      },
    };
  }
};

const Page: NextPage = () => {
  return <Loading size={"lg"} />;
};

export default Page;
