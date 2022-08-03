import { ApolloProvider } from "@apollo/client";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Banner } from "../components/Banner";
import { apolloClient } from "../lib/apollo";
import { GlobalStyles } from "../stitches/global";
import { styled } from "../stitches/stitches.config";
import { darkTheme, lightTheme } from "../stitches/themes";

const Wrapper = styled("div", {
  maxWidth: 1024,
  width: "100%",

  marginInline: "auto",
  padding: "0 1.25rem 1.25rem",
});

function App({ Component, pageProps }: AppProps) {
  GlobalStyles();

  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        value={{
          light: lightTheme.className,
          dark: darkTheme.className,
        }}
      >
        <Head>
          <title>Fernando Oliveira Martins</title>
        </Head>

        <Banner />

        <Wrapper>
          <Component {...pageProps} />
        </Wrapper>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
