import React, { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { LogOut, User, CreditCard, CalendarClock, CheckCircle2, AlertCircle } from "lucide-react";
import { getBackendBaseUrl } from "../../utils/backend";

function formatEUR(n) {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(Number(n || 0));
}

function formatDate(d) {
  if (!d) return "—";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return "—";
  return `${dt.getDate()}/${dt.getMonth() + 1}/${dt.getFullYear()}`;
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

function SkeletonPortal() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-48 rounded bg-gray-200" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl"><CardContent className="p-6 space-y-3">
          <div className="h-5 w-32 rounded bg-gray-200" />
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-4 rounded bg-gray-100" />)}
        </CardContent></Card>
        <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl"><CardContent className="p-6 space-y-3">
          <div className="h-5 w-32 rounded bg-gray-200" />
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-4 rounded bg-gray-100" />)}
        </CardContent></Card>
      </div>
      <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl"><CardContent className="p-6 space-y-3">
        <div className="h-5 w-48 rounded bg-gray-200" />
        {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-10 rounded bg-gray-100" />)}
      </CardContent></Card>
    </div>
  );
}

export default function MemberPortal({ onLogout }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const backendBase = getBackendBaseUrl();
        const raw = localStorage.getItem("msbc_dashboard_auth");
        const token = raw ? JSON.parse(raw)?.token : null;
        if (!token) { setError("Not authenticated"); return; }

        const res = await fetch(`${backendBase}/api/member-portal/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json?.error || "Failed to load");
        setData(json);
      } catch (e) {
        setError(e?.message || "Failed to load member data");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <SkeletonPortal />;

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
    );
  }

  const member = data?.member;
  const mollie = data?.mollieProfile;
  const so = member?.selectedOption || {};

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-4xl mx-auto p-6 lg:p-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">Welkom, {member?.voornaam || "Member"}</div>
            <div className="text-sm text-gray-500">Jouw persoonlijke dashboard</div>
          </div>
          <Button variant="outline" className="rounded-xl border-red-200 text-red-600 hover:bg-red-50" onClick={onLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Uitloggen
          </Button>
        </div>

        {/* Personal Details */}
        <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold">Persoonlijke gegevens</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <Detail label="Voornaam" value={member?.voornaam} />
              <Detail label="Tussenvoegsel" value={member?.tussenvoegsel} />
              <Detail label="Achternaam" value={member?.achternaam} />
              <Detail label="E-mail" value={member?.email} />
              <Detail label="Telefoon" value={member?.telefoonnummer} />
              <Detail label="Adres" value={member?.adres} />
              <Detail label="Postcode" value={member?.postcode} />
              <Detail label="Huisnummer" value={member?.huisnummer} />
              <Detail label="Woonplaats" value={member?.woonplaats} />
              <Detail label="Aangemeld op" value={formatDate(member?.createdAt)} />
            </div>
          </CardContent>
        </Card>

        {/* Package Details */}
        <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold">Pakket details</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <Detail label="Training" value={so.trainingTitle} />
              <Detail label="Plan" value={so.title} />
              <Detail label="Type" value={so.abonnementType} />
              <Detail label="Bedrag" value={member?.totalAmount ? `€${member.totalAmount}` : "—"} />
              <Detail label="Recurring" value={so.recurring ? "Ja" : "Nee"} />
              <Detail label="Program type" value={so.programType} />
              <Detail label="Status" value={member?.status} />
              {member?.blocked && <Detail label="Geblokkeerd" value="Ja" />}
            </div>
          </CardContent>
        </Card>

        {/* Mollie Payment Details */}
        {mollie && (
          <>
            <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CalendarClock className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-semibold">Betalingsoverzicht (Mollie)</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center">
                    <div className="text-xs text-gray-500">Totaal betalingen</div>
                    <div className="text-xl font-bold mt-1">{mollie.totalPayments}</div>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center">
                    <div className="text-xs text-gray-500">Betaald</div>
                    <div className="text-xl font-bold mt-1 text-green-600">{mollie.paidPayments}</div>
                  </div>
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-center">
                    <div className="text-xs text-gray-500">Actieve abonnementen</div>
                    <div className="text-xl font-bold mt-1">{mollie.activeSubscriptionsCount}</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                  <Detail label="Eerste betaling" value={formatDate(mollie.firstPaymentAt)} />
                  <Detail label="Laatste betaling" value={formatDate(mollie.lastPaymentAt)} />
                  <Detail label="Volgende betaling" value={formatDate(mollie.nextPaymentDate)} />
                  <Detail label="Mollie klant ID" value={mollie.customerId} />
                </div>
              </CardContent>
            </Card>

            {/* Active Subscriptions */}
            {mollie.subscriptions?.length > 0 && (
              <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Actieve abonnementen</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 text-gray-600">
                          <th className="text-left px-4 py-2">Beschrijving</th>
                          <th className="text-left px-4 py-2">Bedrag</th>
                          <th className="text-left px-4 py-2">Interval</th>
                          <th className="text-left px-4 py-2">Status</th>
                          <th className="text-left px-4 py-2">Volgende betaling</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mollie.subscriptions.map((s) => (
                          <tr key={s.id} className="border-b border-gray-100">
                            <td className="px-4 py-2">{s.description}</td>
                            <td className="px-4 py-2">{formatEUR(s.amount?.value)}</td>
                            <td className="px-4 py-2">{s.interval}</td>
                            <td className="px-4 py-2"><Chip tone="ok">{s.status}</Chip></td>
                            <td className="px-4 py-2">{formatDate(s.nextPaymentDate)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Payments */}
            {mollie.recentPayments?.length > 0 && (
              <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold mb-4">Recente betalingen</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 text-gray-600">
                          <th className="text-left px-4 py-2">Datum</th>
                          <th className="text-left px-4 py-2">Beschrijving</th>
                          <th className="text-left px-4 py-2">Status</th>
                          <th className="text-right px-4 py-2">Bedrag</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mollie.recentPayments.map((p) => (
                          <tr key={p.id} className="border-b border-gray-100">
                            <td className="px-4 py-2">{formatDate(p.paidAt || p.createdAt)}</td>
                            <td className="px-4 py-2">{p.description}</td>
                            <td className="px-4 py-2">
                              {p.status === "paid" ? (
                                <Chip tone="ok"><CheckCircle2 className="w-3 h-3" /> Betaald</Chip>
                              ) : (
                                <Chip tone="danger"><AlertCircle className="w-3 h-3" /> {p.status}</Chip>
                              )}
                            </td>
                            <td className="px-4 py-2 text-right font-medium">{formatEUR(p.amount?.value)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}

        {!mollie && (
          <Card className="bg-white shadow-sm border border-gray-200 rounded-2xl">
            <CardContent className="p-6 text-sm text-gray-500">
              Geen Mollie betalingsgegevens gevonden voor dit account.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <span className="text-gray-500">{label}:</span>{" "}
      <span className="font-medium text-gray-900">{value || "—"}</span>
    </div>
  );
}
