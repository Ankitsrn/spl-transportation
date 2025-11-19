'use client';
import React, { useEffect, useState } from 'react';
import type { Route } from '../types';

type PricingRow = { passengers: string; price: number | string };
type FormErrors = {
  from?: string;
  to?: string;
  distance?: string;
  duration?: string;
  pricing?: (string | null)[];
  _form?: string | null;
};

export default function AdminPanel() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // add/edit form state - editing === null => form hidden; editing === Route => edit; editing === {} => create
  const [editing, setEditing] = useState<Route | null>(null);
  const defaultPricing: PricingRow[] = [
    { passengers: '1-2', price: 0 },
    { passengers: '3-4', price: 0 },
    { passengers: '5+', price: 0 }
  ];

  const [form, setForm] = useState({
    from: '',
    to: '',
    distance: '',
    duration: '',
    pricing: defaultPricing as PricingRow[]
  });

  const [errors, setErrors] = useState<FormErrors>({ pricing: [] });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/routes');
      if (!res.ok) throw new Error(`Fetch failed (${res.status})`);
      const data: Route[] = await res.json();
      setRoutes(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load routes');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: number) {
    if (!confirm('Delete this route?')) return;
    try {
      const res = await fetch('/api/routes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const json = await res.json();
      if (json.success) {
        await load();
      } else {
        throw new Error('Delete failed');
      }
    } catch (e: any) {
      alert(e.message || 'Delete failed');
    }
  }

  function startEdit(r?: Route | null) {
    // show form only when this is called; pass undefined to clear/create
    setErrors({ pricing: [] });
    setSaving(false);

    if (!r) {
      // create new
      setEditing({} as Route); // non-null indicates show form for create
      setForm({ from: '', to: '', distance: '', duration: '', pricing: defaultPricing });
      return;
    }

    // edit existing
    const pricing = Array.isArray((r as any).pricing)
      ? (r as any).pricing.map((p: any) => ({ passengers: String(p.passengers || ''), price: (p.price ?? 0) }))
      : defaultPricing;

    setEditing(r);
    setForm({
      from: r.from,
      to: r.to,
      distance: r.distance,
      duration: r.duration,
      pricing
    });
  }

  function updateField<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm(s => ({ ...s, [key]: value }));
    setErrors(e => ({ ...e, [key]: undefined }));
  }

  function updatePricingRow(index: number, patch: Partial<PricingRow>) {
    setForm(s => {
      const pricing = s.pricing.map((row, i) => i === index ? { ...row, ...patch } : row);
      return { ...s, pricing };
    });
    setErrors(e => {
      const pricingErr = (e.pricing || []).slice();
      pricingErr[index] = null;
      return { ...e, pricing: pricingErr };
    });
  }

  function addPricingRow() {
    setForm(s => ({ ...s, pricing: [...s.pricing, { passengers: '', price: 0 }] }));
    setErrors(e => ({ ...e, pricing: [...(e.pricing || []), null] }));
  }

  function removePricingRow(index: number) {
    setForm(s => ({ ...s, pricing: s.pricing.filter((_, i) => i !== index) }));
    setErrors(e => ({ ...e, pricing: (e.pricing || []).filter((_, i) => i !== index) }));
  }

  function validate(): boolean {
    const newErrors: FormErrors = { pricing: [] };
    if (!form.from.trim()) newErrors.from = 'Start location is required';
    if (!form.to.trim()) newErrors.to = 'Destination is required';

    if (form.distance && form.distance.length > 50) newErrors.distance = 'Distance text is too long';
    if (form.duration && form.duration.length > 50) newErrors.duration = 'Duration text is too long';

    if (!Array.isArray(form.pricing) || form.pricing.length === 0) {
      newErrors._form = 'Add at least one pricing row';
    } else {
      newErrors.pricing = [];
      form.pricing.forEach((p, i) => {
        if (!p.passengers || !String(p.passengers).trim()) {
          newErrors.pricing![i] = 'Passengers range is required';
        } else if (String(p.passengers).length > 30) {
          newErrors.pricing![i] = 'Passengers text too long';
        } else if (p.price === '' || p.price === null || Number.isNaN(Number(p.price))) {
          newErrors.pricing![i] = 'Price must be a number';
        } else if (Number(p.price) < 0) {
          newErrors.pricing![i] = 'Price cannot be negative';
        } else {
          newErrors.pricing![i] = null;
        }
      });
    }

    setErrors(newErrors);
    const hasFieldErrors = !!(newErrors.from || newErrors.to || newErrors.distance || newErrors.duration || newErrors._form);
    const hasPricingErrors = Array.isArray(newErrors.pricing) && newErrors.pricing.some(x => x);
    return !(hasFieldErrors || hasPricingErrors);
  }

  async function handleSave(e?: React.FormEvent) {
    e?.preventDefault();
    if (!validate()) return;

    setSaving(true);
    try {
      const pricing = form.pricing.map(p => ({ passengers: p.passengers, price: Number(p.price) }));

      const payload = {
        from: form.from,
        to: form.to,
        distance: form.distance,
        duration: form.duration,
        pricing
      };

      if (editing && (editing as any).id) {
        const res = await fetch('/api/routes', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: (editing as any).id, ...payload })
        });
        if (!res.ok) throw new Error('Update failed');
      } else {
        const res = await fetch('/api/routes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Create failed');
      }

      await load();
      // hide form after success
      setEditing(null);
    } catch (err: any) {
      alert(err.message || 'Save failed — check pricing data');
    } finally {
      setSaving(false);
    }
  }

  const saveDisabled = saving || loading;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4">Admin — Routes</h2>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">
        <div className="flex gap-3">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
            onClick={() => startEdit(undefined)}
          >
            + Add route
          </button>
          <button className="px-4 py-2 border rounded hover:bg-gray-50" onClick={load} disabled={loading}>
            Refresh
          </button>
        </div>
        <div className="sm:ml-auto text-sm text-gray-600 mt-2 sm:mt-0">
          {loading ? 'Loading…' : `${routes.length} routes`}
        </div>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: routes list */}
        <div>
          {!loading && routes.length === 0 && <p className="text-sm text-gray-600">No routes configured.</p>}

          <ul className="space-y-3">
            {routes.map(r => (
              <li key={r.id} className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold">{r.from} → {r.to}</div>
                    <div className="text-sm text-gray-500 mt-1">{r.distance} • {r.duration}</div>

                    <div className="mt-3">
                      <div className="text-xs text-gray-500 uppercase mb-1">Pricing</div>
                      <div className="flex gap-2 flex-wrap">
                        {(r as any).pricing && Array.isArray((r as any).pricing)
                          ? (r as any).pricing.map((p: any, i: number) => (
                              <div key={i} className="text-sm px-2 py-1 border rounded bg-gray-50">{p.passengers}: ${Number(p.price).toFixed(2)}</div>
                            ))
                          : <div className="text-sm text-gray-400">—</div>}
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 sm:items-end">
                    <button className="px-3 py-1 border rounded text-sm hover:bg-gray-50" onClick={() => startEdit(r)}>Edit</button>
                    <button className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700" onClick={() => handleDelete(r.id)}>Delete</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: Add / Edit form — shown only when editing !== null */}
        {editing !== null && (
          <div className="bg-white p-5 border rounded-lg shadow-sm">
            <h3 className="text-lg sm:text-xl font-semibold mb-4">
              {(editing && (editing as any).id) ? `Edit route #${(editing as any).id}` : 'Create new route'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start location</label>
                  <input
                    className={`p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-200 ${errors.from ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder="Enter start location (e.g. Downtown)"
                    value={form.from}
                    onChange={e => updateField('from', e.target.value)}
                    required
                  />
                  {errors.from && <div className="text-xs text-red-600 mt-1">{errors.from}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                  <input
                    className={`p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-200 ${errors.to ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder="Enter destination (e.g. Airport)"
                    value={form.to}
                    onChange={e => updateField('to', e.target.value)}
                    required
                  />
                  {errors.to && <div className="text-xs text-red-600 mt-1">{errors.to}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Distance</label>
                  <input
                    className={`p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-200 ${errors.distance ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder="E.g. 10 km"
                    value={form.distance}
                    onChange={e => updateField('distance', e.target.value)}
                  />
                  {errors.distance && <div className="text-xs text-red-600 mt-1">{errors.distance}</div>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated duration</label>
                  <input
                    className={`p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-200 ${errors.duration ? 'border-red-500' : 'border-gray-200'}`}
                    placeholder="E.g. 15 min"
                    value={form.duration}
                    onChange={e => updateField('duration', e.target.value)}
                  />
                  {errors.duration && <div className="text-xs text-red-600 mt-1">{errors.duration}</div>}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pricing (USD)</label>
                    <div className="text-xs text-gray-500">Set price for each passenger bracket</div>
                  </div>
                  <button type="button" className="text-sm px-2 py-1 border rounded hover:bg-gray-50" onClick={addPricingRow}>+ Add row</button>
                </div>

                {errors._form && <div className="text-xs text-red-600 mb-2">{errors._form}</div>}

                <div className="space-y-3">
                  {form.pricing.map((row, i) => (
                    <div key={i} className="grid grid-cols-12 gap-2 items-start">
                      {/* Passenger range: full width on mobile, half on sm+ */}
                      <div className="col-span-12 sm:col-span-6 min-w-0">
                        <label className="text-xs text-gray-600">Passenger range</label>
                        <input
                          className={`mt-1 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-200 ${errors.pricing && errors.pricing[i] ? 'border-red-500' : 'border-gray-200'}`}
                          placeholder="Passengers (e.g. 1-2)"
                          value={row.passengers}
                          onChange={e => updatePricingRow(i, { passengers: e.target.value })}
                        />
                      </div>

                      {/* Price: half width on mobile, one-third on sm+ */}
                      <div className="col-span-6 sm:col-span-4 min-w-0">
                        <label className="text-xs text-gray-600">Price (USD)</label>
                        <input
                          className={`mt-1 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-indigo-200 ${errors.pricing && errors.pricing[i] ? 'border-red-500' : 'border-gray-200'}`}
                          placeholder="0.00"
                          type="number"
                          min="0"
                          step="0.01"
                          value={String(row.price)}
                          onChange={e => updatePricingRow(i, { price: e.target.value })}
                        />
                      </div>

                      {/* Actions: full width on mobile (stacked), one column on sm+ */}
                      <div className="col-span-12 sm:col-span-2 flex flex-row sm:flex-col gap-2 mt-2 sm:mt-0 items-end sm:items-end min-w-0">
                        <button type="button" className="w-full sm:w-24 px-2 py-2 border rounded text-sm hover:bg-gray-50" onClick={() => updatePricingRow(i, { price: Number(row.price) + 5 })}>+5</button>
                        <button type="button" className="w-full sm:w-24 px-2 py-2 border rounded text-sm hover:bg-gray-50" onClick={() => removePricingRow(i)}>Remove</button>
                      </div>

                      {errors.pricing && errors.pricing[i] && <div className="col-span-12 text-xs text-red-600 mt-1">{errors.pricing[i]}</div>}
                    </div>
                  ))}
                </div>

                <div className="text-xs text-gray-500 mt-2">Each row describes a passenger bracket and its price in USD. Prices are saved as numbers (e.g. 12.50).</div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <button type="submit" className={`bg-green-600 text-white px-4 py-2 rounded shadow ${saveDisabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-green-700'}`} disabled={saveDisabled}>Save</button>
                <button type="button" className="px-4 py-2 border rounded hover:bg-gray-50" onClick={() => startEdit(undefined)} disabled={saving}>Reset</button>
                <button type="button" className="px-4 py-2 border rounded hover:bg-gray-50" onClick={() => setEditing(null)} disabled={saving}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
