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
    <div className="space-y-6 p-4">
      {/* Heading */}
      <h3 className="text-xl font-bold text-[#2B388F] border-b-2 border-[#EF4D16] pb-2">
        QR Code Options
      </h3>

      {/* Row: Toggle + Input */}
      <div className="flex items-center gap-10">
        {/* Toggle Switch */}
        <div className="flex items-center gap-3">
          <span className="font-medium text-gray-700">Enable</span>
          <div
            onClick={handleToggle}
            className={`relative w-14 h-7 flex items-center rounded-full cursor-pointer transition-all duration-300 shadow-inner ${enabled
                ? "bg-gradient-to-r from-[#EF4D16] to-[#ff7849]"
                : "bg-gray-300"
              }`}
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${enabled ? "translate-x-7" : "translate-x-1"
                }`}
            ></div>
          </div>
        </div>

        {/* Club Amount Input */}
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
    </div>


  );
};

export default DashboardHome;
