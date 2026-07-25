import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop1 = () => {
    const location = useLocation();

    useEffect(() => {
        // Keep hash anchors working (e.g. /fotos#photos-section)
        if (location.hash) return;
        window.scrollTo(0, 0);
    }, [location.pathname, location.hash]);

    return null;
};

export default ScrollToTop1;
