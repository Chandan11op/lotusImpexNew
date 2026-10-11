import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Product } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Textarea';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Plus, Search, Edit3, Trash2, Eye, EyeOff, Layers, ExternalLink } from 'lucide-react';

export const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'Sanitary Tubes & Pipes',
    shortDescription: '',
    fullDescription: '',
    material: 'Stainless Steel AISI 304 / 316L',
    grade: 'SS 316L / SS 304',
    sizeRange: '0.5" to 4" OD',
    connectionType: 'Tri-Clamp / Butt Weld',
    surfaceFinish: 'Ra < 0.8 µm (Standard) / Ra < 0.4 µm (EP)',
    standards: '3A, DIN 11850, SMS, ISO 2037',
    isPublished: true,
    isFeatured: false,
    images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'],
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminProducts({
        search: search || undefined,
        category: categoryFilter !== 'All' ? categoryFilter : undefined,
        limit: 100,
      });
      if (res?.success && res.data?.products) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error('Failed to load admin products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [search, categoryFilter]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      category: 'Sanitary Tubes & Pipes',
      shortDescription: '',
      fullDescription: '',
      material: 'Stainless Steel AISI 304 / 316L',
      grade: 'SS 316L / SS 304',
      sizeRange: '0.5" to 4" OD',
      connectionType: 'Tri-Clamp / Butt Weld',
      surfaceFinish: 'Ra < 0.8 µm (Standard) / Ra < 0.4 µm (EP)',
      standards: '3A, DIN 11850, SMS, ISO 2037',
      isPublished: true,
      isFeatured: false,
      images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      slug: prod.slug,
      category: prod.category,
      shortDescription: prod.shortDescription,
      fullDescription: prod.fullDescription,
      material: prod.material,
      grade: prod.grade,
      sizeRange: prod.sizeRange,
      connectionType: prod.connectionType,
      surfaceFinish: prod.surfaceFinish,
      standards: prod.standards,
      isPublished: prod.isPublished,
      isFeatured: prod.isFeatured,
      images: prod.images.length > 0 ? prod.images : ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80'],
    });
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        const res = await api.updateProduct(editingProduct._id, formData);
        if (res?.success) {
          setIsModalOpen(false);
          loadProducts();
        }
      } else {
        const res = await api.createProduct(formData);
        if (res?.success) {
          setIsModalOpen(false);
          loadProducts();
        }
      }
    } catch (err: any) {
      alert(err?.message || 'Error saving product');
    }
  };

  const togglePublish = async (prod: Product) => {
    try {
      await api.updateProduct(prod._id, { isPublished: !prod.isPublished });
      loadProducts();
    } catch (err: any) {
      alert(err?.message || 'Failed to toggle status');
    }
  };

  const generateSlugFromName = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
              <Search className="h-4 w-4 text-steel-400 absolute left-3 top-2.5" />
            </div>

            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              options={[
                { label: 'All Categories', value: 'All' },
                { label: 'Sanitary Tubes & Pipes', value: 'Sanitary Tubes & Pipes' },
                { label: 'TC Clamps & Ferrules', value: 'TC Clamps & Ferrules' },
                { label: 'Valves & Butterfly Valves', value: 'Valves & Butterfly Valves' },
                { label: 'Bends & Elbows', value: 'Bends & Elbows' },
                { label: 'Tees & Crosses', value: 'Tees & Crosses' },
                { label: 'Unions & DIN Unions', value: 'Unions & DIN Unions' },
                { label: 'Reducers', value: 'Reducers' },
                { label: 'Flanges', value: 'Flanges' },
                { label: 'Electropolished Fittings', value: 'Electropolished Fittings' },
              ]}
              className="w-56"
            />
          </div>

          <Button variant="primary" size="sm" onClick={openAddModal} icon={<Plus className="h-4 w-4" />}>
            Add New Product
          </Button>
        </div>
      </Card>

      {/* Products Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Retrieving product catalog..." />
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-steel-500 text-xs">
            No products match the selected criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-steel-50 border-b border-steel-200 text-steel-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Material / Grade</th>
                  <th className="py-3 px-4">Size Range</th>
                  <th className="py-3 px-4">Connection</th>
                  <th className="py-3 px-4">Visibility</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-steel-100">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-steel-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-steel-900 block">{p.name}</span>
                      <span className="text-[11px] font-mono text-steel-400">/{p.slug}</span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-steel-700">{p.category}</td>
                    <td className="py-3.5 px-4 text-steel-800">{p.grade}</td>
                    <td className="py-3.5 px-4 text-steel-600">{p.sizeRange}</td>
                    <td className="py-3.5 px-4 text-steel-600 truncate max-w-[150px]">
                      {p.connectionType}
                    </td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => togglePublish(p)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase transition-colors ${
                          p.isPublished
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-steel-100 text-steel-500 hover:bg-steel-200'
                        }`}
                        title="Click to toggle publish status"
                      >
                        {p.isPublished ? (
                          <>
                            <Eye className="h-3 w-3" /> Published
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3" /> Hidden
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {p.isPublished && (
                          <a
                            href={`/products/${p.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-steel-400 hover:text-brand-blue"
                            title="Preview Public Page"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditModal(p)}
                          icon={<Edit3 className="h-3.5 w-3.5" />}
                        >
                          Edit
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Product Specification' : 'Add New Sanitary Product'}
        maxWidth="xl"
      >
        <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Product Name"
              required
              value={formData.name}
              onChange={(e) => {
                const name = e.target.value;
                setFormData({
                  ...formData,
                  name,
                  slug: editingProduct ? formData.slug : generateSlugFromName(name),
                });
              }}
            />
            <Input
              label="Product URL Slug"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Product Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { label: 'Sanitary Tubes & Pipes', value: 'Sanitary Tubes & Pipes' },
                { label: 'TC Clamps & Ferrules', value: 'TC Clamps & Ferrules' },
                { label: 'Valves & Butterfly Valves', value: 'Valves & Butterfly Valves' },
                { label: 'Bends & Elbows', value: 'Bends & Elbows' },
                { label: 'Tees & Crosses', value: 'Tees & Crosses' },
                { label: 'Unions & DIN Unions', value: 'Unions & DIN Unions' },
                { label: 'Reducers', value: 'Reducers' },
                { label: 'Flanges', value: 'Flanges' },
                { label: 'Electropolished Fittings', value: 'Electropolished Fittings' },
                { label: 'Sanitary & Dairy Valves', value: 'Sanitary & Dairy Valves' },
                { label: 'SS Dairy Fittings', value: 'SS Dairy Fittings' },
              ]}
            />

            <Input
              label="Grade"
              required
              value={formData.grade}
              onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Size Range"
              value={formData.sizeRange}
              onChange={(e) => setFormData({ ...formData, sizeRange: e.target.value })}
            />
            <Input
              label="Connection Type"
              value={formData.connectionType}
              onChange={(e) => setFormData({ ...formData, connectionType: e.target.value })}
            />
            <Input
              label="Surface Finish"
              value={formData.surfaceFinish}
              onChange={(e) => setFormData({ ...formData, surfaceFinish: e.target.value })}
            />
          </div>

          <Input
            label="Short Description"
            required
            value={formData.shortDescription}
            onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
          />

          <Textarea
            label="Full Engineering Description"
            required
            rows={4}
            value={formData.fullDescription}
            onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
          />

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="rounded border-steel-300 text-brand-blue"
              />
              <span className="font-semibold text-steel-700">Published on Public Catalogue</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isFeatured}
                onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                className="rounded border-steel-300 text-brand-blue"
              />
              <span className="font-semibold text-steel-700">Featured on Homepage</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-steel-100">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingProduct ? 'Save Changes' : 'Create Product'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
