import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_BACKEND_URL = process.env.REACT_APP_BASE_BACKEND_URL;

const DashboardHome = () => {
  const [enabled, setEnabled] = useState(false);
  const [clubAmount, setClubAmount] = useState(15);

  // ✅ Fetch initial value + amount
  useEffect(() => {
    const fetchToggle = async () => {
      try {
        const res = await axios.get(`${BASE_BACKEND_URL}/api/toggle`);
        setEnabled(res.data.value);
        setClubAmount(res.data.amount);
      } catch (err) {
        console.error("Error fetching toggle:", err);
      }
    };
    fetchToggle();
  }, []);

  // ✅ Handle toggle change
  const handleToggle = async () => {
    const newValue = !enabled;
    setEnabled(newValue);

    try {
      await axios.post(`${BASE_BACKEND_URL}/api/toggle`, { value: newValue });
    } catch (err) {
      console.error("Error updating toggle:", err);
    }
  };

  // ✅ Handle club amount change
  const handleAmountChange = async (e) => {
    const newAmount = e.target.value;
    setClubAmount(newAmount);

    try {
      await axios.post(`${BASE_BACKEND_URL}/api/toggle`, { amount: newAmount });
    } catch (err) {
      console.error("Error updating amount:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toggle Switch */}
      <div
        onClick={handleToggle}
        className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${
          enabled ? "bg-green-500" : "bg-gray-300"
        }`}
      >
        <div
          className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
            enabled ? "translate-x-6" : "translate-x-0"
          }`}
        ></div>
      </div>

      {/* Club Amount Input */}
      <div>
        <label className="block font-semibold mb-2">Club Amount (€)</label>
        <input
          type="number"
          value={clubAmount}
          onChange={handleAmountChange}
          className="border px-3 py-2 rounded-md w-40"
        />
      </div>
    </div>
  );
};

export default DashboardHome;
