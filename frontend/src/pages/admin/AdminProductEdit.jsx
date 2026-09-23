import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getProductByIdApi, updateAdminProductApi } from '../../services/api';

const AdminProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    ingredients: '',
    weight: '',
    price: '',
    stock: '',
    image: '',
    isActive: true,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successNotice, setSuccessNotice] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductByIdApi(id);
        if (res.data.success) {
          const p = res.data.product;
          setFormData({
            name: p.name,
            description: p.description,
            ingredients: p.ingredients,
            weight: p.weight,
            price: p.price,
            stock: p.stock,
            image: p.image,
            isActive: p.isActive,
          });
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to fetch product data.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

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
    setSaving(true);

    try {
      const res = await updateAdminProductApi(id, {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      });

      if (res.data.success) {
        setSuccessNotice('Product updated successfully.');
        setTimeout(() => {
          navigate('/admin/products');
        }, 1500);
      } else {
        setError(res.data.message || 'Failed to update product.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-400">Loading product information...</p>
      </div>
    );
  }

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
          <h1 className="font-serif text-3xl font-bold text-white tracking-tight">Edit Product</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Modify price, restock inventory count, or update details. Changes reflect live immediately.
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
              id="edit-product-name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-medium text-white focus:outline-hidden focus:border-amber-500"
            />
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-300 mb-1">Description *</label>
            <textarea
              name="description"
              required
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-medium text-white focus:outline-hidden focus:border-amber-500"
            />
          </div>

          {/* Ingredients */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-300 mb-1">Ingredients</label>
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
            <label className="block text-xs font-bold text-slate-300 mb-1">Weight *</label>
            <input
              type="text"
              name="weight"
              required
              value={formData.weight}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-medium text-white focus:outline-hidden focus:border-amber-500"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Price (₹ INR) *</label>
            <input
              type="number"
              name="price"
              min="0"
              required
              id="edit-product-price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-hidden focus:border-amber-500"
            />
          </div>

          {/* Stock Quantity */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Stock Quantity (Units) *
            </label>
            <input
              type="number"
              name="stock"
              min="0"
              required
              id="edit-product-stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-sm font-mono text-white focus:outline-hidden focus:border-amber-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Update to restock (e.g. 100 → 150). Immediately reflected on customer store.
            </p>
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              name="isActive"
              id="edit-isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-5 h-5 rounded-lg text-amber-600 focus:ring-amber-500 bg-slate-950 border-slate-800"
            />
            <label htmlFor="edit-isActive" className="text-xs font-bold text-slate-300 cursor-pointer">
              Active for Customer Purchases
            </label>
          </div>

          {/* Image */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-300 mb-1">Image URL *</label>
            <input
              type="url"
              name="image"
              required
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-white focus:outline-hidden focus:border-amber-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
          <Link
            to="/admin/products"
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            id="admin-save-product-btn"
            className="px-8 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Updating...' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductEdit;
