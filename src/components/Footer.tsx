import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import { TbMail, TbSend } from "react-icons/tb";
import { useLocalStorage } from "usehooks-ts";
import { api } from "../services/api";
import { styled } from "../stitches/stitches.config";
import { Input } from "./Input";
import { StyledTooltipContent, Tooltip } from "./Tooltip";

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

  marginBlock: "1rem",

  border: "1px solid $borderPrimary",
  borderRadius: 9999999,
});

const Form = styled("form", {
  marginTop: "1rem",

  width: "100%",
  height: "2.5rem",

  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",

  gap: "0.5rem",

  "& button": {
    width: "2.5rem",
    height: "2.5rem",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    background: "$backgroundColorPrimary20",
    border: "1px solid transparent",
    borderRadius: 10,

    cursor: "pointer",

    "& svg": {
      width: "1.5rem",
      height: "1.5rem",

      fill: "none",
      stroke: "$colorPrimary",
      strokeWidth: 1.5,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },

    "&:hover": {
      background: "$backgroundColorPrimary30",
    },
  },
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

      <h2
        style={{
          textAlign: "center",
        }}
      >
        Junte-se a nossa newsletter
      </h2>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          id="@newsletter-join-input"
          icon={<TbMail />}
          props={{
            type: "email",
            placeholder: "ex: exemplo@gmail.com",
            ...register("email"),
          }}
        />

        <Tooltip
          trigger={
            <button type="submit">
              <TbSend />
            </button>
          }
          content={<StyledTooltipContent>Inscrever-me</StyledTooltipContent>}
        />
      </Form>

      <Divider />

      <Message>
        Feito por{" "}
        <a href={"https://github.com/mmroch4"} target="_blank" rel="noreferrer">
          Miguel Rocha
        </a>
      </Message>
    </Container>
  );
};
