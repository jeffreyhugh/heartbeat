import "../styles/globals.css";
import "nextra-theme-docs/style.css";
import React from "react";

export default function Nextra({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
