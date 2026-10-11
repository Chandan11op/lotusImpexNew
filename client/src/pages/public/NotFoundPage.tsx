import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { FileQuestion, Home, Package } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-24 bg-steel-50 min-h-[70vh] flex items-center justify-center">
      <div className="max-w-md mx-auto text-center px-4 space-y-6">
        <div className="h-16 w-16 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center mx-auto border border-blue-200">
          <FileQuestion className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-steel-900">404</h1>
          <h2 className="text-lg font-bold text-steel-800 mt-1">Page Not Found</h2>
          <p className="text-xs text-steel-600 mt-2">
            The page you are looking for doesn't exist, has been moved, or is restricted to
            authorized personnel.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <Link to="/">
            <Button variant="primary" size="sm" icon={<Home className="h-4 w-4" />}>
              Back to Home
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="outline" size="sm" icon={<Package className="h-4 w-4" />}>
              Product Catalogue
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
