import React, { useEffect, useMemo, useState } from "react";
import { AlertCircle, ArrowLeft, Check, LogOut } from "lucide-react";
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

const DAY_NL = ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"];

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

function getIsoWeekNumber(date = new Date()) {
  // ISO-8601 week: week 1 contains the year's first Thursday
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

function useRealtimeClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const day = DAY_NL[now.getDay()];
  const date = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`;
  const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const week = getIsoWeekNumber(now);
  const todayId = todayDayId(now);
  return { day, date, time, week, todayId };
}

function fieldMap(fields) {
  const map = {};
  (Array.isArray(fields) ? fields : []).forEach((f) => {
    if (!f) return;
    const key = String(f.label || f.id || "").toLowerCase().trim();
    if (key) map[key] = f.value || "";
    if (f.id) map[String(f.id).toLowerCase()] = f.value || "";
  });
  return map;
}

function getField(fields, ...keys) {
  const map = fieldMap(fields);
  for (const k of keys) {
    const v = map[String(k).toLowerCase()];
    if (v != null && String(v).trim() !== "") return v;
  }
  return "";
}

/** Check In radio/switch — red = not done, green = followed menu */
function CheckInSwitch({ checkedIn, disabled, onToggle }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onToggle}
      className="flex flex-col items-center gap-0.5 shrink-0 disabled:opacity-60"
      aria-pressed={checkedIn}
      title={checkedIn ? "Afgvinkt — opnieuw klikken om te resetten" : "Klik om in te checken: menu gevolgd"}
    >
      <span className="text-[10px] font-medium text-gray-600 leading-none">Check In</span>
      <span
        className={`relative inline-flex h-6 w-11 items-center rounded-full border transition-colors ${
          checkedIn ? "bg-emerald-200 border-emerald-400" : "bg-gray-200 border-gray-300"
        }`}
      >
        <span
          className={`absolute flex h-5 w-5 items-center justify-center rounded-full shadow transition-all ${
            checkedIn ? "left-[22px] bg-emerald-500 text-white" : "left-0.5 bg-red-500 text-white"
          }`}
        >
          {checkedIn ? <Check className="w-3 h-3" strokeWidth={3} /> : null}
        </span>
      </span>
    </button>
  );
}

function SchemaInfoBlock({ fields }) {
  const rows = [
    { label: "Doel", value: getField(fields, "doel", "Doel") },
    { label: "Lengte", value: getField(fields, "lengte", "Lengte") },
    { label: "Gewicht", value: getField(fields, "gewicht", "Gewicht") },
    { label: "Leeftijd", value: getField(fields, "leeftijd", "Leeftijd") },
    { label: "Training", value: getField(fields, "training", "Training") },
    { label: "Richtlijn calorieën", value: getField(fields, "richtlijn calorieën", "richtlijn-calorieen", "Richtlijn calorieën") },
    { label: "Start", value: getField(fields, "start", "Start") },
    { label: "Eiwitten", value: getField(fields, "eiwitten", "Eiwitten") },
  ];

  // Also show any custom fields not in the defaults
  const known = new Set(rows.map((r) => r.label.toLowerCase()));
  const extras = (Array.isArray(fields) ? fields : []).filter((f) => {
    if (f.kind === "heading") return false;
    const lab = String(f.label || "").toLowerCase();
    return lab && !known.has(lab) && !["richtlijn calorieën"].includes(lab);
  });

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm space-y-1.5">
      {rows.map((r) => (
        <div key={r.label} className="flex gap-2 text-sm leading-relaxed">
          <span className="font-semibold text-gray-900 shrink-0">{r.label}:</span>
          <span className="text-gray-800 whitespace-pre-wrap">{r.value || "—"}</span>
        </div>
      ))}
      {extras.map((f) => (
        <div key={f.id} className="flex gap-2 text-sm leading-relaxed">
          <span className="font-semibold text-gray-900 shrink-0">{f.label}:</span>
          <span className="text-gray-800 whitespace-pre-wrap">{f.value || "—"}</span>
        </div>
      ))}
    </div>
  );
}

function AdviceBlock({ fields }) {
  const list = Array.isArray(fields) ? fields.filter((f) => f.kind !== "heading") : [];
  if (list.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-6 text-sm text-gray-500 shadow-sm">
        Geen voedingsadvies.
      </div>
    );
  }

  const voor = getField(fields, "voedingsadvies voor", "voedingsadvies-voor");
  const title = voor ? `Voedingsadvies voor: ${voor}` : "Voedingsadvies";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm space-y-3">
      <div className="text-base font-bold text-gray-900">{title}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {list.map((f) => {
          const lab = String(f.label || "").toLowerCase();
          if (lab === "voedingsadvies voor") return null;
          return (
            <div key={f.id} className="min-w-0">
              <div className="text-sm font-semibold text-gray-900 mb-1">{f.label}:</div>
              <div className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 min-h-[80px]">
                {f.value || "—"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MealCard({ meal, index, onCheckIn, checkingId }) {
  const busy = checkingId === meal.id;
  const items = (meal.menuItems || []).filter((i) => String(i.value || "").trim());
  const subtitle = [meal.title, meal.time || meal.menuType].filter(Boolean).join(" — ");

  return (
    <div className="rounded-xl border border-gray-300 bg-white shadow-sm p-4 flex flex-col gap-2.5 min-h-[220px]">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-bold text-gray-900">Maaltijd {index + 1}</div>
          {subtitle && <div className="text-xs text-gray-500 mt-0.5 truncate">{subtitle}</div>}
        </div>
        <CheckInSwitch
          checkedIn={Boolean(meal.checkedIn)}
          disabled={busy}
          onToggle={() => onCheckIn(meal.id, !meal.checkedIn)}
        />
      </div>

      {(meal.menuType || meal.time) && (
        <div className="flex flex-wrap gap-x-3 text-xs text-gray-500">
          {meal.menuType && <span>{meal.menuType}</span>}
          {meal.time && <span>{meal.time}</span>}
        </div>
      )}

      <div className="flex-1 space-y-1.5 pt-1">
        {items.length === 0 ? (
          <div className="text-sm text-gray-400">—</div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="border-b border-gray-200 pb-1 text-sm text-gray-900"
            >
              {item.value}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function OrangeTabTitle({ children }) {
  return (
    <div>
      <div className="text-base sm:text-lg font-bold text-gray-900">{children}</div>
      <div className="mt-1.5 h-1 w-48 sm:w-64 rounded-full bg-[#ef4d16]" />
    </div>
  );
}

function GuidelineGrid({ blocks, cols = 3 }) {
  const list = Array.isArray(blocks) ? blocks : [];
  if (list.length === 0) {
    return <p className="text-sm text-gray-500">Geen gegevens.</p>;
  }
  const colCls =
    cols === 4
      ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"
      : "grid grid-cols-1 md:grid-cols-3 gap-5";
  return (
    <div className={`rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm ${colCls}`}>
      {list.map((b) => (
        <div key={b.id} className="min-w-0">
          <div className="text-sm font-bold text-gray-900 mb-2">
            {b.title || "—"}
            {b.title && b.title !== "Tip!" ? " :" : ""}
          </div>
          <div className="min-h-[140px] rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
            {b.content || ""}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MemberVoedingsschema({ onBack, onLogout }) {
  const backendBase = useMemo(() => getBackendBaseUrl(), []);
  const clock = useRealtimeClock();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exists, setExists] = useState(false);
  const [plan, setPlan] = useState(null);
  const [checkingId, setCheckingId] = useState(null);
  const [checkMsg, setCheckMsg] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${backendBase}/api/member-portal/food-plan`, {
        headers: { ...authHeaders() },
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Kon voedingsschema niet laden");
      }
      setExists(Boolean(data.exists));
      setPlan(data.plan || null);
    } catch (e) {
      setError(e?.message || "Kon voedingsschema niet laden");
      setExists(false);
      setPlan(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [backendBase]); // eslint-disable-line react-hooks/exhaustive-deps

  const onCheckIn = async (mealId, checkedIn) => {
    try {
      setCheckingId(mealId);
      setCheckMsg("");
      setError("");
      const res = await fetch(`${backendBase}/api/member-portal/food-plan/meals/${mealId}/check-in`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ checkedIn }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Check-in mislukt");
      }
      setPlan((prev) => {
        if (!prev?.mealPlan?.meals) return prev;
        return {
          ...prev,
          mealPlan: {
            ...prev.mealPlan,
            meals: prev.mealPlan.meals.map((m) =>
              String(m.id) === String(mealId) ? { ...m, checkedIn } : m
            ),
          },
        };
      });
      setCheckMsg(checkedIn ? "Menu afgevinkt — coach ziet dit in het dashboard." : "Check-in gereset.");
    } catch (e) {
      setError(e?.message || "Check-in mislukt");
    } finally {
      setCheckingId(null);
    }
  };

  const meals = plan?.mealPlan?.meals || [];
  const weekPlan = plan?.mealPlan?.weekPlan || 12;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Button variant="outline" className="rounded-xl bg-white" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Terug
          </Button>
          {onLogout && (
            <Button variant="outline" className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 bg-white" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Uitloggen
            </Button>
          )}
        </div>

        {/* Orange title bar */}
        <div className="rounded-2xl bg-[#f4a574] px-5 py-3.5 shadow-sm">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Voedingsschema</h1>
        </div>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {checkMsg && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-800">
            {checkMsg}
          </div>
        )}

        {loading ? (
          <div className="space-y-4 animate-pulse">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-36 rounded-2xl bg-gray-200" />
            ))}
          </div>
        ) : !exists || !plan ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-10 text-center text-sm text-gray-500 shadow-sm">
            Er is nog geen voedingsschema voor jou beschikbaar.
            <br />
            Neem contact op met je coach.
          </div>
        ) : (
          <>
            {/* 1. Schema info */}
            <SchemaInfoBlock fields={plan.fields} />

            {/* 2. Voedingsadvies */}
            <AdviceBlock fields={plan.adviceFields} />

            {/* 3. Realtime + week plan */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-700 font-medium">
                <span>Week: {clock.week}</span>
                <span className="text-gray-300">|</span>
                <span>Dag: {clock.day}</span>
                <span className="text-gray-300">|</span>
                <span>Datum: {clock.date}</span>
                <span className="text-gray-300">|</span>
                <span>Tijd: {clock.time}</span>
                <span className="inline-flex items-center rounded-full bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 ml-1">
                  Realtime
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Week Plan:</span>
                <span className="inline-flex items-center justify-center min-w-[2.25rem] h-9 px-2 rounded-md border border-gray-300 bg-gray-200 text-sm font-bold text-gray-900">
                  {weekPlan}
                </span>
              </div>
            </div>

            {/* 4. Maaltijd blocks — 3 per row */}
            {meals.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-4 py-8 text-center text-sm text-gray-500">
                Nog geen maaltijden in je plan.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {meals.map((meal, idx) => (
                  <MealCard
                    key={meal.id}
                    meal={meal}
                    index={idx}
                    onCheckIn={onCheckIn}
                    checkingId={checkingId}
                  />
                ))}
              </div>
            )}

            {/* 5. Dagelijkse Richtlijnen */}
            <div className="space-y-3 pt-2">
              <OrangeTabTitle>Dagelijkse Richtlijnen:</OrangeTabTitle>
              <GuidelineGrid blocks={plan.dailyGuidelines} cols={3} />
            </div>

            {/* 6. Producten */}
            <div className="space-y-3 pt-1">
              <OrangeTabTitle>Producten die helpen bij aankomen:</OrangeTabTitle>
              <GuidelineGrid blocks={plan.gainProducts} cols={4} />
            </div>

            {/* 7. Day buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 pb-8">
              {WEEK_DAYS.map((day) => {
                const isActive = clock.todayId === day.id;
                return (
                  <span
                    key={day.id}
                    className={`min-w-[2.5rem] px-3 py-1.5 rounded-md border text-sm font-semibold text-center ${
                      isActive
                        ? "bg-[#ef4d16] border-[#ef4d16] text-white"
                        : "bg-white border-gray-300 text-gray-800"
                    }`}
                  >
                    {day.label}
                  </span>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
