import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { motion } from "framer-motion";
import {
  CalendarClock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { getBackendBaseUrl } from "../../utils/backend";

const CATEGORY_COLORS = { CLUB: "#2563EB", PT: "#F97316", RENTAL: "#10B981" };

function formatEUR(n) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(n);
}

function Chip({ tone, children }) {
  const cls =
    tone === "ok"
      ? "bg-green-50 text-green-700 border-green-200"
      : tone === "warn"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : tone === "danger"
      ? "bg-red-50 text-red-700 border-red-200"
      : "bg-gray-50 text-gray-700 border-gray-200";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${cls}`}>
      {children}
    </span>
  );
}

const i18n = {
  nl: {
    kpi: {
      weekly: "Omzet per week",
      monthly: "Omzet per maand",
      total: "Totale omzet (Jan–Dec)",
      club: "Club omzet",
      pt: "PT omzet",
      rental: "PT Ruimte verhuur omzet",
    },
    trend: "Omzet trend (wekelijks)",
    payments: "Betalingen",
    topOutstanding: "Top openstaande:",
    byCategory: "Omzet per categorie",
    byPlan: "Omzet per abonnement",
    registrations: "Registraties",
    month: "Deze maand",
    weeks: "8 weken",
    updatedToday: "Vandaag bijgewerkt",
    paid: "Betaald",
    open: "Openstaand",
    loading: "Dashboard laden...",
    error: "Kon dashboard data niet laden",
  },
  en: {
    kpi: {
      weekly: "Weekly Revenue",
      monthly: "Monthly Revenue",
      total: "Total Revenue (Jan–Dec)",
      club: "Club Revenue",
      pt: "PT Revenue",
      rental: "PT Rental Revenue",
    },
    trend: "Revenue trend (weekly)",
    payments: "Payments",
    topOutstanding: "Top outstanding:",
    byCategory: "Revenue by category",
    byPlan: "Revenue by plan",
    registrations: "Registrations",
    month: "This month",
    weeks: "8 weeks",
    updatedToday: "Updated today",
    paid: "Paid",
    open: "Outstanding",
    loading: "Loading dashboard...",
    error: "Could not load dashboard data",
  },
};

export default function Dashboard({ lang = "nl" }) {
  const t = i18n[lang] || i18n.nl;
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const backendBaseUrl = getBackendBaseUrl();
        const raw = localStorage.getItem("msbc_dashboard_auth");
        const token = raw ? JSON.parse(raw)?.token : null;
        if (!token) {
          setError("Not authenticated");
          return;
        }
        const res = await fetch(`${backendBaseUrl}/api/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed");
        setStats(data);
      } catch (e) {
        setError(e?.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="inline-flex items-center gap-3 text-gray-600">
          <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-gray-700 animate-spin" />
          <span className="text-sm">{t.loading}</span>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-sm text-red-700">
          {t.error}: {error}
        </div>
      </div>
    );
  }

  const { kpi, weeklyTrend, payments, outstandingMembers, categoryRevenue, planRevenue, registrations } = stats;

  const kpiCards = [
    { label: t.kpi.weekly, value: formatEUR(kpi.weekly) },
    { label: t.kpi.monthly, value: formatEUR(kpi.monthly) },
    { label: t.kpi.total, value: formatEUR(kpi.total) },
    { label: t.kpi.club, value: formatEUR(kpi.club) },
    { label: t.kpi.pt, value: formatEUR(kpi.pt) },
    { label: t.kpi.rental, value: formatEUR(kpi.rental) },
  ];

  const planRevenueColored = (planRevenue || []).map((p) => {
    const lower = p.plan.toLowerCase();
    const fill = lower.includes("ruimte") || lower.includes("rental") || lower.includes("verhuur")
      ? CATEGORY_COLORS.RENTAL
      : lower.includes("club") || lower.includes("summerbody")
      ? CATEGORY_COLORS.CLUB
      : CATEGORY_COLORS.PT;
    return { ...p, fill };
  });

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {kpiCards.map((kpi, index) => (
          <motion.div key={index} whileHover={{ scale: 1.02 }}>
            <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
              <CardContent className="p-5">
                <p className="text-sm text-gray-500">{kpi.label}</p>
                <p className="text-2xl font-extrabold mt-2 text-gray-900">{kpi.value}</p>
                <div className="mt-3 text-xs text-gray-400 flex items-center gap-1">
                  <CalendarClock className="w-3 h-3" /> {t.updatedToday}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Trend (Weekly) */}
        <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl xl:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{t.trend}</h2>
              <Chip tone="neutral">{t.weeks}</Chip>
            </div>
            <div className="h-64">
              {weeklyTrend && weeklyTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weeklyTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip formatter={(v) => formatEUR(Number(v))} />
                    <Line type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-gray-400">No trend data yet</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payments Overview */}
        <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{t.payments}</h2>
              <div className="flex gap-2">
                <Chip tone="ok"><CheckCircle2 className="w-3.5 h-3.5" /> {t.paid}: {payments.paidCount}</Chip>
                <Chip tone="danger"><AlertCircle className="w-3.5 h-3.5" /> {t.open}: {payments.openCount}</Chip>
              </div>
            </div>
            <div className="text-sm text-gray-600">{t.topOutstanding}</div>
            <div className="mt-3 space-y-2">
              {(outstandingMembers || []).slice(0, 4).map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                  <div>
                    <div className="font-medium">{m.firstName} {m.lastName}</div>
                    <div className="text-xs text-gray-500">{m.email || "—"}</div>
                  </div>
                  <div className="text-right">
                    <Chip tone="danger">{t.open}</Chip>
                    {m.amount > 0 && <div className="text-xs font-medium text-gray-700 mt-1">{formatEUR(m.amount)}</div>}
                  </div>
                </div>
              ))}
              {(!outstandingMembers || outstandingMembers.length === 0) && (
                <div className="text-sm text-gray-400 py-3 text-center">No outstanding payments</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Category */}
        <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl xl:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{t.byCategory}</h2>
              <Chip tone="neutral">{t.month}</Chip>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryRevenue} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(v) => formatEUR(Number(v))} />
                  <Bar dataKey="value">
                    {(categoryRevenue || []).map((entry) => (
                      <Cell key={entry.key} fill={CATEGORY_COLORS[entry.key] || "#666"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Plan */}
        <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{t.byPlan}</h2>
              <Chip tone="neutral">MongoDB</Chip>
            </div>
            <div className="h-56">
              {planRevenueColored.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={planRevenueColored} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="plan" hide />
                    <YAxis />
                    <Tooltip formatter={(v) => formatEUR(Number(v))} />
                    <Bar dataKey="value">
                      {planRevenueColored.map((p, i) => (
                        <Cell key={i} fill={p.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-sm text-gray-400">No plan data yet</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Registrations */}
        <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl xl:col-span-3">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">{t.registrations}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <div className="text-xs text-gray-500">Club</div>
                <div className="text-2xl font-bold mt-1">{registrations.club}</div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <div className="text-xs text-gray-500">PT</div>
                <div className="text-2xl font-bold mt-1">{registrations.pt}</div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
                <div className="text-xs text-gray-500">Rental</div>
                <div className="text-2xl font-bold mt-1">{registrations.rental}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
