import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { getBackendBaseUrl } from "../../utils/backend";
import {
  paymentOptions as fallbackPaymentOptions,
  extraOptions as fallbackExtraOptions,
  clubAmount as fallbackClubAmount,
  afvallenTrainingDescription as fallbackAfvallenTrainingDescription,
} from "../../data/AfvallenTraining";

const emptyConfig = {
  paymentOptions: fallbackPaymentOptions,
  extraOptions: fallbackExtraOptions,
  clubAmount: fallbackClubAmount,
  afvallenTrainingDescription: fallbackAfvallenTrainingDescription,
};

const TrainingPrograms = () => {
  const backendBaseUrl = useMemo(() => getBackendBaseUrl(), []);
  const { token } = useAuth();

  const [selectedProgram, setSelectedProgram] = useState("afvallen");
  const [config, setConfig] = useState(emptyConfig);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const authHeaders = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : undefined),
    [token]
  );

  const loadAfvallen = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendBaseUrl}/api/training-config/afvallen`);
      setConfig({
        paymentOptions: Array.isArray(res.data?.paymentOptions) ? res.data.paymentOptions : [],
        extraOptions: Array.isArray(res.data?.extraOptions) ? res.data.extraOptions : [],
        clubAmount: Array.isArray(res.data?.clubAmount) ? res.data.clubAmount : [],
        afvallenTrainingDescription: Array.isArray(res.data?.afvallenTrainingDescription)
          ? res.data.afvallenTrainingDescription
          : [],
      });
    } catch (err) {
      console.error("Failed loading training config", err);
      setConfig(emptyConfig);
      const status = err?.response?.status;
      setMessage(
        `Kon trainingsgegevens niet laden via ${backendBaseUrl}/api/training-config/afvallen` +
          (status ? ` (status ${status})` : "")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProgram === "afvallen") {
      loadAfvallen();
    }
  }, [selectedProgram]);

  const updatePaymentOption = (idx, key, value) => {
    setConfig((prev) => {
      const next = [...prev.paymentOptions];
      next[idx] = { ...next[idx], [key]: value };
      return { ...prev, paymentOptions: next };
    });
  };

  const updateDescription = (idx, key, value) => {
    setConfig((prev) => {
      const next = [...prev.afvallenTrainingDescription];
      next[idx] = { ...next[idx], [key]: value };
      return { ...prev, afvallenTrainingDescription: next };
    });
  };

  const updateExtraOption = (idx, key, value) => {
    setConfig((prev) => {
      const next = [...prev.extraOptions];
      next[idx] = { ...next[idx], [key]: value };
      return { ...prev, extraOptions: next };
    });
  };

  const updateClubAmount = (idx, key, value) => {
    setConfig((prev) => {
      const next = [...prev.clubAmount];
      next[idx] = { ...next[idx], [key]: value };
      return { ...prev, clubAmount: next };
    });
  };

  const updateDescriptionListField = (descIdx, listKey, itemIdx, value) => {
    setConfig((prev) => {
      const next = [...prev.afvallenTrainingDescription];
      const row = { ...(next[descIdx] || {}) };
      const list = Array.isArray(row[listKey]) ? [...row[listKey]] : [];
      list[itemIdx] = value;
      row[listKey] = list;
      next[descIdx] = row;
      return { ...prev, afvallenTrainingDescription: next };
    });
  };

  const updatePaymentOptionListField = (optionIdx, listKey, itemIdx, value) => {
    setConfig((prev) => {
      const next = [...prev.paymentOptions];
      const row = { ...(next[optionIdx] || {}) };
      const list = Array.isArray(row[listKey]) ? [...row[listKey]] : [];
      list[itemIdx] = value;
      row[listKey] = list;
      next[optionIdx] = row;
      return { ...prev, paymentOptions: next };
    });
  };

  const handleSave = async () => {
    if (!authHeaders) {
      setMessage("Log in om wijzigingen op te slaan.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      await axios.put(`${backendBaseUrl}/api/training-config/afvallen`, config, {
        headers: { "Content-Type": "application/json", ...authHeaders },
      });
      setMessage("Opgeslagen.");
    } catch (err) {
      console.error("Failed saving training config", err);
      const status = err?.response?.status;
      const detail = err?.response?.data?.error;
      setMessage(`Opslaan mislukt${status ? ` (status ${status})` : ""}${detail ? `: ${detail}` : ""}.`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Training Programs</h2>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <div className="border rounded-lg bg-white p-4">
          <div className="text-sm font-semibold text-gray-600 mb-3">Programs</div>
          <button
            type="button"
            onClick={() => setSelectedProgram("afvallen")}
            className={`w-full text-left px-3 py-2 rounded-md border ${
              selectedProgram === "afvallen"
                ? "bg-[#ef4d16] text-white border-[#ef4d16]"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            Afvallen Training
          </button>
        </div>

        <div className="border rounded-lg bg-white p-4 space-y-5">
          {loading ? <div>Laden...</div> : null}

          {!loading && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-2">Payment Options</h3>
                <div className="space-y-3">
                  {config.paymentOptions.map((option, idx) => (
                    <div key={idx} className="border rounded-md p-3 space-y-2">
                      <input
                        className="w-full border rounded px-2 py-1"
                        value={option.title || ""}
                        onChange={(e) => updatePaymentOption(idx, "title", e.target.value)}
                        placeholder="Title"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <input
                          className="border rounded px-2 py-1"
                          value={option.trainingTitle || ""}
                          onChange={(e) => updatePaymentOption(idx, "trainingTitle", e.target.value)}
                          placeholder="Training Title"
                        />
                        <input
                          className="border rounded px-2 py-1"
                          value={option.amount || ""}
                          onChange={(e) => updatePaymentOption(idx, "amount", e.target.value)}
                          placeholder="Amount"
                        />
                        <input
                          className="border rounded px-2 py-1"
                          value={option.quantity || ""}
                          onChange={(e) => updatePaymentOption(idx, "quantity", e.target.value)}
                          placeholder="Quantity"
                        />
                        <input
                          className="border rounded px-2 py-1"
                          value={option.abonnementType || ""}
                          onChange={(e) => updatePaymentOption(idx, "abonnementType", e.target.value)}
                          placeholder="Abonnement Type"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <input
                          className="border rounded px-2 py-1"
                          value={option.subTitle || ""}
                          onChange={(e) => updatePaymentOption(idx, "subTitle", e.target.value)}
                          placeholder="Sub Title"
                        />
                        <input
                          className="border rounded px-2 py-1"
                          value={option.abonnementTitle || ""}
                          onChange={(e) => updatePaymentOption(idx, "abonnementTitle", e.target.value)}
                          placeholder="Abonnement Title"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-gray-600">Kosten</div>
                        {(option.kosten || []).map((item, kIdx) => (
                          <input
                            key={`kosten-${idx}-${kIdx}`}
                            className="w-full border rounded px-2 py-1"
                            value={item || ""}
                            onChange={(e) =>
                              updatePaymentOptionListField(idx, "kosten", kIdx, e.target.value)
                            }
                            placeholder={`Kosten ${kIdx + 1}`}
                          />
                        ))}
                      </div>

                      <div className="space-y-2">
                        <div className="text-xs font-semibold text-gray-600">Total Kosten</div>
                        {(option.totalKosten || []).map((item, tIdx) => (
                          <input
                            key={`totalkosten-${idx}-${tIdx}`}
                            className="w-full border rounded px-2 py-1"
                            value={item || ""}
                            onChange={(e) =>
                              updatePaymentOptionListField(idx, "totalKosten", tIdx, e.target.value)
                            }
                            placeholder={`Total Kosten ${tIdx + 1}`}
                          />
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-5 text-sm">
                        <label className="flex items-center gap-2">
                          Extra:
                          <input
                            type="radio"
                            checked={Boolean(option.extra) === true}
                            onChange={() => updatePaymentOption(idx, "extra", true)}
                          />
                          Yes
                          <input
                            type="radio"
                            checked={Boolean(option.extra) === false}
                            onChange={() => updatePaymentOption(idx, "extra", false)}
                          />
                          No
                        </label>
                        <label className="flex items-center gap-2">
                          Recurring:
                          <input
                            type="radio"
                            checked={Boolean(option.recurring) === true}
                            onChange={() => updatePaymentOption(idx, "recurring", true)}
                          />
                          Yes
                          <input
                            type="radio"
                            checked={Boolean(option.recurring) === false}
                            onChange={() => updatePaymentOption(idx, "recurring", false)}
                          />
                          No
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Extra Options</h3>
                {config.extraOptions.map((opt, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                    <input
                      className="border rounded px-2 py-1"
                      value={opt.amount || ""}
                      onChange={(e) => updateExtraOption(idx, "amount", e.target.value)}
                      placeholder="Amount"
                    />
                    <input
                      className="border rounded px-2 py-1"
                      value={opt.title || ""}
                      onChange={(e) => updateExtraOption(idx, "title", e.target.value)}
                      placeholder="Title"
                    />
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Club Amount</h3>
                {config.clubAmount.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                    <input
                      className="border rounded px-2 py-1"
                      value={item.amount || ""}
                      onChange={(e) => updateClubAmount(idx, "amount", e.target.value)}
                      placeholder="Amount"
                    />
                    <input
                      className="border rounded px-2 py-1"
                      value={item.title || ""}
                      onChange={(e) => updateClubAmount(idx, "title", e.target.value)}
                      placeholder="Title"
                    />
                    <label className="flex items-center gap-2 border rounded px-2 py-1">
                      Status
                      <input
                        type="radio"
                        checked={Boolean(item.status) === true}
                        onChange={() => updateClubAmount(idx, "status", true)}
                      />
                      On
                      <input
                        type="radio"
                        checked={Boolean(item.status) === false}
                        onChange={() => updateClubAmount(idx, "status", false)}
                      />
                      Off
                    </label>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Training Description</h3>
                {config.afvallenTrainingDescription.map((d, idx) => (
                  <div key={idx} className="space-y-2 border rounded-md p-3">
                    <input
                      className="w-full border rounded px-2 py-1"
                      value={d.title || ""}
                      onChange={(e) => updateDescription(idx, "title", e.target.value)}
                      placeholder="Title"
                    />
                    <textarea
                      className="w-full border rounded px-2 py-1"
                      value={d.quote || ""}
                      onChange={(e) => updateDescription(idx, "quote", e.target.value)}
                      placeholder="Quote"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input
                        className="border rounded px-2 py-1"
                        value={d.startingPrice || ""}
                        onChange={(e) => updateDescription(idx, "startingPrice", e.target.value)}
                        placeholder="Starting Price"
                      />
                      <input
                        className="border rounded px-2 py-1"
                        value={d.tenure || ""}
                        onChange={(e) => updateDescription(idx, "tenure", e.target.value)}
                        placeholder="Tenure"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input
                        className="border rounded px-2 py-1"
                        value={d.cardHeadline || ""}
                        onChange={(e) => updateDescription(idx, "cardHeadline", e.target.value)}
                        placeholder="Card Headline"
                      />
                      <input
                        className="border rounded px-2 py-1"
                        value={d.headLineBg || ""}
                        onChange={(e) => updateDescription(idx, "headLineBg", e.target.value)}
                        placeholder="Headline BG Color"
                      />
                    </div>
                    <input
                      className="w-full border rounded px-2 py-1"
                      value={d.trainingLink || ""}
                      onChange={(e) => updateDescription(idx, "trainingLink", e.target.value)}
                      placeholder="Training Link"
                    />
                    <div className="space-y-2">
                      <div className="text-xs font-semibold text-gray-600">Training Features</div>
                      {(d.trainingFeatures || []).map((feature, fIdx) => (
                        <input
                          key={`feature-${idx}-${fIdx}`}
                          className="w-full border rounded px-2 py-1"
                          value={feature || ""}
                          onChange={(e) =>
                            updateDescriptionListField(idx, "trainingFeatures", fIdx, e.target.value)
                          }
                          placeholder={`Feature ${fIdx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 rounded-md bg-[#ef4d16] text-white disabled:opacity-60"
                >
                  {saving ? "Opslaan..." : "Opslaan"}
                </button>
                {message ? <span className="text-sm text-gray-700">{message}</span> : null}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingPrograms;
