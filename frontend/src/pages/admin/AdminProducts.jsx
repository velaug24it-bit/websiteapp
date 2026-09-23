import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, Edit3, Trash2, Power, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getAdminProductsApi, deleteAdminProductApi, updateAdminProductApi } from '../../services/api';
import { TableRowSkeleton } from '../../components/SkeletonLoader';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [notification, setNotification] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = { active: 'all' };
      if (search.trim()) params.search = search.trim();

      const res = await getAdminProductsApi(params);
      if (res.data.success) {
        let prods = res.data.products;
        if (statusFilter === 'active') prods = prods.filter((p) => p.isActive);
        if (statusFilter === 'inactive') prods = prods.filter((p) => !p.isActive);
        setProducts(prods);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, statusFilter]);

  const handleToggleStatus = async (product) => {
    try {
      const res = await updateAdminProductApi(product._id, {
        isActive: !product.isActive,
      });
      if (res.data.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === product._id ? { ...p, isActive: !p.isActive } : p))
        );
        showNotice(`Product "${product.name}" is now ${!product.isActive ? 'Active' : 'Disabled'}.`);
      }
    } catch (err) {
      showNotice('Failed to update product status.', 'error');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const res = await deleteAdminProductApi(id);
      if (res.data.success) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        showNotice(`Product "${name}" deleted successfully.`);
      }
    } catch (err) {
      showNotice('Failed to delete product.', 'error');
    }
  };

  const showNotice = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white tracking-tight">Product Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Maintain Groundnut Candy variations, live stock counters, pricing, and visibility.
          </p>
        </div>

        <Link
          to="/admin/products/add"
          id="admin-add-product-btn"
          className="self-start sm:self-auto px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-98"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Add Product</span>
        </Link>
      </div>

      {notification && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn ${
            notification.type === 'error'
              ? 'bg-rose-950/60 border border-rose-800 text-rose-300'
              : 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
          }`}
        >
          {notification.type === 'error' ? (
            <AlertCircle className="w-4 h-4" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Filter and search bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-hidden focus:border-amber-500"
          />
        </div>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <label className="text-xs font-bold text-slate-400">Status:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2.5 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-hidden focus:border-amber-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Disabled Only</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-4 px-5">Product</th>
                <th className="py-4 px-5">Weight</th>
                <th className="py-4 px-5">Price (₹)</th>
                <th className="py-4 px-5">Live Stock</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <TableRowSkeleton cols={6} />
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No products found. Click "+ Add Product" to create one.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-800/40 transition-colors">
                    {/* Image and Name */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-800 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white text-sm line-clamp-1">{p.name}</p>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{p.description}</p>
                        </div>
                      </div>
                    </td>

                    {/* Weight */}
                    <td className="py-4 px-5 font-mono text-slate-300 font-bold">{p.weight}</td>

                    {/* Price */}
                    <td className="py-4 px-5 font-mono text-amber-400 font-black text-sm">₹{p.price}</td>

                    {/* Stock */}
                    <td className="py-4 px-5">
                      <span
                        className={`font-mono font-bold px-2.5 py-1 rounded-full text-xs ${
                          p.stock <= 0
                            ? 'bg-rose-950/60 text-rose-400 border border-rose-800'
                            : p.stock <= 10
                            ? 'bg-amber-950/60 text-amber-400 border border-amber-800'
                            : 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                        }`}
                      >
                        {p.stock} units
                      </span>
                    </td>

                    {/* Status badge */}
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold ${
                          p.isActive
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        {p.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right space-x-2">
                      {/* Toggle status */}
                      <button
                        onClick={() => handleToggleStatus(p)}
                        title={p.isActive ? 'Disable product' : 'Enable product'}
                        className={`p-2 rounded-xl border transition-colors ${
                          p.isActive
                            ? 'border-slate-700 text-slate-400 hover:text-amber-400 hover:bg-slate-800'
                            : 'border-emerald-800 text-emerald-400 hover:bg-emerald-950'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit */}
                      <Link
                        to={`/admin/products/edit/${p._id}`}
                        className="p-2 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 inline-block transition-colors"
                        title="Edit product"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </Link>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(p._id, p.name)}
                        className="p-2 rounded-xl border border-rose-900/60 text-rose-400 hover:bg-rose-950 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
