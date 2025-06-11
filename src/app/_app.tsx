import { AppProps } from "next/app";
import { useEffect } from "react";
import "../globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(
        () => console.log("Service Worker Registered"),
        (err) => console.error("Service Worker Registration Failed", err)
      );
    }
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
