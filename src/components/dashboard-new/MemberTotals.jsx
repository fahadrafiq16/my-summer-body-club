import React, { useEffect, useState } from 'react';
import { getBackendBaseUrl } from '../../utils/backend';

export default function MemberTotals({ collapsed, lang, refreshKey }) {
  const [counts, setCounts] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      setLoading(true);
      setError(false);
      try {
        const auth = JSON.parse(localStorage.getItem('msbc_dashboard_auth') || 'null');
        if (!auth?.token) throw new Error('Not authenticated');
        const response = await fetch(`${getBackendBaseUrl()}/api/dashboard-stats`, {
          headers: { Authorization: `Bearer ${auth.token}` },
          signal: controller.signal,
        });
        if (!response.ok) throw new Error('Could not load totals');
        const data = await response.json();
        if (!['club', 'pt', 'rental'].every((key) => Number.isInteger(data.registrations?.[key]))) {
          throw new Error('Invalid totals');
        }
        if (!controller.signal.aborted) setCounts(data.registrations);
      } catch {
        if (!controller.signal.aborted) setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    load();
    return () => controller.abort();
  }, [refreshKey]);

  const rows = [
    { key: 'club', label: lang === 'nl' ? 'Club leden totaal' : 'Club members total', short: 'Club' },
    { key: 'pt', label: lang === 'nl' ? 'PT leden totaal' : 'PT members total', short: 'PT' },
    { key: 'rental', label: 'PT Ruimte Huren', short: 'Huur' },
  ];

  return (
    <section className={`${collapsed ? 'mx-2 p-2' : 'mx-4 p-3'} mb-4 rounded-2xl border border-orange-100 bg-orange-50`} aria-label={lang === 'nl' ? 'Ledentotalen' : 'Member totals'} aria-busy={loading}>
      {!collapsed && <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">{lang === 'nl' ? 'Ledenoverzicht' : 'Member overview'}</div>}
      <dl className="space-y-2">
        {rows.map(({ key, label, short }) => (
          <div key={key} title={label} className={`flex ${collapsed ? 'flex-col text-center' : 'items-center justify-between gap-2'} text-xs`}>
            <dt className="text-gray-600">{collapsed ? short : label}</dt>
            <dd className="m-0 font-bold tabular-nums text-gray-900">{loading ? '…' : error ? '—' : counts?.[key]}</dd>
          </div>
        ))}
        <div className={`flex ${collapsed ? 'flex-col text-center' : 'items-center justify-between gap-2'} border-t border-orange-200 pt-2 text-xs font-bold text-gray-900`}>
          <dt>{lang === 'nl' ? 'Totaal' : 'Total'}</dt>
          <dd className="m-0 tabular-nums">
            {loading ? '…' : error ? '—' : counts ? counts.club + counts.pt + counts.rental : '—'}
          </dd>
        </div>
      </dl>
      {error && <p role="status" className="mt-2 text-xs text-red-700">{lang === 'nl' ? 'Laden mislukt' : 'Loading failed'}</p>}
    </section>
  );
}
