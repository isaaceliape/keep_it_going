import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/keep_it_going_logo.png" />
        {/* Open Graph meta tags for social media */}
        <meta property="og:title" content="Keep It Going" />
        <meta
          property="og:description"
          content="Track your habits and keep your streaks going!"
        />
        <meta property="og:image" content="/keep_it_going_logo.png" />
        <meta property="og:url" content="https://yourdomain.com/" />
        <meta property="og:type" content="website" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
