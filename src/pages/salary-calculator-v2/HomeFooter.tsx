import { useEffect, useRef, useState } from "react";

/* The homepage footer, link columns and copyright bar (HR Commune strip removed), served from
   public/legacy/hrone-home/footer.html, which is index.html's <head> plus everything
   after its </main>. Regenerate it from index.html if the homepage footer changes.
   Same-origin iframe sized to its content, for the same reason as option D's
   LiveSections: the live site's WordPress CSS and the Tailwind page can't share a document. */
const SRC = "/legacy/hrone-home/footer.html";

export default function HomeFooter() {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(900);

  useEffect(() => {
    const frame = ref.current;
    if (!frame) return;
    let observer: ResizeObserver | undefined;

    const attach = () => {
      const doc = frame.contentDocument;
      if (!doc?.body) return;
      const measure = () => {
        const h = doc.body.scrollHeight;
        setHeight((prev) => (Math.abs(prev - h) > 1 ? h : prev));
      };
      measure();
      observer?.disconnect();
      observer = new ResizeObserver(measure);
      observer.observe(doc.body);
    };

    frame.addEventListener("load", attach);
    attach();
    return () => {
      frame.removeEventListener("load", attach);
      observer?.disconnect();
    };
  }, []);

  return (
    <iframe
      ref={ref}
      src={SRC}
      title="HROne footer"
      scrolling="no"
      className="block w-full border-0"
      style={{ height }}
    />
  );
}
