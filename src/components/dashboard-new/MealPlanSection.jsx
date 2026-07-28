import React, { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Plus,
  RefreshCw,
  Save,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "../ui/button";
import { getBackendBaseUrl } from "../../utils/backend";

const WEEK_OPTIONS = [4, 6, 12, 24, 36];

const DAY_NL = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];
const DAY_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function authHeaders() {
  try {
    const raw = localStorage.getItem("msbc_dashboard_auth");
    const token = raw ? JSON.parse(raw)?.token : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

function newId(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function emptyMeal() {
  return {
    id: newId("meal"),
    menuType: "",
    time: "",
    title: "",
    checkedIn: false,
    menuItems: [{ id: newId("item"), value: "" }],
  };
}

function emptyMealPlan() {
  return { weekPlan: 12, meals: [] };
}

function mapMealPlan(raw) {
  if (!raw || typeof raw !== "object") return emptyMealPlan();
  const week = Number(raw.weekPlan);
  return {
    weekPlan: WEEK_OPTIONS.includes(week) ? week : 12,
    meals: Array.isArray(raw.meals)
      ? raw.meals.map((m) => ({
          id: m.id || newId("meal"),
          menuType: m.menuType || "",
          time: m.time || "",
          title: m.title || "",
          checkedIn: Boolean(m.checkedIn),
          menuItems:
            Array.isArray(m.menuItems) && m.menuItems.length > 0
              ? m.menuItems.map((item) => ({
                  id: item.id || newId("item"),
                  value: item.value || "",
                }))
              : [{ id: newId("item"), value: "" }],
        }))
      : [],
  };
}

function getIsoWeekNumber(date = new Date()) {
  // ISO-8601 week: week 1 contains the year's first Thursday
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

function useRealtimeClock(lang) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const dayNames = lang === "nl" ? DAY_NL : DAY_EN;
  const day = dayNames[now.getDay()];
  const date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
  const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const week = getIsoWeekNumber(now);

  return { day, date, time, week };
}

const inputCls =
  "w-full rounded-md border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-900 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400";

function StatusCheckIn({ checkedIn, lang }) {
  return (
    <div
      className="flex flex-col items-center gap-0.5 shrink-0"
      title={
        checkedIn
          ? lang === "nl"
            ? "Member heeft deze maaltijd afgevinkt"
            : "Member checked in for this meal"
          : lang === "nl"
          ? "Nog niet afgevinkt door member"
          : "Not checked in by member yet"
      }
    >
      <span className="text-[10px] text-gray-500 leading-tight whitespace-nowrap">Check In</span>
      <div
        className={`relative w-11 h-6 rounded-full border transition-colors ${
          checkedIn ? "bg-emerald-200 border-emerald-400" : "bg-gray-200 border-gray-300"
        }`}
        aria-label={checkedIn ? "Checked in" : "Not checked in"}
      >
        <span
          className={`absolute top-0.5 flex items-center justify-center w-5 h-5 rounded-full shadow-sm transition-all ${
            checkedIn ? "left-5 bg-emerald-500 text-white" : "left-0.5 bg-red-500 text-white"
          }`}
        >
          {checkedIn ? <Check className="w-3 h-3" strokeWidth={3} /> : null}
        </span>
      </div>
    </div>
  );
}

function MaaltijdCard({ meal, index, lang, disabled, onChange, onRemove, onAddRegel, onUpdateItem, onRemoveItem }) {
  return (
    <div className="rounded-xl border border-gray-300 bg-white shadow-sm p-3 sm:p-4 flex flex-col gap-3 min-h-[280px]">
      <div className="flex items-center justify-between gap-2">
        <div className="font-semibold text-gray-900">Maaltijd {index + 1}</div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onAddRegel}
            disabled={disabled}
            className="inline-flex items-center gap-1 rounded-md border border-gray-800 bg-white px-2.5 py-1 text-xs font-medium text-gray-900 hover:bg-gray-50 disabled:opacity-50"
          >
            <Plus className="w-3 h-3" />
            Regel
          </button>
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            className="p-1 rounded-md text-red-500 hover:bg-red-50 disabled:opacity-50"
            title={lang === "nl" ? "Maaltijd verwijderen" : "Remove meal"}
            aria-label={lang === "nl" ? "Maaltijd verwijderen" : "Remove meal"}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label className="block space-y-1">
          <span className="text-xs font-medium text-gray-600">Menu Type</span>
          <input
            className={inputCls}
            value={meal.menuType}
            onChange={(e) => onChange({ menuType: e.target.value })}
            disabled={disabled}
            placeholder="Ontbijt"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-xs font-medium text-gray-600">Tijd</span>
          <input
            className={inputCls}
            value={meal.time}
            onChange={(e) => onChange({ time: e.target.value })}
            disabled={disabled}
            placeholder="08:00"
          />
        </label>
      </div>

      <div className="flex items-end gap-2">
        <label className="block space-y-1 flex-1 min-w-0">
          <span className="text-xs font-medium text-gray-600">Titel</span>
          <input
            className={inputCls}
            value={meal.title}
            onChange={(e) => onChange({ title: e.target.value })}
            disabled={disabled}
            placeholder="Muscle Gain Breakfast"
          />
        </label>
        <StatusCheckIn checkedIn={meal.checkedIn} lang={lang} />
      </div>

      <div className="space-y-2">
        <div className="text-xs font-medium text-gray-600">Menu</div>
        <div className="space-y-2">
          {meal.menuItems.map((item) => (
            <div key={item.id} className="flex items-center gap-1.5">
              <input
                className={inputCls}
                value={item.value}
                onChange={(e) => onUpdateItem(item.id, e.target.value)}
                disabled={disabled}
                placeholder=""
              />
              <button
                type="button"
                onClick={() => onRemoveItem(item.id)}
                disabled={disabled || meal.menuItems.length <= 1}
                className="shrink-0 p-1 rounded-md text-red-500 hover:bg-red-50 disabled:opacity-30"
                aria-label="Verwijderen"
                title="Verwijderen"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MealPlanSection({ memberId, lang, defaultOpen = true }) {
  const backendBase = useMemo(() => getBackendBaseUrl(), []);
  const clock = useRealtimeClock(lang);
  const [expanded, setExpanded] = useState(defaultOpen);
  const [weekPlan, setWeekPlan] = useState(12);
  const [meals, setMeals] = useState([]);
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
        throw new Error(data?.error || "Failed to load meal plan");
      }
      const mapped = mapMealPlan(data.plan?.mealPlan);
      setWeekPlan(mapped.weekPlan);
      setMeals(mapped.meals);
    } catch (e) {
      setError(e?.message || "Failed to load meal plan");
      setWeekPlan(12);
      setMeals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (memberId) load();
  }, [memberId, backendBase]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateMeal = (mealId, patch) => {
    setMeals((prev) => prev.map((m) => (m.id === mealId ? { ...m, ...patch } : m)));
    setStatus(null);
  };

  const removeMeal = (mealId) => {
    setMeals((prev) => prev.filter((m) => m.id !== mealId));
    setStatus(null);
  };

  const addMeal = () => {
    setMeals((prev) => [...prev, emptyMeal()]);
    setStatus(null);
  };

  const addRegel = (mealId) => {
    setMeals((prev) =>
      prev.map((m) =>
        m.id === mealId
          ? { ...m, menuItems: [...m.menuItems, { id: newId("item"), value: "" }] }
          : m
      )
    );
    setStatus(null);
  };

  const updateItem = (mealId, itemId, value) => {
    setMeals((prev) =>
      prev.map((m) =>
        m.id === mealId
          ? {
              ...m,
              menuItems: m.menuItems.map((item) => (item.id === itemId ? { ...item, value } : item)),
            }
          : m
      )
    );
    setStatus(null);
  };

  const removeItem = (mealId, itemId) => {
    setMeals((prev) =>
      prev.map((m) => {
        if (m.id !== mealId) return m;
        if (m.menuItems.length <= 1) return m;
        return { ...m, menuItems: m.menuItems.filter((item) => item.id !== itemId) };
      })
    );
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
        body: JSON.stringify({ mealPlan: { weekPlan, meals } }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to save meal plan");
      }
      const mapped = mapMealPlan(data.plan?.mealPlan);
      setWeekPlan(mapped.weekPlan);
      setMeals(mapped.meals);
      setStatus({
        type: "ok",
        text: lang === "nl" ? "Meal plan opgeslagen." : "Meal plan saved.",
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
        <UtensilsCrossed className="w-4 h-4 text-gray-700 shrink-0" />
        <h2 className="text-base font-bold text-gray-900 tracking-tight flex-1">Meal Plan</h2>
      </button>

      {expanded && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* Toolbar: realtime + week plan + add menu */}
          <div className="flex flex-wrap items-end gap-3 justify-between">
            <div className="flex flex-wrap items-end gap-2">
              <label className="block space-y-1">
                <span className="text-xs font-medium text-gray-600">Week</span>
                <input className={`${inputCls} w-14`} value={clock.week} readOnly title="Current week of the year" />
              </label>
              <label className="block space-y-1">
                <span className="text-xs font-medium text-gray-600">Dag</span>
                <input className={`${inputCls} w-14`} value={clock.day} readOnly />
              </label>
              <label className="block space-y-1">
                <span className="text-xs font-medium text-gray-600">Datum</span>
                <input className={`${inputCls} w-28`} value={clock.date} readOnly />
              </label>
              <label className="block space-y-1">
                <span className="text-xs font-medium text-gray-600">Tijd</span>
                <input className={`${inputCls} w-16`} value={clock.time} readOnly />
              </label>
              <span className="inline-flex items-center rounded-full bg-red-600 text-white text-xs font-semibold px-3 py-1.5 mb-0.5">
                Realtime
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Week Plan:</span>
              <div className="flex items-center gap-1">
                {WEEK_OPTIONS.map((w) => (
                  <button
                    key={w}
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      setWeekPlan(w);
                      setStatus(null);
                    }}
                    className={`w-9 h-9 rounded-md border text-sm font-semibold transition-colors disabled:opacity-50 ${
                      weekPlan === w
                        ? "bg-gray-300 border-gray-400 text-gray-900"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                    title={lang === "nl" ? `Plan voor ${w} weken` : `Plan for ${w} weeks`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={addMeal}
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
          ) : meals.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 px-4 py-10 text-center text-sm text-gray-500">
              {lang === "nl"
                ? "Nog geen maaltijden. Klik op + Menu om Maaltijd 1 te maken."
                : "No meals yet. Click + Menu to create Maaltijd 1."}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {meals.map((meal, idx) => (
                <MaaltijdCard
                  key={meal.id}
                  meal={meal}
                  index={idx}
                  lang={lang}
                  disabled={busy}
                  onChange={(patch) => updateMeal(meal.id, patch)}
                  onRemove={() => removeMeal(meal.id)}
                  onAddRegel={() => addRegel(meal.id)}
                  onUpdateItem={(itemId, value) => updateItem(meal.id, itemId, value)}
                  onRemoveItem={(itemId) => removeItem(meal.id, itemId)}
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
      )}
    </div>
  );
}
