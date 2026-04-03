import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { getBackendBaseUrl } from "../../utils/backend";

const DashboardHome = () => {
  const [enabled, setEnabled] = useState(false);
  const [clubAmount, setClubAmount] = useState(15);
  const [settings, setSettings] = useState({ username: "", contactEmail: "" });
  const [password, setPassword] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);
  const [forwarding, setForwarding] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const { token, login } = useAuth();
  const backendBaseUrl = useMemo(() => getBackendBaseUrl(), []);

  const authHeaders = useMemo(() => {
    if (!token) return undefined;
    return { Authorization: `Bearer ${token}` };
  }, [token]);

  // Fetch toggle and admin settings
  useEffect(() => {
    const fetchData = async () => {
      if (!authHeaders) return;
      try {
        const [toggleRes, settingsRes] = await Promise.all([
          axios.get(`${backendBaseUrl}/api/toggle`, { headers: authHeaders }),
          axios.get(`${backendBaseUrl}/api/auth/admin-settings`, { headers: authHeaders }),
        ]);
        setEnabled(toggleRes.data.value);
        setClubAmount(toggleRes.data.amount);
        if (settingsRes.data?.settings) {
          setSettings({
            username: settingsRes.data.settings.username || "",
            contactEmail: settingsRes.data.settings.contactEmail || "",
          });
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setStatusMessage({ type: "error", text: "Kon dashboardgegevens niet laden." });
      }
    };
    fetchData();
  }, [backendBaseUrl, authHeaders]);

  const handleToggle = async () => {
    if (!authHeaders) {
      alert("Geen geldige sessie. Log opnieuw in.");
      return;
    }
    const newValue = !enabled;
    setEnabled(newValue);

    try {
      await axios.post(
        `${backendBaseUrl}/api/toggle`,
        { value: newValue },
        { headers: authHeaders }
      );
    } catch (err) {
      console.error("Error updating toggle:", err);
      setStatusMessage({ type: "error", text: "Kon toggle niet bijwerken." });
    }
  };

  const handleAmountChange = async (event) => {
    if (!authHeaders) {
      alert("Geen geldige sessie. Log opnieuw in.");
      return;
    }
    const newAmount = event.target.value;
    setClubAmount(newAmount);

    try {
      await axios.post(
        `${backendBaseUrl}/api/toggle`,
        { amount: newAmount },
        { headers: authHeaders }
      );
    } catch (err) {
      console.error("Error updating amount:", err);
      setStatusMessage({ type: "error", text: "Kon bedrag niet bijwerken." });
    }
  };

  const handleSettingsSubmit = async (event) => {
    event.preventDefault();
    if (!authHeaders) {
      alert("Geen geldige sessie. Log opnieuw in.");
      return;
    }
    setSavingSettings(true);
    setStatusMessage(null);

    try {
      const payload = {
        username: settings.username,
        contactEmail: settings.contactEmail,
      };

      if (password.trim()) {
        payload.password = password.trim();
      }

      const response = await axios.put(
        `${backendBaseUrl}/api/auth/admin-settings`,
        payload,
        { headers: authHeaders }
      );

      if (response.data?.success) {
        setStatusMessage({ type: "success", text: "Inloggegevens bijgewerkt." });
        setPassword("");
        if (login && token) {
          login(token, response.data.settings);
        }
      } else {
        throw new Error("Onverwachte serverreactie.");
      }
    } catch (err) {
      console.error("Updating admin settings failed:", err);
      setStatusMessage({
        type: "error",
        text:
          err.response?.data?.error ||
          "Bijwerken mislukt. Controleer de invoer en probeer opnieuw.",
      });
    } finally {
      setSavingSettings(false);
    }
  };

  const handleForwardLogins = async () => {
    if (!authHeaders) {
      alert("Geen geldige sessie. Log opnieuw in.");
      return;
    }
    setForwarding(true);
    setStatusMessage(null);

    try {
      const response = await axios.post(
        `${backendBaseUrl}/api/auth/forward-logins`,
        {},
        { headers: authHeaders }
      );
      setStatusMessage({
        type: "success",
        text: response.data?.message || "Inloggegevens verzonden.",
      });
    } catch (err) {
      console.error("Forwarding logins failed:", err);
      setStatusMessage({
        type: "error",
        text: err.response?.data?.error || "Versturen mislukt. Controleer de mailconfiguratie.",
      });
    } finally {
      setForwarding(false);
    }
  };

  return (
    <div className="space-y-10 p-4">
      {statusMessage && (
        <div
          className={`px-4 py-3 rounded ${
            statusMessage.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      <section>
        <h3 className="text-xl font-bold text-[#2B388F] border-b-2 border-[#EF4D16] pb-2 mb-4">
          QR Code Options
        </h3>

        <div className="flex flex-wrap items-center gap-10">
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-700">Enable</span>
            <div
              onClick={handleToggle}
              className={`relative w-14 h-7 flex items-center rounded-full cursor-pointer transition-all duration-300 shadow-inner ${
                enabled ? "bg-gradient-to-r from-[#EF4D16] to-[#ff7849]" : "bg-gray-300"
              }`}
            >
              <div
                className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                  enabled ? "translate-x-7" : "translate-x-1"
                }`}
              ></div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="font-medium text-gray-700">Amount (€)</label>
            <input
              type="number"
              value={clubAmount}
              onChange={handleAmountChange}
              className="w-28 px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:border-[#EF4D16] focus:ring-1 focus:ring-[#EF4D16] transition"
            />
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold text-[#2B388F] border-b-2 border-[#EF4D16] pb-2 mb-4">
          Dashboard inloggegevens
        </h3>

        <form className="space-y-5 max-w-xl" onSubmit={handleSettingsSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gebruikersnaam
            </label>
            <input
              type="text"
              value={settings.username}
              onChange={(event) =>
                setSettings((prev) => ({ ...prev, username: event.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ef4d16]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact e-mailadres
            </label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(event) =>
                setSettings((prev) => ({ ...prev, contactEmail: event.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ef4d16]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nieuw wachtwoord <span className="text-xs text-gray-400">(optioneel)</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ef4d16]"
              placeholder="Laat leeg om het wachtwoord ongewijzigd te laten"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              className="px-5 py-2 bg-[#ef4d16] text-white rounded-md font-semibold hover:bg-[#d23f0f] transition disabled:opacity-60"
              disabled={savingSettings}
            >
              {savingSettings ? "Opslaan..." : "Gegevens opslaan"}
            </button>

            <button
              type="button"
              onClick={handleForwardLogins}
              className="px-5 py-2 border border-[#ef4d16] text-[#ef4d16] rounded-md font-semibold hover:bg-[#ef4d16]/10 transition disabled:opacity-60"
              disabled={forwarding}
            >
              {forwarding ? "Verzenden..." : "Forward logins"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default DashboardHome;

