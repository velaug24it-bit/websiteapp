import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Flame, Heart, Star, CheckCircle, Package } from 'lucide-react';
import { getProductsApi } from '../services/api';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/SkeletonLoader';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await getProductsApi();
        if (res.data.success) {
          setProducts(res.data.products);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-cream-100 via-cream-200/40 to-transparent">
        {/* Decorative blur spheres */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-brand-300/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute bottom-0 right-10 w-[400px] h-[300px] bg-warmOrange/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100 text-brand-900 border border-brand-200 text-xs font-bold tracking-wide uppercase shadow-xs">
                <Flame className="w-3.5 h-3.5 text-warmOrange fill-current" />
                <span>Original Kovilpatti Recipe Since 1952</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-jaggery-900 tracking-tight leading-[1.15]">
                Traditional Taste. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-brand-500 to-warmOrange">
                  Pure Groundnuts.
                </span> <br />
                Made with Love.
              </h1>

              <p className="text-base sm:text-lg text-jaggery-700 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Authentic Groundnut Candy crafted with quality ingredients and traditional taste. Enjoy the unmatched crunch of fire-roasted peanuts enveloped in rich organic jaggery syrup.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link
                  to="/products"
                  id="hero-shop-now-btn"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-jaggery-800 hover:from-brand-700 hover:to-jaggery-900 text-white font-bold text-base shadow-warm hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/products"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white border border-jaggery-200 hover:border-brand-400 text-jaggery-900 font-bold text-base hover:bg-cream-100 shadow-soft transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span>Explore Products</span>
                </Link>
              </div>

              {/* Trust badges row */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-jaggery-200/60 text-left">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="text-xs font-bold text-jaggery-800">100% Organic Jaggery</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="text-xs font-bold text-jaggery-800">No White Sugar</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="text-xs font-bold text-jaggery-800">Zero Preservatives</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image / Illustration Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative glow backing */}
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-400/40 to-warmOrange/30 rounded-3xl filter blur-2xl transform rotate-3 scale-95"></div>

                {/* Main Product Card Visual */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <img
                    src="/images/products/classic_groundnut_candy.jpg"
                    alt="Authentic Groundnut Candy (Kadalai Mittai)"
                    className="w-full h-80 sm:h-96 object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  />
                  {/* Floating Testimonial Pill */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-jaggery-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-amber-500 mb-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <p className="text-xs font-bold text-jaggery-900">"Crispiest Kadalai Mittai outside Kovilpatti!"</p>
                      <p className="text-[11px] text-jaggery-500">— Senthil Nathan, Chennai</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                        Verified Purchase
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -top-4 -right-4 bg-jaggery-900 text-white p-3.5 rounded-2xl shadow-xl flex items-center gap-2 border border-brand-300">
                  <span className="text-2xl">🍯</span>
                  <div className="leading-tight">
                    <p className="text-xs font-bold text-brand-300">Heritage Recipe</p>
                    <p className="text-[10px] text-cream-200">Pure Ghee & Cardamom</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-100 px-3 py-1 rounded-full">
            Why Our Candy Stands Apart
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-jaggery-900 mt-3">
            Handcrafted with South Indian Heritage
          </h2>
          <p className="text-sm text-jaggery-600 mt-2">
            Every bite of our Kadalai Mittai carries the legacy of authentic Tamil craftsmanship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 shadow-soft border border-jaggery-100 hover:shadow-warm transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">
              🥜
            </div>
            <h3 className="font-serif text-xl font-bold text-jaggery-900 mb-2">Grade-A Bold Peanuts</h3>
            <p className="text-sm text-jaggery-600 leading-relaxed">
              We slow-roast native Tamil Nadu groundnuts in heavy iron cauldrons to unlock their deep, nutty aroma before gently skinning each kernel.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-soft border border-jaggery-100 hover:shadow-warm transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">
              🍯
            </div>
            <h3 className="font-serif text-xl font-bold text-jaggery-900 mb-2">Organic Sugarcane Jaggery</h3>
            <p className="text-sm text-jaggery-600 leading-relaxed">
              Never refined white sugar. Our caramel syrup is simmered from unbleached country jaggery rich in iron, minerals, and deep toffee notes.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-soft border border-jaggery-100 hover:shadow-warm transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">
              🌿
            </div>
            <h3 className="font-serif text-xl font-bold text-jaggery-900 mb-2">Cardamom & Ghee Infusion</h3>
            <p className="text-sm text-jaggery-600 leading-relaxed">
              Fragrant green Idukki cardamom powder and a hint of pure cow ghee give our peanut candy its famous golden glaze and comforting crunch.
            </p>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-100 px-3 py-1 rounded-full">
              Fresh Batches Ready
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-jaggery-900 mt-2">
              Our Artisanal Candies & Packs
            </h2>
            <p className="text-sm text-jaggery-600 mt-1">
              Select your pack size — made fresh daily with zero artificial ingredients.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-900 group"
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-jaggery-100 p-8">
            <p className="text-jaggery-600 font-medium">No products currently available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. TRADITIONAL STORY BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-jaggery-900 via-jaggery-800 to-brand-900 text-white p-8 sm:p-14 overflow-hidden shadow-2xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-500/20 via-transparent to-transparent pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl space-y-5">
            <span className="text-xs font-bold text-brand-300 uppercase tracking-widest bg-jaggery-700/60 px-3 py-1 rounded-full border border-jaggery-600">
              The Legend of Kovilpatti
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold leading-tight">
              Why Kovilpatti Kadalai Mittai Holds a GI Tag
            </h2>
            <p className="text-sm sm:text-base text-cream-200 leading-relaxed font-normal">
              Originating from the Thamirabarani river basin, the secret lies in the quality of local groundnuts and the distinct mineral profile of water used to simmer the jaggery syrup. We honor this ancient recipe to deliver the same unmistakable, snap-crisp texture right to your home.
            </p>
            <div className="pt-2">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-jaggery-900 font-bold text-sm shadow-md transition-all active:scale-98"
              >
                <span>Order Authentic Batch</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
