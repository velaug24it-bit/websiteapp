import React, { useState, useEffect } from 'react';
import { Download, X, Sparkles, Smartphone } from 'lucide-react';
import { usePwa } from '../context/PwaContext';

const MobileInstallBanner = () => {
  const { isInstalled, promptInstall, isMobile } = usePwa();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem('pwa_mobile_banner_dismissed') === 'true') {
        setDismissed(true);
      }
    } catch {}
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem('pwa_mobile_banner_dismissed', 'true');
    } catch {}
  };

  // Only show on mobile devices if not installed and not dismissed
  if (!isMobile || isInstalled || dismissed) return null;

  return (
    <aside
      aria-label="Install Mobile App"
      className="fixed bottom-4 left-3 right-3 z-40 md:hidden bg-gradient-to-r from-jaggery-900 via-brand-900 to-jaggery-900 text-white p-3.5 rounded-2xl shadow-2xl border border-brand-400/40 flex items-center justify-between gap-3 animate-fadeIn"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-400/30 flex items-center justify-center text-xl shrink-0 shadow-inner">
          🥜
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xs truncate text-white">Velan Kadalai Mittai</span>
            <span className="text-[9px] bg-brand-500 text-white px-1.5 py-0.2 rounded-md font-bold uppercase tracking-wider shrink-0">
              App
            </span>
          </div>
          <p className="text-[11px] text-cream-200 truncate mt-0.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300 shrink-0" />
            <span>Install on phone for 1-tap access</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={promptInstall}
          id="mobile-sticky-install-btn"
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 active:scale-95 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 transition-all"
        >
          <Download className="w-3.5 h-3.5 animate-bounce" />
          <span>Install</span>
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="p-1.5 rounded-xl text-cream-300 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close mobile app banner"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};

export default MobileInstallBanner;
