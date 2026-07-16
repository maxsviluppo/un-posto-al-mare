import React, { useState, useEffect } from 'react';
import { Settings, MapPin, Phone, Mail, Save, ShieldCheck } from 'lucide-react';
import { UmbrellaIcon } from '../components/UmbrellaIcon';
import { db, doc, getDoc, setDoc, OperationType, handleFirestoreError } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

interface LidoSettings {
  umbrellaPrice: number;
  sunbedPrice: number;
  deckchairPrice: number;
  address: string;
  phone: string;
  email: string;
  description: string;
}

export function AdminSettings() {
  const { isAdmin } = useAuth();
  const [settings, setSettings] = useState<LidoSettings>({
    umbrellaPrice: 20,
    sunbedPrice: 10,
    deckchairPrice: 5,
    address: 'Via della Spiaggia 42, 00121 Roma',
    phone: '+39 06 123 4567',
    email: 'info@lidoparadiso.it',
    description: 'Il tuo angolo di relax sulla costa.',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'config');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(docSnap.data() as LidoSettings);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'settings/config');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [isAdmin]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'config'), settings);
      alert('Impostazioni salvate con successo!');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings/config');
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center p-6">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Accesso Negato</h2>
          <p className="text-gray-500">Questa area è riservata all'amministratore del lido.</p>
          <Link to="/" className="inline-block text-blue-600 font-bold hover:underline">Torna alla Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24">
      <section className="space-y-2">
        <h2 className="text-4xl font-serif font-bold text-gray-900">Configurazione Lido</h2>
        <p className="text-gray-500">Gestisci i parametri e le informazioni dello stabilimento.</p>
      </section>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Prezzi */}
        <div className="modern-card space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <UmbrellaIcon size={24} />
            </div>
            <h3 className="text-2xl font-bold">Listino Prezzi</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Ombrellone (€)</label>
              <input
                type="number"
                className="modern-input"
                value={settings.umbrellaPrice}
                onChange={(e) => setSettings({ ...settings, umbrellaPrice: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Lettino (€)</label>
              <input
                type="number"
                className="modern-input"
                value={settings.sunbedPrice}
                onChange={(e) => setSettings({ ...settings, sunbedPrice: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Sdraio (€)</label>
              <input
                type="number"
                className="modern-input"
                value={settings.deckchairPrice}
                onChange={(e) => setSettings({ ...settings, deckchairPrice: parseInt(e.target.value) })}
              />
            </div>
          </div>
        </div>

        {/* Contatti */}
        <div className="modern-card space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
              <Settings size={24} />
            </div>
            <h3 className="text-2xl font-bold">Informazioni di Contatto</h3>
          </div>
          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <MapPin size={14} /> Indirizzo
              </label>
              <input
                type="text"
                className="modern-input"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Phone size={14} /> Telefono
                </label>
                <input
                  type="text"
                  className="modern-input"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Mail size={14} /> Email
                </label>
                <input
                  type="email"
                  className="modern-input"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Descrizione</label>
              <textarea
                className="modern-input h-32 resize-none"
                value={settings.description}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="modern-button w-full flex items-center justify-center gap-3"
        >
          <Save size={20} />
          {saving ? 'Salvataggio...' : 'Salva Tutte le Impostazioni'}
        </button>
      </form>
    </div>
  );
}
