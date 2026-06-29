import React, { useEffect } from "react";
import "../../assets/css/static-content.css";

export default function StaticContentPage({ title, children }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div id="page-title-banner">
        <div className="container">
          <h2 className="page-title">{title}</h2>
        </div>
      </div>
      <div id="page-custom-content" className="padding-all static-content-page">
        <div className="container-800">
          <div className="custom-inner-content">{children}</div>
        </div>
      </div>
    </>
  );
}
