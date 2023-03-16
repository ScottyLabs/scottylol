import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Google Font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@300&display=swap"
          rel="stylesheet"
        />
        {/* Autodiscovery for Firefox */}
        <link
          rel="search"
          type="application/opensearchdescription+xml"
          title="scotty.lol"
          href="/opensearch.xml"
        />
        <link
          rel="search"
          type="application/opensearchdescription+xml"
          title="scotty.lol-noob"
          href="/opensearch_noob.xml"
        />

        {/* Browser Metadata */}
        <title>ScottyLOL</title>
        {/* <link rel="icon" type="image/png" href="/" /> */}
        <meta property="og:title" content="ScottyLOL - a new search engine" />
        <meta property="og:site_name" content="ScottyLOL" />
        <meta property="og:description" content="ScottyLOL Search Engine." />
        {/* <meta property="og:image" content="/assets/" /> */}
        {/* <meta name="theme-color" content="" /> */}
        <body className="bg-zinc-800">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
