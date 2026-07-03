import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import Dashboard from "../../components/dashboard-new/Dashboard";
import Finance from "../../components/dashboard-new/Finance";
import Programs from "../../components/dashboard-new/Programs";
import Reviews from "../../components/dashboard-new/Reviews";
import FotosGalleryAdmin from "../../components/dashboard-new/FotosGalleryAdmin";
import HomeTab from "../../components/dashboard-new/HomeTab";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import {
  Shield,
  Users,
  LayoutDashboard,
  Receipt,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Search,
  Ban,
  Unlock,
  CheckCircle2,
  AlertCircle,
  ChevronsUpDown,
  Globe,
  FileText,
  CreditCard,
  Mail,
  MessageSquare,
  Home,
  Images,
  LogIn,
  LogOut,
  ArrowLeft,
  ExternalLink,
  Trash2,
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

const i18n = {
  nl: {
    app: {
      title: "MY SUMMERBODY CLUB",
      subtitle: "Admin Dashboard 2026",
      lang: "Taal",
      role: "Rol",
      location: "Vestiging",
    },
    tabs: {
      dashboard: "Dashboard",
      members: "Members",
      finance: "Finance",
      invoices: "Facturen",
      automations: "Automations",
      programs: "Programs",
      reviews: "Reviews",
      home: "Home",
      gallery: "Gallery",
      contentMenu: "Website",
      portal: "Member portal",
    },
    roles: { admin: "Admin", staff: "Staff" },
    dashboard: {
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
    },
    members: {
      title: "Members",
      subtitle: "Overzicht in 3 blokken (Club / PT / Rental)",
      search: "Zoeken (naam, ID, plan)",
      paid: "Betaald",
      open: "Openstaand",
      clubOverview: "Club Member Overzicht",
      ptOverview: "PT Member Overzicht",
      rentalOverview: "Verhuur / Rental Member Overzicht",
      clubSub: "Club registratie en abonnementen",
      ptSub: "Personal Training registraties",
      rentalSub: "PT ruimte verhuur registraties",
      table: {
        member: "Member",
        customerId: "Customer ID",
        category: "Categorie",
        plan: "Abonnement",
        subType: "Type abonnement",
        start: "Start",
        end: "Eind",
        payment: "Betaling",
        block: "Blokkade",
        actions: "Acties",
        openBtn: "Open",
        blockBtn: "Blok",
        unblockBtn: "Deblok",
        active: "Actief",
        blocked: "Geblokkeerd",
      },
      none: "Geen resultaten.",
      detail: {
        title: "Member details",
        personal: "Persoonlijke gegevens",
        payments: "Betalingen",
        markPaid: "Markeer als betaald",
        generateInvoice: "Factuur maken",
        sendReminder: "Herinnering sturen",
        paymentProvider: "Betaalprovider",
      },
    },
    finance: {
      title: "Finance",
      subtitle: "Betalingen & omzet",
      paidTotal: "Paid",
      openTotal: "Open",
      paidVsOpen: "Paid vs Open (per dag)",
      payments: "Payments",
      allTransactions: "Alle transacties",
      export: "Export",
    },
    invoices: {
      title: "Facturen",
      subtitle: "PDF export + factuur preview",
      create: "Nieuwe factuur",
      print: "Print / Save PDF",
      vatToggle: "BTW",
      vatPerCategory: "BTW per categorie",
      vatRate: "BTW tarief",
      customer: "Klant",
      subscription: "Abonnement",
      oneTime: "Eenmalige kosten (1e maand)",
      vat: "BTW",
      subtotal: "Subtotaal",
      total: "Totaal",
      note: "Tip: gebruik Print → Save as PDF. In productie genereren we echte PDF via server.",
    },
    automations: {
      title: "Automations",
      subtitle: "Maandelijkse facturatie + reminders",
      cron: "Maandelijkse facturatie",
      runNow: "Nu uitvoeren",
      schedule: "Schema",
      reminders: "E-mail reminders",
      template: "Template",
      save: "Opslaan",
      test: "Test mail sturen",
    },
    portal: {
      title: "Member portal",
      subtitle: "Leden kunnen status en facturen bekijken",
      loginAs: "Login als",
      mySubs: "Mijn abonnement(en)",
      myPayments: "Mijn betalingen",
    },
    common: {
      updatedToday: "Vandaag bijgewerkt",
      open: "Open",
      paid: "Betaald",
      back: "Terug",
      demo: "Demo",
      adminOnly: "Alleen Admin",
    },
  },
  en: {
    app: {
      title: "MY SUMMERBODY CLUB",
      subtitle: "Admin Dashboard 2026",
      lang: "Language",
      role: "Role",
      location: "Location",
    },
    tabs: {
      dashboard: "Dashboard",
      members: "Members",
      finance: "Finance",
      invoices: "Invoices",
      automations: "Automations",
      programs: "Programs",
      reviews: "Reviews",
      home: "Home",
      gallery: "Gallery",
      contentMenu: "Website",
      portal: "Member portal",
    },
    roles: { admin: "Admin", staff: "Staff" },
    dashboard: {
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
    },
    members: {
      title: "Members",
      subtitle: "Overview in 3 sections (Club / PT / Rental)",
      search: "Search (name, ID, plan)",
      paid: "Paid",
      open: "Outstanding",
      clubOverview: "Club Members Overview",
      ptOverview: "PT Members Overview",
      rentalOverview: "Rental Members Overview",
      clubSub: "Club registration and plans",
      ptSub: "Personal Training registrations",
      rentalSub: "PT space rental registrations",
      table: {
        member: "Member",
        customerId: "Customer ID",
        category: "Category",
        plan: "Plan",
        subType: "Plan type",
        start: "Start",
        end: "End",
        payment: "Payment",
        block: "Block",
        actions: "Actions",
        openBtn: "Open",
        blockBtn: "Block",
        unblockBtn: "Unblock",
        active: "Active",
        blocked: "Blocked",
      },
      none: "No results.",
      detail: {
        title: "Member details",
        personal: "Personal info",
        payments: "Payments",
        markPaid: "Mark as paid",
        generateInvoice: "Generate invoice",
        sendReminder: "Send reminder",
        paymentProvider: "Payment provider",
      },
    },
    finance: {
      title: "Finance",
      subtitle: "Payments & revenue",
      paidTotal: "Paid",
      openTotal: "Outstanding",
      paidVsOpen: "Paid vs Outstanding (per day)",
      payments: "Payments",
      allTransactions: "All transactions",
      export: "Export",
    },
    invoices: {
      title: "Invoices",
      subtitle: "PDF export + invoice preview",
      create: "New invoice",
      print: "Print / Save PDF",
      vatToggle: "VAT",
      vatPerCategory: "VAT per category",
      vatRate: "VAT rate",
      customer: "Customer",
      subscription: "Subscription",
      oneTime: "One-time fees (first month)",
      vat: "VAT",
      subtotal: "Subtotal",
      total: "Total",
      note: "Tip: use Print → Save as PDF. In production we generate real PDFs server-side.",
    },
    automations: {
      title: "Automations",
      subtitle: "Monthly billing + reminders",
      cron: "Monthly billing",
      runNow: "Run now",
      schedule: "Schedule",
      reminders: "Email reminders",
      template: "Template",
      save: "Save",
      test: "Send test email",
    },
    portal: {
      title: "Member portal",
      subtitle: "Members can view status and invoices",
      loginAs: "Login as",
      mySubs: "My subscriptions",
      myPayments: "My payments",
    },
    common: {
      updatedToday: "Updated today",
      open: "Open",
      paid: "Paid",
      back: "Back",
      demo: "Demo",
      adminOnly: "Admin only",
    },
  },
};

function formatEUR(n) {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(n);
}

function formatDateDMY(dateString) {
  const d = new Date(dateString);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function assert(condition, message) {
  if (!condition) throw new Error(`SelfTest failed: ${message}`);
}

const PLAN_CATALOG = [
  { id: "club-4w", category: "CLUB", labelNL: "Club | 4 weken", labelEN: "Club | 4 weeks", price: 60, cycle: "FOUR_WEEKS" },
  { id: "pt-single", category: "PT", labelNL: "PT | Losse les (1 uur)", labelEN: "PT | Single session (1h)", price: 65, cycle: "SINGLE" },
  { id: "pt1", category: "PT", labelNL: "PT1 | 2 mnd | 2x p.w.", labelEN: "PT1 | 2 mo | 2x/wk", price: 499, cycle: "MONTHLY" },
  { id: "pt2", category: "PT", labelNL: "PT2 | 2 mnd | 3x p.w.", labelEN: "PT2 | 2 mo | 3x/wk", price: 540, cycle: "MONTHLY" },
  { id: "pt3", category: "PT", labelNL: "PT3 | 6 mnd | 2x p.w.", labelEN: "PT3 | 6 mo | 2x/wk", price: 399, cycle: "MONTHLY" },
  { id: "ptc1", category: "PT", labelNL: "PT C1 | Pakket op maat (X)", labelEN: "PT C1 | Custom (X)", price: 0, cycle: "MONTHLY", custom: true },
  { id: "pt-5", category: "PT", labelNL: "PT | 5-lessenkaart", labelEN: "PT | 5-session card", price: 300, cycle: "CARD" },
  { id: "pt-10", category: "PT", labelNL: "PT | 10-lessenkaart", labelEN: "PT | 10-session card", price: 550, cycle: "CARD" },
  { id: "pt-20", category: "PT", labelNL: "PT | 20-lessenkaart", labelEN: "PT | 20-session card", price: 1020, cycle: "CARD" },
  { id: "gpt2", category: "PT", labelNL: "GPT2 | 2 mnd | 1-3-2x p.w.", labelEN: "GPT2 | 2 mo | 1-3-2x/wk", price: 175, cycle: "MONTHLY" },
  { id: "wt1", category: "PT", labelNL: "WT1 | 3x p.w.", labelEN: "WT1 | 3x/wk", price: 945, cycle: "MONTHLY" },
  { id: "nutri", category: "PT", labelNL: "Voedingsplan (optioneel)", labelEN: "Nutrition plan (optional)", price: 300, cycle: "SINGLE" },
  { id: "rental-1", category: "RENTAL", labelNL: "Onbeperkt 1 PT ruimte (excl. BTW)", labelEN: "Unlimited 1 PT room (excl. VAT)", price: 300, cycle: "MONTHLY" },
  { id: "rental-2", category: "RENTAL", labelNL: "Onbeperkt 2 PT ruimtes (excl. BTW)", labelEN: "Unlimited 2 PT rooms (excl. VAT)", price: 400, cycle: "MONTHLY" },
];

function getPlan(planId) {
  return PLAN_CATALOG.find((p) => p.id === planId) ?? PLAN_CATALOG[0];
}

const CATEGORY_COLORS = { CLUB: "#2563EB", PT: "#F97316", RENTAL: "#10B981" };

const VAT_STORAGE_PREFIX = "msbc_vat_settings_v1";
function vatStorageKey(locationId) {
  return `${VAT_STORAGE_PREFIX}:${locationId}`;
}
function readVatSettings(locationId) {
  try {
    if (typeof window === "undefined") return { percentByCategory: { CLUB: 21, PT: 21, RENTAL: 21 } };
    const raw = localStorage.getItem(vatStorageKey(locationId));
    if (!raw) throw new Error("missing");
    const parsed = JSON.parse(raw);
    if (!parsed?.percentByCategory) throw new Error("invalid");
    return parsed;
  } catch {
    return { percentByCategory: { CLUB: 21, PT: 21, RENTAL: 21 } };
  }
}
function useVatSettings(locationId) {
  const [settings, setSettings] = useState(() => readVatSettings(locationId));
  useEffect(() => {
    setSettings(readVatSettings(locationId));
  }, [locationId]);
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      localStorage.setItem(vatStorageKey(locationId), JSON.stringify(settings));
    } catch {}
  }, [settings, locationId]);
  const setPercentForCategory = (cat, percent) => {
    setSettings((prev) => ({
      ...prev,
      percentByCategory: { ...prev.percentByCategory, [cat]: percent },
    }));
  };
  return { settings, setSettings, setPercentForCategory };
}
function vatAmount(subtotal, percent) {
  return Math.round(subtotal * (percent / 100) * 100) / 100;
}

const LOCATIONS = [
  { id: "ams", name: "MSBC Amsterdam", city: "Amsterdam" },
  { id: "utr", name: "MSBC Utrecht", city: "Utrecht" },
];

const MOCK_REVENUE_KPI = { weekly: 4850, monthly: 18200, total: 142000, club: 9400, pt: 6300, rental: 2500 };
const MOCK_REVENUE_TREND = [
  { week: "W1", revenue: 3500 }, { week: "W2", revenue: 4200 }, { week: "W3", revenue: 3900 }, { week: "W4", revenue: 4850 },
  { week: "W5", revenue: 5100 }, { week: "W6", revenue: 4700 }, { week: "W7", revenue: 5200 }, { week: "W8", revenue: 5650 },
];

const MOCK_MEMBERS_SEED = [
  { id: "m1", category: "CLUB", customerId: "CLUB-000014", firstName: "Sam", lastName: "de Vries", planId: "club-4w", startDate: "2026-02-01", endDate: "2026-02-29", paymentStatus: "PAID", blocked: false, email: "sam@example.com" },
  { id: "m2", category: "PT", customerId: "PT-000087", firstName: "Noah", lastName: "Jansen", planId: "pt1", startDate: "2026-02-10", endDate: "2026-03-10", paymentStatus: "OPEN", blocked: false, email: "noah@example.com" },
  { id: "m3", category: "RENTAL", customerId: "RENT-000006", firstName: "Aisha", lastName: "Bakker", planId: "rental-1", startDate: "2026-02-15", endDate: "2026-03-15", paymentStatus: "PAID", blocked: false, email: "aisha@example.com" },
  { id: "m4", category: "CLUB", customerId: "CLUB-000031", firstName: "Liam", lastName: "Smit", planId: "club-4w", startDate: "2026-01-25", endDate: "2026-02-22", paymentStatus: "OPEN", blocked: true, email: "liam@example.com" },
  { id: "m5", category: "PT", customerId: "PT-000112", firstName: "Mila", lastName: "Visser", planId: "gpt2", startDate: "2026-02-20", endDate: "2026-03-20", paymentStatus: "PAID", blocked: false, email: "mila@example.com" },
  { id: "m6", category: "RENTAL", customerId: "RENT-000009", firstName: "Jay", lastName: "Khan", planId: "rental-2", startDate: "2026-02-05", endDate: "2026-03-05", paymentStatus: "OPEN", blocked: false, email: "jay@example.com" },
];

const MOCK_PAYMENTS_BASE = [
  { id: "p1", customerId: "PT-000087", customerName: "Noah Jansen", category: "PT", planId: "pt1", date: "2026-02-10", amount: 499, status: "OPEN", method: "Transfer", kind: "BASE" },
  { id: "p2", customerId: "CLUB-000031", customerName: "Liam Smit", category: "CLUB", planId: "club-4w", date: "2026-01-25", amount: 60, status: "OPEN", method: "Cash", kind: "BASE" },
  { id: "p3", customerId: "PT-000112", customerName: "Mila Visser", category: "PT", planId: "gpt2", date: "2026-02-20", amount: 175, status: "PAID", method: "Card", kind: "BASE" },
  { id: "p4", customerId: "RENT-000006", customerName: "Aisha Bakker", category: "RENTAL", planId: "rental-1", date: "2026-02-15", amount: 300, status: "PAID", method: "Transfer", kind: "BASE" },
  { id: "p5", customerId: "CLUB-000014", customerName: "Sam de Vries", category: "CLUB", planId: "club-4w", date: "2026-02-01", amount: 60, status: "PAID", method: "Card", kind: "BASE" },
  { id: "p6", customerId: "RENT-000009", customerName: "Jay Khan", category: "RENTAL", planId: "rental-2", date: "2026-02-05", amount: 400, status: "OPEN", method: "Transfer", kind: "BASE" },
];

function Chip({ tone, children }) {
  const cls = tone === "ok" ? "bg-green-50 text-green-700 border-green-200"
    : tone === "warn" ? "bg-amber-50 text-amber-700 border-amber-200"
    : tone === "danger" ? "bg-red-50 text-red-700 border-red-200"
    : "bg-gray-50 text-gray-700 border-gray-200";
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium ${cls}`}>{children}</span>;
}

function cycleLabel(cycle, lang) {
  const nl = cycle === "FOUR_WEEKS" ? "4 weken" : cycle === "MONTHLY" ? "Maandelijks" : cycle === "CARD" ? "Lessenkaart" : "Los";
  const en = cycle === "FOUR_WEEKS" ? "4 weeks" : cycle === "MONTHLY" ? "Monthly" : cycle === "CARD" ? "Session card" : "Single";
  return lang === "nl" ? nl : en;
}

function NavButton({ icon, label, active, collapsed, onClick }) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${active ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"}`}
    >
      {active && <span className="absolute left-0 top-2 bottom-2 w-1 bg-black rounded-r-full" />}
      <span className="shrink-0">{icon}</span>
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  );
}

const CONTENT_TABS = ["home", "programs", "gallery", "reviews"];

function NavSubButton({ icon, label, active, onClick }) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={`w-full flex items-center gap-2.5 pl-11 pr-4 py-2.5 rounded-xl text-left text-sm transition ${active ? "bg-gray-100 font-semibold text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
      >
        <span className="shrink-0">{icon}</span>
        <span className="truncate">{label}</span>
      </button>
    </li>
  );
}

function NavGroup({ icon, label, collapsed, open, onToggle, active, items, tab, setTab, onExpandSidebar }) {
  const handleParentClick = () => {
    if (collapsed) {
      onExpandSidebar?.();
      onToggle(true);
      return;
    }
    onToggle(!open);
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleParentClick}
        title={collapsed ? label : undefined}
        className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition ${active ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"}`}
      >
        {active && <span className="absolute left-0 top-2 bottom-2 w-1 bg-black rounded-r-full" />}
        <span className="shrink-0">{icon}</span>
        {!collapsed && (
          <>
            <span className="truncate flex-1">{label}</span>
            <ChevronRight className={`w-4 h-4 shrink-0 text-gray-400 transition-transform ${open ? "rotate-90" : ""}`} />
          </>
        )}
      </button>
      {!collapsed && open && (
        <ul className="mt-1 space-y-0.5 list-none m-0 p-0">
          {items.map((item) => (
            <NavSubButton
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={tab === item.id}
              onClick={() => setTab(item.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function CollapsibleSection({ title, subtitle, defaultOpen, children }) {
  return (
    <details open={defaultOpen} className="group">
      <summary className="list-none cursor-pointer">
        <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <div className="text-lg font-semibold">{title}</div>
              {subtitle && <div className="text-sm text-gray-500 mt-0.5">{subtitle}</div>}
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <ChevronsUpDown className="w-4 h-4" />
              <span className="text-xs group-open:hidden">Open</span>
              <span className="text-xs hidden group-open:inline">Close</span>
            </div>
          </CardContent>
        </Card>
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}

function MembersTable({ rows, role, lang, onChangePlan, onOpen, onToggleBlock, onBulkDelete, loading, loadingText }) {
  const t = i18n[lang];
  const canBlock = role === "admin";
  const [selected, setSelected] = useState(new Set());
  const [deleting, setDeleting] = useState(false);

  const allChecked = rows.length > 0 && selected.size === rows.length;
  const someChecked = selected.size > 0 && selected.size < rows.length;

  const toggleAll = () => {
    if (allChecked) setSelected(new Set());
    else setSelected(new Set(rows.map((m) => m.id)));
  };
  const toggleOne = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleBulkDelete = async () => {
    if (selected.size === 0) return;
    if (!window.confirm(`Delete ${selected.size} record${selected.size > 1 ? "s" : ""} from MongoDB? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await onBulkDelete([...selected]);
      setSelected(new Set());
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
      <CardContent className="p-0">
        {selected.size > 0 && (
          <div className="flex items-center gap-3 px-4 py-2 bg-red-50 border-b border-red-200">
            <span className="text-sm font-medium text-red-700">{selected.size} selected</span>
            <Button
              variant="outline"
              className="rounded-xl border-red-300 text-red-600 hover:bg-red-100 text-xs px-3 py-1"
              onClick={handleBulkDelete}
              disabled={deleting}
            >
              {deleting ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full border-2 border-red-300 border-t-red-600 animate-spin" />
                  Deleting...
                </span>
              ) : (
                <><Trash2 className="w-3.5 h-3.5 mr-1" /> Delete selected</>
              )}
            </Button>
            <button className="text-xs text-gray-500 hover:text-gray-700 underline" onClick={() => setSelected(new Set())}>Clear selection</button>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-gray-600">
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    ref={(el) => { if (el) el.indeterminate = someChecked; }}
                    onChange={toggleAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="text-left px-4 py-3">{t.members.table.member}</th>
                <th className="text-left px-4 py-3">{t.members.table.customerId}</th>
                <th className="text-left px-4 py-3">{t.members.table.category}</th>
                <th className="text-left px-4 py-3">{t.members.table.plan}</th>
                <th className="text-left px-4 py-3">{t.members.table.subType}</th>
                <th className="text-left px-4 py-3">{t.members.table.start}</th>
                <th className="text-left px-4 py-3">{t.members.table.end}</th>
                <th className="text-left px-4 py-3">{t.members.table.payment}</th>
                <th className="text-left px-4 py-3">{t.members.table.block}</th>
                <th className="text-right px-4 py-3">{t.members.table.actions}</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={11} className="px-4 py-10 text-center">
                    <div className="inline-flex items-center gap-3 text-gray-600">
                      <div className="h-4 w-4 rounded-full border-2 border-gray-300 border-t-gray-700 animate-spin" />
                      <span className="text-sm">{loadingText || "Loading from MongoDB..."}</span>
                    </div>
                  </td>
                </tr>
              )}
              {!loading && rows.map((m) => {
                const plan = getPlan(m.planId);
                const planLabel = m.planLabel ?? (lang === "nl" ? plan.labelNL : plan.labelEN);
                const planTypeLabel = m.planTypeLabel ?? cycleLabel(plan.cycle, lang);
                const plansForCategory = PLAN_CATALOG.filter((p) => p.category === m.category);
                const isChecked = selected.has(m.id);
                return (
                  <tr key={m.id} className={`border-b border-gray-100 hover:bg-gray-50 ${isChecked ? "bg-red-50/50" : ""}`}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={isChecked} onChange={() => toggleOne(m.id)} className="rounded border-gray-300" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{m.firstName} {m.lastName}</div>
                      <div className="text-xs text-gray-500">{m.email ?? "—"}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{m.customerId}</td>
                    <td className="px-4 py-3"><Chip tone="neutral">{m.category}</Chip></td>
                    <td className="px-4 py-3 text-gray-700">{planLabel}</td>
                    <td className="px-4 py-3">
                      {m.planTypeLabel ? (
                        <div className="text-gray-700">{m.planTypeLabel}</div>
                      ) : (
                        <>
                          <select value={m.planId} onChange={(e) => onChangePlan(m.id, e.target.value)} className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none">
                            {plansForCategory.map((p) => (
                              <option key={p.id} value={p.id}>{(lang === "nl" ? p.labelNL : p.labelEN) + " — " + (p.price ? formatEUR(p.price) : "€ (X)")}</option>
                            ))}
                          </select>
                          <div className="mt-2 text-xs text-gray-500">{planTypeLabel}{plan.custom ? (lang === "nl" ? " • Aanpasbaar" : " • Custom") : ""}</div>
                        </>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{formatDateDMY(m.startDate)}</td>
                    <td className="px-4 py-3 text-gray-700">{formatDateDMY(m.endDate)}</td>
                    <td className="px-4 py-3">
                      {m.paymentStatus === "PAID" ? <Chip tone="ok"><CheckCircle2 className="w-3.5 h-3.5" /> {t.members.paid}</Chip> : <Chip tone="danger"><AlertCircle className="w-3.5 h-3.5" /> {t.members.open}</Chip>}
                    </td>
                    <td className="px-4 py-3">
                      {m.blocked ? <Chip tone="danger">{t.members.table.blocked}</Chip> : <Chip tone="ok">{t.members.table.active}</Chip>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" className="rounded-xl" onClick={() => onOpen(m.id)}>{t.members.table.openBtn}</Button>
                        <Button variant="outline" className={`rounded-xl ${!canBlock ? "opacity-50 cursor-not-allowed" : ""}`} title={!canBlock ? t.common.adminOnly : undefined} onClick={() => (canBlock ? onToggleBlock(m.id) : null)}>
                          {m.blocked ? <><Unlock className="w-4 h-4 mr-2" />{t.members.table.unblockBtn}</> : <><Ban className="w-4 h-4 mr-2" />{t.members.table.blockBtn}</>}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-4 py-10 text-center text-gray-500">{t.members.none}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function MemberDetail({ member, role, lang, locationId, provider, setProvider, onBack, onMarkPaid, onToggleBlock, onDelete, onSendReminder }) {
  const t = i18n[lang];
  const isAdmin = role === "admin";
  const backendBaseUrl = getBackendBaseUrl();
  const plan = getPlan(member.planId);
  const planLabel = member.planLabel ?? (lang === "nl" ? plan.labelNL : plan.labelEN);
  const { settings: vatSettings } = useVatSettings(locationId);
  const mongo = member.mongo ?? null;
  const mongoSelectedOption = mongo?.selectedOption ?? null;
  const mollieCustomerId = String(
    mongo?.mollieCustomerId ||
    member?.mollieCustomerId ||
    (String(member?.customerId || "").startsWith("cst_") ? member.customerId : "")
  ).trim();
  const molliePaymentId = String(mongo?.molliePaymentId || "").trim();
  const isRecurring = Boolean(mongoSelectedOption?.recurring);
  const [mollieProfile, setMollieProfile] = useState(null);
  const [mollieLoading, setMollieLoading] = useState(false);
  const [resolvedMollieCustomerId, setResolvedMollieCustomerId] = useState(mollieCustomerId);

  useEffect(() => {
    if (!isRecurring) {
      setMollieProfile(null);
      return;
    }
    const loadMollieProfile = async () => {
      const profileId = mollieCustomerId || molliePaymentId;
      if (!profileId) {
        setMollieProfile(null);
        return;
      }
      try {
        setMollieLoading(true);
        let url = `${backendBaseUrl}/api/fetch-customer-profile/${encodeURIComponent(profileId)}`;
        if (molliePaymentId && molliePaymentId.startsWith("tr_")) {
          url += `?paymentId=${encodeURIComponent(molliePaymentId)}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) {
          setMollieProfile(data);
          if (data.customerId) setResolvedMollieCustomerId(data.customerId);
        }
      } catch {
        // ignore profile load errors
      } finally {
        setMollieLoading(false);
      }
    };

    loadMollieProfile();
  }, [backendBaseUrl, mollieCustomerId, molliePaymentId, isRecurring]);
  const payments = useMemo(() => {
    // If loaded from MongoDB, show a single row based on stored payment fields.
    if (member.mongo) {
      const createdAt = member.mongo?.createdAt ? new Date(member.mongo.createdAt) : new Date(member.startDate);
      const amount = Number(member.mongo?.totalAmount ?? 0);
      return [
        {
          id: String(member.mongo?._id ?? member.customerId),
          date: createdAt.toISOString().slice(0, 10),
          status: member.paymentStatus,
          method: "Mollie",
          kind: member.mongo?.selectedOption?.programType ?? "BASE",
          amount: Number.isFinite(amount) ? amount : 0,
        },
      ];
    }

    // Fallback to demo data for mock members
    const base = MOCK_PAYMENTS_BASE.filter((p) => p.customerId === member.customerId);
    if (member.category === "RENTAL") {
      const oneTime = { id: `ot-${member.customerId}`, customerId: member.customerId, customerName: `${member.firstName} ${member.lastName}`, category: "RENTAL", planId: member.planId, date: base[0]?.date ?? member.startDate, amount: 185, status: member.paymentStatus, method: "Transfer", kind: "ONE_TIME" };
      const percent = vatSettings.percentByCategory.RENTAL;
      const vat = { id: `vat-${member.customerId}`, customerId: member.customerId, customerName: `${member.firstName} ${member.lastName}`, category: "RENTAL", planId: member.planId, date: base[0]?.date ?? member.startDate, amount: vatAmount(getPlan(member.planId).price + 185, percent), status: member.paymentStatus, method: "Transfer", kind: "VAT" };
      return [vat, oneTime, ...base].sort((a, b) => (a.date < b.date ? 1 : -1));
    }
    return base.sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [member, vatSettings.percentByCategory.RENTAL]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-2" /> {t.common.back}</Button>
          <div>
            <div className="text-2xl font-bold">{member.firstName} {member.lastName}</div>
            <div className="text-sm text-gray-500">{member.customerId} • {member.category}</div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {member.paymentStatus === "PAID" ? <Chip tone="ok"><CheckCircle2 className="w-3.5 h-3.5" /> {t.members.paid}</Chip> : <Chip tone="danger"><AlertCircle className="w-3.5 h-3.5" /> {t.members.open}</Chip>}
          {member.blocked ? <Chip tone="danger">{t.members.table.blocked}</Chip> : <Chip tone="ok">{t.members.table.active}</Chip>}
          {(mongo?.manualPaymentStatus || member.manualPaymentStatus) && (
            <Chip tone={(mongo?.manualPaymentStatus || member.manualPaymentStatus) === "manually_payment_verified" ? "ok" : "warn"}>
              {(mongo?.manualPaymentStatus || member.manualPaymentStatus) === "manually_payment_verified" ? "Verified" : "Unverified"}
            </Chip>
          )}
          <div className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
            <CreditCard className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{t.members.detail.paymentProvider}</span>
            <select value={provider} onChange={(e) => setProvider(e.target.value)} className="outline-none text-sm">
              <option value="manual">Manual</option>
              <option value="stripe">Stripe</option>
              <option value="mollie">Mollie</option>
            </select>
          </div>
          <Button
            variant="outline"
            className={`rounded-xl ${member.blocked ? "border-green-300 text-green-700 hover:bg-green-50" : "border-red-300 text-red-600 hover:bg-red-50"} ${!isAdmin ? "opacity-50 cursor-not-allowed" : ""}`}
            title={!isAdmin ? t.common.adminOnly : undefined}
            onClick={() => (isAdmin ? onToggleBlock() : null)}
          >
            {member.blocked
              ? <><Unlock className="w-4 h-4 mr-2" /> {t.members.table.unblockBtn}</>
              : <><Ban className="w-4 h-4 mr-2" /> {t.members.table.blockBtn}</>}
          </Button>
          <Button
            className={`rounded-xl ${!isAdmin ? "opacity-50 cursor-not-allowed" : ""}`}
            title={!isAdmin ? t.common.adminOnly : undefined}
            onClick={() => (isAdmin ? onMarkPaid() : null)}
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            {(mongo?.manualPaymentStatus || member.manualPaymentStatus) === "manually_payment_verified"
              ? "Markeer als onbetaald"
              : t.members.detail.markPaid}
          </Button>
          <Button variant="outline" className="rounded-xl" onClick={onSendReminder}><Mail className="w-4 h-4 mr-2" /> {t.members.detail.sendReminder}</Button>
          {mongo && (
            <Button
              variant="outline"
              className="rounded-xl border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => {
                if (window.confirm(`Delete ${member.firstName} ${member.lastName} from MongoDB? This cannot be undone.`)) {
                  onDelete(member.id);
                }
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl xl:col-span-1">
          <CardContent className="p-6">
            <div className="text-lg font-semibold">{t.members.detail.personal}</div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between"><span className="text-gray-500">Email</span><span className="font-medium">{member.email ?? "—"}</span></div>
              <div className="flex items-center justify-between"><span className="text-gray-500">Plan</span><span className="font-medium">{planLabel}</span></div>
              {member.planTypeLabel && (
                <div className="flex items-center justify-between"><span className="text-gray-500">Plan type</span><span className="font-medium">{member.planTypeLabel}</span></div>
              )}
              <div className="flex items-center justify-between"><span className="text-gray-500">Start</span><span className="font-medium">{formatDateDMY(member.startDate)}</span></div>
              <div className="flex items-center justify-between"><span className="text-gray-500">End</span><span className="font-medium">{formatDateDMY(member.endDate)}</span></div>
              <div className="flex items-center justify-between"><span className="text-gray-500">Payment</span><span className="font-medium">{member.paymentStatus === "PAID" ? t.members.paid : t.members.open}</span></div>
              {mongo && (
                <>
                  <div className="flex items-center justify-between"><span className="text-gray-500">Phone</span><span className="font-medium">{mongo.telefoonnummer || "—"}</span></div>
                  <div className="flex items-center justify-between"><span className="text-gray-500">Address</span><span className="font-medium">{mongo.adres || "—"}</span></div>
                  <div className="flex items-center justify-between"><span className="text-gray-500">City</span><span className="font-medium">{mongo.woonplaats || "—"}</span></div>
                  <div className="flex items-center justify-between"><span className="text-gray-500">Postcode</span><span className="font-medium">{mongo.postcode || "—"}</span></div>
                  <div className="flex items-center justify-between"><span className="text-gray-500">House no</span><span className="font-medium">{mongo.huisnummer || "—"}</span></div>
                  <div className="flex items-center justify-between"><span className="text-gray-500">Extra</span><span className="font-medium">{mongo.extraOption?.title ?? "—"}</span></div>
                </>
              )}
              {member.category === "RENTAL" && <div className="text-xs text-gray-500 pt-2">VAT (Rental) currently: <b>{vatSettings.percentByCategory.RENTAL}%</b></div>}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl xl:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">{t.members.detail.payments}</div>
              <Chip tone="neutral">{i18n[lang].common.demo}</Chip>
            </div>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-600">
                    <th className="text-left py-2 pr-3">Date</th>
                    <th className="text-left py-2 pr-3">Type</th>
                    <th className="text-left py-2 pr-3">Method</th>
                    <th className="text-right py-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-b border-gray-100">
                      <td className="py-2 pr-3 text-gray-700">{formatDateDMY(p.date)}</td>
                      <td className="py-2 pr-3">
                        <div className="flex items-center gap-2">
                          {p.status === "PAID" ? <Chip tone="ok">PAID</Chip> : <Chip tone="danger">OPEN</Chip>}
                          <span className="text-gray-700">{p.kind ?? "BASE"}</span>
                        </div>
                      </td>
                      <td className="py-2 pr-3 text-gray-700">{p.method}</td>
                      <td className="py-2 text-right font-medium">{formatEUR(p.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {isRecurring && <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="text-sm font-semibold text-gray-900">Mollie Payment & Subscription Details</div>
              {mollieLoading ? (
                <div className="mt-2 inline-flex items-center gap-2 text-sm text-gray-600">
                  <div className="h-4 w-4 rounded-full border-2 border-gray-300 border-t-gray-700 animate-spin" />
                  Loading Mollie details...
                </div>
              ) : mollieProfile?.summary ? (
                <div className="mt-3 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-sm">
                    <div className="rounded-xl border border-gray-200 bg-white px-3 py-2">
                      <div className="text-xs text-gray-500">First payment</div>
                      <div className="font-medium">{mollieProfile.summary.firstPaymentAt ? new Date(mollieProfile.summary.firstPaymentAt).toLocaleString() : "—"}</div>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white px-3 py-2">
                      <div className="text-xs text-gray-500">Last payment</div>
                      <div className="font-medium">{mollieProfile.summary.lastPaymentAt ? new Date(mollieProfile.summary.lastPaymentAt).toLocaleString() : "—"}</div>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white px-3 py-2">
                      <div className="text-xs text-gray-500">Next payment date</div>
                      <div className="font-medium">{mollieProfile.summary.nextPaymentDate || "—"}</div>
                    </div>
                    <div className="rounded-xl border border-gray-200 bg-white px-3 py-2">
                      <div className="text-xs text-gray-500">Active subscriptions</div>
                      <div className="font-medium">{String(mollieProfile.summary.activeSubscriptionsCount ?? 0)} / {String(mollieProfile.summary.totalSubscriptionsCount ?? 0)} total</div>
                    </div>
                  </div>

                  {mollieProfile.summary.subscriptionDetails?.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-gray-700 mb-2">Subscriptions</div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-gray-200 text-gray-500">
                              <th className="text-left py-1.5 pr-2">Created</th>
                              <th className="text-left py-1.5 pr-2">Status</th>
                              <th className="text-left py-1.5 pr-2">Interval</th>
                              <th className="text-left py-1.5 pr-2">Description</th>
                              <th className="text-right py-1.5">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mollieProfile.summary.subscriptionDetails.map((s) => (
                              <tr key={s.id} className="border-b border-gray-100">
                                <td className="py-1.5 pr-2 text-gray-700">{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "—"}</td>
                                <td className="py-1.5 pr-2"><Chip tone={s.status === "active" ? "ok" : "neutral"}>{s.status}</Chip></td>
                                <td className="py-1.5 pr-2 text-gray-700">{s.interval || "—"}</td>
                                <td className="py-1.5 pr-2 text-gray-700">{s.description || "—"}</td>
                                <td className="py-1.5 text-right font-medium">{s.amount ? `€${s.amount.value}` : "—"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {mollieProfile.payments?.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-gray-700 mb-2">Mollie Payments ({mollieProfile.summary.paidPaymentsCount} paid / {mollieProfile.summary.totalPaymentsCount} total)</div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="border-b border-gray-200 text-gray-500">
                              <th className="text-left py-1.5 pr-2">Date</th>
                              <th className="text-left py-1.5 pr-2">Status</th>
                              <th className="text-left py-1.5 pr-2">Method</th>
                              <th className="text-left py-1.5 pr-2">Description</th>
                              <th className="text-right py-1.5">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {mollieProfile.payments.map((p) => (
                              <tr key={p.id} className="border-b border-gray-100">
                                <td className="py-1.5 pr-2 text-gray-700">{p.paidAt ? new Date(p.paidAt).toLocaleString() : p.createdAt ? new Date(p.createdAt).toLocaleString() : "—"}</td>
                                <td className="py-1.5 pr-2"><Chip tone={p.status === "paid" ? "ok" : p.status === "open" ? "danger" : "neutral"}>{p.status}</Chip></td>
                                <td className="py-1.5 pr-2 text-gray-700">{p.method || "—"}</td>
                                <td className="py-1.5 pr-2 text-gray-700">{p.description || "—"}</td>
                                <td className="py-1.5 text-right font-medium">{p.amount ? `€${p.amount.value}` : "—"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-2 text-sm text-gray-600">
                  {(mollieCustomerId || molliePaymentId) ? "Could not load Mollie data for this member." : "No Mollie ID available for this member."}
                </div>
              )}
            </div>}

            {mongo && (
              <div className="mt-6">
                <div className="text-lg font-semibold">Full MongoDB data</div>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <div className="text-xs text-gray-500 mb-2">Main</div>
                    <div className="space-y-2">
                      <div className="flex justify-between gap-3"><span className="text-gray-500">_id</span><span className="font-mono text-right">{String(mongo._id ?? "")}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-gray-500">mollieCustomerId</span><span className="font-mono text-right">{String(mongo.mollieCustomerId ?? "")}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-gray-500">email</span><span className="text-right">{mongo.email ?? ""}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-gray-500">voornaam</span><span className="text-right">{mongo.voornaam ?? ""}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-gray-500">tussenvoegsel</span><span className="text-right">{mongo.tussenvoegsel ?? ""}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-gray-500">achternaam</span><span className="text-right">{mongo.achternaam ?? ""}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-gray-500">telefoonnummer</span><span className="text-right">{mongo.telefoonnummer ?? ""}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-gray-500">adres</span><span className="text-right">{mongo.adres ?? ""}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-gray-500">woonplaats</span><span className="text-right">{mongo.woonplaats ?? ""}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-gray-500">postcode</span><span className="text-right">{mongo.postcode ?? ""}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-gray-500">huisnummer</span><span className="text-right">{mongo.huisnummer ?? ""}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-gray-500">toevoeging</span><span className="text-right">{mongo.toevoeging ?? ""}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-gray-500">status</span><span className="text-right">{mongo.status ?? ""}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-gray-500">blocked</span><span className="text-right">{String(Boolean(mongo.blocked))}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-gray-500">manualPaymentStatus</span><span className="text-right">{mongo.manualPaymentStatus ?? ""}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-gray-500">createdAt</span><span className="text-right">{mongo.createdAt ? String(mongo.createdAt) : ""}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-gray-500">updatedAt</span><span className="text-right">{mongo.updatedAt ? String(mongo.updatedAt) : ""}</span></div>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                    <div className="text-xs text-gray-500 mb-2">selectedOption</div>
                    <div className="space-y-2">
                      <div className="flex justify-between gap-3"><span className="text-gray-500">trainingTitle</span><span className="text-right">{mongoSelectedOption?.trainingTitle ?? ""}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-gray-500">programType</span><span className="text-right">{mongoSelectedOption?.programType ?? ""}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-gray-500">amount</span><span className="text-right">{mongoSelectedOption?.amount ?? ""}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-gray-500">quantity</span><span className="text-right">{mongoSelectedOption?.quantity ?? ""}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-gray-500">title</span><span className="text-right">{mongoSelectedOption?.title ?? ""}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-gray-500">subTitle</span><span className="text-right">{mongoSelectedOption?.subTitle ?? ""}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-gray-500">abonnementType</span><span className="text-right">{mongoSelectedOption?.abonnementType ?? ""}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-gray-500">abonnementTitle</span><span className="text-right">{mongoSelectedOption?.abonnementTitle ?? ""}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-gray-500">kosten</span><span className="text-right">{Array.isArray(mongoSelectedOption?.kosten) ? mongoSelectedOption.kosten.join(", ") : ""}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-gray-500">totalKosten</span><span className="text-right">{Array.isArray(mongoSelectedOption?.totalKosten) ? mongoSelectedOption.totalKosten.join(", ") : ""}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-gray-500">extra</span><span className="text-right">{String(Boolean(mongoSelectedOption?.extra))}</span></div>
                      <div className="flex justify-between gap-3"><span className="text-gray-500">recurring</span><span className="text-right">{String(Boolean(mongoSelectedOption?.recurring))}</span></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isRecurring && <div className="mt-6">
              <div className="text-lg font-semibold">Customer Profile (Mollie)</div>
              {(resolvedMollieCustomerId || mollieCustomerId) ? (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50" href={`${backendBaseUrl}/api/fetch-customer/${encodeURIComponent(resolvedMollieCustomerId || mollieCustomerId)}`} target="_blank" rel="noreferrer">
                    Open customer ({resolvedMollieCustomerId || mollieCustomerId})
                  </a>
                  <a className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50" href={`${backendBaseUrl}/api/fetch-customer-mandates/${encodeURIComponent(resolvedMollieCustomerId || mollieCustomerId)}`} target="_blank" rel="noreferrer">
                    Open mandates
                  </a>
                  <a className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50" href={`${backendBaseUrl}/api/fetch-customer-subscriptions/${encodeURIComponent(resolvedMollieCustomerId || mollieCustomerId)}`} target="_blank" rel="noreferrer">
                    Open subscriptions
                  </a>
                  <a className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50" href={`${backendBaseUrl}/api/fetch-customer-payments/${encodeURIComponent(resolvedMollieCustomerId || mollieCustomerId)}`} target="_blank" rel="noreferrer">
                    Open payments
                  </a>
                  {molliePaymentId && (
                    <a className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50 sm:col-span-2" href={`${backendBaseUrl}/api/fetch-payment/${encodeURIComponent(molliePaymentId)}`} target="_blank" rel="noreferrer">
                      Open payment ({molliePaymentId})
                    </a>
                  )}
                </div>
              ) : molliePaymentId ? (
                <div className="mt-3 text-sm text-gray-600">Resolving customer from payment ID...</div>
              ) : (
                <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                  No Mollie payment or customer ID available for this member.
                </div>
              )}
            </div>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MembersTab({ lang, role, locationId }) {
  const t = i18n[lang];
  const [query, setQuery] = useState("");
  const [members, setMembers] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [provider, setProvider] = useState("manual");
  const [selectedMember, setSelectedMember] = useState(null);
  const [loadingMember, setLoadingMember] = useState(false);
  const [loadingPt, setLoadingPt] = useState(true);
  const [loadingClub, setLoadingClub] = useState(true);
  const [loadingRental, setLoadingRental] = useState(true);

  const mapDocToMember = (doc) => {
    const created = doc?.createdAt ? new Date(doc.createdAt) : new Date();
    const end = new Date(created);
    end.setDate(end.getDate() + 30);
    const trainingTitle = doc?.selectedOption?.trainingTitle;
    const planTypeTitle = doc?.selectedOption?.title;
    const programType = String(doc?.selectedOption?.programType || "").toLowerCase();
    const pt = programType === "pttraining";
    const club = programType === "club";
    const rent = ["rent", "pt-ruimte"].includes(programType);
    const category = pt ? "PT" : club ? "CLUB" : rent ? "RENTAL" : "PT";

    return {
      id: String(doc?._id ?? doc?.molliePaymentId ?? Math.random()),
      category,
      customerId: String(doc?.mollieCustomerId ?? doc?.molliePaymentId ?? doc?._id ?? category),
      firstName: String(doc?.voornaam ?? ""),
      lastName: String(doc?.achternaam ?? ""),
      email: doc?.email ?? undefined,
      mollieCustomerId: doc?.mollieCustomerId ?? "",
      planId: pt ? "pt-single" : club ? "club-4w" : "rental-1",
      planLabel: trainingTitle ? String(trainingTitle) : undefined,
      planTypeLabel: planTypeTitle ? String(planTypeTitle) : undefined,
      startDate: created.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
      paymentStatus: String(doc?.status ?? "").toLowerCase() === "paid" ? "PAID" : "OPEN",
      blocked: Boolean(doc?.blocked),
      manualPaymentStatus: doc?.manualPaymentStatus || "",
    };
  };

  const loadMembersFromApi = async (searchText = "") => {
    try {
      setLoadingPt(true);
      setLoadingClub(true);
      setLoadingRental(true);
      const backendBaseUrl = getBackendBaseUrl();
      const raw = localStorage.getItem("msbc_dashboard_auth");
      const token = raw ? JSON.parse(raw)?.token : null;
      if (!token) return;

      const url = `${backendBaseUrl}/api/get-userinfos${searchText ? `?q=${encodeURIComponent(searchText)}` : ""}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok || !Array.isArray(data)) return;
      setMembers(data.map(mapDocToMember));
    } catch {
      // ignore
    } finally {
      setLoadingPt(false);
      setLoadingClub(false);
      setLoadingRental(false);
    }
  };

  // Load PT members from MongoDB (selectedOption.programType === "ptTraining")
  useEffect(() => {
    const loadPtMembers = async () => {
      setLoadingPt(true);
      try {
        const backendBaseUrl = getBackendBaseUrl();
        const raw = localStorage.getItem("msbc_dashboard_auth");
        const token = raw ? JSON.parse(raw)?.token : null;
        if (!token) return;

        const res = await fetch(`${backendBaseUrl}/api/get-userinfos?programType=ptTraining`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok || !Array.isArray(data)) return;

        const ptMembers = data.map((doc) => {
          const created = doc?.createdAt ? new Date(doc.createdAt) : new Date();
          const end = new Date(created);
          end.setDate(end.getDate() + 30);
          const trainingTitle = doc?.selectedOption?.trainingTitle;
          const planTypeTitle = doc?.selectedOption?.title;

          return {
            id: String(doc?._id ?? doc?.molliePaymentId ?? Math.random()),
            category: "PT",
            customerId: String(doc?.mollieCustomerId ?? doc?.molliePaymentId ?? doc?._id ?? "PT"),
            firstName: String(doc?.voornaam ?? ""),
            lastName: String(doc?.achternaam ?? ""),
            email: doc?.email ?? undefined,
            mollieCustomerId: doc?.mollieCustomerId ?? "",
            planId: "pt-single",
            planLabel: trainingTitle ? String(trainingTitle) : undefined, // Plan = trainingTitle
            planTypeLabel: planTypeTitle ? String(planTypeTitle) : undefined, // Plan type = title
            startDate: created.toISOString().slice(0, 10),
            endDate: end.toISOString().slice(0, 10),
            paymentStatus: String(doc?.status ?? "").toLowerCase() === "paid" ? "PAID" : "OPEN",
            blocked: Boolean(doc?.blocked),
            manualPaymentStatus: doc?.manualPaymentStatus || "",
          };
        });

        setMembers((prev) => {
          const nonPt = prev.filter((m) => m.category !== "PT");
          return [...nonPt, ...ptMembers];
        });
      } catch {
        // ignore
      } finally {
        setLoadingPt(false);
      }
    };

    loadPtMembers();
  }, []);

  // Load CLUB members from MongoDB (selectedOption.programType === "club")
  useEffect(() => {
    const loadClubMembers = async () => {
      setLoadingClub(true);
      try {
        const backendBaseUrl = getBackendBaseUrl();
        const raw = localStorage.getItem("msbc_dashboard_auth");
        const token = raw ? JSON.parse(raw)?.token : null;
        if (!token) return;

        const res = await fetch(`${backendBaseUrl}/api/get-userinfos?programType=club`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok || !Array.isArray(data)) return;

        const clubMembers = data.map((doc) => {
          const created = doc?.createdAt ? new Date(doc.createdAt) : new Date();
          const end = new Date(created);
          end.setDate(end.getDate() + 30);
          const trainingTitle = doc?.selectedOption?.trainingTitle;
          const planTypeTitle = doc?.selectedOption?.title;

          return {
            id: String(doc?._id ?? doc?.molliePaymentId ?? Math.random()),
            category: "CLUB",
            customerId: String(doc?.mollieCustomerId ?? doc?.molliePaymentId ?? doc?._id ?? "CLUB"),
            firstName: String(doc?.voornaam ?? ""),
            lastName: String(doc?.achternaam ?? ""),
            email: doc?.email ?? undefined,
            mollieCustomerId: doc?.mollieCustomerId ?? "",
            planId: "club-4w",
            planLabel: trainingTitle ? String(trainingTitle) : undefined,
            planTypeLabel: planTypeTitle ? String(planTypeTitle) : undefined,
            startDate: created.toISOString().slice(0, 10),
            endDate: end.toISOString().slice(0, 10),
            paymentStatus: String(doc?.status ?? "").toLowerCase() === "paid" ? "PAID" : "OPEN",
            blocked: Boolean(doc?.blocked),
            manualPaymentStatus: doc?.manualPaymentStatus || "",
          };
        });

        setMembers((prev) => {
          const nonClub = prev.filter((m) => m.category !== "CLUB");
          return [...nonClub, ...clubMembers];
        });
      } catch {
        // ignore
      } finally {
        setLoadingClub(false);
      }
    };

    loadClubMembers();
  }, []);

  // Load RENTAL members from MongoDB (selectedOption.programType === "rent" | "pt-ruimte")
  useEffect(() => {
    const loadRentalMembers = async () => {
      setLoadingRental(true);
      try {
        const backendBaseUrl = getBackendBaseUrl();
        const raw = localStorage.getItem("msbc_dashboard_auth");
        const token = raw ? JSON.parse(raw)?.token : null;
        if (!token) return;

        const res = await fetch(`${backendBaseUrl}/api/get-userinfos`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok || !Array.isArray(data)) return;

        const rentalProgramTypes = new Set(["rent", "pt-ruimte"]);
        const rentalMembers = data
          .filter((doc) => rentalProgramTypes.has(String(doc?.selectedOption?.programType || "").toLowerCase()))
          .map((doc) => {
            const created = doc?.createdAt ? new Date(doc.createdAt) : new Date();
            const end = new Date(created);
            end.setDate(end.getDate() + 30);
            const trainingTitle = doc?.selectedOption?.trainingTitle;
            const planTypeTitle = doc?.selectedOption?.title;

            return {
              id: String(doc?._id ?? doc?.molliePaymentId ?? Math.random()),
              category: "RENTAL",
              customerId: String(doc?.mollieCustomerId ?? doc?.molliePaymentId ?? doc?._id ?? "RENTAL"),
              firstName: String(doc?.voornaam ?? ""),
              lastName: String(doc?.achternaam ?? ""),
              email: doc?.email ?? undefined,
              mollieCustomerId: doc?.mollieCustomerId ?? "",
              planId: "rental-1",
              planLabel: trainingTitle ? String(trainingTitle) : undefined,
              planTypeLabel: planTypeTitle ? String(planTypeTitle) : undefined,
              startDate: created.toISOString().slice(0, 10),
              endDate: end.toISOString().slice(0, 10),
              paymentStatus: String(doc?.status ?? "").toLowerCase() === "paid" ? "PAID" : "OPEN",
              blocked: Boolean(doc?.blocked),
              manualPaymentStatus: doc?.manualPaymentStatus || "",
            };
          });

        setMembers((prev) => {
          const nonRental = prev.filter((m) => m.category !== "RENTAL");
          return [...nonRental, ...rentalMembers];
        });
      } catch {
        // ignore
      } finally {
        setLoadingRental(false);
      }
    };

    loadRentalMembers();
  }, []);

  // API-driven search: when typing, query backend; when empty, reload all
  useEffect(() => {
    const q = String(query || "").trim();
    const timer = setTimeout(() => {
      loadMembersFromApi(q);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  const selected = selectedMember ?? (members.find((m) => m.id === selectedId) ?? null);

  const openMember = async (memberId) => {
    setSelectedId(memberId);
    setLoadingMember(true);
    try {
      const backendBaseUrl = getBackendBaseUrl();
      const raw = localStorage.getItem("msbc_dashboard_auth");
      const token = raw ? JSON.parse(raw)?.token : null;
      if (!token) return;

      const res = await fetch(`${backendBaseUrl}/api/get-userinfo/${memberId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const doc = await res.json();
      if (!res.ok || !doc) return;

      let resolvedCustomerId = String(doc?.mollieCustomerId || doc?.customerId || "").trim();
      const rawMolliePaymentId = String(doc?.molliePaymentId || "").trim();

      // Some legacy records stored customer id in molliePaymentId field.
      if (!resolvedCustomerId && rawMolliePaymentId.startsWith("cst_")) {
        resolvedCustomerId = rawMolliePaymentId;
      }

      // Resolve customer id from payment id only when it is an actual Mollie payment id.
      if (!resolvedCustomerId && rawMolliePaymentId.startsWith("tr_")) {
        try {
          const payRes = await fetch(`${backendBaseUrl}/api/fetch-payment/${encodeURIComponent(rawMolliePaymentId)}`);
          const pay = await payRes.json();
          if (payRes.ok && pay?.customerId) {
            resolvedCustomerId = String(pay.customerId);
          }
        } catch {
          // ignore resolve failure
        }
      }

      const created = doc?.createdAt ? new Date(doc.createdAt) : new Date();
      const end = new Date(created);
      end.setDate(end.getDate() + 30);

      const pt = doc?.selectedOption?.programType === "ptTraining";
      const club = doc?.selectedOption?.programType === "club";
      const rent = ["rent", "pt-ruimte"].includes(String(doc?.selectedOption?.programType || "").toLowerCase());
      const category = pt ? "PT" : club ? "CLUB" : rent ? "RENTAL" : "PT";

      setSelectedMember({
        id: String(doc?._id ?? memberId),
        category,
        customerId: String(doc?.mollieCustomerId ?? doc?.customerId ?? doc?.molliePaymentId ?? doc?._id ?? category),
        firstName: String(doc?.voornaam ?? ""),
        lastName: String(doc?.achternaam ?? ""),
        email: doc?.email ?? undefined,
        mollieCustomerId: resolvedCustomerId,
        planId: pt ? "pt-single" : club ? "club-4w" : "rental-1",
        planLabel: doc?.selectedOption?.trainingTitle ? String(doc.selectedOption.trainingTitle) : undefined,
        planTypeLabel: doc?.selectedOption?.title ? String(doc.selectedOption.title) : undefined,
        startDate: created.toISOString().slice(0, 10),
        endDate: end.toISOString().slice(0, 10),
        paymentStatus: String(doc?.status ?? "").toLowerCase() === "paid" ? "PAID" : "OPEN",
        blocked: Boolean(doc?.blocked),
        manualPaymentStatus: doc?.manualPaymentStatus || "",
        mongo: doc,
      });
    } catch {
      // ignore
    } finally {
      setLoadingMember(false);
    }
  };
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return members;
    return members.filter((m) => {
      const plan = getPlan(m.planId);
      const fallbackPlanLabel = lang === "nl" ? plan.labelNL : plan.labelEN;
      const name = `${m.firstName || ""} ${m.lastName || ""}`.toLowerCase();
      const customerId = String(m.customerId || "").toLowerCase();
      const email = String(m.email || "").toLowerCase();
      const planLabel = String(m.planLabel || fallbackPlanLabel || "").toLowerCase();
      const planTypeLabel = String(m.planTypeLabel || "").toLowerCase();
      const category = String(m.category || "").toLowerCase();
      return (
        name.includes(q) ||
        customerId.includes(q) ||
        email.includes(q) ||
        planLabel.includes(q) ||
        planTypeLabel.includes(q) ||
        category.includes(q)
      );
    });
  }, [query, members, lang]);
  const clubRows = filtered.filter((m) => m.category === "CLUB");
  const ptRows = filtered.filter((m) => m.category === "PT");
  const rentalRows = filtered.filter((m) => m.category === "RENTAL");
  const onChangePlan = (memberId, newPlanId) => setMembers((prev) => prev.map((m) => (m.id === memberId ? { ...m, planId: newPlanId } : m)));
  const patchMember = async (memberId, body) => {
    const backendBaseUrl = getBackendBaseUrl();
    const raw = localStorage.getItem("msbc_dashboard_auth");
    const token = raw ? JSON.parse(raw)?.token : null;
    if (!token) return null;
    const res = await fetch(`${backendBaseUrl}/api/update-userinfo/${memberId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  };

  const onToggleBlock = async (memberId) => {
    const m = members.find((x) => x.id === memberId);
    if (!m) return;
    const newBlocked = !m.blocked;
    const updated = await patchMember(memberId, { blocked: newBlocked });
    if (updated) {
      setMembers((prev) => prev.map((x) => (x.id === memberId ? { ...x, blocked: newBlocked } : x)));
      if (selectedMember?.id === memberId) {
        setSelectedMember((prev) => prev ? { ...prev, blocked: newBlocked, mongo: prev.mongo ? { ...prev.mongo, blocked: newBlocked } : prev.mongo } : prev);
      }
    } else {
      alert("Failed to update block status");
    }
  };

  const onMarkPaid = async (memberId) => {
    const m = members.find((x) => x.id === memberId) || selectedMember;
    if (!m) return;
    const currentStatus = m.mongo?.manualPaymentStatus || m.manualPaymentStatus || "";
    const newStatus = currentStatus === "manually_payment_verified" ? "manually_payment_unverified" : "manually_payment_verified";
    const updated = await patchMember(memberId, { manualPaymentStatus: newStatus });
    if (updated) {
      setMembers((prev) => prev.map((x) => (x.id === memberId ? { ...x, manualPaymentStatus: newStatus } : x)));
      if (selectedMember?.id === memberId) {
        setSelectedMember((prev) => prev ? { ...prev, manualPaymentStatus: newStatus, mongo: prev.mongo ? { ...prev.mongo, manualPaymentStatus: newStatus } : prev.mongo } : prev);
      }
    } else {
      alert("Failed to update payment status");
    }
  };

  const onBulkDelete = async (ids) => {
    const backendBaseUrl = getBackendBaseUrl();
    const raw = localStorage.getItem("msbc_dashboard_auth");
    const token = raw ? JSON.parse(raw)?.token : null;
    if (!token) return;

    const results = await Promise.allSettled(
      ids.map((id) =>
        fetch(`${backendBaseUrl}/api/delete-userinfo/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }).then((r) => {
          if (!r.ok) throw new Error(`Failed: ${id}`);
          return id;
        })
      )
    );

    const deleted = results.filter((r) => r.status === "fulfilled").map((r) => r.value);
    const failed = results.filter((r) => r.status === "rejected").length;

    if (deleted.length > 0) {
      const deletedSet = new Set(deleted);
      setMembers((prev) => prev.filter((m) => !deletedSet.has(m.id)));
    }
    if (failed > 0) {
      alert(`${deleted.length} deleted, ${failed} failed.`);
    }
  };

  const onDeleteMember = async (memberId) => {
    try {
      const backendBaseUrl = getBackendBaseUrl();
      const raw = localStorage.getItem("msbc_dashboard_auth");
      const token = raw ? JSON.parse(raw)?.token : null;
      if (!token) return;

      const res = await fetch(`${backendBaseUrl}/api/delete-userinfo/${memberId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== memberId));
        setSelectedId(null);
        setSelectedMember(null);
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err?.message || "Failed to delete member");
      }
    } catch (e) {
      alert("Error deleting member: " + (e?.message || "Unknown error"));
    }
  };

  const onSendReminder = async () => {
    if (!selected) return;
    const mongo = selected.mongo;
    const email = selected.email || mongo?.email;
    if (!email) {
      alert("No email address available for this member.");
      return;
    }
    if (!window.confirm(`Send payment reminder email to ${email}?`)) return;
    try {
      const backendBaseUrl = getBackendBaseUrl();
      const raw = localStorage.getItem("msbc_dashboard_auth");
      const token = raw ? JSON.parse(raw)?.token : null;
      if (!token) return;

      const res = await fetch(`${backendBaseUrl}/api/send-reminder-email`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          voornaam: selected.firstName || mongo?.voornaam || "",
          achternaam: selected.lastName || mongo?.achternaam || "",
          trainingTitle: mongo?.selectedOption?.trainingTitle || selected.planLabel || "",
          totalAmount: mongo?.totalAmount || "",
          selectedOptionTitle: mongo?.selectedOption?.title || selected.planTypeLabel || "",
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Reminder email sent successfully!");
      } else {
        alert(data?.error || "Failed to send reminder email");
      }
    } catch (e) {
      alert("Error sending reminder: " + (e?.message || "Unknown error"));
    }
  };

  if (selected) {
    return (
      <MemberDetail
        member={selected}
        role={role}
        lang={lang}
        locationId={locationId}
        provider={provider}
        setProvider={setProvider}
        onBack={() => {
          setSelectedId(null);
          setSelectedMember(null);
        }}
        onMarkPaid={() => onMarkPaid(selected.id)}
        onToggleBlock={() => onToggleBlock(selected.id)}
        onDelete={onDeleteMember}
        onSendReminder={onSendReminder}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-bold">{t.members.title}</div>
        <div className="text-sm text-gray-500">{t.members.subtitle}</div>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 w-full sm:w-96">
          <Search className="w-4 h-4 text-gray-500" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} className="outline-none text-sm w-full" placeholder={t.members.search} />
        </div>
        <Chip tone="ok">{t.members.paid}: {members.filter((m) => m.paymentStatus === "PAID").length}</Chip>
        <Chip tone="danger">{t.members.open}: {members.filter((m) => m.paymentStatus === "OPEN").length}</Chip>
      </div>
      <CollapsibleSection title={t.members.clubOverview} subtitle={t.members.clubSub} defaultOpen>
        <MembersTable
          rows={clubRows}
          role={role}
          lang={lang}
          onChangePlan={onChangePlan}
          onOpen={openMember}
          onToggleBlock={onToggleBlock}
          onBulkDelete={onBulkDelete}
          loading={loadingClub}
          loadingText="Loading Club members from MongoDB..."
        />
      </CollapsibleSection>
      <CollapsibleSection title={t.members.ptOverview} subtitle={t.members.ptSub} defaultOpen>
        <MembersTable
          rows={ptRows}
          role={role}
          lang={lang}
          onChangePlan={onChangePlan}
          onOpen={openMember}
          onToggleBlock={onToggleBlock}
          onBulkDelete={onBulkDelete}
          loading={loadingPt}
          loadingText="Loading PT members from MongoDB..."
        />
      </CollapsibleSection>
      <CollapsibleSection title={t.members.rentalOverview} subtitle={t.members.rentalSub} defaultOpen>
        <MembersTable
          rows={rentalRows}
          role={role}
          lang={lang}
          onChangePlan={onChangePlan}
          onOpen={openMember}
          onToggleBlock={onToggleBlock}
          onBulkDelete={onBulkDelete}
          loading={loadingRental}
          loadingText="Loading Rental members from MongoDB..."
        />
      </CollapsibleSection>
    </div>
  );
}

function FinanceTab({ lang }) {
  const t = i18n[lang];
  const paidTotal = MOCK_PAYMENTS_BASE.filter((p) => p.status === "PAID").reduce((a, b) => a + b.amount, 0);
  const openTotal = MOCK_PAYMENTS_BASE.filter((p) => p.status === "OPEN").reduce((a, b) => a + b.amount, 0);
  const byDay = useMemo(() => {
    const map = new Map();
    for (const p of MOCK_PAYMENTS_BASE) {
      const key = p.date;
      if (!map.has(key)) map.set(key, { date: key, paid: 0, open: 0 });
      const row = map.get(key);
      if (p.status === "PAID") row.paid += p.amount;
      else row.open += p.amount;
    }
    return Array.from(map.values()).sort((a, b) => (a.date > b.date ? 1 : -1));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-bold">{t.finance.title}</div>
        <div className="text-sm text-gray-500">{t.finance.subtitle}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between"><div className="text-sm text-gray-500">{t.finance.paidTotal}</div><Chip tone="ok">PAID</Chip></div>
            <div className="text-3xl font-extrabold mt-2">{formatEUR(paidTotal)}</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between"><div className="text-sm text-gray-500">{t.finance.openTotal}</div><Chip tone="danger">OPEN</Chip></div>
            <div className="text-3xl font-extrabold mt-2">{formatEUR(openTotal)}</div>
          </CardContent>
        </Card>
      </div>
      <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-lg font-semibold">{t.finance.paidVsOpen}</div>
            <Button variant="outline" className="rounded-xl"><ExternalLink className="w-4 h-4 mr-2" /> {t.finance.export}</Button>
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
            <div><div className="text-lg font-semibold">{t.finance.payments}</div><div className="text-sm text-gray-500">{t.finance.allTransactions}</div></div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-t border-b border-gray-200 text-gray-600">
                  <th className="text-left px-6 py-3">Date</th>
                  <th className="text-left px-6 py-3">Customer</th>
                  <th className="text-left px-6 py-3">Category</th>
                  <th className="text-left px-6 py-3">Status</th>
                  <th className="text-right px-6 py-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_PAYMENTS_BASE.map((p) => (
                  <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-6 py-3 text-gray-700">{formatDateDMY(p.date)}</td>
                    <td className="px-6 py-3"><div className="font-medium">{p.customerName}</div><div className="text-xs text-gray-500">{p.customerId}</div></td>
                    <td className="px-6 py-3"><Chip tone="neutral">{p.category}</Chip></td>
                    <td className="px-6 py-3">{p.status === "PAID" ? <Chip tone="ok">PAID</Chip> : <Chip tone="danger">OPEN</Chip>}</td>
                    <td className="px-6 py-3 text-right font-medium">{formatEUR(p.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InvoicePreview({ invoice, lang }) {
  const t = i18n[lang];
  const subtotal = invoice.lines.filter((l) => !String(l.description).toLowerCase().includes("vat") && !String(l.description).toLowerCase().includes("btw")).reduce((a, b) => a + b.amount, 0);
  const vatLines = invoice.lines.filter((l) => String(l.description).toLowerCase().includes("vat") || String(l.description).toLowerCase().includes("btw"));
  return (
    <div className="print:p-0 print:bg-white">
      <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl print:border-0 print:shadow-none">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div><div className="text-2xl font-extrabold">{t.invoices.title}</div><div className="text-sm text-gray-500">{invoice.id}</div><div className="text-sm text-gray-500">{formatDateDMY(invoice.issueDate)}</div></div>
            <div className="text-right"><div className="text-sm text-gray-500">{t.invoices.customer}</div><div className="font-semibold">{invoice.customerName}</div><div className="text-xs text-gray-500">{invoice.customerId}</div></div>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-200 text-gray-600"><th className="text-left py-2 pr-3">Description</th><th className="text-right py-2">Amount</th></tr></thead>
              <tbody>
                {invoice.lines.map((l, idx) => (
                  <tr key={idx} className="border-b border-gray-100"><td className="py-2 pr-3 text-gray-700">{l.description}</td><td className="py-2 text-right font-medium">{formatEUR(l.amount)}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex justify-end">
            <div className="w-full sm:w-80 space-y-2 text-sm">
              <div className="flex items-center justify-between"><span className="text-gray-500">{t.invoices.subtotal}</span><span className="font-medium">{formatEUR(subtotal)}</span></div>
              {vatLines.length > 0 && <div className="flex items-center justify-between"><span className="text-gray-500">{t.invoices.vat}</span><span className="font-medium">{formatEUR(vatLines.reduce((a, b) => a + b.amount, 0))}</span></div>}
              <div className="h-px bg-gray-200" />
              <div className="flex items-center justify-between"><span className="text-gray-900 font-semibold">{t.invoices.total}</span><span className="text-gray-900 font-extrabold">{formatEUR(invoice.total)}</span></div>
              <div className="text-xs text-gray-500 pt-2">{t.invoices.note}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InvoicesTab({ lang, locationId }) {
  const t = i18n[lang];
  const { settings: vatSettings, setPercentForCategory } = useVatSettings(locationId);
  const [selectedCustomerId, setSelectedCustomerId] = useState(MOCK_MEMBERS_SEED[0]?.customerId);
  const [vatByCategory, setVatByCategory] = useState({ CLUB: true, PT: true, RENTAL: true });
  const member = useMemo(() => MOCK_MEMBERS_SEED.find((m) => m.customerId === selectedCustomerId) ?? MOCK_MEMBERS_SEED[0], [selectedCustomerId]);
  const vatEnabledForMember = vatByCategory[member.category];
  const vatPercentForMember = vatSettings.percentByCategory[member.category];
  const invoice = useMemo(() => {
    const plan = getPlan(member.planId);
    const planLabel = lang === "nl" ? plan.labelNL : plan.labelEN;
    const oneTimeFees = member.category === "RENTAL" ? 185 : 0;
    const lines = [{ description: `${t.invoices.subscription}: ${planLabel}`, amount: plan.price }];
    if (oneTimeFees > 0) lines.push({ description: lang === "nl" ? `${t.invoices.oneTime}: Borg €150 + QR €35` : `${t.invoices.oneTime}: Deposit €150 + QR €35`, amount: oneTimeFees });
    const subtotal = lines.reduce((a, b) => a + b.amount, 0);
    const vatValue = vatEnabledForMember ? vatAmount(subtotal, vatPercentForMember) : 0;
    if (vatValue > 0) lines.push({ description: `${t.invoices.vat} ${vatPercentForMember}%`, amount: vatValue });
    return { id: "INV-2026-0001", customerId: member.customerId, customerName: `${member.firstName} ${member.lastName}`, issueDate: "2026-02-26", lines, total: subtotal + vatValue };
  }, [member, lang, t.invoices.oneTime, t.invoices.subscription, t.invoices.vat, vatEnabledForMember, vatPercentForMember]);

  const Toggle = ({ cat }) => (
    <label className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: CATEGORY_COLORS[cat] }} />
      <span className="text-sm text-gray-700">{cat === "CLUB" ? "Club" : cat === "PT" ? "PT" : "Rental"}</span>
      <input type="checkbox" checked={vatByCategory[cat]} onChange={(e) => setVatByCategory((prev) => ({ ...prev, [cat]: e.target.checked }))} />
    </label>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div><div className="text-2xl font-bold">{t.invoices.title}</div><div className="text-sm text-gray-500">{t.invoices.subtitle}</div></div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
            <span className="text-sm text-gray-600">{t.invoices.customer}</span>
            <select value={selectedCustomerId} onChange={(e) => setSelectedCustomerId(e.target.value)} className="outline-none text-sm">
              {MOCK_MEMBERS_SEED.map((m) => <option key={m.customerId} value={m.customerId}>{m.customerId} — {m.firstName} {m.lastName}</option>)}
            </select>
          </div>
          <div className="hidden lg:flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
            <span className="text-sm text-gray-600">{t.invoices.vatPerCategory}</span>
            <Toggle cat="CLUB" /><Toggle cat="PT" /><Toggle cat="RENTAL" />
            <div className="ml-2 flex items-center gap-2">
              <span className="text-sm text-gray-600">{t.invoices.vatRate}</span>
              {["CLUB", "PT", "RENTAL"].map((cat) => (
                <select key={cat} value={vatSettings.percentByCategory[cat]} onChange={(e) => setPercentForCategory(cat, Number(e.target.value))} className="rounded-xl border border-gray-200 bg-white px-2 py-1 text-sm outline-none" title={`${cat} VAT`}>
                  <option value={9}>{cat} 9%</option>
                  <option value={21}>{cat} 21%</option>
                </select>
              ))}
            </div>
          </div>
          <div className="lg:hidden flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2">
            <span className="text-sm text-gray-600">{t.invoices.vatToggle}</span>
            <input type="checkbox" checked={vatEnabledForMember} onChange={(e) => setVatByCategory((prev) => ({ ...prev, [member.category]: e.target.checked }))} />
            <span className="text-sm text-gray-600">{t.invoices.vatRate}</span>
            <select value={vatPercentForMember} onChange={(e) => setPercentForCategory(member.category, Number(e.target.value))} className="rounded-xl border border-gray-200 bg-white px-2 py-1 text-sm outline-none">
              <option value={9}>9%</option>
              <option value={21}>21%</option>
            </select>
          </div>
          <Button variant="outline" className="rounded-xl"><FileText className="w-4 h-4 mr-2" /> {t.invoices.create}</Button>
          <Button className="rounded-xl" onClick={() => window.print()}><FileText className="w-4 h-4 mr-2" /> {t.invoices.print}</Button>
        </div>
      </div>
      <InvoicePreview invoice={invoice} lang={lang} />
    </div>
  );
}

function AutomationsTab({ lang }) {
  const t = i18n[lang];
  return (
    <div className="space-y-6">
      <div><div className="text-2xl font-bold">{t.automations.title}</div><div className="text-sm text-gray-500">{t.automations.subtitle}</div></div>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div><div className="text-lg font-semibold">{t.automations.cron}</div><div className="text-sm text-gray-500">{t.automations.schedule}: 1st day / monthly</div></div>
              <Button className="rounded-xl"><Receipt className="w-4 h-4 mr-2" /> {t.automations.runNow}</Button>
            </div>
            <div className="mt-4 text-sm text-gray-600">Demo: in productie draait dit via Supabase Edge Function of Netlify cron.</div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div><div className="text-lg font-semibold">{t.automations.reminders}</div><div className="text-sm text-gray-500">OPEN → reminder email template</div></div>
              <Button variant="outline" className="rounded-xl"><Mail className="w-4 h-4 mr-2" /> {t.automations.test}</Button>
            </div>
            <div className="mt-4">
              <textarea className="w-full min-h-[140px] rounded-2xl border border-gray-200 bg-white p-4 text-sm outline-none" defaultValue={lang === "nl" ? "Onderwerp: Betalingsherinnering\n\nHi {FIRST_NAME},\n\nJe betaling staat nog open. Je kunt betalen via de link in je portal.\n\nGroet,\nMSBC" : "Subject: Payment reminder\n\nHi {FIRST_NAME},\n\nYour payment is still outstanding. You can pay via the link in your portal.\n\nKind regards,\nMSBC"} />
              <div className="mt-3 flex justify-end"><Button className="rounded-xl"><FileText className="w-4 h-4 mr-2" /> {t.automations.save}</Button></div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PortalTab({ lang }) {
  const t = i18n[lang];
  const [asCustomerId, setAsCustomerId] = useState(MOCK_MEMBERS_SEED[0]?.customerId);
  const member = useMemo(() => MOCK_MEMBERS_SEED.find((m) => m.customerId === asCustomerId) ?? MOCK_MEMBERS_SEED[0], [asCustomerId]);
  return (
    <div className="space-y-6">
      <div><div className="text-2xl font-bold">{t.portal.title}</div><div className="text-sm text-gray-500">{t.portal.subtitle}</div></div>
      <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <LogIn className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">{t.portal.loginAs}</span>
              <select value={asCustomerId} onChange={(e) => setAsCustomerId(e.target.value)} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none">
                {MOCK_MEMBERS_SEED.map((m) => <option key={m.customerId} value={m.customerId}>{m.customerId} — {m.firstName} {m.lastName}</option>)}
              </select>
            </div>
            <Chip tone={member.paymentStatus === "PAID" ? "ok" : "danger"}>{member.paymentStatus}</Chip>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <div className="text-sm text-gray-500">{t.portal.mySubs}</div>
              <div className="text-lg font-semibold mt-1">{lang === "nl" ? getPlan(member.planId).labelNL : getPlan(member.planId).labelEN}</div>
              <div className="text-sm text-gray-600 mt-2">{formatDateDMY(member.startDate)} → {formatDateDMY(member.endDate)}</div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <div className="text-sm text-gray-500">{t.portal.myPayments}</div>
              <div className="text-lg font-semibold mt-1">{member.paymentStatus === "PAID" ? t.common.paid : t.common.open}</div>
              <div className="text-sm text-gray-600 mt-2">Demo: betaal-link (Stripe/Mollie) in productie.</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FinanceGate({ role, children, lang }) {
  if (role !== "admin") {
    return (
      <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5" />
            <div><div className="font-semibold">{i18n[lang].common.adminOnly}</div><div className="text-sm text-gray-500">Finance is alleen zichtbaar voor Admin.</div></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  return <>{children}</>;
}

function runSelfTests() {
  assert(formatDateDMY("2026-02-01") === "1/2/2026", "formatDateDMY should output d/m/y");
  assert(vatAmount(100, 21) === 21, "vatAmount 21% of 100");
  assert(vatAmount(100, 9) === 9, "vatAmount 9% of 100");
  assert(cycleLabel("FOUR_WEEKS", "en") === "4 weeks", "cycleLabel en");
  assert(vatStorageKey("ams") === "msbc_vat_settings_v1:ams", "vatStorageKey per location");
}

export default function DashboardDemo() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [lang, setLang] = useState("nl");
  const [role, setRole] = useState("admin");
  const [tab, setTab] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [contentOpen, setContentOpen] = useState(false);
  const [locationId, setLocationId] = useState(LOCATIONS[0].id);

  const isMember = user?.role === "member";

  useEffect(() => {
    runSelfTests();
  }, []);

  useEffect(() => {
    if (CONTENT_TABS.includes(tab)) setContentOpen(true);
  }, [tab]);

  const onLogout = () => {
    logout();
    navigate("/dashboard-new/login", { replace: true });
  };

  if (isMember) {
    const MemberPortal = React.lazy(() => import("../../components/dashboard-new/MemberPortal"));
    return (
      <React.Suspense fallback={<div className="flex items-center justify-center h-screen text-gray-500">Laden...</div>}>
        <MemberPortal onLogout={onLogout} />
      </React.Suspense>
    );
  }

  const t = i18n[lang];
  const location = LOCATIONS.find((l) => l.id === locationId) ?? LOCATIONS[0];
  const contentNavItems = [
    { id: "home", label: t.tabs.home, icon: <Home className="w-4 h-4" /> },
    { id: "programs", label: t.tabs.programs, icon: <FileText className="w-4 h-4" /> },
    { id: "gallery", label: t.tabs.gallery, icon: <Images className="w-4 h-4" /> },
    { id: "reviews", label: t.tabs.reviews, icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="flex">
        <aside className={`sticky top-0 h-screen flex flex-col border-r border-gray-200 bg-white ${collapsed ? "w-20" : "w-72"} transition-all duration-200`}>
          <div className="shrink-0 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-bold">MS</div>
              {!collapsed && <div><div className="font-extrabold leading-tight">{t.app.title}</div><div className="text-xs text-gray-500">{location.city} • {t.app.subtitle}</div></div>}
            </div>
            <button className="rounded-xl border border-gray-200 p-2 hover:bg-gray-50" onClick={() => setCollapsed((v) => !v)} aria-label="Toggle sidebar">
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="px-4 pb-4 space-y-2">
            <NavButton icon={<LayoutDashboard className="w-5 h-5" />} label={t.tabs.dashboard} active={tab === "dashboard"} collapsed={collapsed} onClick={() => setTab("dashboard")} />
            <NavButton icon={<Users className="w-5 h-5" />} label={t.tabs.members} active={tab === "members"} collapsed={collapsed} onClick={() => setTab("members")} />
            <NavButton icon={<Shield className="w-5 h-5" />} label={t.tabs.finance} active={tab === "finance"} collapsed={collapsed} onClick={() => setTab("finance")} />
            <NavButton icon={<Receipt className="w-5 h-5" />} label={t.tabs.invoices} active={tab === "invoices"} collapsed={collapsed} onClick={() => setTab("invoices")} />
            <NavButton icon={<CalendarClock className="w-5 h-5" />} label={t.tabs.automations} active={tab === "automations"} collapsed={collapsed} onClick={() => setTab("automations")} />
            <NavGroup
              icon={<Globe className="w-5 h-5" />}
              label={t.tabs.contentMenu}
              collapsed={collapsed}
              open={contentOpen}
              onToggle={setContentOpen}
              active={CONTENT_TABS.includes(tab)}
              items={contentNavItems}
              tab={tab}
              setTab={setTab}
              onExpandSidebar={() => setCollapsed(false)}
            />
            <NavButton icon={<LogIn className="w-5 h-5" />} label={t.tabs.portal} active={tab === "portal"} collapsed={collapsed} onClick={() => setTab("portal")} />
          </div>
          {!collapsed && (
            <div className="px-4 pb-4 space-y-3">
              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs text-gray-500">{t.app.location}</div>
                  <select value={locationId} onChange={(e) => setLocationId(e.target.value)} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none">
                    {LOCATIONS.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2"><Globe className="w-4 h-4 text-gray-500" /><span className="text-xs text-gray-500">{t.app.lang}</span></div>
                  <select value={lang} onChange={(e) => setLang(e.target.value)} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none">
                    <option value="nl">NL</option>
                    <option value="en">EN</option>
                  </select>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-gray-500" /><span className="text-xs text-gray-500">{t.app.role}</span></div>
                  <select value={role} onChange={(e) => setRole(e.target.value)} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none">
                    <option value="admin">{t.roles.admin}</option>
                    <option value="staff">{t.roles.staff}</option>
                  </select>
                </div>
                <div className="mt-3 text-xs text-gray-500">Staff ziet (PAID/OPEN) & Members. Finance is Admin-only.</div>
                <Button
                  variant="outline"
                  className="mt-4 w-full rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                  onClick={onLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          )}
          </div>
        </aside>
        <main className="flex-1 p-6 lg:p-10">
          {tab === "dashboard" && <Dashboard lang={lang} />}
          {tab === "members" && <MembersTab lang={lang} role={role} locationId={locationId} />}
          {tab === "finance" && <FinanceGate role={role} lang={lang}><Finance lang={lang} /></FinanceGate>}
          {tab === "invoices" && <InvoicesTab lang={lang} locationId={locationId} />}
          {tab === "automations" && <AutomationsTab lang={lang} />}
          {tab === "programs" && <Programs />}
          {tab === "home" && <HomeTab lang={lang} />}
          {tab === "gallery" && <FotosGalleryAdmin />}
          {tab === "reviews" && <Reviews lang={lang} />}
          {tab === "portal" && <PortalTab lang={lang} />}
        </main>
      </div>
      <style>{`@media print { body { background: white; } aside { display: none !important; } main { padding: 0 !important; } .print\\:border-0 { border: 0 !important; } .print\\:shadow-none { box-shadow: none !important; } }`}</style>
    </div>
  );
}
