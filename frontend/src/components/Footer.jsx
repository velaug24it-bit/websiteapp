import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Truck, Award, Phone, Mail, MapPin, Download } from 'lucide-react';
import { usePwa } from '../context/PwaContext';

const Footer = () => {
  const { promptInstall, isInstalled } = usePwa();

  return (
    <footer className="bg-jaggery-900 text-cream-100 pt-7 sm:pt-14 pb-20 sm:pb-12 border-t border-jaggery-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Highlights: Sleek 2x2 grid on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6 pb-6 sm:pb-10 border-b border-jaggery-800/80">
          <div className="flex items-start gap-2.5 sm:gap-4 p-2.5 sm:p-0 rounded-2xl bg-jaggery-800/40 sm:bg-transparent">
            <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-jaggery-800 text-brand-400 shrink-0">
              <Award className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-white text-xs sm:text-base leading-tight">Authentic Heritage</h4>
              <p className="text-[10px] sm:text-sm text-jaggery-300 mt-0.5 sm:mt-1 leading-tight sm:leading-normal line-clamp-2 sm:line-clamp-none">
                Kovilpatti recipe crafted with organic sugarcane jaggery.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 sm:gap-4 p-2.5 sm:p-0 rounded-2xl bg-jaggery-800/40 sm:bg-transparent">
            <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-jaggery-800 text-brand-400 shrink-0">
              <Truck className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-white text-xs sm:text-base leading-tight">Fresh & Fast</h4>
              <p className="text-[10px] sm:text-sm text-jaggery-300 mt-0.5 sm:mt-1 leading-tight sm:leading-normal line-clamp-2 sm:line-clamp-none">
                Direct from roasteries to your doorstep in 3-4 days.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 sm:gap-4 p-2.5 sm:p-0 rounded-2xl bg-jaggery-800/40 sm:bg-transparent">
            <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-jaggery-800 text-brand-400 shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-white text-xs sm:text-base leading-tight">100% Pure</h4>
              <p className="text-[10px] sm:text-sm text-jaggery-300 mt-0.5 sm:mt-1 leading-tight sm:leading-normal line-clamp-2 sm:line-clamp-none">
                Zero refined sugars, zero artificial colors or trans fats.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 sm:gap-4 p-2.5 sm:p-0 rounded-2xl bg-jaggery-800/40 sm:bg-transparent">
            <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-jaggery-800 text-brand-400 shrink-0">
              <Heart className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <h4 className="font-bold text-white text-xs sm:text-base leading-tight">Loved by All</h4>
              <p className="text-[10px] sm:text-sm text-jaggery-300 mt-0.5 sm:mt-1 leading-tight sm:leading-normal line-clamp-2 sm:line-clamp-none">
                Wholesome natural snack for kids, seniors & families.
              </p>
            </div>
          </div>
        </div>

        {/* Links & Brand Story: Side-by-side 2-col on mobile, 3-col on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 py-6 sm:py-10">
          {/* Brand info */}
          <div className="md:col-span-5 space-y-2.5 sm:space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl sm:text-3xl">🥜</span>
              <span className="font-serif text-xl sm:text-2xl font-bold text-white">
                Velan Kadalai <span className="text-brand-400">Mittai</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-jaggery-300 leading-relaxed max-w-sm line-clamp-2 sm:line-clamp-none">
              South India's most celebrated confectionery snack — handcrafted peanut candy made with golden roasted groundnuts and clarified organic jaggery.
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-jaggery-300">
              <span className="px-2 py-0.5 rounded-md bg-jaggery-800/80 border border-jaggery-700/50">FSSAI Certified</span>
              <span className="text-jaggery-500">•</span>
              <span className="px-2 py-0.5 rounded-md bg-jaggery-800/80 border border-jaggery-700/50">Tamil Nadu Origin</span>
              <span className="text-jaggery-500">•</span>
              <span className="px-2 py-0.5 rounded-md bg-jaggery-800/80 border border-jaggery-700/50">Artisanal Batches</span>
            </div>
          </div>

          {/* Quick Links & Customer Support Container: 2-column on mobile */}
          <div className="md:col-span-7 grid grid-cols-2 gap-4 sm:gap-8 pt-3 sm:pt-0 border-t border-jaggery-800/60 sm:border-t-0">
            {/* Quick Links */}
            <div className="space-y-2 sm:space-y-3">
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-300">Quick Links</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-jaggery-300">
                <li><Link to="/" className="hover:text-white transition-colors">Home Page</Link></li>
                <li><Link to="/products" className="hover:text-white transition-colors">All Candies</Link></li>
                <li><Link to="/cart" className="hover:text-white transition-colors">View Cart</Link></li>
                <li><Link to="/my-orders" className="hover:text-white transition-colors">Order Tracking</Link></li>
                <li>
                  <button
                    type="button"
                    onClick={promptInstall}
                    className="hover:text-brand-300 transition-colors flex items-center gap-1 text-brand-400 font-bold text-left"
                  >
                    <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                    <span className="truncate">{isInstalled ? 'App Ready' : 'Download App'}</span>
                  </button>
                </li>
                <li><Link to="/admin/login" className="hover:text-white transition-colors">Admin Dashboard</Link></li>
              </ul>
            </div>

            {/* Contact & Support */}
            <div className="space-y-2 sm:space-y-3">
              <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-300">Support</h4>
              <div className="space-y-2 text-xs sm:text-sm text-jaggery-300">
                <div className="flex items-start gap-1.5 sm:gap-2">
                  <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] sm:text-sm leading-tight">Kovilpatti, Tamil Nadu 628501</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Phone className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                  <span className="text-[11px] sm:text-sm truncate">+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Mail className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                  <span className="text-[11px] sm:text-sm truncate">support@kadalaicandy.com</span>
                </div>
                <div className="pt-1 text-[10px] sm:text-xs text-jaggery-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Razorpay 256-bit SSL</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="pt-4 sm:pt-8 border-t border-jaggery-800 text-center sm:text-left text-[11px] sm:text-xs text-jaggery-400 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-4">
          <p>© {new Date().getFullYear()} Velan Kadalai Mittai. Handcrafted with Love.</p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span className="text-jaggery-600">•</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span className="text-jaggery-600">•</span>
            <span className="hover:text-white cursor-pointer">Shipping & Returns</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
