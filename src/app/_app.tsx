import { useEffect } from "react";
import "../globals.css";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(
        (registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        },
        (error) => {
          console.error("Service Worker registration failed:", error);
        }
      );
    }
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
