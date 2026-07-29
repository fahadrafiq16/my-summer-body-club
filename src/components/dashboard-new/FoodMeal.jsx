import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FileText,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
  User,
  X,
} from "lucide-react";
import { Button } from "../ui/button";
import { getBackendBaseUrl } from "../../utils/backend";
import MealPlanSection from "./MealPlanSection";
import DagelijkseRichtlijnenSection from "./DagelijkseRichtlijnenSection";
import GainProductsSection from "./GainProductsSection";

function authHeaders() {
  try {
    const raw = localStorage.getItem("msbc_dashboard_auth");
    const token = raw ? JSON.parse(raw)?.token : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

function memberDisplayName(m) {
  const parts = [m?.voornaam, m?.tussenvoegsel, m?.achternaam].map((p) => String(p || "").trim()).filter(Boolean);
  return parts.join(" ") || m?.email || m?._id || "—";
}

function newFieldId() {
  return `field-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function defaultSchemaFields() {
  return [
    { id: "doel", kind: "field", label: "Doel", value: "", labelEditable: false, inputType: "text" },
    { id: "lengte", kind: "field", label: "Lengte", value: "", labelEditable: false, inputType: "text" },
    { id: "start-gewicht", kind: "field", label: "Start gewicht", value: "", labelEditable: false, inputType: "text" },
    { id: "eind-gewicht", kind: "field", label: "Eind gewicht", value: "", labelEditable: false, inputType: "text" },
    { id: "leeftijd", kind: "field", label: "Leeftijd", value: "", labelEditable: false, inputType: "text" },
    { id: "training", kind: "field", label: "Training", value: "", labelEditable: false, inputType: "text" },
    { id: "aandachtspunt", kind: "field", label: "Aandachtspunt", value: "", labelEditable: false, inputType: "text" },
    { id: "richtlijn-calorieen", kind: "heading", label: "Richtlijn calorieën", value: "", labelEditable: false, inputType: "text" },
    { id: "start", kind: "field", label: "Start", value: "", labelEditable: false, inputType: "text" },
    { id: "opbouw", kind: "field", label: "Opbouw", value: "", labelEditable: false, inputType: "text" },
    { id: "afbouw", kind: "field", label: "Afbouw", value: "", labelEditable: false, inputType: "text" },
    { id: "eiwitten", kind: "field", label: "Eiwitten", value: "", labelEditable: false, inputType: "text" },
  ];
}

function defaultAdviceFields() {
  return [
    { id: "voedingsadvies-voor", kind: "field", label: "Voedingsadvies voor", value: "", labelEditable: false, inputType: "text" },
    { id: "focus-op", kind: "field", label: "Focus op", value: "", labelEditable: false, inputType: "textarea" },
    { id: "shake", kind: "field", label: "Shake", value: "", labelEditable: false, inputType: "textarea" },
    { id: "kcal", kind: "field", label: "kcal", value: "", labelEditable: false, inputType: "text" },
  ];
}

function mapPlanFields(list, fallback) {
  if (!Array.isArray(list) || list.length === 0) return fallback();
  const mapped = list.map((f) => {
    const id = f.id || newFieldId();
    const isRichtlijn = id === "richtlijn-calorieen" || f.label === "Richtlijn calorieën";
    return {
      id,
      kind: isRichtlijn ? "heading" : f.kind === "heading" ? "heading" : "field",
      label: f.label || "",
      value: isRichtlijn ? "" : f.value || "",
      labelEditable: Boolean(f.labelEditable),
      inputType: f.inputType === "textarea" ? "textarea" : "text",
    };
  });
  return upgradeSchemaFields(mapped, fallback);
}

/** Upgrade classic schema (Gewicht) → Start/Eind gewicht + Opbouw/Afbouw/Aandachtspunt */
function upgradeSchemaFields(fields, fallback = defaultSchemaFields) {
  if (fallback !== defaultSchemaFields) return fields;
  const ids = new Set(fields.map((f) => f.id));
  const alreadyNew =
    ids.has("start-gewicht") || ids.has("eind-gewicht") || ids.has("opbouw") || ids.has("afbouw") || ids.has("aandachtspunt");
  if (alreadyNew) return fields;

  const OLD_IDS = new Set(["doel", "lengte", "gewicht", "leeftijd", "training", "richtlijn-calorieen", "start", "eiwitten"]);
  const byId = Object.fromEntries(fields.map((f) => [f.id, f]));
  const customs = fields.filter((f) => !OLD_IDS.has(f.id));

  return [
    ...defaultSchemaFields().map((f) => {
      if (f.id === "start-gewicht") {
        return { ...f, value: byId["gewicht"]?.value || "" };
      }
      return { ...f, value: byId[f.id]?.value || "" };
    }),
    ...customs,
  ];
}

const selectInputCls =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#ef4d16]";

const schemaInputCls =
  "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400";

const schemaTextareaCls =
  "w-full min-h-[88px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 resize-y";

function SchemaFieldRow({
  label,
  value,
  onChange,
  disabled,
  labelEditable,
  onLabelChange,
  onRemove,
  isHeading,
  inputType = "text",
}) {
  if (isHeading) {
    return (
      <div className="pt-2 pb-1 space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex-4 min-w-[210px] text-sm font-semibold text-gray-900">{label}:</div>
          <div className="h-[2px] w-full rounded-full bg-[#ef4d16]" aria-hidden />
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              disabled={disabled}
              className="shrink-0 p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
              aria-label="Verwijderen"
              title="Verwijderen"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        
      </div>
    );
  }

  const isTextarea = inputType === "textarea";

  return (
    <div className={`flex gap-3 ${isTextarea ? "items-start" : "items-center"}`}>
      {labelEditable ? (
        <input
          className="w-40 sm:w-52 shrink-0 rounded-md border border-gray-300 bg-white px-2.5 py-2 text-sm font-semibold text-gray-900 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400"
          value={label}
          onChange={(e) => onLabelChange?.(e.target.value)}
          placeholder="Label"
          disabled={disabled}
        />
      ) : (
        <div className={`w-40 sm:w-52 shrink-0 text-sm font-semibold text-gray-900 ${isTextarea ? "pt-2" : ""}`}>
          {label}:
        </div>
      )}
      {isTextarea ? (
        <textarea
          className={schemaTextareaCls}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          rows={3}
        />
      ) : (
        <input
          className={schemaInputCls}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className={`shrink-0 p-1.5 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50 ${
            isTextarea ? "mt-1.5" : ""
          }`}
          aria-label="Verwijderen"
          title="Verwijderen"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}

/**
 * Reusable collapsible food-plan field box.
 * saveKey: "fields" | "adviceFields" — which plan property to PUT
 */
function FoodPlanFieldsSection({
  memberId,
  lang,
  title,
  saveKey,
  defaultFields,
  defaultOpen = true,
  showHeader = true,
}) {
  const backendBase = useMemo(() => getBackendBaseUrl(), []);
  const [expanded, setExpanded] = useState(defaultOpen);
  const [fields, setFields] = useState(defaultFields);
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
        throw new Error(data?.error || "Failed to load food plan");
      }
      const plan = data.plan || {};
      setFields(mapPlanFields(plan[saveKey], defaultFields));
    } catch (e) {
      setError(e?.message || "Failed to load food plan");
      setFields(defaultFields());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (memberId) load();
  }, [memberId, backendBase, saveKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateField = (id, patch) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
    setStatus(null);
  };

  const removeField = (id) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    setStatus(null);
  };

  const addRule = () => {
    setFields((prev) => [
      ...prev,
      { id: newFieldId(), kind: "field", label: "", value: "", labelEditable: true, inputType: "text" },
    ]);
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
        body: JSON.stringify({ [saveKey]: fields }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to save food plan");
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

  const body = (
    <div className="p-4 sm:p-5 space-y-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={addRule}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-md border border-gray-800 bg-white px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-50 disabled:opacity-50"
        >
          <Plus className="w-3.5 h-3.5" />
          Regel
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
        <div className="py-8 text-center text-sm text-gray-500 animate-pulse">
          {lang === "nl" ? "Laden…" : "Loading…"}
        </div>
      ) : fields.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-200 px-4 py-6 text-center text-sm text-gray-500">
          {lang === "nl"
            ? "Geen velden. Klik op + Regel om een veld toe te voegen."
            : "No fields. Click + Regel to add a field."}
        </div>
      ) : (
        <div className="space-y-3">
          {fields.map((f) => (
            <SchemaFieldRow
              key={f.id}
              isHeading={f.kind === "heading"}
              label={f.label}
              value={f.value}
              inputType={f.inputType}
              labelEditable={f.labelEditable}
              onLabelChange={(label) => updateField(f.id, { label })}
              onChange={(value) => updateField(f.id, { value })}
              onRemove={() => removeField(f.id)}
              disabled={busy}
            />
          ))}
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
  );

  return (
    <div className="rounded-xl border border-gray-300 bg-white overflow-hidden shadow-sm">
      {showHeader ? (
        <>
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
            <FileText className="w-4 h-4 text-gray-700 shrink-0" />
            <h2 className="text-base font-bold text-gray-900 tracking-tight flex-1">{title}</h2>
          </button>
          {expanded && body}
        </>
      ) : (
        body
      )}
    </div>
  );
}

function FoodPlanView({ member, lang, onBack }) {
  const name = memberDisplayName(member);
  const memberId = String(member._id);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <Button variant="outline" className="rounded-xl mb-3" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {lang === "nl" ? "Terug naar members" : "Back to members"}
          </Button>
          <div className="text-2xl font-bold">
            {lang === "nl" ? `Food Plan voor ${name}` : `Food Plan for ${name}`}
          </div>
          <div className="text-sm text-gray-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
            {member.email && <span>{member.email}</span>}
            {member.selectedOption?.programType && (
              <span className="text-gray-400">{String(member.selectedOption.programType)}</span>
            )}
            {(member.selectedOption?.trainingTitle || member.selectedOption?.title) && (
              <span className="text-gray-400">
                {member.selectedOption?.trainingTitle || member.selectedOption?.title}
              </span>
            )}
          </div>
        </div>
        <div className="rounded-full bg-orange-50 border border-orange-100 p-3 shrink-0">
          <User className="w-5 h-5 text-[#ef4d16]" />
        </div>
      </div>

      <div className="space-y-4">
        <FoodPlanFieldsSection
          memberId={memberId}
          lang={lang}
          title="Voedingsschema informatie"
          saveKey="fields"
          defaultFields={defaultSchemaFields}
          defaultOpen
        />

        <FoodPlanFieldsSection
          memberId={memberId}
          lang={lang}
          title="Voedingsadvies"
          saveKey="adviceFields"
          defaultFields={defaultAdviceFields}
          defaultOpen
        />

        <MealPlanSection memberId={memberId} lang={lang} defaultOpen />

        <DagelijkseRichtlijnenSection memberId={memberId} lang={lang} defaultOpen />

        <GainProductsSection memberId={memberId} lang={lang} defaultOpen />
      </div>
    </div>
  );
}

export default function FoodMeal({ lang = "nl" }) {
  const backendBase = useMemo(() => getBackendBaseUrl(), []);
  const [members, setMembers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const dropdownRef = useRef(null);

  const loadMembers = async (q = "") => {
    try {
      setLoading(true);
      setError("");
      const url = `${backendBase}/api/get-userinfos${q ? `?q=${encodeURIComponent(q)}` : ""}`;
      const res = await fetch(url, { headers: { ...authHeaders() } });
      const data = await res.json();
      if (!res.ok || !Array.isArray(data)) {
        throw new Error(data?.message || data?.error || "Failed to load members");
      }
      setMembers(data);
    } catch (e) {
      setError(e?.message || "Failed to load members");
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [backendBase]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const q = String(search || "").trim();
    const timer = setTimeout(() => {
      if (open) loadMembers(q);
    }, 250);
    return () => clearTimeout(timer);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onDocClick = (e) => {
      if (!dropdownRef.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  if (selected) {
    return (
      <FoodPlanView
        member={selected}
        lang={lang}
        onBack={() => setSelected(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-2xl font-bold">Food Meal</div>
          <div className="text-sm text-gray-500">
            {lang === "nl"
              ? "Selecteer een member om het Food Plan te openen."
              : "Select a member to open their Food Plan."}
          </div>
        </div>
        <Button variant="outline" className="rounded-xl" onClick={() => loadMembers(search)} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          {lang === "nl" ? "Verversen" : "Refresh"}
        </Button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      <div ref={dropdownRef} className="relative space-y-1 max-w-xl">
        <label className="block text-xs font-medium text-gray-600">
          {lang === "nl" ? "Selecteer member" : "Select member"}
        </label>

        <button
          type="button"
          onClick={() => {
            setOpen((v) => {
              const next = !v;
              if (next) {
                setSearch("");
                loadMembers("");
              }
              return next;
            });
          }}
          className={`${selectInputCls} flex items-center justify-between gap-2 text-left`}
          aria-expanded={open}
          aria-haspopup="listbox"
        >
          <span className="truncate text-gray-400">
            {lang === "nl" ? "Kies een member…" : "Choose a member…"}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="absolute z-30 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg overflow-hidden">
            <div className="flex items-center gap-2 border-b border-gray-100 px-3 py-2">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="outline-none text-sm w-full"
                placeholder={lang === "nl" ? "Zoek op naam, e-mail, ID…" : "Search name, email, ID…"}
              />
              {search && (
                <button type="button" onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <ul className="max-h-64 overflow-y-auto py-1" role="listbox">
              {loading && (
                <li className="px-3 py-3 text-sm text-gray-500">
                  {lang === "nl" ? "Members laden…" : "Loading members…"}
                </li>
              )}
              {!loading && members.length === 0 && (
                <li className="px-3 py-3 text-sm text-gray-500">
                  {lang === "nl" ? "Geen members gevonden." : "No members found."}
                </li>
              )}
              {!loading &&
                members.map((m) => {
                  const id = String(m._id);
                  return (
                    <li key={id}>
                      <button
                        type="button"
                        role="option"
                        onClick={() => {
                          setSelected(m);
                          setOpen(false);
                          setSearch("");
                        }}
                        className="w-full text-left px-3 py-2.5 text-sm text-gray-800 hover:bg-orange-50 transition-colors"
                      >
                        <div className="font-medium truncate">{memberDisplayName(m)}</div>
                        <div className="text-xs text-gray-500 truncate mt-0.5">
                          {[m.email, m.selectedOption?.trainingTitle || m.selectedOption?.title]
                            .filter(Boolean)
                            .join(" · ") || id}
                        </div>
                      </button>
                    </li>
                  );
                })}
            </ul>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-500 max-w-xl">
        {lang === "nl"
          ? "Selecteer een member om naar hun Food Plan te gaan."
          : "Select a member to go to their Food Plan."}
      </div>
    </div>
  );
}
