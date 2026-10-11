import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePublicContext } from '../../layouts/PublicLayout';
import { api } from '../../services/api';
import { Product } from '../../types';
import { ProductCard } from '../../components/public/ProductCard';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Search, Filter, RotateCcw, PackageSearch } from 'lucide-react';

export const CataloguePage: React.FC = () => {
  const { openQuoteModal } = usePublicContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const search = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('category') || 'All';
  const selectedGrade = searchParams.get('grade') || 'All';

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.getCategories();
        if (res?.success && res.data) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const res = await api.getPublicProducts({
          search: search || undefined,
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          grade: selectedGrade !== 'All' ? selectedGrade : undefined,
          limit: 30,
        });
        if (res?.success && res.data?.products) {
          setProducts(res.data.products);
        }
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [search, selectedCategory, selectedGrade]);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const resetFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="py-12 bg-steel-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-8">
          <h1 className="text-3xl font-extrabold text-steel-900 tracking-tight">
            Sanitary & Stainless Steel Product Catalogue
          </h1>
          <p className="mt-2 text-sm text-steel-600 leading-relaxed">
            Search and filter our verified sanitary inventory. All components are available with
            full dimensional data and mill test certification upon quotation request.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-5 rounded-xl border border-steel-200/90 shadow-xs mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Box */}
            <div className="md:col-span-5 relative">
              <Input
                placeholder="Search by product name, standard (SMS/DIN), or connection..."
                value={search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="pl-9"
              />
              <Search className="h-4 w-4 text-steel-400 absolute left-3 top-2.5" />
            </div>

            {/* Category Dropdown */}
            <div className="md:col-span-4">
              <Select
                value={selectedCategory}
                onChange={(e) => updateFilter('category', e.target.value)}
                options={[
                  { label: 'All Categories', value: 'All' },
                  ...categories.map((c) => ({
                    label: `${c.name} (${c.count})`,
                    value: c.name,
                  })),
                ]}
              />
            </div>

            {/* Grade Filter */}
            <div className="md:col-span-2">
              <Select
                value={selectedGrade}
                onChange={(e) => updateFilter('grade', e.target.value)}
                options={[
                  { label: 'All Grades', value: 'All' },
                  { label: 'SS 316L (High Purity)', value: '316L' },
                  { label: 'SS 304 (Standard)', value: '304' },
                ]}
              />
            </div>

            {/* Reset Button */}
            <div className="md:col-span-1 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                icon={<RotateCcw className="h-3.5 w-3.5 text-steel-500" />}
                title="Reset All Filters"
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Category Quick Tags */}
          <div className="pt-2 border-t border-steel-100 flex items-center gap-2 overflow-x-auto text-xs pb-1">
            <span className="text-steel-400 text-[11px] font-bold uppercase shrink-0 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Quick Filter:
            </span>
            <button
              onClick={() => updateFilter('category', 'All')}
              className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-colors ${
                selectedCategory === 'All'
                  ? 'bg-brand-blue text-white'
                  : 'bg-steel-100 text-steel-700 hover:bg-steel-200'
              }`}
            >
              All Products
            </button>
            {categories.map((c) => (
              <button
                key={c.name}
                onClick={() => updateFilter('category', c.name)}
                className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-colors ${
                  selectedCategory === c.name
                    ? 'bg-brand-blue text-white'
                    : 'bg-steel-100 text-steel-700 hover:bg-steel-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Section */}
        {loading ? (
          <LoadingSpinner text="Filtering stainless steel catalogue..." />
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-steel-200 p-8">
            <PackageSearch className="h-12 w-12 text-steel-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-steel-900">No Matching Sanitary Products Found</h3>
            <p className="mt-1 text-xs text-steel-500 max-w-md mx-auto">
              We couldn't find any products matching your current search parameters. Try resetting
              filters or submit a general RFQ with your custom requirements.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Clear All Filters
              </Button>
              <Button variant="primary" size="sm" onClick={() => openQuoteModal()}>
                Submit Custom Specification
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4 text-xs text-steel-500">
              <span>
                Showing <strong>{products.length}</strong> verified products
              </span>
              <span>All items available for tailored commercial quotation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => (
                <ProductCard
                  key={prod._id}
                  product={prod}
                  onRequestQuote={(p) => openQuoteModal({ _id: p._id, name: p.name })}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
