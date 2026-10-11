import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePublicContext } from '../../layouts/PublicLayout';
import { api } from '../../services/api';
import { Product } from '../../types';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { InteractiveViewer360 } from '../../components/public/InteractiveViewer360';
import {
  FileText,
  Phone,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Tag,
  Layers,
  Sparkles,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { openQuoteModal } = usePublicContext();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [viewMode, setViewMode] = useState<'gallery' | '360'>('gallery');

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await api.getProductBySlug(slug);
        if (res?.success && res.data?.product) {
          setProduct(res.data.product);
          setRelated(res.data.related || []);
          setSelectedImage(res.data.product.images?.[0] || '');
        }
      } catch (err) {
        console.error('Failed to load product detail', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-24">
        <LoadingSpinner text="Retrieving sanitary product specifications..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center">
        <h2 className="text-2xl font-bold text-steel-900">Product Not Found</h2>
        <p className="mt-2 text-sm text-steel-600">
          The requested product specification could not be located or has been archived.
        </p>
        <div className="mt-6">
          <Link to="/products">
            <Button variant="primary">Return to Product Catalogue</Button>
          </Link>
        </div>
      </div>
    );
  }

  const fallbackImage =
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="py-10 bg-steel-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-steel-500 mb-6 overflow-x-auto">
          <Link to="/" className="hover:text-steel-900">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/products" className="hover:text-steel-900">
            Products
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link
            to={`/products?category=${encodeURIComponent(product.category)}`}
            className="hover:text-steel-900"
          >
            {product.category}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-steel-900 font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white p-6 sm:p-8 rounded-2xl border border-steel-200/90 shadow-xs mb-12">
          {/* Left Column: Visual Media & 360 viewer */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant={viewMode === 'gallery' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('gallery')}
              >
                Standard Photo Gallery
              </Button>
              <Button
                variant={viewMode === '360' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('360')}
                icon={<Sparkles className="h-3.5 w-3.5" />}
              >
                Interactive 360° Inspection
              </Button>
            </div>

            {viewMode === '360' ? (
              <InteractiveViewer360
                productName={product.name}
                images={product.images.length > 0 ? product.images : [fallbackImage]}
              />
            ) : (
              <div>
                <div className="aspect-4/3 bg-steel-100 rounded-xl overflow-hidden border border-steel-200 flex items-center justify-center">
                  <img
                    src={selectedImage || fallbackImage}
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Thumbnails */}
                {product.images.length > 1 && (
                  <div className="flex gap-3 mt-4 overflow-x-auto">
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(img)}
                        className={`h-16 w-16 rounded-lg overflow-hidden border-2 shrink-0 transition-colors ${
                          selectedImage === img
                            ? 'border-brand-blue ring-2 ring-blue-100'
                            : 'border-steel-200 hover:border-steel-400'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Quality & Traceability Callout */}
            <div className="p-4 bg-steel-50 rounded-xl border border-steel-200 text-xs text-steel-600 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-steel-900">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Sanitary Inspection & Traceability Standards</span>
              </div>
              <p>
                All components are verified for uniform wall thickness, smooth sanitary bore
                finish, and compatibility with standard Tri-Clamp, SMS, or DIN couplings.
              </p>
            </div>
          </div>

          {/* Right Column: Information, Key Parameters, Quotation CTA */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary" size="md">
                  {product.category}
                </Badge>
                <Badge variant="default" size="md">
                  Grade: {product.grade}
                </Badge>
                {product.isFeatured && (
                  <Badge variant="orange" size="md">
                    Featured Item
                  </Badge>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-steel-900 leading-tight">
                {product.name}
              </h1>

              <p className="text-sm text-steel-600 leading-relaxed">{product.shortDescription}</p>

              {/* Core Parameters Table */}
              <div className="bg-steel-50/70 rounded-xl p-4 border border-steel-200 text-xs space-y-2.5">
                <h4 className="font-bold text-steel-900 uppercase tracking-wider text-[11px] mb-2">
                  Key Design Parameters:
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-steel-400 block">Material Grade</span>
                    <span className="font-semibold text-steel-800">{product.material}</span>
                  </div>
                  <div>
                    <span className="text-steel-400 block">Available Sizes</span>
                    <span className="font-semibold text-steel-800">{product.sizeRange}</span>
                  </div>
                  <div>
                    <span className="text-steel-400 block">Connection Style</span>
                    <span className="font-semibold text-steel-800">{product.connectionType}</span>
                  </div>
                  <div>
                    <span className="text-steel-400 block">Surface Finish</span>
                    <span className="font-semibold text-steel-800">{product.surfaceFinish}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-steel-400 block">Standards Supported</span>
                    <span className="font-semibold text-steel-800">{product.standards}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => openQuoteModal({ _id: product._id, name: product.name })}
                  icon={<FileText className="h-4 w-4" />}
                  className="flex-1 justify-center"
                >
                  Request a Formal Quote (RFQ)
                </Button>
                <Link to="/contact" className="flex-1">
                  <Button
                    variant="outline"
                    size="lg"
                    icon={<Phone className="h-4 w-4 text-steel-600" />}
                    className="w-full justify-center"
                  >
                    Contact Mumbai Desk
                  </Button>
                </Link>
              </div>
            </div>

            {/* Applicable Industries Tags */}
            <div className="pt-4 border-t border-steel-100">
              <span className="text-xs font-bold text-steel-700 uppercase tracking-wider block mb-2">
                Applicable Sanitary Industries:
              </span>
              <div className="flex flex-wrap gap-2">
                {product.applicableIndustries?.map((ind, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-steel-100 text-steel-700 text-xs font-medium"
                  >
                    <CheckCircle2 className="h-3 w-3 text-brand-blue" />
                    <span>{ind}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Description & Technical Specifications Accordion / Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Detailed Narrative */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-steel-200/90 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-steel-900 border-b border-steel-100 pb-3">
              Full Engineering Description
            </h3>
            <p className="text-sm text-steel-700 leading-relaxed whitespace-pre-line">
              {product.fullDescription}
            </p>
            <div className="pt-4 border-t border-steel-100 text-xs text-steel-500">
              <span className="font-semibold text-steel-700 block mb-1">
                Material Testing & Verification Notice:
              </span>
              Sample specifications and technical data presented above illustrate standard
              manufacturing tolerances. Mill test certificates (MTR 3.1) and surface roughness
              test reports are provided per order batch.
            </div>
          </div>

          {/* Detailed Technical Specs Table */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-steel-200/90 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-steel-900 border-b border-steel-100 pb-3">
              Technical Specifications Table
            </h3>
            {product.specs && Object.keys(product.specs).length > 0 ? (
              <div className="divide-y divide-steel-100 text-xs">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="py-2.5 flex justify-between gap-4">
                    <span className="font-semibold text-steel-600">{key}</span>
                    <span className="font-mono text-steel-900 text-right">{val}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-steel-500">Standard specifications apply.</p>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        {related.length > 0 && (
          <div className="pt-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-steel-900">
                Related Components in {product.category}
              </h3>
              <Link
                to={`/products?category=${encodeURIComponent(product.category)}`}
                className="text-xs font-semibold text-brand-blue hover:underline"
              >
                View all in category →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((rel) => (
                <div
                  key={rel._id}
                  className="bg-white p-4 rounded-xl border border-steel-200 hover:shadow-md transition-shadow"
                >
                  <img
                    src={rel.images?.[0] || fallbackImage}
                    alt={rel.name}
                    className="w-full aspect-4/3 object-cover rounded-lg mb-3"
                  />
                  <h4 className="text-sm font-bold text-steel-900 line-clamp-1">
                    <Link to={`/products/${rel.slug}`} className="hover:text-brand-blue">
                      {rel.name}
                    </Link>
                  </h4>
                  <p className="text-xs text-steel-500 line-clamp-2 mt-1">
                    {rel.shortDescription}
                  </p>
                  <div className="mt-4 pt-3 border-t border-steel-100">
                    <Link to={`/products/${rel.slug}`}>
                      <Button variant="outline" size="sm" className="w-full justify-center">
                        View Product
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
