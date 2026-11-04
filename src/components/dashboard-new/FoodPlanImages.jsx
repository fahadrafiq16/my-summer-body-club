import React, { useEffect, useState } from 'react';
import { Plus, Save, Upload, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { getBackendBaseUrl } from '../../utils/backend';
const defaults = () => ['Profiel', 'Start', 'Week 4', 'Week 8', 'Doel'].map((caption, i) => ({ id: 'photo-' + i, caption, imageUrl: '', imagePublicId: '' }));
function headers() {
  const auth = JSON.parse(localStorage.getItem('msbc_dashboard_auth') || 'null');
  return { Authorization: 'Bearer ' + (auth?.token || '') };
}
export default function FoodPlanImages({ memberId, lang }) {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const base = getBackendBaseUrl();
  const nl = lang === 'nl';
  useEffect(() => {
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(`${base}/api/food-plans/${memberId}`, { headers: headers(), signal: controller.signal });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'Could not load images');
        if (!controller.signal.aborted) { setBlocks(Array.isArray(data.plan?.imageBlocks) ? data.plan.imageBlocks : defaults()); setLoaded(true); }
      } catch (e) { if (!controller.signal.aborted) setError(e.message); }
      finally { if (!controller.signal.aborted) setLoading(false); }
    })();
    return () => controller.abort();
  }, [base, memberId]);
  const update = (id, patch) => { setBlocks(p => p.map(b => b.id === id ? { ...b, ...patch } : b)); setStatus(''); };
  const upload = async (id, event) => {
    const file = event.target.files?.[0]; event.target.value = '';
    if (!file) return;
    if (!['image/jpeg','image/png','image/webp','image/gif'].includes(file.type) || file.size > 5 * 1024 * 1024) { setError(nl ? 'Kies JPG, PNG, WebP of GIF, maximaal 5 MB.' : 'Choose JPG, PNG, WebP or GIF, up to 5 MB.'); return; }
    setBusy(true); setError(''); setStatus('');
    try {
      const form = new FormData(); form.append('image', file);
      const res = await fetch(`${base}/api/upload-image?folder=${encodeURIComponent('msbc/food-plans/' + memberId)}`, { method: 'POST', headers: headers(), body: form });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Upload failed');
      update(id, { imageUrl: data.url, imagePublicId: data.publicId });
      setStatus(nl ? 'Foto geupload. Klik op Opslaan.' : 'Image uploaded. Click Save.');
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  };
  const save = async () => {
    setBusy(true); setError(''); setStatus('');
    try {
      const res = await fetch(`${base}/api/food-plans/${memberId}`, { method: 'PUT', headers: { ...headers(), 'Content-Type': 'application/json' }, body: JSON.stringify({ imageBlocks: blocks }) });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Save failed');
      setBlocks(data.plan.imageBlocks); setStatus(nl ? 'Fotos opgeslagen voor deze member.' : 'Images saved for this member.');
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  };
  const disabled = loading || busy || !loaded;
  return <section className="rounded-2xl border border-gray-200 bg-gray-50 p-4 space-y-4" aria-label="Member photos">
    <div className="flex items-center justify-between flex-wrap gap-3">
      <h3 className="font-semibold">{nl ? 'Fotos en voortgang' : 'Photos and progress'}</h3>
      <div className="flex gap-2">
        <Button variant="outline" disabled={disabled || blocks.length >= 50} onClick={() => { setBlocks(p => [...p, { id: crypto.randomUUID(), caption: '', imageUrl: '', imagePublicId: '' }]); setStatus(''); }}><Plus className="w-4 h-4 mr-1" />{nl ? 'Regel' : 'Row'}</Button>
        <Button disabled={disabled} onClick={save} className="bg-[#ef4d16] hover:bg-[#d94412]"><Save className="w-4 h-4 mr-1" />{nl ? 'Opslaan' : 'Save'}</Button>
      </div>
    </div>
    <p className="text-xs text-gray-500">{nl ? 'Upload fotos en voeg een onderschrift toe. Klik op Opslaan om wijzigingen te bewaren.' : 'Upload photos and add captions. Click Save to keep your changes.'}</p>
    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
    {(loading || busy || status) && <p role="status" className="text-sm text-gray-600">{loading ? 'Loading...' : busy ? 'Bezig / Working...' : status}</p>}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
      {blocks.map((block, index) => <div key={block.id} className="min-w-0 space-y-2">
        <div className="aspect-[3/4] border border-gray-300 bg-white overflow-hidden flex items-center justify-center">
          {block.imageUrl ? <img src={block.imageUrl} alt={block.caption || 'Foto ' + (index + 1)} className="w-full h-full object-cover" /> : <span className="text-gray-400 text-xl">Foto {index + 1}</span>}
        </div>
        <input aria-label={'Caption ' + (index + 1)} maxLength={200} value={block.caption} disabled={disabled} onChange={e => update(block.id, { caption: e.target.value })} placeholder={nl ? 'Onderschrift' : 'Caption'} className="w-full rounded-lg border border-gray-200 bg-white p-2 font-semibold" />
        <label className={`flex gap-2 items-center text-sm text-orange-700 ${disabled ? 'opacity-50' : 'cursor-pointer'} focus-within:ring-2 focus-within:ring-orange-500`}>
          <Upload className="w-4 h-4" />{nl ? 'Foto uploaden' : 'Upload image'}
          <input type="file" className="sr-only" accept="image/jpeg,image/png,image/webp,image/gif" disabled={disabled} onChange={e => upload(block.id, e)} />
        </label>
        <button type="button" disabled={disabled} onClick={() => { setBlocks(p => p.filter(b => b.id !== block.id)); setStatus(''); }} className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-red-600" aria-label={'Remove ' + (block.caption || 'Foto ' + (index + 1))}><Trash2 className="w-3 h-3" />{nl ? 'Verwijderen' : 'Remove'}</button>
      </div>)}
    </div>
  </section>;
}
