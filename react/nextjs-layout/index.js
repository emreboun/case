import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import Head from "next/head";

import { wrapper } from "../store/store";
import Layout from "../components/layout";

function App({ Component, pageProps }) {
  const getLayout =
    Component.getLayout ||
    (Component.WrappedComponent && Component.WrappedComponent.getLayout) ||
    ((page) => page);
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Layout>{getLayout(<Component {...pageProps} />)}</Layout>
    </>
  );
}

export default wrapper.withRedux(App);
