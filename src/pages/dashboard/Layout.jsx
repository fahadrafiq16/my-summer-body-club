import { Outlet, Link } from "react-router-dom";
import Logo from '../../images/logo.png';
import DividerIcon from '../../images/divider-icon.png';
import { FiHome, FiCreditCard } from "react-icons/fi";

const Layout = () => {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-56 min-h-screen bg-[#ef4d16] border border-[#ef4d16]">
                <div className="dashboard-logo mx-auto center p-4 bg-[#fff]">
                    <img className="mx-auto" src={Logo} alt="My Summer Body Club" />
                    <div className="divider-area mx-auto">
                        <img className="mx-auto" src={DividerIcon} alt="Divider" />
                    </div>
                </div>
                <div className="dashboard-navigation  bg-[#ef4d16]">
                    <ul>
                        <li><Link to="/dashboard" className="block p-2 ">
                            <FiHome className="mr-2 text-lg" />
                            Dashboard
                        </Link></li>
                        <li><Link to="/dashboard/payments" className="block p-2">
                            <FiCreditCard className="mr-2 text-lg" />
                            View Payments
                        </Link></li>
                    </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
