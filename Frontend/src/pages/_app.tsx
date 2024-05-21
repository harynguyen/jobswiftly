import { type AppType } from "next/dist/shared/lib/utils";
import Head from "next/head";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {

  return (
    <>
      <Head>
        <title>JobSwiftly</title>
        <meta
          name="description"
          content="JobSwiftly"
        />
        <link rel="icon" href="/icon.png" />
        <meta name="theme-color" content="#251754" />
        <meta name="apple-mobile-web-app-capable" content="yes"></meta>
        <meta name="mobile-web-app-capable" content="yes"></meta>
        <link rel="manifest" href="/app.webmanifest" />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;