import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ListChecks,
  Plus,
  RefreshCw,
  Save,
  Trash2,
} from "lucide-react";
import { Button } from "../ui/button";
import { getBackendBaseUrl } from "../../utils/backend";

function authHeaders() {
  try {
    const raw = localStorage.getItem("msbc_dashboard_auth");
    const token = raw ? JSON.parse(raw)?.token : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

function newId(prefix = "guideline") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function defaultBlocks() {
  return [
    {
      id: "drink",
      title: "Drink",
      content: "2,5–3 liter water\nEventueel:\nmelk\nsmoothies\nmass shakes",
    },
    {
      id: "supplementen",
      title: "Supplementen",
      content: "Whey Protein\nCreatine Monohydraat 5g\nper dag\nOmega 3\nMultivitamine",
    },
    {
      id: "gezonde-vetten",
      title: "Gezonde vetten",
      content: "Avocado\nNoten\nPindakaas\nOlijfolie",
    },
  ];
}

function mapBlocks(list) {
  if (!Array.isArray(list)) return defaultBlocks();
  if (list.length === 0) return [];
  return list.map((b) => ({
    id: b.id || newId(),
    title: b.title || "",
    content: b.content || "",
  }));
}

const titleInputCls =
  "w-full rounded-md border border-transparent bg-transparent px-0 py-1 text-sm font-bold text-gray-900 outline-none focus:border-gray-300 focus:px-2 focus:bg-white";

const textareaCls =
  "w-full min-h-[160px] rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 resize-y leading-relaxed";

function GuidelineBlock({ block, disabled, onChange, onRemove }) {
  return (
    <div className="flex flex-col gap-2 min-w-0">
      <div className="flex items-center gap-1">
        <input
          className={titleInputCls}
          value={block.title}
          onChange={(e) => onChange({ title: e.target.value })}
          disabled={disabled}
          placeholder="Titel"
        />
        <span className="text-sm font-bold text-gray-900 shrink-0">:</span>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className="shrink-0 p-1 rounded-md text-red-500 hover:bg-red-50 disabled:opacity-50"
          aria-label="Verwijderen"
          title="Verwijderen"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      <textarea
        className={textareaCls}
        value={block.content}
        onChange={(e) => onChange({ content: e.target.value })}
        disabled={disabled}
        rows={7}
      />
    </div>
  );
}

export default function DagelijkseRichtlijnenSection({ memberId, lang, defaultOpen = true }) {
  const backendBase = useMemo(() => getBackendBaseUrl(), []);
  const [expanded, setExpanded] = useState(defaultOpen);
  const [blocks, setBlocks] = useState(defaultBlocks);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      setStatus(null);
      const res = await fetch(`${backendBase}/api/food-plans/${memberId}`, {
        headers: { ...authHeaders() },
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to load guidelines");
      }
      // Missing key → defaults; empty array → user cleared all
      if (!Array.isArray(data.plan?.dailyGuidelines)) {
        setBlocks(defaultBlocks());
      } else {
        setBlocks(mapBlocks(data.plan.dailyGuidelines));
      }
    } catch (e) {
      setError(e?.message || "Failed to load guidelines");
      setBlocks(defaultBlocks());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (memberId) load();
  }, [memberId, backendBase]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateBlock = (id, patch) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
    setStatus(null);
  };

  const removeBlock = (id) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
    setStatus(null);
  };

  const addBlock = () => {
    setBlocks((prev) => [...prev, { id: newId(), title: "", content: "" }]);
    setStatus(null);
  };

  const save = async () => {
    try {
      setSaving(true);
      setError("");
      setStatus(null);
      const res = await fetch(`${backendBase}/api/food-plans/${memberId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ dailyGuidelines: blocks }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to save guidelines");
      }
      if (Array.isArray(data.plan?.dailyGuidelines)) {
        setBlocks(mapBlocks(data.plan.dailyGuidelines));
      }
      setStatus({
        type: "ok",
        text: lang === "nl" ? "Richtlijnen opgeslagen." : "Guidelines saved.",
      });
    } catch (e) {
      setStatus({
        type: "error",
        text: e?.message || (lang === "nl" ? "Opslaan mislukt." : "Save failed."),
      });
    } finally {
      setSaving(false);
    }
  };

  const busy = loading || saving;

  return (
    <div className="rounded-xl border border-gray-300 bg-white overflow-hidden shadow-sm">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className={`w-full flex items-center gap-2.5 bg-gray-100 px-4 py-3 text-left hover:bg-gray-200/70 transition-colors ${
          expanded ? "border-b border-gray-300" : ""
        }`}
        aria-expanded={expanded}
      >
        {expanded ? (
          <ChevronDown className="w-4 h-4 text-gray-700 shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-500 shrink-0" />
        )}
        <ListChecks className="w-4 h-4 text-gray-700 shrink-0" />
        <h2 className="text-base font-bold text-gray-900 tracking-tight flex-1">Dagelijkse Richtlijnen</h2>
      </button>

      {expanded && (
        <div className="p-4 sm:p-5 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-lg font-bold text-gray-900">Dagelijkse Richtlijnen:</div>
              <div className="mt-1 h-1 w-48 sm:w-64 rounded-full bg-[#ef4d16]" />
            </div>
            <button
              type="button"
              onClick={addBlock}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-md border border-emerald-600 bg-emerald-100 px-3 py-1.5 text-sm font-semibold text-emerald-900 hover:bg-emerald-200 disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              Menu
            </button>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {status && (
            <div
              className={`rounded-lg border px-3 py-2 text-sm flex items-center gap-2 ${
                status.type === "ok"
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {status.type === "ok" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
              {status.text}
            </div>
          )}

          {loading ? (
            <div className="py-10 text-center text-sm text-gray-500 animate-pulse">
              {lang === "nl" ? "Laden…" : "Loading…"}
            </div>
          ) : blocks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 px-4 py-10 text-center text-sm text-gray-500">
              {lang === "nl"
                ? "Geen blokken. Klik op + Menu om een blok toe te voegen."
                : "No blocks. Click + Menu to add a block."}
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {blocks.map((block) => (
                  <GuidelineBlock
                    key={block.id}
                    block={block}
                    disabled={busy}
                    onChange={(patch) => updateBlock(block.id, patch)}
                    onRemove={() => removeBlock(block.id)}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
            <Button variant="outline" className="rounded-xl" onClick={load} disabled={busy}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              {lang === "nl" ? "Verversen" : "Refresh"}
            </Button>
            <Button className="rounded-xl bg-[#ef4d16] hover:bg-[#d94412]" onClick={save} disabled={busy}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? "…" : lang === "nl" ? "Opslaan" : "Save"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
