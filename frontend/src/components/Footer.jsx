import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Truck, Award, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-jaggery-900 text-cream-100 pt-16 pb-12 border-t border-jaggery-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-jaggery-800">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-jaggery-800 text-brand-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Authentic Heritage</h4>
              <p className="text-sm text-jaggery-300 mt-1">Kovilpatti traditional recipe crafted with organic sugarcane jaggery.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-jaggery-800 text-brand-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Fresh & Fast Delivery</h4>
              <p className="text-sm text-jaggery-300 mt-1">Direct from our roasteries to your doorstep within 3-4 days.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-jaggery-800 text-brand-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">100% Pure & Preservative-Free</h4>
              <p className="text-sm text-jaggery-300 mt-1">Zero refined sugars, zero artificial colors, zero trans fats.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-jaggery-800 text-brand-400">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Loved Across Generations</h4>
              <p className="text-sm text-jaggery-300 mt-1">Trusted snack for kids, seniors, athletes, and wholesome families.</p>
            </div>
          </div>
        </div>

        {/* Links & Brand Story */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-12">
          {/* Brand info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🥜</span>
              <span className="font-serif text-2xl font-bold text-white">
                Kadalai <span className="text-brand-400">Mittai</span>
              </span>
            </div>
            <p className="text-sm text-jaggery-300 leading-relaxed max-w-sm">
              We take immense pride in bringing you South India's most celebrated confectionery snack — handcrafted peanut candy made with golden roasted groundnuts and clarified organic jaggery.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-jaggery-400">
              <span>FSSAI Certified</span>
              <span>•</span>
              <span>Tamil Nadu Origin</span>
              <span>•</span>
              <span>Artisanal Small Batches</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-brand-300">Quick Links</h4>
            <ul className="space-y-2 text-sm text-jaggery-300">
              <li><Link to="/" className="hover:text-white transition-colors">Home Page</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">All Candies & Packs</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">View Cart</Link></li>
              <li><Link to="/my-orders" className="hover:text-white transition-colors">Order Tracking</Link></li>
              <li><Link to="/admin/login" className="hover:text-white transition-colors">Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-brand-300">Customer Support</h4>
            <div className="space-y-2.5 text-sm text-jaggery-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
                <span>Kovilpatti Highway, Thoothukudi Dist, Tamil Nadu, 628501</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <span>+91 98765 43210 / 04632 220199</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <span>support@kadalaicandy.com</span>
              </div>
              <div className="pt-2 text-xs text-jaggery-400">
                Payment Security: Razorpay 256-bit Encrypted SSL Gateway
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-jaggery-800 text-center text-xs text-jaggery-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Kadalai Mittai. Pure Groundnuts. Handcrafted with Love.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-white cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-white cursor-pointer">Shipping & Returns</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
