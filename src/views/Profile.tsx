import React, { useState, useEffect } from 'react';
import { 
  User, LogOut, Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle, 
  CheckCircle, Calendar, ShieldCheck, Palmtree, Award, ArrowRight, Heart
} from 'lucide-react';
import { playClickSound } from '../lib/audio';

export function Profile() {
  // Authentication Simulated State (matching the key 'lido_simulated_user' from Booking.tsx)
  const [user, setUser] = useState<{ email: string } | null>(() => {
    const saved = localStorage.getItem('lido_simulated_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Past Bookings State loaded dynamically from localStorage
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    // Load bookings saved in LocalStorage (key matching Booking.tsx fallback)
    const savedBookings = localStorage.getItem('local_bookings');
    if (savedBookings) {
      try {
        const parsed = JSON.parse(savedBookings);
        // Filter only bookings for the currently signed-in user email
        if (user) {
          const userBookings = parsed.filter((b: any) => b.userEmail === user.email);
          setBookings(userBookings);
        } else {
          setBookings([]);
        }
      } catch (err) {
        console.error("Error reading bookings", err);
      }
    }
  }, [user]);

  // Handle Form Submission
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
      setAuthSuccess('Registrazione avvenuta con successo! Benvenuto.');
    } else {
      const existingUser = { email };
      localStorage.setItem('lido_simulated_user', JSON.stringify(existingUser));
      setUser(existingUser);
      setAuthSuccess('Accesso completato!');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('lido_simulated_user');
    setUser(null);
    setBookings([]);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-8 pb-20 md:py-12 font-montserrat space-y-6 md:space-y-8 min-h-[75vh] flex flex-col justify-center">
      
      {/* Small top section indicator */}
      <div className="text-center">
        <span className="text-xs font-black tracking-[0.25em] text-[#ad8f65] uppercase">
          PROFILO
        </span>
      </div>
      
      {/* Title Header (Only visible when logged in) */}
      {user && (
        <section className="text-center space-y-2">
          <h2 className="text-2xl md:text-5xl font-black uppercase tracking-wider text-gray-900">
            Area Riservata
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto rounded-full" />
          <p className="text-xs md:text-sm font-semibold text-amber-900/60 uppercase tracking-widest">
            Benvenuto, {user.email.split('@')[0]}
          </p>
        </section>
      )}

      {/* Auth Screen (When user is not signed in) */}
      {!user ? (
        <div className="w-full flex items-center justify-center py-2">
          <div className="w-full max-w-md bg-[#FAF6EE] rounded-[2rem] border-2 border-[#E9DFCB] p-6 sm:p-8 shadow-xl space-y-6">
            
            {authError && (
              <div className="p-3.5 bg-red-100/70 border border-red-200 rounded-xl flex items-center gap-3 text-red-700 text-xs font-bold">
                <AlertCircle size={16} className="shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="p-3.5 bg-green-100/70 border border-green-200 rounded-xl flex items-center gap-3 text-green-700 text-xs font-bold">
                <CheckCircle size={16} className="shrink-0" />
                <span>{authSuccess}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-amber-900/60 uppercase tracking-widest flex items-center gap-2">
                  <Mail size={12} /> Indirizzo E-mail
                </label>
                <input
                  type="email"
                  required
                  placeholder="es. nome@esempio.it"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white border-2 border-[#E5DAC4] rounded-xl text-sm focus:ring-4 focus:ring-amber-500/10 focus:border-amber-600 outline-none transition-all text-gray-800 font-semibold"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-amber-900/60 uppercase tracking-widest flex items-center gap-2">
                  <Lock size={12} /> Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Almeno 6 caratteri"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white border-2 border-[#E5DAC4] rounded-xl text-sm focus:ring-4 focus:ring-amber-500/10 focus:border-amber-600 outline-none transition-all text-gray-800 font-semibold pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setShowPassword(!showPassword);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-900/40 hover:text-amber-900 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit Button - 3D brown-beige tone */}
              <button
                type="submit"
                onClick={playClickSound}
                className="w-full py-4 bg-[#ad8f65] border-b-[4px] border-[#81653e] hover:bg-[#a18155] active:translate-y-[4px] active:border-b-0 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-amber-900/10 mt-2 transform transition-all duration-75"
              >
                {authMode === 'register' ? 'Registrati Ora' : 'Accedi'}
              </button>
            </form>

            {/* Selector Option switch */}
            <div className="text-center pt-4 border-t-2 border-[#F1E8D5]">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setAuthMode(authMode === 'register' ? 'login' : 'register');
                  setAuthError('');
                  setAuthSuccess('');
                }}
                className="text-xs text-amber-800 hover:text-amber-900 font-black tracking-wide transition-colors uppercase"
              >
                {authMode === 'register' 
                  ? 'Sei già registrato? Accedi qui' 
                  : 'Non hai un account? Registrati ora'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Profile Dashboard Screen (When user is logged in)
        <div className="space-y-6 md:space-y-8">
          
          {/* Main User Card (Sand/Beige/Brown Tones) */}
          <div className="bg-[#FAF6EE] rounded-3xl md:rounded-[2.5rem] border-2 border-[#E9DFCB] p-5 sm:p-8 md:p-10 shadow-xl">
            <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
                <div className="space-y-1.5">
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 uppercase tracking-tight">
                    {user.email.split('@')[0]}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-amber-900/60 flex items-center gap-2 justify-center sm:justify-start">
                    <Mail size={13} /> {user.email}
                  </p>
                </div>
              </div>

              {/* Logout Button styled in 3D Brown Tone */}
              <button
                onClick={() => {
                  playClickSound();
                  handleLogout();
                }}
                className="w-full md:w-auto justify-center px-6 py-3.5 bg-red-800 border-b-[4px] border-red-950 hover:bg-red-700 active:translate-y-[4px] active:border-b-0 text-white rounded-xl font-bold text-xs uppercase tracking-widest shadow-md flex items-center gap-2 transform transition-all duration-75 shrink-0"
              >
                <LogOut size={14} /> Esci dall'account
              </button>
            </div>
          </div>

          {/* User Booking History recap */}
          <div className="bg-white rounded-3xl md:rounded-[2rem] border border-[#E9DFCB] p-5 sm:p-8 shadow-md space-y-6">
            <div className="flex justify-between items-center border-b border-[#F1E8D5] pb-4">
              <h4 className="text-base sm:text-lg font-black uppercase tracking-wider text-gray-900 flex items-center gap-2">
                <Palmtree size={20} className="text-[#ad8f65]" /> Le tue prenotazioni
              </h4>
              <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full">
                {bookings.length} Attive
              </span>
            </div>

            {bookings.length === 0 ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center text-amber-400 mx-auto border border-amber-100">
                  <Palmtree size={28} />
                </div>
                <p className="text-xs sm:text-sm font-bold text-gray-400">Nessuna prenotazione attiva trovata per questo account.</p>
                <p className="text-[11px] text-gray-400 max-w-xs mx-auto">Visita la pagina prenotazioni per scegliere la tua postazione in prima fila.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {bookings.map((booking, idx) => (
                  <div key={idx} className="bg-[#FAF6EE] border border-[#E9DFCB] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow">
                    <div className="space-y-1.5 w-full md:w-auto">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-[#ad8f65] text-white text-[9px] font-black uppercase tracking-wider rounded">
                          Codice #{1000 + idx}
                        </span>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                          <Calendar size={11} className="text-amber-600" /> {booking.date}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-amber-900">
                        Ombrelloni scelti:{' '}
                        <span className="font-extrabold text-gray-900">
                          {booking.umbrellas.map((u: any) => `${u.row}ª Fila #${u.num}`).join(', ')}
                        </span>
                      </p>
                      <p className="text-[11px] font-semibold text-gray-500">
                        Intestato a: <strong className="text-gray-700">{booking.lastName}</strong> ({booking.phone})
                      </p>
                    </div>

                    <div className="flex md:flex-col items-center md:items-end justify-between md:justify-end w-full md:w-auto pt-3 md:pt-0 border-t border-[#F1E8D5] md:border-t-0 shrink-0">
                      <span className="text-[9px] font-black uppercase tracking-widest text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                        ✓ Confermato
                      </span>
                      <span className="text-lg sm:text-xl font-black text-gray-900 md:mt-1.5">
                        €{booking.totalPrice}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
