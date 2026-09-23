import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { createAdminProductApi } from '../../services/api';

const IMAGE_PRESETS = [
  { label: 'Classic Crunchy Squares', url: '/images/products/classic_groundnut_candy.jpg' },
  { label: 'Palm Jaggery Karupatti', url: '/images/products/premium_groundnut_candy.jpg' },
  { label: 'Family Sharing Box', url: '/images/products/family_pack_candy.jpg' },
  { label: 'Special Master Pack 1kg', url: '/images/products/special_pack_candy.jpg' },
];

const AdminProductAdd = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ingredients: 'Roasted Peanuts (Groundnuts), Pure Organic Jaggery, Cardamom, Pure Ghee',
    weight: '100g',
    price: '',
    stock: '',
    image: IMAGE_PRESETS[0].url,
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successNotice, setSuccessNotice] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await createAdminProductApi({
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      });

      if (res.data.success) {
        setSuccessNotice('Product added successfully.');
        setTimeout(() => {
          navigate('/admin/products');
        }, 1500);
      } else {
        setError(res.data.message || 'Failed to create product.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create product.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
        <Link
          to="/admin/products"
          className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl font-bold text-white tracking-tight">Add New Product</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Create a new Groundnut Candy item in the database with instant customer storefront synchronization.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successNotice}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Name */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-300 mb-1">Product Name *</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Classic Groundnut Candy"
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-medium text-white focus:outline-hidden focus:border-amber-500"
            />
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-300 mb-1">Product Description *</label>
            <textarea
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the texture, taste, and tradition..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-medium text-white focus:outline-hidden focus:border-amber-500"
            />
          </div>

          {/* Ingredients */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-300 mb-1">Ingredients Breakdown</label>
            <input
              type="text"
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-medium text-white focus:outline-hidden focus:border-amber-500"
            />
          </div>

          {/* Weight */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Weight Specification *</label>
            <select
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-medium text-white focus:outline-hidden focus:border-amber-500"
            >
              <option value="100g">100g Pack</option>
              <option value="250g">250g Pack</option>
              <option value="500g">500g Pack</option>
              <option value="1kg">1kg Tin / Pack</option>
              <option value="Custom">Custom Size</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Price (₹ INR) *</label>
            <input
              type="number"
              name="price"
              min="1"
              required
              value={formData.price}
              onChange={handleChange}
              placeholder="50"
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-hidden focus:border-amber-500"
            />
          </div>

          {/* Stock Quantity */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Stock Quantity (Units) *</label>
            <input
              type="number"
              name="stock"
              min="0"
              required
              value={formData.stock}
              onChange={handleChange}
              placeholder="100"
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-hidden focus:border-amber-500"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              name="isActive"
              id="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-5 h-5 rounded-lg text-amber-600 focus:ring-amber-500 bg-slate-950 border-slate-800"
            />
            <label htmlFor="isActive" className="text-xs font-bold text-slate-300 cursor-pointer">
              Active for Customer Purchases
            </label>
          </div>

          {/* Product Image URL with Presets */}
          <div className="sm:col-span-2 space-y-3">
            <label className="block text-xs font-bold text-slate-300">Product Image URL *</label>
            <input
              type="url"
              name="image"
              required
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-hidden focus:border-amber-500"
            />

            {/* Presets */}
            <div>
              <p className="text-[11px] text-slate-400 mb-2">Or choose a high-resolution preset photography:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {IMAGE_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, image: preset.url }))}
                    className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      formData.image === preset.url
                        ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <img src={preset.url} alt="" className="w-8 h-8 rounded-lg object-cover" />
                    <span className="text-[10px] font-bold line-clamp-1">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
          <Link
            to="/admin/products"
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            id="admin-submit-product-btn"
            className="px-8 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : 'Save Product to Database'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductAdd;
