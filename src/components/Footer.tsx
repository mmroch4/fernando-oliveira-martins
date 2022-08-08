import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { useLocalStorage } from "usehooks-ts";
import { api } from "../services/api";
import { styled } from "../stitches/stitches.config";

const Container = styled("footer", {
  display: "flex",
  flexDirection: "column",
  justifyItems: "center",
  alignItems: "center",

  width: "100%",
});

const Divider = styled("hr", {
  width: "4rem",
  background: "$backgroundSecondary",

  margin: "1.25rem 0 0.9375rem",

  border: "1px solid $borderPrimary",
  borderRadius: 9999999,
});

const Message = styled("p", {
  "& a": {
    cursor: "pointer",

    color: "$fontPrimary",
    fontWeight: "bold",
    textDecoration: "none",
  },

  "& a:hover": {
    textDecoration: "underline",
  },
});

interface Values {
  email: string;
}

interface Data {
  ok: boolean;
  message: string;
  payload?: {
    createded: string;
    published: string;
  };
}

export const Footer = () => {
  const { push } = useRouter();
  const { register, handleSubmit } = useForm<Values>();
  const [typedEmail, setTypedEmail] = useLocalStorage<string | null>(
    "typed@email",
    null
  );

  const onSubmit: SubmitHandler<Values> = async ({ email }) => {
    try {
      await api.post<Data>(
        "/api/newsletter/confirm",
        {
          email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setTypedEmail(email);

      push("/newsletter/confirmar/");
    } catch (error) {
      const err = error as AxiosError<Data>;

      alert(err.response?.data.message as string);
    }
  };

  return (
    <Container>
      <Divider />
      Junte-se a nossa newsletter
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="email" {...register("email")} />

        <button type="submit">Registrar</button>
      </form>
      <Message>
        Feito por{" "}
        <a href={"https://github.com/mmroch4"} target="_blank" rel="noreferrer">
          Miguel Rocha
        </a>
      </Message>
    </Container>
  );
};
