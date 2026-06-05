'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2, Edit2, MapPin, Loader2 } from 'lucide-react';

interface Address {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  street2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);

  async function fetchAddresses() {
    const res = await fetch('/api/account/addresses');
    const data = await res.json();
    if (data.success) setAddresses(data.data);
    setLoading(false);
  }

  useEffect(() => { fetchAddresses(); }, []);

  async function handleDelete(id: string) {
    if (!confirm('Supprimer cette adresse ?')) return;
    const res = await fetch(`/api/account/addresses/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setAddresses(addresses.filter(a => a.id !== id));
      toast.success('Adresse supprim\u00e9e');
    }
  }

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mes adresses</h1>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800"
        >
          <Plus className="w-4 h-4" /> Ajouter
        </button>
      </div>

      {showForm && (
        <AddressForm
          address={editing}
          onSave={() => { setShowForm(false); setEditing(null); fetchAddresses(); }}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      {addresses.length === 0 && !showForm ? (
        <div className="text-center py-12 text-gray-500">
          <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Aucune adresse enregistr\u00e9e</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map(addr => (
            <div key={addr.id} className="border border-gray-200 rounded-lg p-4 relative">
              {addr.isDefault && (
                <span className="absolute top-2 right-2 text-xs bg-gray-900 text-white px-2 py-0.5 rounded">Par d\u00e9faut</span>
              )}
              <p className="font-medium">{addr.firstName} {addr.lastName}</p>
              <p className="text-sm text-gray-600">{addr.street}</p>
              {addr.street2 && <p className="text-sm text-gray-600">{addr.street2}</p>}
              <p className="text-sm text-gray-600">{addr.postalCode} {addr.city}</p>
              <p className="text-sm text-gray-600">{addr.country}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => { setEditing(addr); setShowForm(true); }} className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1">
                  <Edit2 className="w-3.5 h-3.5" /> Modifier
                </button>
                <button onClick={() => handleDelete(addr.id)} className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1">
                  <Trash2 className="w-3.5 h-3.5" /> Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddressForm({ address, onSave, onCancel }: { address: Address | null; onSave: () => void; onCancel: () => void }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: address?.firstName || '',
    lastName: address?.lastName || '',
    street: address?.street || '',
    street2: address?.street2 || '',
    city: address?.city || '',
    postalCode: address?.postalCode || '',
    country: address?.country || 'FR',
    phone: address?.phone || '',
    isDefault: address?.isDefault || false,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const url = address ? `/api/account/addresses/${address.id}` : '/api/account/addresses';
    const method = address ? 'PUT' : 'POST';

    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) { toast.error(data.error); setSaving(false); return; }

    toast.success(address ? 'Adresse modifi\u00e9e' : 'Adresse ajout\u00e9e');
    onSave();
  }

  const setField = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 border rounded-lg p-6 mb-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input placeholder="Pr\u00e9nom" required value={form.firstName} onChange={e => setField('firstName', e.target.value)} className="px-3 py-2 border rounded-lg" />
        <input placeholder="Nom" required value={form.lastName} onChange={e => setField('lastName', e.target.value)} className="px-3 py-2 border rounded-lg" />
      </div>
      <input placeholder="Adresse" required value={form.street} onChange={e => setField('street', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
      <input placeholder="Compl\u00e9ment (optionnel)" value={form.street2} onChange={e => setField('street2', e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
      <div className="grid grid-cols-2 gap-4">
        <input placeholder="Code postal" required value={form.postalCode} onChange={e => setField('postalCode', e.target.value)} className="px-3 py-2 border rounded-lg" />
        <input placeholder="Ville" required value={form.city} onChange={e => setField('city', e.target.value)} className="px-3 py-2 border rounded-lg" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <input placeholder="Pays (ex: FR)" required value={form.country} onChange={e => setField('country', e.target.value)} className="px-3 py-2 border rounded-lg" />
        <input placeholder="T\u00e9l\u00e9phone (optionnel)" value={form.phone} onChange={e => setField('phone', e.target.value)} className="px-3 py-2 border rounded-lg" />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.isDefault} onChange={e => setField('isDefault', e.target.checked)} />
        Adresse par d\u00e9faut
      </label>
      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium disabled:opacity-50">
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-lg text-sm">Annuler</button>
      </div>
    </form>
  );
}
