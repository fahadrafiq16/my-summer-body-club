import { useEffect, useRef } from "react";

let sdkLoading = false;
let sdkLoaded = false;
const parseQueue = new Set();

function loadFacebookSdk() {
  if (sdkLoaded && window.FB) {
    parseQueue.forEach((el) => window.FB.XFBML.parse(el));
    parseQueue.clear();
    return;
  }

  if (sdkLoading) return;
  sdkLoading = true;

  window.fbAsyncInit = function fbAsyncInit() {
    window.FB.init({
      xfbml: true,
      version: "v18.0",
    });
    sdkLoaded = true;
    sdkLoading = false;
    parseQueue.forEach((el) => window.FB.XFBML.parse(el));
    parseQueue.clear();
  };

  if (document.getElementById("facebook-jssdk")) return;

  const script = document.createElement("script");
  script.id = "facebook-jssdk";
  script.async = true;
  script.defer = true;
  script.crossOrigin = "anonymous";
  script.src = "https://connect.facebook.net/en_US/sdk.js";
  document.body.appendChild(script);
}

export default function FacebookPagePlugin({ pageUrl, width = 340, height = 500, noScroll = false }) {
  const containerRef = useRef(null);
  const displayHeight = noScroll ? Math.min(height, 340) : height;

  useEffect(() => {
    if (!pageUrl || !containerRef.current) return;

    loadFacebookSdk();

    const parseWidget = () => {
      if (sdkLoaded && window.FB) {
        window.FB.XFBML.parse(containerRef.current);
      } else {
        parseQueue.add(containerRef.current);
      }
    };

    parseWidget();

    if (!noScroll) return undefined;

    const lockIframeScroll = () => {
      const iframe = containerRef.current?.querySelector("iframe");
      if (!iframe) return;
      iframe.setAttribute("scrolling", "no");
      iframe.style.overflow = "hidden";
      iframe.style.maxHeight = `${displayHeight}px`;
    };

    const observer = new MutationObserver(lockIframeScroll);
    observer.observe(containerRef.current, { childList: true, subtree: true });
    lockIframeScroll();

    const timer = setInterval(lockIframeScroll, 500);
    const stopTimer = setTimeout(() => clearInterval(timer), 8000);

    return () => {
      observer.disconnect();
      clearInterval(timer);
      clearTimeout(stopTimer);
    };
  }, [pageUrl, width, displayHeight, noScroll]);

  if (!pageUrl) return null;

  const widgetClass = noScroll
    ? "facebook-page-plugin-widget facebook-page-plugin-widget--no-scroll"
    : "facebook-page-plugin-widget";

  return (
    <div ref={containerRef} className={widgetClass}>
      <div
        className="fb-page"
        data-href={pageUrl}
        data-width={String(width)}
        data-height={String(displayHeight)}
        data-small-header="true"
        data-adapt-container-width="true"
        data-hide-cover="false"
        data-show-facepile="true"
        data-tabs={noScroll ? "timeline" : "timeline,events,messages"}
        data-hide-cta="false"
      />
    </div>
  );
}
