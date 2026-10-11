import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ArrowRight, Layers, Tag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onRequestQuote: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onRequestQuote }) => {
  const fallbackImage =
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
  const displayImage = product.images?.[0] || fallbackImage;

  return (
    <div className="group bg-white rounded-xl border border-steel-200/90 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden">
      {/* Image container */}
      <div className="relative aspect-4/3 bg-steel-100 overflow-hidden border-b border-steel-100">
        <img
          src={displayImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Badge variant="primary" size="sm">
            {product.category}
          </Badge>
          {product.isFeatured && (
            <Badge variant="orange" size="sm">
              Featured
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-steel-900 group-hover:text-brand-blue transition-colors line-clamp-2">
            <Link to={`/products/${product.slug}`}>{product.name}</Link>
          </h3>

          <p className="mt-2 text-xs text-steel-600 line-clamp-2 leading-relaxed">
            {product.shortDescription}
          </p>

          {/* Quick Technical Specs Snippet */}
          <div className="mt-4 pt-3 border-t border-steel-100 space-y-1.5 text-xs text-steel-600">
            <div className="flex items-center justify-between">
              <span className="text-steel-400 flex items-center gap-1">
                <Tag className="h-3 w-3" /> Material:
              </span>
              <span className="font-semibold text-steel-800">{product.grade}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-steel-400 flex items-center gap-1">
                <Layers className="h-3 w-3" /> Connection:
              </span>
              <span className="font-semibold text-steel-800 truncate max-w-[170px]" title={product.connectionType}>
                {product.connectionType}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 pt-3 border-t border-steel-100 flex items-center gap-2">
          <Link to={`/products/${product.slug}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full justify-between">
              <span>View Specs</span>
              <ArrowRight className="h-3.5 w-3.5 text-steel-400" />
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={() => onRequestQuote(product)}
            className="flex-1"
          >
            Quote RFQ
          </Button>
        </div>
      </div>
    </div>
  );
};
