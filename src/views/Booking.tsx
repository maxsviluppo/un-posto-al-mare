import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle, User, Mail, Lock, 
  LogOut, Calendar, Users, AlertCircle, Eye, EyeOff, Sparkles, Phone
} from 'lucide-react';
import { UmbrellaIcon } from '../components/UmbrellaIcon';
import { db, collection, addDoc, serverTimestamp, OperationType, handleFirestoreError } from '../firebase';
import beachBg from '../assets/spiaggia_sfondo.png';

// Rows configuration with zone descriptions and prices
const ROW_PRICES = {
  1: { name: "1ª Fila - Fronte Mare", price: 35 },
  2: { name: "2ª Fila - Centro Spiaggia", price: 25 },
  3: { name: "3ª Fila - Retro Spiaggia", price: 20 }
};

// App configuration (configurable values for managers)
const CONFIG = {
  maxAdults: 4,      // Valore MAX adulti per singolo ombrellone
  maxChildren: 4,    // Valore MAX bambini per singolo ombrellone
  maxChairs: 2,      // Valore MAX sedie per singolo ombrellone
  maxSunbeds: 2      // Valore MAX lettini per singolo ombrellone
};

export interface SelectedUmbrella {
  row: number;
  num: number;
  adults: number;
  children: number;
  chairs: number;
  sunbeds: number;
}

export function Booking() {
  // Authentication Simulated State
  const [user, setUser] = useState<{ email: string } | null>(() => {
    const saved = localStorage.getItem('lido_simulated_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [authMode, setAuthMode] = useState<'register' | 'login'>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Booking details State
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedUmbrellas, setSelectedUmbrellas] = useState<SelectedUmbrella[]>([]);
  const [phone, setPhone] = useState('');
  const [lastName, setLastName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  // Modal State for configuring each selected umbrella
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTarget, setModalTarget] = useState<{ row: number; num: number } | null>(null);
  const [modalAdults, setModalAdults] = useState(2);
  const [modalChildren, setModalChildren] = useState(0);
  const [modalChairs, setModalChairs] = useState(0);
  const [modalSunbeds, setModalSunbeds] = useState(2);
  const [isEditing, setIsEditing] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isDatePickerOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDatePickerOpen]);

  const formatSelectedDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(`${dateStr}T12:00:00`).toLocaleDateString('it-IT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Derived totals
  const totalAdultsSelected = selectedUmbrellas.reduce((sum, item) => sum + item.adults, 0);
  const totalChildrenSelected = selectedUmbrellas.reduce((sum, item) => sum + item.children, 0);
  const totalChairsSelected = selectedUmbrellas.reduce((sum, item) => sum + item.chairs, 0);
  const totalSunbedsSelected = selectedUmbrellas.reduce((sum, item) => sum + item.sunbeds, 0);

  // Handle simulated authentication submit
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');

    if (!email || !password) {
      setAuthError('Inserisci tutti i campi obbligatori.');
      return;
    }

    if (password.length < 6) {
      setAuthError('La password deve essere lunga almeno 6 caratteri.');
      return;
    }

    if (authMode === 'register') {
      const newUser = { email };
      localStorage.setItem('lido_simulated_user', JSON.stringify(newUser));
      setUser(newUser);
      setAuthSuccess('Registrazione completata! Benvenuto.');
    } else {
      const existingUser = { email };
      localStorage.setItem('lido_simulated_user', JSON.stringify(existingUser));
      setUser(existingUser);
      setAuthSuccess('Accesso completato!');
    }
  };

  // Sign out user simulation
  const handleLogout = () => {
    localStorage.removeItem('lido_simulated_user');
    setUser(null);
    setSelectedUmbrellas([]);
  };

  // Deterministic calculation for mock umbrella occupation based on row, index, and date choice
  const isUmbrellaOccupied = (row: number, num: number) => {
    if (!selectedDate) return false;
    const dateCode = selectedDate.split('-').reduce((acc, part) => acc + parseInt(part), 0);
    // Dynamic seed hashing
    const hash = (row * 17 + num * 29 + dateCode) % 7;
    return hash === 0 || hash === 3; // ~28% deterministic occupancy
  };

  // Open configuration modal on empty umbrella click
  const handleUmbrellaClick = (row: number, num: number) => {
    if (isUmbrellaOccupied(row, num)) return;

    const existing = selectedUmbrellas.find(item => item.row === row && item.num === num);
    if (existing) {
      setModalTarget({ row, num });
      setModalAdults(existing.adults);
      setModalChildren(existing.children);
      setModalChairs(existing.chairs);
      setModalSunbeds(existing.sunbeds);
      setIsEditing(true);
      setIsModalOpen(true);
    } else {
      setModalTarget({ row, num });
      setModalAdults(2); // Default to 2 adults
      setModalChildren(0); // Default to 0 children
      setModalChairs(0); // Default to 0 chairs
      setModalSunbeds(2); // Default to 2 sunbeds
      setIsEditing(false);
      setIsModalOpen(true);
    }
  };

  // Handle modal confirmation
  const handleModalConfirm = () => {
    if (!modalTarget) return;

    const newSelection: SelectedUmbrella = {
      row: modalTarget.row,
      num: modalTarget.num,
      adults: modalAdults,
      children: modalChildren,
      chairs: modalChairs,
      sunbeds: modalSunbeds
    };

    setSelectedUmbrellas(prev => {
      const filtered = prev.filter(item => !(item.row === modalTarget.row && item.num === modalTarget.num));
      return [...filtered, newSelection];
    });

    setIsModalOpen(false);
    setModalTarget(null);
  };

  // Handle modal removal
  const handleModalRemove = () => {
    if (!modalTarget) return;

    setSelectedUmbrellas(prev => prev.filter(item => !(item.row === modalTarget.row && item.num === modalTarget.num)));
    setIsModalOpen(false);
    setModalTarget(null);
  };

  // Handle modal cancel
  const handleModalCancel = () => {
    setIsModalOpen(false);
    setModalTarget(null);
  };

  // Sum total prices of all current selections
  const calculateTotal = () => {
    return selectedUmbrellas.reduce((total, item) => {
      const rowPrice = ROW_PRICES[item.row as keyof typeof ROW_PRICES]?.price || 0;
      return total + rowPrice;
    }, 0);
  };

  // Finalize reservation and try writing to Firestore or mock backup
  const handleBookingConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lastName || !phone) {
      alert('Per favore, inserisci cognome e telefono per la prenotazione.');
      return;
    }
    if (selectedUmbrellas.length === 0) {
      alert('Scegli almeno un ombrellone dalla mappa per continuare.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Save data in Firebase Firestore
      await addDoc(collection(db, 'bookings'), {
        userEmail: user?.email || 'user@example.com',
        lastName,
        phone,
        date: selectedDate,
        people: totalAdultsSelected,
        childrenCount: totalChildrenSelected,
        totalChairs: totalChairsSelected,
        totalSunbeds: totalSunbedsSelected,
        umbrellas: selectedUmbrellas,
        totalPrice: calculateTotal(),
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setIsBooked(true);
    } catch (error) {
      console.warn("Firestore access pending. Saving booking simulation to browser LocalStorage.", error);
      // Fallback local save
      const localStore = JSON.parse(localStorage.getItem('local_bookings') || '[]');
      localStore.push({
        userEmail: user?.email,
        lastName,
        phone,
        date: selectedDate,
        people: totalAdultsSelected,
        childrenCount: totalChildrenSelected,
        totalChairs: totalChairsSelected,
        totalSunbeds: totalSunbedsSelected,
        umbrellas: selectedUmbrellas,
        totalPrice: calculateTotal(),
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('local_bookings', JSON.stringify(localStore));
      setIsBooked(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedUmbrellas([]);
    setLastName('');
    setPhone('');
    setIsBooked(false);
  };

  return (
    <div 
      className="w-full min-h-screen font-montserrat relative"
      style={{
        backgroundImage: `url(${beachBg})`,
        backgroundPosition: 'top center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        backgroundColor: '#ddb678',
      }}
      id="booking-page-root"
    >
      {user && !isBooked && (
        <div className="fixed top-20 left-4 md:left-6 z-50" ref={datePickerRef} id="date-picker-floating">
          <button
            type="button"
            onClick={() => setIsDatePickerOpen((open) => !open)}
            className="w-11 h-11 bg-white/90 backdrop-blur-md border border-white/70 rounded-xl shadow-lg flex items-center justify-center text-[#ad8f65] hover:bg-white hover:scale-105 transition-all"
            aria-label="Seleziona giorno prenotazione"
            id="date-picker-toggle"
          >
            <Calendar size={20} />
          </button>

          <AnimatePresence>
            {isDatePickerOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 mt-2 bg-white/95 backdrop-blur-md border border-[#E9DFCB] rounded-xl shadow-xl p-4 min-w-[240px]"
                id="date-picker-popover"
              >
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                  Giorno prenotazione
                </p>
                <input
                  type="date"
                  required
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedUmbrellas([]);
                  }}
                  className="w-full px-3 py-2 bg-white border border-[#E9DFCB] rounded-lg text-xs font-semibold outline-none focus:border-[#ad8f65] transition-all text-gray-800 cursor-pointer"
                  id="date-input"
                />
                <p className="text-[11px] font-semibold text-[#5c4323] mt-2 capitalize">
                  {formatSelectedDate(selectedDate)}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-24 relative z-10" id="booking-container">
      {/* Page Title */}
      <section className="text-center space-y-2 mb-8" id="booking-heading-section">
        <span className="text-[10px] font-black tracking-[0.25em] text-[#ad8f65] uppercase">
          PRENOTAZIONI
        </span>
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-[#5c4323]" id="booking-title">
          PRENOTA IL TUO OMBRELLONE
        </h2>
        <div className="w-12 h-0.5 bg-amber-500 mx-auto rounded-full" id="booking-accent-bar" />
        <p className="text-gray-500 max-w-md mx-auto font-medium text-[11px] leading-relaxed" id="booking-subtitle">
          Scegli la tua posizione ideale sulla nostra spiaggia privata.
        </p>
      </section>

      {/* STEP 1: Registration Form (if user is not signed in) */}
      {!user ? (
        <div className="max-w-md mx-auto" id="auth-panel-wrapper">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-[#E9DFCB] shadow-lg p-6 sm:p-8 space-y-6"
            id="auth-card"
          >
            <div className="text-center space-y-1" id="auth-header">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mx-auto" id="auth-icon-container">
                <Sparkles size={20} className="animate-pulse" id="auth-sparkle-icon" />
              </div>
              <h3 className="text-base font-black uppercase tracking-wider text-gray-900" id="auth-title">
                {authMode === 'register' ? 'Registrati per Continuare' : 'Accedi al tuo Profilo'}
              </h3>
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider" id="auth-instructions">
                {authMode === 'register' 
                  ? 'Crea un account per visualizzare la mappa degli ombrelloni' 
                  : 'Bentornato! Accedi per visualizzare la mappa'}
              </p>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200/50 rounded-xl flex items-center gap-2.5 text-red-600 text-[11px] font-semibold" id="auth-error-alert">
                <AlertCircle size={14} className="shrink-0" id="auth-error-icon" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="p-3 bg-green-50 border border-green-200/50 rounded-xl flex items-center gap-2.5 text-green-600 text-[11px] font-semibold" id="auth-success-alert">
                <CheckCircle size={14} className="shrink-0" id="auth-success-icon" />
                <span>{authSuccess}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4" id="auth-form">
              <div className="space-y-1" id="auth-email-group">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5" id="auth-email-label">
                  <Mail size={11} id="auth-mail-icon" /> Indirizzo E-mail
                </label>
                <input
                  type="email"
                  required
                  placeholder="es. mario.rossi@email.it"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-[#E9DFCB] rounded-lg text-xs focus:bg-white focus:border-[#ad8f65] transition-all outline-none text-gray-800 font-semibold"
                  id="auth-email-input"
                />
              </div>

              <div className="space-y-1" id="auth-password-group">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5" id="auth-password-label">
                  <Lock size={11} id="auth-lock-icon" /> Password
                </label>
                <div className="relative" id="auth-password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Almeno 6 caratteri"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-[#E9DFCB] rounded-lg text-xs focus:bg-white focus:border-[#ad8f65] transition-all outline-none text-gray-800 font-semibold pr-8"
                    id="auth-password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    id="auth-eye-button"
                  >
                    {showPassword ? <EyeOff size={14} id="auth-eye-off" /> : <Eye size={14} id="auth-eye-on" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#ad8f65] hover:bg-[#967b56] text-white rounded-lg font-black text-[10px] uppercase tracking-widest transition-all duration-150 shadow-sm mt-2"
                id="auth-submit-btn"
              >
                {authMode === 'register' ? 'Registrati ed Entra' : 'Accedi'}
              </button>
            </form>

            <div className="text-center pt-2.5 border-t border-gray-100" id="auth-mode-switch-wrapper">
              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === 'register' ? 'login' : 'register');
                  setAuthError('');
                }}
                className="text-[10px] text-amber-800 hover:text-amber-900 font-black uppercase tracking-wider transition-colors"
                id="auth-toggle-mode-btn"
              >
                {authMode === 'register' 
                  ? 'Hai già un account? Accedi' 
                  : 'Nuovo utente? Registrati ora'}
              </button>
            </div>
          </motion.div>
        </div>
      ) : isBooked ? (
        // SUCCESS STATE SCREEN
        <div className="max-w-xl mx-auto text-center space-y-8 py-12" id="booking-success-wrapper">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-600 mx-auto shadow-inner"
            id="success-circle"
          >
            <CheckCircle size={48} className="stroke-[2.5]" id="success-icon" />
          </motion.div>
          <div className="space-y-4" id="success-heading">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 uppercase" id="success-title">
              Posto Riservato!
            </h2>
            <p className="text-gray-500 font-medium leading-relaxed max-w-md mx-auto text-sm animate-fade-in" id="success-subtitle">
              Ottimo! La tua prenotazione per il giorno <span className="text-amber-600 font-bold">{selectedDate}</span> è stata completata con successo.
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-6 text-left max-w-sm mx-auto border border-gray-100 space-y-3" id="success-recap-card">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-200/60 pb-2" id="recap-header">
              Dettagli Prenotazione
            </div>
            <div className="text-sm text-gray-600 flex justify-between font-medium" id="recap-user">
              <span>Account:</span>
              <span className="font-bold text-gray-900">{user.email}</span>
            </div>
            <div className="text-sm text-gray-600 flex justify-between font-medium" id="recap-name">
              <span>Intestatario:</span>
              <span className="font-bold text-gray-900">{lastName}</span>
            </div>
            <div className="text-sm text-gray-600 flex justify-between font-medium" id="recap-phone">
              <span>Telefono:</span>
              <span className="font-bold text-gray-900">{phone}</span>
            </div>
            <div className="text-sm text-gray-600 flex justify-between font-medium animate-pulse" id="recap-umbrellas">
              <span>Ombrelloni:</span>
              <span className="font-bold text-amber-600">
                {selectedUmbrellas.map(u => `${u.row}ª Fila #${u.num}`).join(', ')}
              </span>
            </div>
            <div className="text-sm text-gray-600 flex justify-between font-medium pt-2 border-t border-gray-200/60" id="recap-price">
              <span>Totale Pagato:</span>
              <span className="font-black text-gray-900 text-lg">€{calculateTotal()}</span>
            </div>
          </div>
          
          <button
            onClick={handleReset}
            className="px-8 py-3.5 bg-[#ad8f65] text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:bg-[#967b56]"
            id="success-new-booking-btn"
          >
            Prenota un altro ombrellone
          </button>
        </div>
      ) : (
        // STEP 2: BEACH MAP & CHOOSE POSTS SCREEN
        <div className="space-y-6 relative" id="beach-map-wrapper">

          {/* SIMULATION OF UMBRELLA MAP GRID CONTAINER (LA MAPPA) */}
          <div className="bg-white rounded-2xl border border-[#E9DFCB] shadow-md overflow-hidden flex flex-col" id="beach-map-stage">
            
            {/* IL MARE (Sleek minimalist water marker with Left Sea text and Right synthetic legend on the same row) */}
            <div className="relative py-2.5 bg-gradient-to-r from-sky-50 via-cyan-100/30 to-sky-50 border-b border-cyan-200/50" id="sea-layer">
              <div className="relative z-10 flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 gap-2 sm:gap-4" id="sea-layer-content">
                {/* Left side info */}
                <div className="flex flex-col items-center sm:items-start" id="sea-title-group">
                  <span className="text-[8px] tracking-[0.25em] font-extrabold uppercase text-cyan-700" id="sea-zone-label">FRONTE BALNEAZIONE</span>
                  <h4 className="text-[10px] font-black tracking-widest uppercase text-cyan-800/80 flex items-center gap-1" id="sea-title">
                    🌊 MARE ADRIATICO
                  </h4>
                </div>

                {/* Right side synthetic legend */}
                <div className="flex items-center gap-3.5 text-[9px] font-black text-gray-500 uppercase tracking-wider" id="map-legend">
                  <div className="flex items-center gap-1" id="legend-free">
                    <div className="w-2.5 h-2.5 rounded-full border border-gray-300 bg-white" />
                    <span>Libero</span>
                  </div>
                  <div className="flex items-center gap-1" id="legend-occupied">
                    <div className="w-2.5 h-2.5 rounded bg-slate-200" />
                    <span>Occupato</span>
                  </div>
                  <div className="flex items-center gap-1" id="legend-selected">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ad8f65] animate-pulse" />
                    <span className="text-[#ad8f65]">Scelto</span>
                  </div>
                </div>
              </div>
            </div>

            {/* LA SPIAGGIA (The Beach Sand playground with 3 rows) */}
            <div className="bg-[#FAF8F5] p-4 space-y-5 overflow-x-auto relative scrollbar-thin" id="beach-sand-playground">
              
              {/* Row 1: Prima Fila */}
              <div className="space-y-1.5 min-w-[700px]" id="beach-row-1-wrapper">
                <div className="flex justify-between items-center border-b border-[#F1E8D5] pb-0.5" id="row-1-info-bar">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-[8px] font-black uppercase tracking-wider text-amber-800 rounded">
                      {ROW_PRICES[1].name}
                    </span>
                    <span className="text-[9px] text-gray-400 font-bold">€{ROW_PRICES[1].price}/giorno</span>
                  </div>
                  <span className="text-[8px] font-black text-[#ad8f65] uppercase tracking-widest">PRIMA FILA (Posti 1 - 20)</span>
                </div>
                
                <div 
                  className="grid gap-1 text-center select-none"
                  style={{ gridTemplateColumns: 'repeat(20, minmax(0, 1fr))' }}
                  id="row-1-grid"
                >
                  {[...Array(20)].map((_, idx) => {
                    const umbrellaNum = idx + 1;
                    const occupied = isUmbrellaOccupied(1, umbrellaNum);
                    const selected = selectedUmbrellas.some(item => item.row === 1 && item.num === umbrellaNum);
                    return (
                      <div 
                        key={`row-1-${umbrellaNum}`}
                        onClick={() => handleUmbrellaClick(1, umbrellaNum)}
                        className={`aspect-square w-6 h-6 rounded-full border text-[9px] font-black flex items-center justify-center transition-all duration-150 cursor-pointer ${
                          occupied 
                            ? 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed shadow-none'
                            : selected
                            ? 'bg-[#ad8f65] border-[#ad8f65] text-white shadow-sm scale-105'
                            : 'border-[#E9DFCB] hover:border-[#ad8f65] bg-white text-gray-700 hover:text-[#ad8f65] hover:bg-amber-500/5'
                        }`}
                        title={occupied ? `Ombrellone ${umbrellaNum} Occupato` : `Ombrellone ${umbrellaNum} Libero`}
                        id={`row-1-umb-${umbrellaNum}`}
                      >
                        {umbrellaNum}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Row 2: Seconda Fila */}
              <div className="space-y-1.5 min-w-[700px]" id="beach-row-2-wrapper">
                <div className="flex justify-between items-center border-b border-[#F1E8D5] pb-0.5" id="row-2-info-bar">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 bg-blue-500/10 border border-blue-500/20 text-[8px] font-black uppercase tracking-wider text-blue-800 rounded">
                      {ROW_PRICES[2].name}
                    </span>
                    <span className="text-[9px] text-gray-400 font-bold">€{ROW_PRICES[2].price}/giorno</span>
                  </div>
                  <span className="text-[8px] font-black text-[#ad8f65] uppercase tracking-widest">SECONDA FILA (Posti 1 - 20)</span>
                </div>
                
                <div 
                  className="grid gap-1 text-center select-none"
                  style={{ gridTemplateColumns: 'repeat(20, minmax(0, 1fr))' }}
                  id="row-2-grid"
                >
                  {[...Array(20)].map((_, idx) => {
                    const umbrellaNum = idx + 1;
                    const occupied = isUmbrellaOccupied(2, umbrellaNum);
                    const selected = selectedUmbrellas.some(item => item.row === 2 && item.num === umbrellaNum);
                    return (
                      <div 
                        key={`row-2-${umbrellaNum}`}
                        onClick={() => handleUmbrellaClick(2, umbrellaNum)}
                        className={`aspect-square w-6 h-6 rounded-full border text-[9px] font-black flex items-center justify-center transition-all duration-150 cursor-pointer ${
                          occupied 
                            ? 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed shadow-none'
                            : selected
                            ? 'bg-[#ad8f65] border-[#ad8f65] text-white shadow-sm scale-105'
                            : 'border-[#E9DFCB] hover:border-[#ad8f65] bg-white text-gray-700 hover:text-[#ad8f65] hover:bg-amber-500/5'
                        }`}
                        title={occupied ? `Ombrellone ${umbrellaNum} Occupato` : `Ombrellone ${umbrellaNum} Libero`}
                        id={`row-2-umb-${umbrellaNum}`}
                      >
                        {umbrellaNum}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Row 3: Terza Fila */}
              <div className="space-y-1.5 min-w-[700px]" id="beach-row-3-wrapper">
                <div className="flex justify-between items-center border-b border-[#F1E8D5] pb-0.5" id="row-3-info-bar">
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 bg-slate-500/10 border border-slate-500/20 text-[8px] font-black uppercase tracking-wider text-slate-800 rounded">
                      {ROW_PRICES[3].name}
                    </span>
                    <span className="text-[9px] text-gray-400 font-bold">€{ROW_PRICES[3].price}/giorno</span>
                  </div>
                  <span className="text-[8px] font-black text-[#ad8f65] uppercase tracking-widest">TERZA FILA (Posti 1 - 20)</span>
                </div>
                
                <div 
                  className="grid gap-1 text-center select-none"
                  style={{ gridTemplateColumns: 'repeat(20, minmax(0, 1fr))' }}
                  id="row-3-grid"
                >
                  {[...Array(20)].map((_, idx) => {
                    const umbrellaNum = idx + 1;
                    const occupied = isUmbrellaOccupied(3, umbrellaNum);
                    const selected = selectedUmbrellas.some(item => item.row === 3 && item.num === umbrellaNum);
                    return (
                      <div 
                        key={`row-3-${umbrellaNum}`}
                        onClick={() => handleUmbrellaClick(3, umbrellaNum)}
                        className={`aspect-square w-6 h-6 rounded-full border text-[9px] font-black flex items-center justify-center transition-all duration-150 cursor-pointer ${
                          occupied 
                            ? 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed shadow-none'
                            : selected
                            ? 'bg-[#ad8f65] border-[#ad8f65] text-white shadow-sm scale-105'
                            : 'border-[#E9DFCB] hover:border-[#ad8f65] bg-white text-gray-700 hover:text-[#ad8f65] hover:bg-amber-500/5'
                        }`}
                        title={occupied ? `Ombrellone ${umbrellaNum} Occupato` : `Ombrellone ${umbrellaNum} Libero`}
                        id={`row-3-umb-${umbrellaNum}`}
                      >
                        {umbrellaNum}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* CHECKOUT SECTION AND BOOKING FORM SUMMARY */}
          <div className="grid lg:grid-cols-3 gap-6 items-start" id="checkout-grid">
            <div className="lg:col-span-2" id="checkout-form-wrapper">
              <form onSubmit={handleBookingConfirm} className="bg-white rounded-2xl border border-[#E9DFCB] p-5 sm:p-6 shadow-sm space-y-4" id="confirm-form">
                <h3 className="text-xs font-black text-gray-900 tracking-wider uppercase border-b border-[#F1E8D5] pb-2" id="form-title">
                  Inserisci i tuoi Dettagli
                </h3>
                <div className="grid md:grid-cols-2 gap-4" id="form-inputs">
                  <div className="space-y-1" id="form-lastname-group">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5" id="form-lastname-label">
                      <User size={11} className="text-[#ad8f65]" /> Cognome Intestatario
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="es. Rossi"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-[#E9DFCB] rounded-lg text-xs font-semibold outline-none focus:bg-white focus:border-[#ad8f65] transition-all text-gray-800"
                      id="form-lastname-input"
                    />
                  </div>
                  <div className="space-y-1" id="form-phone-group">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5" id="form-phone-label">
                      <Phone size={11} className="text-[#ad8f65]" /> Telefono Cellulare
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="es. +39 333 1234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-[#E9DFCB] rounded-lg text-xs font-semibold outline-none focus:bg-white focus:border-[#ad8f65] transition-all text-gray-800"
                      id="form-phone-input"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || selectedUmbrellas.length === 0}
                  className={`w-full py-3 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all duration-150 flex items-center justify-center gap-2 text-white ${
                    selectedUmbrellas.length === 0 
                      ? 'bg-gray-300 cursor-not-allowed shadow-none'
                      : 'bg-[#ad8f65] hover:bg-[#967b56] shadow-sm hover:scale-[1.01]'
                  }`}
                  id="form-submit-btn"
                >
                  {isSubmitting ? 'Salvataggio...' : 'Conferma Prenotazione Spiaggia'}
                </button>
              </form>
            </div>

            {/* LIVE PRICE SUMMARY RECAP CARD */}
            <div className="bg-white rounded-2xl border border-[#E9DFCB] p-5 sm:p-6 shadow-sm space-y-4" id="summary-sidebar">
              <h3 className="text-xs font-black text-gray-900 tracking-wider uppercase border-b border-[#F1E8D5] pb-2" id="summary-sidebar-title">
                Riepilogo Selezione
              </h3>
              
              {selectedUmbrellas.length === 0 ? (
                <div className="py-6 text-center text-gray-400 space-y-2" id="summary-empty-state">
                  <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                    <UmbrellaIcon size={16} />
                  </div>
                  <p className="text-[10px] font-bold">Nessun ombrellone scelto</p>
                  <p className="text-[9px]">Fai clic sui cerchietti della mappa per selezionare le posizioni.</p>
                </div>
              ) : (
                <div className="space-y-4" id="summary-selections-list">
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1" id="summary-scroll-area">
                    {selectedUmbrellas.map((item, idx) => (
                      <div key={idx} className="flex flex-col text-[10px] bg-amber-50/40 border border-amber-500/10 rounded-lg p-2.5 space-y-1.5 cursor-pointer hover:bg-amber-50/60 transition-colors" onClick={() => handleUmbrellaClick(item.row, item.num)} id={`summary-item-${idx}`}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1.5">
                            <UmbrellaIcon size={12} />
                            <span className="font-bold text-gray-700">Posto #{item.num}</span>
                          </div>
                          <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded text-[8px] font-black uppercase">
                            {item.row}ª Fila
                          </span>
                          <span className="font-bold text-gray-900">€{ROW_PRICES[item.row as keyof typeof ROW_PRICES]?.price}</span>
                        </div>
                        {/* Selected accessories per-umbrella details */}
                        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[9px] text-gray-500 font-semibold border-t border-amber-500/5 pt-1.5">
                          <div>• Adulti: <span className="font-bold text-gray-700">{item.adults}</span></div>
                          <div>• Bambini: <span className="font-bold text-gray-700">{item.children}</span></div>
                          <div>• Sedie: <span className="font-bold text-gray-700">{item.chairs}</span></div>
                          <div>• Lettini: <span className="font-bold text-gray-700">{item.sunbeds}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#F1E8D5] pt-3 space-y-1.5" id="summary-total-details">
                    <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase">
                      <span>Giorno:</span>
                      <span className="text-gray-700">{selectedDate}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase">
                      <span>Totale Adulti:</span>
                      <span className="text-gray-700">{totalAdultsSelected}</span>
                    </div>
                    {totalChildrenSelected > 0 && (
                      <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase">
                        <span>Totale Bambini:</span>
                        <span className="text-gray-700">{totalChildrenSelected}</span>
                      </div>
                    )}
                    {totalChairsSelected > 0 && (
                      <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase">
                        <span>Totale Sedie:</span>
                        <span className="text-gray-700">{totalChairsSelected}</span>
                      </div>
                    )}
                    {totalSunbedsSelected > 0 && (
                      <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase">
                        <span>Totale Lettini:</span>
                        <span className="text-gray-700">{totalSunbedsSelected}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase border-t border-dashed border-gray-100 pt-1.5">
                      <span>Totale Ombrelloni:</span>
                      <span className="text-gray-700">{selectedUmbrellas.length}</span>
                    </div>
                    <div className="flex justify-between items-end pt-3 border-t border-gray-100" id="summary-final-total">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Prezzo Totale:</span>
                      <span className="text-sm font-black text-[#ad8f65]">€{calculateTotal()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SELECTION CONFIGURATION MODAL */}
      <AnimatePresence>
        {isModalOpen && modalTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" id="booking-modal-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.15 }}
              className="bg-white border border-[#E9DFCB] w-full max-w-md rounded-2xl shadow-xl overflow-hidden"
              id="booking-modal-container"
            >
              {/* Modal Header */}
              <div className="bg-[#FAF8F5] px-5 py-4 border-b border-[#F1E8D5] flex justify-between items-center" id="modal-header">
                <div>
                  <span className="text-[8px] font-black tracking-widest text-[#ad8f65] uppercase">CONFIGURAZIONE POSTAZIONE</span>
                  <h3 className="text-xs font-black text-gray-950 uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                    <UmbrellaIcon size={13} /> Ombrellone #{modalTarget.num} ({modalTarget.row}ª Fila)
                  </h3>
                </div>
                <span className="text-[10px] font-black text-[#ad8f65] uppercase bg-amber-50 border border-[#E9DFCB]/50 px-2 py-0.5 rounded">
                  €{ROW_PRICES[modalTarget.row as keyof typeof ROW_PRICES]?.price}
                </span>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-4" id="modal-body">
                {/* Selected Day Info */}
                <div className="bg-amber-50/20 border border-[#E9DFCB]/40 rounded-xl p-3 flex justify-between items-center text-xs text-gray-600 font-semibold animate-pulse" id="modal-date-info">
                  <span className="flex items-center gap-1.5"><Calendar size={13} className="text-[#ad8f65]" /> Data Selezionata:</span>
                  <span className="text-gray-900 font-bold">{selectedDate}</span>
                </div>

                <div className="space-y-3.5" id="modal-selectors">
                  {/* Adulti */}
                  <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-lg border border-gray-100/60" id="modal-adults-field">
                    <div className="space-y-0.5">
                      <div className="text-[10px] font-black uppercase text-gray-800 tracking-wider">Numero Adulti</div>
                      <div className="text-[9px] text-gray-400 font-medium">Max {CONFIG.maxAdults} persone per ombrellone</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setModalAdults(prev => Math.max(1, prev - 1))}
                        className="w-7 h-7 bg-white border border-[#E9DFCB] rounded-full flex items-center justify-center text-xs font-bold hover:bg-gray-100 active:bg-gray-200 transition-colors shadow-sm text-gray-700"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-gray-800">{modalAdults}</span>
                      <button
                        type="button"
                        onClick={() => setModalAdults(prev => Math.min(CONFIG.maxAdults, prev + 1))}
                        className="w-7 h-7 bg-white border border-[#E9DFCB] rounded-full flex items-center justify-center text-xs font-bold hover:bg-gray-100 active:bg-gray-200 transition-colors shadow-sm text-gray-700"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Bambini */}
                  <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-lg border border-gray-100/60" id="modal-children-field">
                    <div className="space-y-0.5">
                      <div className="text-[10px] font-black uppercase text-gray-800 tracking-wider">Numero Bambini</div>
                      <div className="text-[9px] text-gray-400 font-medium">Max {CONFIG.maxChildren} bambini per ombrellone</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setModalChildren(prev => Math.max(0, prev - 1))}
                        className="w-7 h-7 bg-white border border-[#E9DFCB] rounded-full flex items-center justify-center text-xs font-bold hover:bg-gray-100 active:bg-gray-200 transition-colors shadow-sm text-gray-700"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-gray-800">{modalChildren}</span>
                      <button
                        type="button"
                        onClick={() => setModalChildren(prev => Math.min(CONFIG.maxChildren, prev + 1))}
                        className="w-7 h-7 bg-white border border-[#E9DFCB] rounded-full flex items-center justify-center text-xs font-bold hover:bg-gray-100 active:bg-gray-200 transition-colors shadow-sm text-gray-700"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Sedie */}
                  <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-lg border border-gray-100/60" id="modal-chairs-field">
                    <div className="space-y-0.5">
                      <div className="text-[10px] font-black uppercase text-gray-800 tracking-wider">Numero Sedie</div>
                      <div className="text-[9px] text-gray-400 font-medium">Max {CONFIG.maxChairs} pezzi per ombrellone</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setModalChairs(prev => Math.max(0, prev - 1))}
                        className="w-7 h-7 bg-white border border-[#E9DFCB] rounded-full flex items-center justify-center text-xs font-bold hover:bg-gray-100 active:bg-gray-200 transition-colors shadow-sm text-gray-700"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-gray-800">{modalChairs}</span>
                      <button
                        type="button"
                        onClick={() => setModalChairs(prev => Math.min(CONFIG.maxChairs, prev + 1))}
                        className="w-7 h-7 bg-white border border-[#E9DFCB] rounded-full flex items-center justify-center text-xs font-bold hover:bg-gray-100 active:bg-gray-200 transition-colors shadow-sm text-gray-700"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Lettini */}
                  <div className="flex justify-between items-center bg-gray-50/50 p-3 rounded-lg border border-gray-100/60" id="modal-sunbeds-field">
                    <div className="space-y-0.5">
                      <div className="text-[10px] font-black uppercase text-gray-800 tracking-wider">Numero Lettini</div>
                      <div className="text-[9px] text-gray-400 font-medium">Max {CONFIG.maxSunbeds} pezzi per ombrellone</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setModalSunbeds(prev => Math.max(0, prev - 1))}
                        className="w-7 h-7 bg-white border border-[#E9DFCB] rounded-full flex items-center justify-center text-xs font-bold hover:bg-gray-100 active:bg-gray-200 transition-colors shadow-sm text-gray-700"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-gray-800">{modalSunbeds}</span>
                      <button
                        type="button"
                        onClick={() => setModalSunbeds(prev => Math.min(CONFIG.maxSunbeds, prev + 1))}
                        className="w-7 h-7 bg-white border border-[#E9DFCB] rounded-full flex items-center justify-center text-xs font-bold hover:bg-gray-100 active:bg-gray-200 transition-colors shadow-sm text-gray-700"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="bg-[#FAF8F5] px-5 py-4 border-t border-[#F1E8D5] flex gap-2 justify-end" id="modal-footer">
                <button
                  type="button"
                  onClick={handleModalCancel}
                  className="px-4 py-2 text-[10px] font-black uppercase tracking-wider text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Annulla
                </button>
                {isEditing && (
                  <button
                    type="button"
                    onClick={handleModalRemove}
                    className="px-4 py-2 text-[10px] font-black uppercase tracking-wider text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Rimuovi
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleModalConfirm}
                  className="px-5 py-2 text-[10px] font-black uppercase tracking-wider text-white bg-[#ad8f65] hover:bg-[#967b56] rounded-lg shadow-sm transition-colors"
                >
                  {isEditing ? 'Salva' : 'Conferma'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
}
