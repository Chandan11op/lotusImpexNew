import React, { useState } from 'react';
import { RotateCw, RotateCcw, ZoomIn, Info } from 'lucide-react';
import { Button } from '../ui/Button';

interface InteractiveViewer360Props {
  productName: string;
  images: string[];
}

export const InteractiveViewer360: React.FC<InteractiveViewer360Props> = ({
  productName,
  images,
}) => {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const fallbackImage =
    images[0] ||
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';

  const rotateLeft = () => setRotationAngle((prev) => (prev - 45 + 360) % 360);
  const rotateRight = () => setRotationAngle((prev) => (prev + 45) % 360);

  return (
    <div className="bg-steel-900 text-white rounded-xl overflow-hidden border border-steel-700 shadow-md">
      {/* Top Banner Notice */}
      <div className="bg-steel-800/90 px-4 py-2 border-b border-steel-700 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-steel-300">
          <Info className="h-4 w-4 text-brand-lightBlue shrink-0" />
          <span>Interactive 360° Inspection Simulation (Demonstration View)</span>
        </div>
        <span className="font-mono text-cyan-400 font-bold">{rotationAngle}° ANGLE</span>
      </div>

      {/* Main Viewing Stage */}
      <div className="relative aspect-4/3 flex items-center justify-center p-8 bg-radial from-steel-800 to-steel-950 overflow-hidden select-none">
        {/* Subtle Angle Indicator Grid */}
        <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center">
          <div className="w-64 h-64 border-2 border-dashed border-cyan-400 rounded-full" />
          <div className="w-96 h-96 border border-steel-600 rounded-full absolute" />
        </div>

        {/* Product Visual with Simulated Rotation and Zoom */}
        <div
          className={`transition-all duration-300 ease-out cursor-grab active:cursor-grabbing ${
            isZoomed ? 'scale-125' : 'scale-100'
          }`}
          style={{
            transform: `perspective(800px) rotateY(${rotationAngle}deg) ${
              isZoomed ? 'scale(1.25)' : 'scale(1)'
            }`,
          }}
        >
          <img
            src={fallbackImage}
            alt={`${productName} 360 angle`}
            className="max-h-64 object-contain drop-shadow-2xl pointer-events-none rounded-lg"
          />
        </div>

        {/* Bottom floating angle dial */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={rotateLeft}
              icon={<RotateCcw className="h-3.5 w-3.5" />}
              className="bg-steel-800/90 hover:bg-steel-700 text-white border border-steel-600"
            >
              Rotate -45°
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={rotateRight}
              icon={<RotateCw className="h-3.5 w-3.5" />}
              className="bg-steel-800/90 hover:bg-steel-700 text-white border border-steel-600"
            >
              Rotate +45°
            </Button>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsZoomed(!isZoomed)}
            icon={<ZoomIn className="h-3.5 w-3.5" />}
            className="bg-steel-800/90 hover:bg-steel-700 text-white border border-steel-600"
          >
            {isZoomed ? 'Reset Zoom' : 'Inspect Bore'}
          </Button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-steel-950 px-4 py-2.5 text-[11px] text-steel-400 flex items-center justify-between border-t border-steel-800">
        <span>Component: {productName}</span>
        <span className="text-steel-400">Drag or click buttons to simulate 3D rotation inspection</span>
      </div>
    </div>
  );
};
