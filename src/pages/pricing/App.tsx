import { useEffect } from "react";

/* hrone.cloud/plans-pricing — lifted as-is from a saved copy of the live page
   (public/legacy/hrone-pricing, built from the browser save in /pricing with trackers
   stripped). It runs in a full-viewport frame because it needs the live site's
   WordPress stylesheets and jQuery scripts, which would clash with Tailwind here. */
const SRC = "/legacy/hrone-pricing/index.html";

export default function Pricing() {
  /* the tab shows this document's title, not the framed page's */
  useEffect(() => {
    const previous = document.title;
    document.title = "Pricing CRO";
    return () => {
      document.title = previous;
    };
  }, []);

  return (
    <iframe
      src={SRC}
      title="HR Software Pricing Plans & Cost Guide | HROne"
      className="fixed inset-0 block h-dvh w-screen border-0"
    />
  );
}
