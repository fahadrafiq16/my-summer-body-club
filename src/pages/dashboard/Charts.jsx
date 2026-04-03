import React, { useMemo, useState } from "react";
import { FiBarChart2, FiUsers, FiDollarSign } from "react-icons/fi";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
  Cell,
} from "recharts";

const EUR = (n) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "EUR" }).format(Number(n) || 0);

const Charts = () => {
  const [section, setSection] = useState("dashboard");
  const [selectedMonth, setSelectedMonth] = useState(0);
  const months = useMemo(
    () => ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    []
  );

  const monthly = useMemo(
    () => [
      { month: "Jan", club: 1200, pt: 800 },
      { month: "Feb", club: 1500, pt: 900 },
      { month: "Mar", club: 1800, pt: 1100 },
      { month: "Apr", club: 1700, pt: 1200 },
      { month: "May", club: 2100, pt: 1400 },
      { month: "Jun", club: 2300, pt: 1500 },
      { month: "Jul", club: 2200, pt: 1400 },
      { month: "Aug", club: 2400, pt: 1600 },
      { month: "Sep", club: 2600, pt: 1700 },
      { month: "Oct", club: 2800, pt: 1800 },
      { month: "Nov", club: 3000, pt: 2000 },
      { month: "Dec", club: 3200, pt: 2200 },
    ].map((m) => ({ ...m, total: m.club + m.pt })),
    []
  );

  const members = useMemo(
    () => monthly.map((m, i) => ({ month: m.month, total: 120 + i * 10, newMembers: 10 + (i % 4) * 3 })),
    [monthly]
  );

  const totals = useMemo(() => {
    const club = monthly.reduce((a, x) => a + x.club, 0);
    const pt = monthly.reduce((a, x) => a + x.pt, 0);
    return { club, pt, grand: club + pt };
  }, [monthly]);

  const selectedRevenue = monthly[selectedMonth] || { total: 0, club: 0, pt: 0 };

  const pieData = useMemo(
    () => [
      { name: "Club", value: totals.club, color: "#2563eb" },
      { name: "PT", value: totals.pt, color: "#f97316" },
    ],
    [totals]
  );

  return (
    <div className="p-6 md:p-8 w-full animate-fadeIn space-y-5">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSection("dashboard")}
          className={`h-10 rounded-xl border px-3 text-sm inline-flex items-center gap-2 ${
            section === "dashboard" ? "bg-[#ef4d16] text-white border-[#ef4d16]" : "bg-background hover:bg-muted"
          }`}
        >
          <FiBarChart2 /> Dashboard
        </button>
        <button
          type="button"
          onClick={() => setSection("members")}
          className={`h-10 rounded-xl border px-3 text-sm inline-flex items-center gap-2 ${
            section === "members" ? "bg-[#ef4d16] text-white border-[#ef4d16]" : "bg-background hover:bg-muted"
          }`}
        >
          <FiUsers /> Members
        </button>
        <button
          type="button"
          onClick={() => setSection("finance")}
          className={`h-10 rounded-xl border px-3 text-sm inline-flex items-center gap-2 ${
            section === "finance" ? "bg-[#ef4d16] text-white border-[#ef4d16]" : "bg-background hover:bg-muted"
          }`}
        >
          <FiDollarSign /> Finance
        </button>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Month:</span>
          <select
            className="h-10 rounded-xl border bg-background px-3 text-sm"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {months.map((m, i) => (
              <option key={m} value={i}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-muted-foreground">Total YTD</div>
            <div className="text-2xl font-bold">{EUR(totals.grand)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-muted-foreground">Club YTD</div>
            <div className="text-2xl font-bold">{EUR(totals.club)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-muted-foreground">PT YTD</div>
            <div className="text-2xl font-bold">{EUR(totals.pt)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="text-sm text-muted-foreground">Selected Month</div>
            <div className="text-2xl font-bold">{EUR(selectedRevenue.total)}</div>
          </CardContent>
        </Card>
      </div>

      {(section === "dashboard" || section === "finance") && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Total Revenue (Jan-Dec)</CardTitle>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(v) => EUR(v)} />
                  <Legend />
                  <Bar dataKey="total" name="Total" fill="#ef4d16" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Club vs PT per Month</CardTitle>
            </CardHeader>
            <CardContent className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(v) => EUR(v)} />
                  <Legend />
                  <Bar dataKey="club" stackId="a" fill="#2563eb" />
                  <Bar dataKey="pt" stackId="a" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}

      {(section === "dashboard" || section === "members") && (
        <Card>
          <CardHeader>
            <CardTitle>Members Growth</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={members}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#16a34a" name="Total members" />
                <Bar dataKey="newMembers" fill="#a855f7" name="New members" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Yearly Revenue Split</CardTitle>
        </CardHeader>
        <CardContent className="h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={120}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => EUR(v)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Input</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input placeholder="Club users (demo)" inputMode="numeric" />
          <Input placeholder="PT users (demo)" inputMode="numeric" />
          <Input placeholder="New members (demo)" inputMode="numeric" />
        </CardContent>
      </Card>
    </div>
  );
};

export default Charts;
