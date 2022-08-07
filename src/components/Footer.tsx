import { AxiosError } from "axios";
import { Magic } from "magic-sdk";
import { SubmitHandler, useForm } from "react-hook-form";
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
  ok: true;
  message: string;
  payload?: {
    createded: string;
    published: string;
  };
}

const MAGIC_PUBLISHABLE_KEY = process.env
  .NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY as string;

export const Footer = () => {
  const { register, handleSubmit } = useForm<Values>();

  const onSubmit: SubmitHandler<Values> = async ({ email }) => {
    const magic = new Magic(MAGIC_PUBLISHABLE_KEY);

    const didToken = await magic.auth.loginWithMagicLink({ email });

    try {
      await api.post<Data>(
        "/api/newsletter/register",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${didToken}`,
          },
        }
      );

      alert(`${email} registrado com sucesso em nossa newsletter`);
    } catch (error) {
      const err = error as AxiosError<Data>;

      alert(err.response?.data.message as string);
    }
  };

  return (
    <Container>
      <Divider />

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
