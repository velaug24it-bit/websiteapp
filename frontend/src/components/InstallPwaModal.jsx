import React, { useState, useEffect } from 'react';
import {
  X,
  Download,
  Smartphone,
  Monitor,
  Share,
  PlusSquare,
  CheckCircle,
  Copy,
  Check,
  AlertTriangle,
  Sparkles,
  Zap,
} from 'lucide-react';
import { usePwa } from '../context/PwaContext';

const InstallPwaModal = () => {
  const {
    showInstallGuide,
    setShowInstallGuide,
    isInstalled,
    promptInstall,
    isIOS,
    isAndroid,
    isInAppBrowser,
  } = usePwa();

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('android');

  // Auto-select tab matching user's platform
  useEffect(() => {
    if (isIOS) {
      setActiveTab('ios');
    } else if (isAndroid) {
      setActiveTab('android');
    } else {
      setActiveTab('desktop');
    }
  }, [isIOS, isAndroid]);

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  if (!showInstallGuide) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-fadeIn"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-jaggery-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-brand-700 via-brand-800 to-jaggery-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl shadow-inner shrink-0">
              🥜
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold leading-tight">Install Velan Kadalai Mittai</h3>
              <p className="text-xs text-cream-200 mt-0.5">Fast 1-tap mobile & desktop app</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowInstallGuide(false)}
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 space-y-4 text-jaggery-900 text-xs overflow-y-auto">
          {isInstalled ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle className="w-14 h-14 text-emerald-600 mx-auto animate-bounce" />
              <h4 className="font-serif text-lg font-bold text-jaggery-900">App Already Installed!</h4>
              <p className="text-jaggery-600 text-xs max-w-xs mx-auto">
                Velan Kadalai Mittai is already installed on your device. You can open it directly from your home screen or application launcher!
              </p>
              <button
                type="button"
                onClick={() => setShowInstallGuide(false)}
                className="mt-2 px-6 py-2.5 rounded-xl bg-jaggery-800 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {/* In-App Browser Warning (e.g. opened inside WhatsApp / Instagram) */}
              {isInAppBrowser && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-900 text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Viewing inside WhatsApp / Instagram?</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    In-app browsers do not allow installing apps. To install Velan Kadalai Mittai onto your phone:
                  </p>
                  <ol className="list-decimal list-inside text-[11px] text-amber-900 font-medium space-y-1 pl-1">
                    <li>Tap the <strong>three dots (⋮)</strong> or <strong>Share</strong> icon in the top right.</li>
                    <li>Select <strong>"Open in Chrome"</strong> (or <strong>"Open in Safari"</strong>).</li>
                  </ol>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="w-full mt-1.5 py-2 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Link Copied! Paste in Chrome' : 'Copy Website Link'}</span>
                  </button>
                </div>
              )}

              {/* Direct Install Button (Android / Chrome / Edge) */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-brand-50 to-orange-50 border border-brand-200 flex flex-col gap-2.5">
                <div className="flex items-center gap-2 text-brand-950 font-bold text-xs">
                  <Zap className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>1-Tap Instant Installation</span>
                </div>
                <p className="text-[11px] text-brand-800 leading-relaxed">
                  Install our lightweight Web App for faster browsing, offline access, and instant order tracking!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    promptInstall();
                  }}
                  id="modal-direct-install-btn"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-600 via-brand-700 to-jaggery-800 hover:from-brand-700 hover:to-jaggery-900 active:scale-98 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Tap to Download & Install App</span>
                </button>
              </div>

              {/* Platform Selector Tabs */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between border-b border-jaggery-100 pb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-jaggery-500">
                    Step-by-Step Guide
                  </span>
                  <div className="flex items-center gap-1 bg-cream-200 p-0.5 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setActiveTab('android')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        activeTab === 'android'
                          ? 'bg-brand-600 text-white shadow-xs'
                          : 'text-jaggery-700 hover:text-jaggery-900'
                      }`}
                    >
                      Android
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('ios')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        activeTab === 'ios'
                          ? 'bg-brand-600 text-white shadow-xs'
                          : 'text-jaggery-700 hover:text-jaggery-900'
                      }`}
                    >
                      iPhone (iOS)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('desktop')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                        activeTab === 'desktop'
                          ? 'bg-brand-600 text-white shadow-xs'
                          : 'text-jaggery-700 hover:text-jaggery-900'
                      }`}
                    >
                      Laptop / PC
                    </button>
                  </div>
                </div>

                {/* Tab 1: Android Phone Guide */}
                {activeTab === 'android' && (
                  <div className="p-3.5 rounded-2xl bg-cream-50 border border-jaggery-100 space-y-2.5 animate-fadeIn">
                    <div className="flex items-center gap-2 font-bold text-jaggery-900 text-xs">
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                      <span>On Android Phone (Google Chrome):</span>
                    </div>
                    <div className="space-y-2 text-[11px] text-jaggery-700">
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                          1
                        </span>
                        <p>
                          Tap the <strong>three vertical dots (⋮)</strong> at the top right corner of Chrome.
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                          2
                        </span>
                        <p>
                          Tap <strong className="text-jaggery-900">"Install app"</strong> or{' '}
                          <strong className="text-jaggery-900">"Add to Home screen"</strong> in the menu.
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                          3
                        </span>
                        <p>
                          Tap <strong>"Install"</strong> in the popup. The app will be added directly to your phone's home screen and app drawer!
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: iPhone / iPad Guide */}
                {activeTab === 'ios' && (
                  <div className="p-3.5 rounded-2xl bg-cream-50 border border-jaggery-100 space-y-2.5 animate-fadeIn">
                    <div className="flex items-center gap-2 font-bold text-jaggery-900 text-xs">
                      <Smartphone className="w-4 h-4 text-blue-600" />
                      <span>On iPhone / iPad (Safari):</span>
                    </div>
                    <div className="space-y-2 text-[11px] text-jaggery-700">
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                          1
                        </span>
                        <p>
                          Tap the <Share className="w-3.5 h-3.5 inline mx-1 text-blue-600" />{' '}
                          <strong>Share button</strong> at the bottom bar of Safari.
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                          2
                        </span>
                        <p>
                          Scroll down the share sheet and tap{' '}
                          <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-brand-700" />{' '}
                          <strong>"Add to Home Screen"</strong>.
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                          3
                        </span>
                        <p>
                          Tap <strong>"Add"</strong> in the top-right corner. The app icon will appear immediately on your home screen!
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 3: Laptop / PC Guide */}
                {activeTab === 'desktop' && (
                  <div className="p-3.5 rounded-2xl bg-cream-50 border border-jaggery-100 space-y-2.5 animate-fadeIn">
                    <div className="flex items-center gap-2 font-bold text-jaggery-900 text-xs">
                      <Monitor className="w-4 h-4 text-purple-600" />
                      <span>On Laptop & Desktop (Chrome / Edge / Brave):</span>
                    </div>
                    <div className="space-y-2 text-[11px] text-jaggery-700">
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                          1
                        </span>
                        <p>
                          Click the <strong>Install icon</strong> <Download className="w-3.5 h-3.5 inline mx-0.5 text-emerald-600" /> inside the browser URL address bar.
                        </p>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center shrink-0 text-[10px]">
                          2
                        </span>
                        <p>
                          Or click the <strong>three dots menu (⋮)</strong> ➔ tap <strong>"Install Velan Kadalai Mittai"</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* App Perks Badge */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="p-2 rounded-xl bg-cream-200/60 border border-jaggery-100">
                  <p className="font-bold text-jaggery-900 text-[10px]">⚡ Superfast</p>
                  <p className="text-[9px] text-jaggery-600">Loads in &lt;1s</p>
                </div>
                <div className="p-2 rounded-xl bg-cream-200/60 border border-jaggery-100">
                  <p className="font-bold text-jaggery-900 text-[10px]">💾 Tiny Size</p>
                  <p className="text-[9px] text-jaggery-600">&lt;2MB storage</p>
                </div>
                <div className="p-2 rounded-xl bg-cream-200/60 border border-jaggery-100">
                  <p className="font-bold text-jaggery-900 text-[10px]">📶 Offline</p>
                  <p className="text-[9px] text-jaggery-600">Browse anytime</p>
                </div>
              </div>
            </>
          )}

          <button
            type="button"
            onClick={() => setShowInstallGuide(false)}
            className="w-full py-2.5 rounded-2xl bg-jaggery-800 hover:bg-jaggery-900 active:scale-98 text-white font-bold text-xs shadow-md transition-all mt-2"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPwaModal;
