import React, { useEffect, useMemo, useState } from "react";
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
  Sector
} from "recharts";

const EUR = (n) =>
  new Intl.NumberFormat(undefined, { style: "currency", currency: "EUR" }).format(n || 0);

// Brand colors (light)
const BRAND = {
  q1: "#2563eb",
  q2: "#16a34a",
  q3: "#f97316",
  q4: "#a855f7",
  down: "#ef4444"
};

// Brand colors (dark) — tuned for contrast on dark backgrounds
const BRAND_DARK = {
  q1: "#60a5fa",
  q2: "#34d399",
  q3: "#fb923c",
  q4: "#c084fc",
  down: "#fb7185"
};

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function rgbToHex({ r, g, b }) {
  const toHex = (v) => v.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function blendHex(c1, c2, t) {
  const a = hexToRgb(c1);
  const b = hexToRgb(c2);
  return rgbToHex({
    r: Math.round(a.r + (b.r - a.r) * t),
    g: Math.round(a.g + (b.g - a.g) * t),
    b: Math.round(a.b + (b.b - a.b) * t)
  });
}

function safeInt(v) {
  const n = Number(String(v ?? "").replace(/[^0-9]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function sumAge(stats) {
  const male =
    (stats.a18_25_m || 0) + (stats.a25_35_m || 0) + (stats.a35_50_m || 0) + (stats.a50p_m || 0);
  const female =
    (stats.a18_25_f || 0) + (stats.a25_35_f || 0) + (stats.a35_50_f || 0) + (stats.a50p_f || 0);
  return { male, female, total: male + female };
}

const emptyMembers = () => ({
  totalMembers: 0,
  newMembers: 0,
  male: 0,
  female: 0,
  a18_25_m: 0,
  a18_25_f: 0,
  a25_35_m: 0,
  a25_35_f: 0,
  a35_50_m: 0,
  a35_50_f: 0,
  a50p_m: 0,
  a50p_f: 0
});

const legendFormatter = (value, entry) => (
  <span style={{ color: entry?.color || "inherit" }}>{value}</span>
);

function activePieShape(props) {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <text x={cx} y={cy} dy={-6} textAnchor="middle" className="fill-foreground text-sm font-semibold">
        {payload?.name}
      </text>
      <text x={cx} y={cy} dy={14} textAnchor="middle" className="fill-muted-foreground text-xs">
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    </g>
  );
}

export default function RevenueDashboardMock() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Detect dark mode (supports Tailwind 'dark' class + OS preference)
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;

    const read = () => {
      const byClass = document.documentElement.classList.contains("dark");
      const byMedia = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
      setIsDark(Boolean(byClass || byMedia));
    };

    read();

    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    const onChange = () => read();
    mq?.addEventListener?.("change", onChange);

    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      mq?.removeEventListener?.("change", onChange);
      obs.disconnect();
    };
  }, []);

  const palette = isDark ? BRAND_DARK : BRAND;
  const baseMix = isDark ? "#0b1220" : "#ffffff";

  const quarterLabel = (i) => `Q${Math.floor(i / 3) + 1}`;
  const quarterColor = (i) => {
    const q = Math.floor(i / 3) + 1;
    return q === 1 ? palette.q1 : q === 2 ? palette.q2 : q === 3 ? palette.q3 : palette.q4;
  };

  // Classes / pricing
  const CLUB_ITEMS = useMemo(
    () => [
      { key: "club_summerbody_45", label: "Summerbody", price: 45 },
      { key: "club_summerbody_55", label: "Summerbody", price: 55 },
      { key: "club_summerbody_flex_60", label: "Summerbody Flex", price: 60 }
    ],
    []
  );

  const PT_GROUPS = useMemo(
    () => [
      {
        title: "Personal Training",
        items: [
          { key: "pt_personal_single_65", label: "Losse les", price: 65 },
          { key: "pt_pt1_499", label: "PT 1 | Start Pakket 2x p/w", price: 499 },
          { key: "pt_pt2_540", label: "PT 2 | Start Pakket 3x p/w", price: 540 },
          { key: "pt_pt3_399", label: "PT 3 | Start Pakket 2x p/w", price: 399 },
          { key: "pt_personal_5_300", label: "5 Rittenkaart", price: 300 },
          { key: "pt_personal_10_550", label: "10 Rittenkaart", price: 550 },
          { key: "pt_personal_20_1020", label: "20 Rittenkaart", price: 1020 }
        ]
      },
      {
        title: "Afvallen Training",
        items: [
          { key: "pt_afvallen_single_65", label: "Losse les", price: 65 },
          { key: "pt_af1_499", label: "AF 1 | Start Pakket 2x p/w", price: 499 },
          { key: "pt_af2_540", label: "AF 2 | Start Pakket 3x p/w", price: 540 },
          { key: "pt_af3_399", label: "AF 3 | Start Pakket 2x p/w", price: 399 },
          { key: "pt_af_5_300", label: "5 Rittenkaart", price: 300 },
          { key: "pt_af_10_550", label: "10 Rittenkaart", price: 550 },
          { key: "pt_af_20_1020", label: "20 Rittenkaart", price: 1020 }
        ]
      },
      {
        title: "Groep PT Training",
        items: [
          { key: "pt_gpt_single_45", label: "Losse les 1–2", price: 45 },
          { key: "pt_gpt_month_280", label: "Per maand 1–2–2", price: 280 },
          { key: "pt_gpt1_200", label: "GPT 1 | Start Pakket 1–2–2x p/w", price: 200 },
          { key: "pt_gpt2_175", label: "GPT 2 | Start Pakket 1–3–2x p/w", price: 175 },
          { key: "pt_gpt3_250", label: "GPT 3 | Start Pakket 1–2–3x p/w", price: 250 },
          { key: "pt_gpt_5_180", label: "5 Rittenkaart 1–2", price: 180 },
          { key: "pt_gpt_10_350", label: "10 Rittenkaart 1–2", price: 350 }
        ]
      },
      {
        title: "Wedstrijd Training",
        items: [
          { key: "pt_wt_single_80", label: "Losse les", price: 80 },
          { key: "pt_wt1_945", label: "WT 1 | Start Pakket 3x p/w", price: 945 },
          { key: "pt_wt2_1170", label: "WT 2 | Start Pakket 4x p/w", price: 1170 },
          { key: "pt_wt_10_800", label: "10 Rittenkaart", price: 800 },
          { key: "pt_wt_20_1500", label: "20 Rittenkaart", price: 1500 }
        ]
      }
    ],
    []
  );

  const ALL_KEYS = useMemo(
    () => [...CLUB_ITEMS.map((i) => i.key), ...PT_GROUPS.flatMap((g) => g.items.map((i) => i.key))],
    [CLUB_ITEMS, PT_GROUPS]
  );

  const [lang, setLang] = useState(() => {
    if (typeof window === "undefined") return "NL";
    return localStorage.getItem("dashboard_lang") || "NL";
  });

  const T = useMemo(
    () =>
      ({
        NL: {
          dashboard: "Revenue Dashboard (Jan–Dec)",
          hint: "Vul per maand de actieve users per class in. Omzet = prijs × actieve users.",
          month: "Maand",
          copyPrev: "Kopieer vorige maand",
          exportJson: "Export JSON",
          downloadJson: "Download JSON",
          exportPdf: "Exporteer PDF",
          exported: "JSON gekopieerd naar clipboard",
          exportFail: "Kon niet kopiëren (clipboard). Selecteer en kopieer handmatig.",
          pdfTitle: "Omzetrapport",
          club: "Club",
          pt: "PT",
          clubClasses: "Club Abonnementen (Classes)",
          ptClasses: "PT Abonnementen (Classes)",
          subtotal: "Subtotaal",
          monthlyRevenue: "Maandomzet",
          kpiGrand: "Totaal (YTD)",
          kpiClub: "Club Totaal (YTD)",
          kpiPt: "PT Totaal (YTD)",
          totalRevenue: "Totale Omzet (Jan–Dec)",
          clubVsPt: "Club vs PT per Maand",
          revenueSplit: "Jaarlijkse Omzetverdeling",
          printHint: "Tip: kies in de print dialoog voor “Save as PDF”.",
          members: "Leden",
          totalMembers: "LedenTotaal",
          newMembers: "Nieuwe leden (per maand)",
          gender: "Geslacht",
          male: "Man",
          female: "Vrouw",
          ageCategory: "Leeftijd categorie",
          checks: "Checks",
          setGenderFromAge: "Set Man/Vrouw = leeftijdsom",
          newSplit: "Nieuwe leden verdeling (auto)",
          memberGrowth: "Leden groei (MoM)"
        },
        EN: {
          dashboard: "Revenue Dashboard (Jan–Dec)",
          hint: "Enter active users per class per month. Revenue = price × active users.",
          month: "Month",
          copyPrev: "Copy previous month",
          exportJson: "Export JSON",
          downloadJson: "Download JSON",
          exportPdf: "Export PDF",
          exported: "JSON copied to clipboard",
          exportFail: "Could not copy (clipboard). Please copy manually.",
          pdfTitle: "Revenue report",
          club: "Club",
          pt: "PT",
          clubClasses: "Club Subscriptions (Classes)",
          ptClasses: "PT Subscriptions (Classes)",
          subtotal: "Subtotal",
          monthlyRevenue: "Monthly revenue",
          kpiGrand: "Total (YTD)",
          kpiClub: "Club Total (YTD)",
          kpiPt: "PT Total (YTD)",
          totalRevenue: "Total Revenue (Jan–Dec)",
          clubVsPt: "Club vs PT per Month",
          revenueSplit: "Yearly Revenue Split",
          printHint: "Tip: choose “Save as PDF” in the print dialog.",
          members: "Members",
          totalMembers: "Total members",
          newMembers: "New members (per month)",
          gender: "Gender",
          male: "Male",
          female: "Female",
          ageCategory: "Age categories",
          checks: "Checks",
          setGenderFromAge: "Set M/F = age sums",
          newSplit: "New member split (auto)",
          memberGrowth: "Member growth (MoM)"
        }
      })[lang],
    [lang]
  );

  useEffect(() => {
    try {
      localStorage.setItem("dashboard_lang", lang);
    } catch {}

    const persist = async () => {
      try {
        await fetch("/api/user/preferences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ language: lang })
        });
      } catch {
        // ignore
      }
    };
    persist();
  }, [lang]);

  const [selectedMonth, setSelectedMonth] = useState(0);
  const [exportStatus, setExportStatus] = useState("");

  // Hover emphasis
  const [hover, setHover] = useState({ chart: "", index: -1, series: "" });

  const [activePieIdx, setActivePieIdx] = useState(0);

  const [countsByMonth, setCountsByMonth] = useState(() => {
    const init = {};
    for (let mi = 0; mi < months.length; mi++) {
      init[mi] = {};
      for (const k of ALL_KEYS) init[mi][k] = 0;
    }
    return init;
  });

  const [memberStatsByMonth, setMemberStatsByMonth] = useState(() =>
    months.map(() => emptyMembers())
  );

  const setMemberStat = (monthIdx, key, value) => {
    setMemberStatsByMonth((prev) => {
      const next = [...prev];
      const updated = { ...next[monthIdx], [key]: safeInt(value) };
      updated.totalMembers = (updated.male || 0) + (updated.female || 0);
      next[monthIdx] = updated;
      return next;
    });
  };

  const setCount = (monthIdx, key, value) => {
    setCountsByMonth((prev) => ({
      ...prev,
      [monthIdx]: {
        ...prev[monthIdx],
        [key]: safeInt(value)
      }
    }));
  };

  const copyPrevMonth = () => {
    setCountsByMonth((prev) => {
      if (selectedMonth === 0) return prev;
      return {
        ...prev,
        [selectedMonth]: { ...prev[selectedMonth - 1] }
      };
    });

    setMemberStatsByMonth((prev) => {
      if (selectedMonth === 0) return prev;
      const next = [...prev];
      next[selectedMonth] = { ...prev[selectedMonth - 1] };
      return next;
    });
  };

  const revenueForMonth = (monthIdx) => {
    const counts = countsByMonth[monthIdx] || {};
    const club = CLUB_ITEMS.reduce((sum, item) => sum + item.price * (counts[item.key] || 0), 0);
    const pt = PT_GROUPS.reduce(
      (sum, g) => sum + g.items.reduce((s2, item) => s2 + item.price * (counts[item.key] || 0), 0),
      0
    );
    return { club, pt, total: club + pt };
  };

  const baseTimeline = months.map((m, i) => ({ month: m, ...revenueForMonth(i) }));

  // Total revenue bars: quarter colors + growth gradient
  const timeline = baseTimeline.map((row, i) => {
    const prev = i === 0 ? row.total : baseTimeline[i - 1].total;
    const growth = i === 0 ? 0 : (row.total - prev) / (prev || 1);

    const qBase = quarterColor(i);
    const t = clamp((growth + 0.03) / 0.15, 0, 1);

    const fill =
      growth < 0
        ? blendHex(baseMix, palette.down, clamp(-growth / 0.12, 0, 1))
        : blendHex(baseMix, qBase, t);

    return { ...row, quarter: quarterLabel(i), growth, fill };
  });

  const totals = useMemo(() => {
    const club_total = baseTimeline.reduce((a, r) => a + r.club, 0);
    const pt_total = baseTimeline.reduce((a, r) => a + r.pt, 0);
    return { club_total, pt_total, grand_total: club_total + pt_total };
  }, [countsByMonth]);

  const selectedCounts = countsByMonth[selectedMonth] || {};
  const selectedRevenue = revenueForMonth(selectedMonth);
  const selectedMembers = memberStatsByMonth[selectedMonth] || emptyMembers();

  const membersTimeline = months.map((m, i) => {
    const s = memberStatsByMonth[i] || emptyMembers();
    const prev = i === 0 ? s.totalMembers : (memberStatsByMonth[i - 1]?.totalMembers || 0);
    const growth = i === 0 ? 0 : (s.totalMembers - prev) / (prev || 1);
    return {
      month: m,
      totalMembers: s.totalMembers,
      newMembers: s.newMembers,
      male: s.male,
      female: s.female,
      memberGrowth: growth
    };
  });

  // New members auto split (based on current gender ratio)
  const ratioBase = (selectedMembers.male || 0) + (selectedMembers.female || 0);
  const maleShare = ratioBase > 0 ? (selectedMembers.male || 0) / ratioBase : 0.5;
  const newMale = Math.round((selectedMembers.newMembers || 0) * maleShare);
  const newFemale = (selectedMembers.newMembers || 0) - newMale;

  const selectedAgeBars = [
    {
      name: "18–25",
      [T.male]: selectedMembers.a18_25_m || 0,
      [T.female]: selectedMembers.a18_25_f || 0
    },
    {
      name: "25–35",
      [T.male]: selectedMembers.a25_35_m || 0,
      [T.female]: selectedMembers.a25_35_f || 0
    },
    {
      name: "35–50",
      [T.male]: selectedMembers.a35_50_m || 0,
      [T.female]: selectedMembers.a35_50_f || 0
    },
    {
      name: "50+",
      [T.male]: selectedMembers.a50p_m || 0,
      [T.female]: selectedMembers.a50p_f || 0
    }
  ];

  const ageSumsSelected = sumAge(selectedMembers);
  const genderTotalSelected = (selectedMembers.male || 0) + (selectedMembers.female || 0);
  const genderMismatchAge = genderTotalSelected !== ageSumsSelected.total;

  const applyGenderFromAge = () => {
    setMemberStatsByMonth((prev) => {
      const next = [...prev];
      const s = next[selectedMonth] || emptyMembers();
      const sums = sumAge(s);
      const updated = {
        ...s,
        male: sums.male,
        female: sums.female,
        totalMembers: sums.male + sums.female
      };
      next[selectedMonth] = updated;
      return next;
    });
  };

  const memberTotals = useMemo(() => {
    const totalMembersLatest = memberStatsByMonth
      .map((m) => m.totalMembers || 0)
      .filter((n) => n > 0)
      .at(-1) || 0;

    const newMembersYTD = memberStatsByMonth.reduce((a, m) => a + (m.newMembers || 0), 0);
    return { totalMembersLatest, newMembersYTD };
  }, [memberStatsByMonth]);

  const buildExportPayload = () => {
    const monthData = months.map((m, i) => {
      const counts = countsByMonth[i] || {};
      const revenue = revenueForMonth(i);
      const members = memberStatsByMonth[i] || emptyMembers();
      return { month: m, counts, revenue, members };
    });

    const pricingLocalized = {
      club: CLUB_ITEMS.map((x) => ({ ...x, localizedLabel: x.label })),
      pt: PT_GROUPS.map((g) => ({
        title: g.title,
        items: g.items.map((x) => ({ ...x, localizedLabel: x.label }))
      }))
    };

    return {
      language: lang,
      currency: "EUR",
      months: monthData,
      pricing: {
        raw: { club: CLUB_ITEMS, pt: PT_GROUPS },
        localized: pricingLocalized
      },
      totals: {
        club: monthData.reduce((a, x) => a + (x.revenue.club || 0), 0),
        pt: monthData.reduce((a, x) => a + (x.revenue.pt || 0), 0),
        grand: monthData.reduce((a, x) => a + (x.revenue.total || 0), 0)
      },
      members: {
        totalMembersLatest: memberTotals.totalMembersLatest,
        newMembersYTD: memberTotals.newMembersYTD
      }
    };
  };

  const exportJson = async () => {
    try {
      const payload = buildExportPayload();
      const text = JSON.stringify(payload, null, 2);
      await navigator.clipboard.writeText(text);
      setExportStatus(T.exported);
      setTimeout(() => setExportStatus(""), 2500);
    } catch {
      setExportStatus(T.exportFail);
      setTimeout(() => setExportStatus(""), 3000);
    }
  };

  const downloadJson = () => {
    const payload = buildExportPayload();
    const text = JSON.stringify(payload, null, 2);
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `revenue-${lang.toLowerCase()}-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    const payload = buildExportPayload();
    const w = window.open("", "_blank");
    if (!w) return;

    const style = `
      <style>
        body{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Arial; padding:24px;}
        h1{margin:0 0 8px 0;}
        .muted{color:#64748b; font-size:12px;}
        table{width:100%; border-collapse:collapse; margin-top:16px;}
        th,td{border:1px solid #e2e8f0; padding:8px; text-align:left; font-size:12px;}
        th{background:#f8fafc;}
        .kpis{display:flex; gap:12px; margin-top:16px; flex-wrap:wrap;}
        .kpi{border:1px solid #e2e8f0; padding:12px; border-radius:12px; min-width:180px;}
        .kpi .v{font-size:20px; font-weight:700; margin-top:4px;}
        h2{margin:22px 0 8px 0; font-size:14px;}
      </style>
    `;

    const revenueRows = payload.months
      .map(
        (m) =>
          `<tr><td>${m.month}</td><td>${EUR(m.revenue.club)}</td><td>${EUR(m.revenue.pt)}</td><td>${EUR(m.revenue.total)}</td></tr>`
      )
      .join("");

    const memberRows = payload.months
      .map(
        (m) =>
          `<tr><td>${m.month}</td><td>${m.members?.totalMembers ?? 0}</td><td>${m.members?.newMembers ?? 0}</td><td>${m.members?.male ?? 0}</td><td>${m.members?.female ?? 0}</td></tr>`
      )
      .join("");

    w.document.write(`
      <html><head><title>${T.pdfTitle}</title>${style}</head>
      <body>
        <h1>${T.pdfTitle}</h1>
        <div class="muted">${payload.currency} · ${payload.language} · ${new Date().toLocaleString()}</div>

        <div class="kpis">
          <div class="kpi"><div>${T.kpiGrand}</div><div class="v">${EUR(payload.totals.grand)}</div></div>
          <div class="kpi"><div>${T.kpiClub}</div><div class="v">${EUR(payload.totals.club)}</div></div>
          <div class="kpi"><div>${T.kpiPt}</div><div class="v">${EUR(payload.totals.pt)}</div></div>
        </div>

        <h2>Revenue</h2>
        <table>
          <thead><tr><th>${T.month}</th><th>${T.club}</th><th>${T.pt}</th><th>Total</th></tr></thead>
          <tbody>${revenueRows}</tbody>
        </table>

        <h2>${T.members}</h2>
        <table>
          <thead><tr><th>${T.month}</th><th>${T.totalMembers}</th><th>${T.newMembers}</th><th>${T.male}</th><th>${T.female}</th></tr></thead>
          <tbody>${memberRows}</tbody>
        </table>

        <div class="muted" style="margin-top:16px;">${T.printHint}</div>
      </body></html>
    `);
    w.document.close();
    w.focus();
    w.print();
  };

  const quarterLegend = useMemo(
    () => [
      { value: "Q1", type: "square", color: palette.q1 },
      { value: "Q2", type: "square", color: palette.q2 },
      { value: "Q3", type: "square", color: palette.q3 },
      { value: "Q4", type: "square", color: palette.q4 },
      { value: "Down", type: "square", color: palette.down }
    ],
    [palette]
  );

  // Removed runtime self-tests to avoid browser 'process' reference errors.

  return (
    <div className="min-h-screen w-full bg-muted/20 p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">{T.dashboard}</h1>
            <p className="text-sm text-muted-foreground">{T.hint}</p>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <button
              type="button"
              className="h-10 rounded-xl border bg-background px-3 text-sm hover:bg-muted"
              onClick={() => setLang(lang === "NL" ? "EN" : "NL")}
              title="NL / EN"
            >
              {lang}
            </button>

            <div className="text-sm text-muted-foreground">{T.month}:</div>
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

            <button
              type="button"
              className="h-10 rounded-xl border bg-background px-3 text-sm hover:bg-muted"
              onClick={copyPrevMonth}
              title={T.copyPrev}
            >
              {T.copyPrev}
            </button>

            <button
              type="button"
              className="h-10 rounded-xl border bg-background px-3 text-sm hover:bg-muted"
              onClick={exportJson}
              title="Export JSON (clipboard)"
            >
              {T.exportJson}
            </button>

            <button
              type="button"
              className="h-10 rounded-xl border bg-background px-3 text-sm hover:bg-muted"
              onClick={downloadJson}
              title="Download JSON"
            >
              {T.downloadJson}
            </button>

            <button
              type="button"
              className="h-10 rounded-xl border bg-background px-3 text-sm hover:bg-muted"
              onClick={exportPdf}
              title="Export PDF"
            >
              {T.exportPdf}
            </button>

            {exportStatus ? <span className="text-xs text-muted-foreground">{exportStatus}</span> : null}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Card className="md:col-span-2">
            <CardContent className="p-6">
              <div className="text-sm">{T.kpiGrand}</div>
              <div className="text-3xl font-bold">{EUR(totals.grand_total)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm">{T.kpiClub}</div>
              <div className="text-3xl font-bold">{EUR(totals.club_total)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm">{T.kpiPt}</div>
              <div className="text-3xl font-bold">{EUR(totals.pt_total)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm">{T.members}</div>
              <div className="text-3xl font-bold">{memberTotals.totalMembersLatest}</div>
              <div className="text-xs text-muted-foreground">Latest non-zero</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm">{T.newMembers}</div>
              <div className="text-3xl font-bold">{memberTotals.newMembersYTD}</div>
              <div className="text-xs text-muted-foreground">YTD</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm">{T.selectedMonth}</div>
              <div className="text-3xl font-bold">{EUR(selectedRevenue.total)}</div>
              <div className="text-xs text-muted-foreground">
                {months[selectedMonth]} ({T.club} {EUR(selectedRevenue.club)} · {T.pt} {EUR(selectedRevenue.pt)})
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Member Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>
                {T.members} — {months[selectedMonth]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border bg-background p-3">
                  <div className="text-xs text-muted-foreground">{T.totalMembers} (auto)</div>
                  <div className="flex items-center justify-between gap-3 mt-1">
                    <div className="text-lg font-semibold">{selectedMembers.totalMembers}</div>
                    <Input
                      value={String(selectedMembers.totalMembers)}
                      disabled
                      className="w-28 text-right opacity-70"
                      aria-label="Total members (auto)"
                    />
                  </div>
                </div>

                <div className="rounded-xl border bg-background p-3">
                  <div className="text-xs text-muted-foreground">{T.newMembers}</div>
                  <div className="flex items-center justify-between gap-3 mt-1">
                    <div className="text-lg font-semibold">{selectedMembers.newMembers}</div>
                    <Input
                      inputMode="numeric"
                      value={String(selectedMembers.newMembers)}
                      onChange={(e) => setMemberStat(selectedMonth, "newMembers", e.target.value)}
                      className="w-28 text-right"
                      aria-label="New members per month"
                    />
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {T.newSplit}: {T.male} {newMale} · {T.female} {newFemale}
                  </div>
                </div>

                <div className="rounded-xl border bg-background p-3">
                  <div className="text-xs text-muted-foreground">{T.gender}: {T.male}</div>
                  <div className="flex items-center justify-between gap-3 mt-1">
                    <div className="text-lg font-semibold">{selectedMembers.male}</div>
                    <Input
                      inputMode="numeric"
                      value={String(selectedMembers.male)}
                      onChange={(e) => setMemberStat(selectedMonth, "male", e.target.value)}
                      className="w-28 text-right"
                      aria-label="Male"
                    />
                  </div>
                </div>

                <div className="rounded-xl border bg-background p-3">
                  <div className="text-xs text-muted-foreground">{T.gender}: {T.female}</div>
                  <div className="flex items-center justify-between gap-3 mt-1">
                    <div className="text-lg font-semibold">{selectedMembers.female}</div>
                    <Input
                      inputMode="numeric"
                      value={String(selectedMembers.female)}
                      onChange={(e) => setMemberStat(selectedMonth, "female", e.target.value)}
                      className="w-28 text-right"
                      aria-label="Female"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  className="h-9 rounded-xl border bg-background px-3 text-sm hover:bg-muted"
                  onClick={applyGenderFromAge}
                >
                  {T.setGenderFromAge}
                </button>
              </div>

              <div className="mt-4 rounded-2xl border bg-background p-3">
                <div className="text-sm font-semibold mb-2">{T.checks}</div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>
                    {T.totalMembers} = {selectedMembers.totalMembers} · {T.male}+{T.female} = {genderTotalSelected} · {T.ageCategory} sum = {ageSumsSelected.total}
                  </div>
                  {genderMismatchAge ? (
                    <div className="text-amber-600">⚠ {T.male}+{T.female} ≠ {T.ageCategory} sum</div>
                  ) : null}
                  {!genderMismatchAge ? <div className="text-green-700">✓ OK</div> : null}
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm font-semibold mb-2">{T.ageCategory} (Man / Vrouw)</div>
                <div className="space-y-3 text-sm">
                  {[
                    { label: "18–25", mKey: "a18_25_m", fKey: "a18_25_f" },
                    { label: "25–35", mKey: "a25_35_m", fKey: "a25_35_f" },
                    { label: "35–50", mKey: "a35_50_m", fKey: "a35_50_f" },
                    { label: "50+", mKey: "a50p_m", fKey: "a50p_f" }
                  ].map(({ label, mKey, fKey }) => (
                    <div key={label} className="rounded-xl border bg-background p-3">
                      <div className="font-medium mb-2">{label}</div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-muted-foreground">{T.male}</span>
                          <Input
                            inputMode="numeric"
                            value={String(selectedMembers[mKey] || 0)}
                            onChange={(e) => setMemberStat(selectedMonth, mKey, e.target.value)}
                            className="w-24 text-right"
                          />
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-muted-foreground">{T.female}</span>
                          <Input
                            inputMode="numeric"
                            value={String(selectedMembers[fKey] || 0)}
                            onChange={(e) => setMemberStat(selectedMonth, fKey, e.target.value)}
                            className="w-24 text-right"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>New Members (Jan–Dec)</CardTitle>
              </CardHeader>
              <CardContent className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={membersTimeline}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend formatter={legendFormatter} />
                    <Bar dataKey="newMembers" name={T.newMembers} fill={palette.q2} isAnimationActive={false}>
                      {membersTimeline.map((_e, idx) => (
                        <Cell
                          key={`new-${idx}`}
                          fill={palette.q2}
                          fillOpacity={
                            hover.chart !== "new" || hover.index === -1
                              ? 0.9
                              : hover.index === idx
                              ? 1
                              : 0.25
                          }
                          onMouseEnter={() => setHover({ chart: "new", index: idx, series: "" })}
                          onMouseLeave={() => setHover({ chart: "", index: -1, series: "" })}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>{T.memberGrowth} (Jan–Dec)</CardTitle>
              </CardHeader>
              <CardContent className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={membersTimeline}>
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(v) => `${Math.round(Number(v) * 100)}%`} />
                    <Tooltip formatter={(v) => `${(Number(v) * 100).toFixed(1)}%`} />
                    <Legend formatter={legendFormatter} />
                    <Bar dataKey="memberGrowth" name="MoM" fill={palette.q3} isAnimationActive={false}>
                      {membersTimeline.map((_e, idx) => (
                        <Cell
                          key={`growth-${idx}`}
                          fill={palette.q3}
                          fillOpacity={
                            hover.chart !== "growth" || hover.index === -1
                              ? 0.9
                              : hover.index === idx
                              ? 1
                              : 0.25
                          }
                          onMouseEnter={() => setHover({ chart: "growth", index: idx, series: "" })}
                          onMouseLeave={() => setHover({ chart: "", index: -1, series: "" })}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>
                  {T.ageCategory} (Man / Vrouw) — {months[selectedMonth]}
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={selectedAgeBars} layout="vertical">
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend formatter={legendFormatter} />
                    <Bar
                      dataKey={T.male}
                      stackId="a"
                      name={T.male}
                      fill={palette.q1}
                      fillOpacity={hover.series && hover.series !== "male" ? 0.25 : 0.9}
                      onMouseEnter={() => setHover({ chart: "", index: -1, series: "male" })}
                      onMouseLeave={() => setHover({ chart: "", index: -1, series: "" })}
                      isAnimationActive={false}
                    />
                    <Bar
                      dataKey={T.female}
                      stackId="a"
                      name={T.female}
                      fill={palette.q4}
                      fillOpacity={hover.series && hover.series !== "female" ? 0.25 : 0.9}
                      onMouseEnter={() => setHover({ chart: "", index: -1, series: "female" })}
                      onMouseLeave={() => setHover({ chart: "", index: -1, series: "" })}
                      isAnimationActive={false}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Inputs by category/classes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>
                {T.clubClasses} — {months[selectedMonth]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {CLUB_ITEMS.map((item) => {
                  const n = selectedCounts[item.key] || 0;
                  const rev = item.price * n;
                  return (
                    <div
                      key={item.key}
                      className="flex items-center justify-between gap-3 rounded-xl border bg-background p-3"
                    >
                      <div className="min-w-0">
                        <div className="font-medium truncate">
                          {item.label} <span className="text-muted-foreground">({EUR(item.price)}/mnd)</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {T.monthlyRevenue}: <span className="text-foreground font-medium">{EUR(rev)}</span>
                        </div>
                      </div>
                      <div className="w-24 shrink-0">
                        <Input
                          inputMode="numeric"
                          value={String(n)}
                          onChange={(e) => setCount(selectedMonth, item.key, e.target.value)}
                          className="text-right"
                          aria-label={`Active users for ${item.label}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>
                {T.ptClasses} — {months[selectedMonth]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {PT_GROUPS.map((group) => {
                  const groupSubtotal = group.items.reduce(
                    (s, it) => s + it.price * (selectedCounts[it.key] || 0),
                    0
                  );

                  return (
                    <div key={group.title} className="rounded-2xl border bg-background p-3">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <div className="font-semibold">{group.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {T.subtotal}: <span className="font-medium text-foreground">{EUR(groupSubtotal)}</span>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        {group.items.map((item) => {
                          const n = selectedCounts[item.key] || 0;
                          const rev = item.price * n;
                          return (
                            <div
                              key={item.key}
                              className="flex items-center justify-between gap-3 rounded-xl border bg-background p-3"
                            >
                              <div className="min-w-0">
                                <div className="font-medium truncate">
                                  {item.label} <span className="text-muted-foreground">({EUR(item.price)})</span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {T.monthlyRevenue}: <span className="text-foreground font-medium">{EUR(rev)}</span>
                                </div>
                              </div>
                              <div className="w-24 shrink-0">
                                <Input
                                  inputMode="numeric"
                                  value={String(n)}
                                  onChange={(e) => setCount(selectedMonth, item.key, e.target.value)}
                                  className="text-right"
                                  aria-label={`Active users for ${group.title} - ${item.label}`}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue charts */}
        <Card>
          <CardHeader>
            <CardTitle>{T.totalRevenue}</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeline} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(v, _name, ctx) => {
                    const g = ctx?.payload?.growth ?? 0;
                    const gPct = (Number(g) * 100).toFixed(1);
                    return [`${EUR(Number(v))}  •  MoM ${Number(g) >= 0 ? "+" : ""}${gPct}%`, "Total"];
                  }}
                />
                <Legend payload={quarterLegend} formatter={legendFormatter} />
                <Bar
                  dataKey="total"
                  name="Total"
                  activeBar={{ stroke: isDark ? "#e2e8f0" : "#0f172a", strokeWidth: 2 }}
                  isAnimationActive={false}
                >
                  {timeline.map((entry, index) => (
                    <Cell
                      key={`rev-${index}`}
                      fill={entry.fill}
                      fillOpacity={
                        hover.chart !== "rev" || hover.index === -1
                          ? 0.9
                          : hover.index === index
                          ? 1
                          : 0.25
                      }
                      onMouseEnter={() => setHover({ chart: "rev", index, series: "" })}
                      onMouseLeave={() => setHover({ chart: "", index: -1, series: "" })}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{T.clubVsPt}</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={baseTimeline}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(v) => EUR(Number(v))} />
                <Legend formatter={legendFormatter} />
                <Bar
                  dataKey="club"
                  stackId="a"
                  name={T.club}
                  fill={palette.q1}
                  fillOpacity={hover.series && hover.series !== "club" ? 0.25 : 0.9}
                  onMouseEnter={() => setHover({ chart: "clubpt", index: -1, series: "club" })}
                  onMouseLeave={() => setHover({ chart: "", index: -1, series: "" })}
                  isAnimationActive={false}
                />
                <Bar
                  dataKey="pt"
                  stackId="a"
                  name={T.pt}
                  fill={palette.q3}
                  fillOpacity={hover.series && hover.series !== "pt" ? 0.25 : 0.9}
                  onMouseEnter={() => setHover({ chart: "clubpt", index: -1, series: "pt" })}
                  onMouseLeave={() => setHover({ chart: "", index: -1, series: "" })}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{T.revenueSplit}</CardTitle>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: T.club, value: totals.club_total, color: palette.q1 },
                    { name: T.pt, value: totals.pt_total, color: palette.q3 }
                  ]}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  innerRadius={55}
                  activeIndex={activePieIdx}
                  activeShape={activePieShape}
                  onMouseEnter={(_d, idx) => setActivePieIdx(idx)}
                >
                  <Cell fill={palette.q1} fillOpacity={activePieIdx === 0 ? 1 : 0.35} />
                  <Cell fill={palette.q3} fillOpacity={activePieIdx === 1 ? 1 : 0.35} />
                </Pie>
                <Tooltip formatter={(v) => EUR(Number(v))} />
                <Legend formatter={legendFormatter} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
