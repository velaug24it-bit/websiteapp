import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const PwaContext = createContext();

export const PwaProvider = ({ children }) => {
  const [deferredPrompt, setDeferredPrompt] = useState(() => window.__pwaPrompt || null);
  const [isInstallable, setIsInstallable] = useState(() => Boolean(window.__pwaPrompt));
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  // Device & Browser environment detection
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (typeof navigator !== 'undefined' && navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(ua);
  const isInAppBrowser = /(FBAN|FBAV|Instagram|WhatsApp|Line|Twitter|Snapchat|Telegram|TikTok)/i.test(ua);
  const isMobile = isIOS || isAndroid || /Mobi|Android/i.test(ua);

  useEffect(() => {
    // 1. Check if already installed or running in standalone mode
    const checkIsInstalled = () => {
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true ||
        document.referrer.includes('android-app://');
      if (isStandalone) {
        setIsInstalled(true);
      }
    };
    checkIsInstalled();

    // 2. Read any early-captured prompt from window
    if (window.__pwaPrompt) {
      setDeferredPrompt(window.__pwaPrompt);
      setIsInstallable(true);
    }

    // 3. Failsafe Service Worker registration
    if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'test') {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((reg) => {
          console.log('[PWA] SW registered:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] SW registration notice:', err);
        });
    }

    // 4. Listen for prompt events
    const handlePromptEvent = (e) => {
      const promptEvent = e.detail || e;
      if (e.preventDefault && typeof e.preventDefault === 'function') {
        e.preventDefault();
      }
      window.__pwaPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
      setIsInstallable(true);
      console.log('[PWA] Prompt is available to install');
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      window.__pwaPrompt = null;
      setShowInstallGuide(false);
      console.log('[PWA] App successfully installed on device');
    };

    window.addEventListener('beforeinstallprompt', handlePromptEvent);
    window.addEventListener('pwa-prompt-ready', handlePromptEvent);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('pwa-installed', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handlePromptEvent);
      window.removeEventListener('pwa-prompt-ready', handlePromptEvent);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('pwa-installed', handleAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    const activePrompt = deferredPrompt || window.__pwaPrompt;

    if (activePrompt) {
      try {
        // Trigger browser native install prompt synchronously in user gesture
        const promptResult = activePrompt.prompt();
        if (promptResult && typeof promptResult.then === 'function') {
          await promptResult;
        }
        const choice = await activePrompt.userChoice;
        if (choice && choice.outcome === 'accepted') {
          setIsInstalled(true);
          setIsInstallable(false);
        }
        setDeferredPrompt(null);
        window.__pwaPrompt = null;
        return;
      } catch (err) {
        console.warn('[PWA] Prompt error, falling back to guide modal:', err);
      }
    }

    // Fallback: Show device-specific install guide modal
    setShowInstallGuide(true);
  }, [deferredPrompt]);

  return (
    <PwaContext.Provider
      value={{
        isInstallable,
        isInstalled,
        promptInstall,
        showInstallGuide,
        setShowInstallGuide,
        isMobile,
        isIOS,
        isAndroid,
        isInAppBrowser,
      }}
    >
      {children}
    </PwaContext.Provider>
  );
};

export const usePwa = () => {
  const context = useContext(PwaContext);
  if (!context) {
    throw new Error('usePwa must be used within a PwaProvider');
  }
  return context;
};
