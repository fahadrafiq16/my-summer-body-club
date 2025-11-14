import { Outlet, Link, useNavigate } from "react-router-dom";
import Logo from '../../images/logo.png';
import DividerIcon from '../../images/divider-icon.png';
import { FiHome, FiCreditCard, FiMessageSquare, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const Layout = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/dashboard/login", { replace: true });
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="fixed h-screen w-56 min-h-screen bg-[#ef4d16] border border-[#ef4d16] flex flex-col">
                <div className="dashboard-logo mx-auto center p-4 bg-[#fff]">
                    <img className="mx-auto" src={Logo} alt="My Summer Body Club" />
                    <div className="divider-area mx-auto">
                        <img className="mx-auto" src={DividerIcon} alt="Divider" />
                    </div>
                </div>
                <div className="dashboard-navigation bg-[#ef4d16] flex-1">
                    <ul>
                        <li><Link to="/dashboard" className="block p-2 ">
                            <FiHome className="mr-2 text-lg inline-block" />
                            Dashboard
                        </Link></li>
                        <li><Link to="/dashboard/payments" className="block p-2">
                            <FiCreditCard className="mr-2 text-lg inline-block" />
                            View Payments
                        </Link></li>
                        <li><Link to="/dashboard/testimonials" className="block p-2">
                            <FiMessageSquare className="mr-2 text-lg inline-block" />
                            Customers Reviews
                        </Link></li>
                    </ul>
                </div>
                <div className="px-4 py-3 bg-[#d63f0f] text-white">
                    <p className="text-sm mb-2 truncate">
                        Ingelogd als: <span className="font-semibold">{user?.username || "Admin"}</span>
                    </p>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-2 bg-white/10 rounded-md hover:bg-white/20 transition"
                    >
                        <FiLogOut />
                        Uitloggen
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-[224px]">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
