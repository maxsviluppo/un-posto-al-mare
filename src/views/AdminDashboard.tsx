import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db, collection, onSnapshot, query, orderBy, updateDoc, doc, OperationType, handleFirestoreError } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Calendar, Users, CheckCircle, XCircle, Clock, ShieldCheck, Phone, User, Filter, Trash2 } from 'lucide-react';
import { UmbrellaIcon } from '../components/UmbrellaIcon';
import { Link } from 'react-router-dom';

interface Booking {
  id: string;
  lastName: string;
  phone: string;
  date: string;
  people: number;
  umbrellas: number;
  sunbeds: number;
  deckchairs: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: any;
}

export function AdminDashboard() {
  const { isAdmin } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    if (!isAdmin) return;

    const q = query(collection(db, 'bookings'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookingsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Booking));
      setBookings(bookingsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'bookings');
    });

    return () => unsubscribe();
  }, [isAdmin]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'bookings', id), { status });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `bookings/${id}`);
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

  const filteredBookings = bookings.filter(b => {
    const matchesStatus = filter === 'all' || b.status === filter;
    const matchesDate = !dateFilter || b.date === dateFilter;
    return matchesStatus && matchesDate;
  });

  return (
    <div className="space-y-12 pb-24">
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-serif font-bold text-gray-900">Gestione Prenotazioni</h2>
          <p className="text-gray-500">Monitora e gestisci le richieste dei tuoi clienti.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="date"
              className="pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
          <select
            className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
          >
            <option value="all">Tutti gli stati</option>
            <option value="pending">In Attesa</option>
            <option value="confirmed">Confermati</option>
            <option value="cancelled">Annullati</option>
          </select>
        </div>
      </section>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: 'Totali', value: bookings.length, color: 'blue' },
          { label: 'In Attesa', value: bookings.filter(b => b.status === 'pending').length, color: 'yellow' },
          { label: 'Confermati', value: bookings.filter(b => b.status === 'confirmed').length, color: 'green' },
          { label: 'Annullati', value: bookings.filter(b => b.status === 'cancelled').length, color: 'red' }
        ].map((stat, idx) => (
          <div key={idx} className="modern-card p-6 text-center space-y-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-3xl font-serif font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Bookings List */}
      <div className="grid gap-6">
        <AnimatePresence mode="popLayout">
          {filteredBookings.map((booking) => (
            <motion.div
              key={booking.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modern-card flex flex-col md:flex-row items-center justify-between gap-8"
            >
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${
                  booking.status === 'confirmed' ? 'bg-green-50 text-green-600' :
                  booking.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                  'bg-yellow-50 text-yellow-600'
                }`}>
                  {booking.status === 'confirmed' ? <CheckCircle size={32} /> :
                   booking.status === 'cancelled' ? <XCircle size={32} /> :
                   <Clock size={32} />}
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-gray-900">{booking.lastName}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {booking.date}</span>
                    <span className="flex items-center gap-1"><Phone size={14} /> {booking.phone}</span>
                    <span className="flex items-center gap-1"><Users size={14} /> {booking.people} persone</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-6 md:pt-0">
                <div className="flex gap-4 text-xs font-bold text-gray-400">
                  <span className="flex items-center gap-1"><UmbrellaIcon size={14} /> {booking.umbrellas}</span>
                  <span>L: {booking.sunbeds}</span>
                  <span>S: {booking.deckchairs}</span>
                </div>
                
                <div className="flex gap-2">
                  {booking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(booking.id, 'confirmed')}
                        className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all"
                      >
                        <CheckCircle size={20} />
                      </button>
                      <button
                        onClick={() => updateStatus(booking.id, 'cancelled')}
                        className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                      >
                        <XCircle size={20} />
                      </button>
                    </>
                  )}
                  {booking.status !== 'pending' && (
                    <button
                      onClick={() => updateStatus(booking.id, 'pending')}
                      className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100 transition-all"
                    >
                      <Clock size={20} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredBookings.length === 0 && !loading && (
          <div className="modern-card p-12 text-center border-dashed border-2">
            <p className="text-gray-400 font-bold">Nessuna prenotazione trovata per i filtri selezionati.</p>
          </div>
        )}
      </div>
    </div>
  );
}
