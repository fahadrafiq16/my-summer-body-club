import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { ExternalLink } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { getBackendBaseUrl } from "../../utils/backend";

function formatEUR(n) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(Number(n || 0));
}

function formatDateDMY(dateString) {
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "-";
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

function Chip({ tone, children }) {
  const cls =
    tone === "ok"
      ? "bg-green-50 text-green-700 border-green-200"
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
    title: "Finance",
    subtitle: "Betalingen & omzet",
    paidTotal: "Paid",
    openTotal: "Open",
    paidVsOpen: "Paid vs Open (per dag)",
    payments: "Payments",
    allTransactions: "Alle transacties",
    export: "Export",
    loading: "Finance laden...",
  },
  en: {
    title: "Finance",
    subtitle: "Payments & revenue",
    paidTotal: "Paid",
    openTotal: "Outstanding",
    paidVsOpen: "Paid vs Outstanding (per day)",
    payments: "Payments",
    allTransactions: "All transactions",
    export: "Export",
    loading: "Loading finance...",
  },
};

function FinanceSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <div className="h-8 w-40 rounded bg-gray-200" />
        <div className="h-4 w-64 rounded bg-gray-100 mt-2" />
      </div>

      <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="h-4 w-14 rounded bg-gray-200" />
            <div className="h-10 w-44 rounded-xl bg-gray-100 border border-gray-200" />
            <div className="h-10 w-44 rounded-xl bg-gray-100 border border-gray-200" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
          <CardContent className="p-6">
            <div className="h-4 w-20 rounded bg-gray-200" />
            <div className="h-9 w-36 rounded bg-gray-100 mt-3" />
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
          <CardContent className="p-6">
            <div className="h-4 w-20 rounded bg-gray-200" />
            <div className="h-9 w-36 rounded bg-gray-100 mt-3" />
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
        <CardContent className="p-6">
          <div className="h-6 w-52 rounded bg-gray-200 mb-4" />
          <div className="h-64 rounded-xl bg-gray-100 border border-gray-200" />
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
        <CardContent className="p-6 space-y-3">
          <div className="h-6 w-48 rounded bg-gray-200" />
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-10 rounded bg-gray-100 border border-gray-200" />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default function Finance({ lang = "nl" }) {
  const t = i18n[lang] || i18n.nl;
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;
  const yearOptions = ["2025", "2026"];
  const monthOptions = [
    { value: "all", label: "All" },
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const backendBaseUrl = getBackendBaseUrl();
        const query = new URLSearchParams();
        if (selectedYear) query.set("year", selectedYear);
        if (selectedMonth && selectedMonth !== "all") query.set("month", selectedMonth);
        const res = await fetch(`${backendBaseUrl}/api/fetch-payments?${query.toString()}`);
        const data = await res.json();
        if (!res.ok || !Array.isArray(data)) {
          throw new Error(data?.error || "Failed to fetch Mollie payments");
        }
        setPayments(data);
        setPage(1);
      } catch (e) {
        setError(e?.message || "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedYear, selectedMonth]);

  const paidTotal = useMemo(
    () =>
      payments
        .filter((p) => String(p?.status || "").toLowerCase() === "paid")
        .reduce((sum, p) => sum + Number(p?.amount?.value || 0), 0),
    [payments]
  );

  const openTotal = useMemo(
    () =>
      payments
        .filter((p) => ["open", "pending", "authorized"].includes(String(p?.status || "").toLowerCase()))
        .reduce((sum, p) => sum + Number(p?.amount?.value || 0), 0),
    [payments]
  );

  const byDay = useMemo(() => {
    const map = new Map();
    for (const p of payments) {
      const raw = p?.paidAt || p?.createdAt;
      if (!raw) continue;
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) continue;
      const key = d.toISOString().slice(0, 10);
      if (!map.has(key)) map.set(key, { date: key, paid: 0, open: 0 });
      const row = map.get(key);
      const val = Number(p?.amount?.value || 0);
      if (String(p?.status || "").toLowerCase() === "paid") row.paid += val;
      else row.open += val;
    }
    return Array.from(map.values()).sort((a, b) => (a.date > b.date ? 1 : -1));
  }, [payments]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(payments.length / PAGE_SIZE)),
    [payments]
  );

  const pageRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return payments.slice(start, start + PAGE_SIZE);
  }, [payments, page]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  if (loading) {
    return <FinanceSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-bold">{t.title}</div>
        <div className="text-sm text-gray-500">{t.subtitle}</div>
      </div>
      <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-sm text-gray-600">Filters:</div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
              <span className="text-sm text-gray-500">Year</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="outline-none text-sm"
              >
                {yearOptions.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
              <span className="text-sm text-gray-500">Month</span>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="outline-none text-sm"
              >
                {monthOptions.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">{t.paidTotal}</div>
              <Chip tone="ok">PAID</Chip>
            </div>
            <div className="text-3xl font-extrabold mt-2">{formatEUR(paidTotal)}</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">{t.openTotal}</div>
              <Chip tone="danger">OPEN</Chip>
            </div>
            <div className="text-3xl font-extrabold mt-2">{formatEUR(openTotal)}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold">{t.paidVsOpen}</div>
            <Button variant="outline" className="rounded-xl">
              <ExternalLink className="w-4 h-4 mr-2" /> {t.export}
            </Button>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={byDay} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(v) => formatDateDMY(v)} />
                <YAxis />
                <Tooltip formatter={(v) => formatEUR(Number(v))} labelFormatter={(l) => formatDateDMY(String(l))} />
                <Line type="monotone" dataKey="paid" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="open" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
        <CardContent className="p-0">
          <div className="p-6 flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">{t.payments}</div>
              <div className="text-sm text-gray-500">{t.allTransactions}</div>
            </div>
            <div className="text-xs text-gray-500">
              {payments.length === 0
                ? "0"
                : `${(page - 1) * PAGE_SIZE + 1}-${Math.min(page * PAGE_SIZE, payments.length)} / ${payments.length}`}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-b border-gray-200 text-gray-600">
                  <th className="text-left px-6 py-3">Date</th>
                  <th className="text-left px-6 py-3">Payment ID</th>
                  <th className="text-left px-6 py-3">Customer</th>
                  <th className="text-left px-6 py-3">Status</th>
                  <th className="text-right px-6 py-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-700">{formatDateDMY(p.paidAt || p.createdAt)}</td>
                    <td className="px-6 py-3 font-mono text-xs">{p.id}</td>
                    <td className="px-6 py-3 text-gray-700">{p.customerId || "-"}</td>
                    <td className="px-6 py-3">
                      {String(p.status || "").toLowerCase() === "paid" ? (
                        <Chip tone="ok">PAID</Chip>
                      ) : (
                        <Chip tone="danger">{String(p.status || "OPEN").toUpperCase()}</Chip>
                      )}
                    </td>
                    <td className="px-6 py-3 text-right font-medium">{formatEUR(p?.amount?.value || 0)}</td>
                  </tr>
                ))}
                {payments.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                      No Mollie transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-2">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Prev
            </Button>
            <span className="text-sm text-gray-600">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

