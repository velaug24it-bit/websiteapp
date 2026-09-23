import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, RefreshCw, X } from 'lucide-react';
import { getProductsApi } from '../services/api';
import ProductCard from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/SkeletonLoader';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortOption, setSortOption] = useState('latest');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (stockFilter !== 'all') params.stock = stockFilter;
      if (sortOption !== 'latest') params.sort = sortOption;

      const res = await getProductsApi(params);
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProducts();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, stockFilter, sortOption]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setStockFilter('all');
    setSortOption('latest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-jaggery-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-100 px-3 py-1 rounded-full">
            Our Candy Collection
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-extrabold text-jaggery-900 mt-2">
            Handcrafted Kadalai Mittai
          </h1>
          <p className="text-sm text-jaggery-600 mt-1">
            Pure jaggery groundnut candies available from 100g travel packs up to 1kg celebratory tins.
          </p>
        </div>

        <div className="text-sm text-jaggery-600 font-medium">
          Showing <span className="font-bold text-jaggery-900">{products.length}</span> {products.length === 1 ? 'pack' : 'packs'}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl shadow-soft border border-jaggery-100 flex flex-col md:flex-row items-center gap-4">
        {/* Search Input */}
        <div className="relative w-full md:flex-1">
          <Search className="w-5 h-5 text-jaggery-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            id="product-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Kadalai Mittai, 100g, 250g, 500g, 1kg..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-cream-100 border border-jaggery-200 text-sm font-medium text-jaggery-900 placeholder:text-jaggery-400 focus:outline-hidden focus:border-brand-500 focus:bg-white transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-jaggery-400 hover:text-jaggery-700 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Stock Filter */}
        <div className="w-full md:w-auto flex items-center gap-2">
          <label className="text-xs font-bold text-jaggery-600 shrink-0">Stock:</label>
          <select
            value={stockFilter}
            id="product-stock-filter"
            onChange={(e) => setStockFilter(e.target.value)}
            className="w-full md:w-40 py-3 px-3.5 rounded-2xl bg-cream-100 border border-jaggery-200 text-xs font-semibold text-jaggery-800 focus:outline-hidden focus:border-brand-500"
          >
            <option value="all">All Items</option>
            <option value="in_stock">In Stock Only</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>

        {/* Sort Filter */}
        <div className="w-full md:w-auto flex items-center gap-2">
          <label className="text-xs font-bold text-jaggery-600 shrink-0">Sort By:</label>
          <select
            value={sortOption}
            id="product-sort-select"
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full md:w-44 py-3 px-3.5 rounded-2xl bg-cream-100 border border-jaggery-200 text-xs font-semibold text-jaggery-800 focus:outline-hidden focus:border-brand-500"
          >
            <option value="latest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-jaggery-200 max-w-md mx-auto space-y-4">
          <div className="text-4xl">🔍</div>
          <h3 className="font-serif text-xl font-bold text-jaggery-900">No Candies Found</h3>
          <p className="text-xs text-jaggery-600">
            We couldn't find any products matching your search or filters. Try adjusting your keywords.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-6 py-2.5 rounded-xl bg-jaggery-800 text-white text-xs font-bold hover:bg-jaggery-900 transition-all inline-flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
