import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Package,
  Plus,
  RefreshCw,
  Save,
  Trash2,
} from "lucide-react";
import { Button } from "../ui/button";
import { getBackendBaseUrl } from "../../utils/backend";

const WEEK_DAYS = [
  { id: "ma", label: "Ma" },
  { id: "di", label: "Di" },
  { id: "wo", label: "Wo" },
  { id: "do", label: "Do" },
  { id: "vr", label: "Vr" },
  { id: "za", label: "Za" },
  { id: "zo", label: "Zo" },
];

/** JS getDay(): 0=Sun … 6=Sat → our day ids */
function todayDayId(date = new Date()) {
  return ["zo", "ma", "di", "wo", "do", "vr", "za"][date.getDay()];
}

function authHeaders() {
  try {
    const raw = localStorage.getItem("msbc_dashboard_auth");
    const token = raw ? JSON.parse(raw)?.token : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

function newId(prefix = "product") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function defaultBlocks() {
  return [
    {
      id: "koolhydraten",
      title: "Koolhydraten",
      content: "Rijst\nHavermout\nPasta\nWraps\nAardappelen\nGranola",
    },
    {
      id: "eiwitten",
      title: "Eiwitten",
      content: "Kip\nZalm\nEieren\nBiefstuk\nTonijn\nKwark\nWhey",
    },
    {
      id: "gezonde-vetten",
      title: "Gezonde vetten",
      content: "Avocado\nNoten\nPindakaas\nOlijfolie",
    },
    {
      id: "tip",
      title: "Tip!",
      content: "",
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
  "w-full min-h-[140px] rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 resize-y leading-relaxed";

function ProductBlock({ block, disabled, onChange, onRemove }) {
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
        {block.title !== "Tip!" && <span className="text-sm font-bold text-gray-900 shrink-0">:</span>}
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
        rows={6}
      />
    </div>
  );
}

export default function GainProductsSection({ memberId, lang, defaultOpen = true }) {
  const backendBase = useMemo(() => getBackendBaseUrl(), []);
  const [expanded, setExpanded] = useState(defaultOpen);
  const [blocks, setBlocks] = useState(defaultBlocks);
  const [todayId, setTodayId] = useState(() => todayDayId());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const tick = () => setTodayId(todayDayId());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

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
        throw new Error(data?.error || "Failed to load products");
      }
      if (!Array.isArray(data.plan?.gainProducts)) {
        setBlocks(defaultBlocks());
      } else {
        setBlocks(mapBlocks(data.plan.gainProducts));
      }
    } catch (e) {
      setError(e?.message || "Failed to load products");
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
        body: JSON.stringify({
          gainProducts: blocks,
          selectedWeekDay: todayId,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to save products");
      }
      if (Array.isArray(data.plan?.gainProducts)) {
        setBlocks(mapBlocks(data.plan.gainProducts));
      }
      setStatus({
        type: "ok",
        text: lang === "nl" ? "Opgeslagen." : "Saved.",
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
    <div className="space-y-4">
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
          <Package className="w-4 h-4 text-gray-700 shrink-0" />
          <h2 className="text-base font-bold text-gray-900 tracking-tight flex-1">
            Producten die helpen bij aankomen
          </h2>
        </button>

        {expanded && (
          <div className="p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-lg font-bold text-gray-900">Producten die helpen bij aankomen:</div>
                <div className="mt-1 h-1 w-56 sm:w-72 rounded-full bg-[#ef4d16]" />
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
                {status.type === "ok" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                  {blocks.map((block) => (
                    <ProductBlock
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

      {/* Day names — highlights today's day (updates automatically) */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        {WEEK_DAYS.map((day) => {
          const active = todayId === day.id;
          return (
            <span
              key={day.id}
              className={`min-w-[2.5rem] px-3 py-1.5 rounded-md border text-sm font-semibold text-center ${
                active
                  ? "bg-[#ef4d16] border-[#ef4d16] text-white"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
            >
              {day.label}
            </span>
          );
        })}
      </div>
    </div>
  );
}
