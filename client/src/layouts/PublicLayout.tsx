import React, { useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { Navbar } from '../components/public/Navbar';
import { Footer } from '../components/public/Footer';
import { EnquiryModal } from '../components/public/EnquiryModal';
import { Product } from '../types';

export interface PublicContextType {
  openQuoteModal: (product?: { _id: string; name: string }) => void;
}

export const PublicLayout: React.FC = () => {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ _id: string; name: string } | undefined>(
    undefined
  );

  const openQuoteModal = (product?: { _id: string; name: string }) => {
    setSelectedProduct(product);
    setIsQuoteOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-steel-50 text-steel-900">
      <Navbar onRequestQuote={() => openQuoteModal()} />

      <main className="flex-1">
        <Outlet context={{ openQuoteModal } satisfies PublicContextType} />
      </main>

      <Footer />

      <EnquiryModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
};

export function usePublicContext() {
  return useOutletContext<PublicContextType>();
}
