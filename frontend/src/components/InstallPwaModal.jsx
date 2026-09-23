import React from 'react';
import { X, Download, Smartphone, Monitor, Share, PlusSquare, CheckCircle } from 'lucide-react';
import { usePwa } from '../context/PwaContext';

const InstallPwaModal = () => {
  const { showInstallGuide, setShowInstallGuide, isInstalled } = usePwa();

  if (!showInstallGuide) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-jaggery-100 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-brand-700 to-jaggery-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-2xl shadow-inner">
              🥜
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold">Install Kadalai Mittai</h3>
              <p className="text-xs text-cream-200">Use like a native mobile or desktop app</p>
            </div>
          </div>
          <button
            onClick={() => setShowInstallGuide(false)}
            className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-jaggery-900 text-xs">
          {isInstalled ? (
            <div className="text-center py-4 space-y-2">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="font-serif text-base font-bold text-jaggery-900">App Already Installed!</h4>
              <p className="text-jaggery-600">
                You can launch Kadalai Mittai directly from your home screen or application launcher.
              </p>
            </div>
          ) : (
            <>
              <div className="p-3.5 rounded-2xl bg-brand-50 border border-brand-200 flex items-center gap-3">
                <Download className="w-6 h-6 text-brand-700 shrink-0" />
                <p className="text-brand-900 font-medium leading-relaxed">
                  Install our lightweight Web App for instant 1-tap access, offline browsing, and faster checkout!
                </p>
              </div>

              {/* Instructions based on platform */}
              <div className="space-y-4 pt-1">
                {/* iPhone / iPad */}
                <div className="p-3.5 rounded-2xl bg-cream-50 border border-jaggery-100 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-jaggery-900">
                    <Smartphone className="w-4 h-4 text-brand-600" />
                    <span>On iPhone & iPad (Safari):</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-jaggery-700 text-[11px] pl-1">
                    <li>Tap the <Share className="w-3.5 h-3.5 inline mx-1 text-blue-600" /> <strong>Share</strong> button at the bottom of Safari.</li>
                    <li>Scroll down and tap <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-brand-700" /> <strong>"Add to Home Screen"</strong>.</li>
                    <li>Tap <strong>"Add"</strong> in the top-right corner. Done!</li>
                  </ol>
                </div>

                {/* Android / Chrome */}
                <div className="p-3.5 rounded-2xl bg-cream-50 border border-jaggery-100 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-jaggery-900">
                    <Monitor className="w-4 h-4 text-brand-600" />
                    <span>On Android or Desktop (Chrome / Edge / Brave):</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-jaggery-700 text-[11px] pl-1">
                    <li>Click the <strong>Install App</strong> icon <Download className="w-3.5 h-3.5 inline mx-1 text-emerald-600" /> in the browser address bar.</li>
                    <li>Or click the three dots menu (⋮) and tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                  </ol>
                </div>
              </div>
            </>
          )}

          <button
            onClick={() => setShowInstallGuide(false)}
            className="w-full py-3 rounded-2xl bg-jaggery-800 hover:bg-jaggery-900 text-white font-bold text-xs shadow-md transition-all"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPwaModal;
