/* eslint-disable import/no-anonymous-default-export */

import Heartbeat from "./public/heartbeat.svg";

export default {
  projectLink: "https://github.com/jeffreyhugh/heartbeat", // GitHub link in the navbar
  docsRepositoryBase: "https://github.com/jeffreyhugh/heartbeat/blob/main", // base URL for the docs repository
  titleSuffix: " | Heartbeat Docs",
  nextLinks: true,
  prevLinks: true,
  search: true,
  customSearch: null, // customizable, you can use algolia for example
  darkMode: true,
  footer: true,
  // footerText: `Heartbeat by Jeffrey Hugh`,
  footerText: ``,
  footerEditLink: `Edit this page`,
  font: false,
  logo: (
    <>
      <span style={{ display: "flex", alignItems: "center" }}>
        <Heartbeat
          style={{
            marginRight: "0.25rem",
            fontSize: "1.5rem",
            lineHeight: "2rem",
          }}
        />
        <span
          style={{
            fontSize: "1.125rem",
            lineHeight: "1.75rem",
            fontWeight: "700",
          }}
        >
          Heartbeat
        </span>
      </span>
    </>
  ),
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content="Nextra: the next docs builder" />
      <meta name="og:title" content="Nextra: the next docs builder" />
    </>
  ),
};
