import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { getBackendBaseUrl } from "../../utils/backend";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showForgot, setShowForgot] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotStatus, setForgotStatus] = useState(null);
    const [forgotLoading, setForgotLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const backendBaseUrl = getBackendBaseUrl();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post(`${backendBaseUrl}/api/auth/login`, {
                username,
                password,
            });

            if (response.data?.success && response.data?.token) {
                login(response.data.token, response.data.user);
                const redirectTo = location.state?.from?.pathname || "/dashboard";
                navigate(redirectTo, { replace: true });
            } else {
                setError("Ongeldige reactie van de server.");
            }
        } catch (err) {
            console.error("Login failed:", err);
            setError(
                err.response?.data?.error ||
                    "Inloggen mislukt. Controleer je gegevens en probeer opnieuw."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleForgotSubmit = async (event) => {
        event.preventDefault();
        if (!forgotEmail.trim()) {
            setForgotStatus({
                type: "error",
                text: "Vul een e-mailadres in.",
            });
            return;
        }

        setForgotLoading(true);
        setForgotStatus(null);

        try {
            const response = await axios.post(`${backendBaseUrl}/api/auth/forgot-logins`, {
                email: forgotEmail.trim(),
            });

            setForgotStatus({
                type: "success",
                text: response.data?.message || "Als het e-mailadres bekend is, verzenden we de gegevens.",
            });
        } catch (err) {
            console.error("Forgot password request failed:", err);
            setForgotStatus({
                type: "error",
                text:
                    err.response?.data?.error ||
                    "Verzoek mislukt. Probeer het later opnieuw.",
            });
        } finally {
            setForgotLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
                <h1 className="text-2xl font-bold text-center text-[#ef4d16] mb-6">
                    Dashboard Login
                </h1>
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Gebruikersnaam
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ef4d16]"
                            placeholder="Voer je gebruikersnaam in"
                            autoComplete="username"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Wachtwoord
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ef4d16]"
                            placeholder="Voer je wachtwoord in"
                            autoComplete="current-password"
                            required
                        />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <button
                        type="submit"
                        className="w-full py-2 bg-[#ef4d16] text-white rounded-md font-semibold hover:bg-[#d23f0f] transition disabled:opacity-60"
                        disabled={loading}
                    >
                        {loading ? "Bezig met inloggen..." : "Inloggen"}
                    </button>
                    <button
                        type="button"
                        className="w-full text-sm text-[#ef4d16] hover:underline"
                        onClick={() => {
                            setShowForgot((prev) => !prev);
                            setForgotStatus(null);
                        }}
                    >
                        Wachtwoord vergeten?
                    </button>
                </form>
                {showForgot && (
                    <div className="mt-6 border-t pt-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">
                            Verzenden van inloggegevens
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Vul het geregistreerde e-mailadres in. De huidige gebruikersnaam en het wachtwoord worden gestuurd naar het admin e-mailadres en het master e-mailadres.
                        </p>
                        <form className="space-y-4" onSubmit={handleForgotSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    E-mailadres
                                </label>
                                <input
                                    type="email"
                                    value={forgotEmail}
                                    onChange={(event) => setForgotEmail(event.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ef4d16]"
                                    placeholder="bijv. admin@email.com"
                                    required
                                />
                            </div>
                            {forgotStatus && (
                                <p
                                    className={`text-sm ${
                                        forgotStatus.type === "success"
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {forgotStatus.text}
                                </p>
                            )}
                            <button
                                type="submit"
                                className="w-full py-2 bg-[#ef4d16] text-white rounded-md font-semibold hover:bg-[#d23f0f] transition disabled:opacity-60"
                                disabled={forgotLoading}
                            >
                                {forgotLoading ? "Bezig met verzenden..." : "Verzend gegevens"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;


