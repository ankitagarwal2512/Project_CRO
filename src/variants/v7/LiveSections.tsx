import { useEffect, useRef, useState } from "react";

/* Everything on hrone.cloud below the hero — "Your workplace. Your way." through the
   footer — lifted as-is from a saved copy of the live homepage (public/legacy/hrone-home).

   It sits in a same-origin iframe rather than inline because it needs the live site's
   WordPress stylesheets and jQuery/slick scripts, which would restyle the Tailwind hero
   (and the hero's resets would restyle it). The frame is sized to its content so the
   page scrolls as one document. */
const SRC = "/legacy/hrone-home/index.html";

export function LiveSections() {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(4000);

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
      title="HROne — more about the platform"
      scrolling="no"
      className="block w-full border-0"
      style={{ height }}
    />
  );
}
