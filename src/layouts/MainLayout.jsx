import Header from "../components/header/Header";
import Footer from "../components/header/Footer";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
    return (
        <div className="App">
            <Header />
            <Outlet />  {/* This renders the public page content */}
            <Footer />
        </div>
    );
}

export default MainLayout;