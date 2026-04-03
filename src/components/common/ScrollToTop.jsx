import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop1 = () => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]); // Trigger on route change

    return null; // No need to render anything
};

export default ScrollToTop1;
