import React, { useState } from 'react';
import { Image, FileText, Download, ExternalLink, Shield, Layers } from 'lucide-react';

export function MediaPage() {
  const [activeTab, setActiveTab] = useState<'gallery' | 'technical' | 'downloads'>('gallery');

  const galleryItems = [
    {
      title: 'Electro-Polished Sanitary Tubing (Ra < 0.4 µm)',
      category: 'Pipes & Tubes',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      description: 'Mirror bore finish inspection on SS 316L ASTM A270-S2 tubes for bioprocess distribution loops.',
    },
    {
      title: 'Heavy Duty Tri-Clamp Clamps & Weld Ferrules',
      category: 'Fittings & Clamps',
      image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80',
      description: 'Precision forged 13MHH clamps and CNC machined ferrules ready for batch pass-through inspection.',
    },
    {
      title: 'Sanitary Butterfly Valve Line Assembly',
      category: 'Valves',
      image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
      description: '4-position multi-handle sanitary butterfly valves configured with Tri-clamp ends.',
    },
    {
      title: 'Packaging & End-Capping Inspection',
      category: 'Logistics',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
      description: 'Protective polyethylene caps applied to deburred square-cut tube ends prior to crating.',
    },
  ];

  const downloadDocuments = [
    {
      title: 'Sanitary Tubing Technical Specification Guide (ASTM A270 / ASME BPE)',
      format: 'PDF',
      size: '2.4 MB',
      description: 'Dimensional tables, wall thickness schedules (16 SWG / 14 SWG), chemical composition limits, and Ra roughness definitions.',
    },
    {
      title: 'Tri-Clamp Fittings & Gasket Dimensional Matrix (BS 4825 Part 3)',
      format: 'PDF',
      size: '1.8 MB',
      description: 'Flange diameters, ferrule lengths, clamp pressure ratings, and elastomer compatibility chart (Silicone, EPDM, PTFE).',
    },
    {
      title: 'Standard Mill Test Certificate (MTC EN 10204 3.1) Sample Template',
      format: 'PDF',
      size: '850 KB',
      description: 'Specimen copy showing heat batch number correlation, chemical analysis, tensile testing, and eddy current test verification.',
    },
    {
      title: 'Clean-in-Place (CIP) Tank Cleaning Spray Ball Selection Chart',
      format: 'PDF',
      size: '1.2 MB',
      description: 'Flow rate curves, pressure drop parameters, and 360-degree coverage diagrams for process vessel washdown.',
    },
  ];

  return (
    <div className="bg-steel-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-b from-steel-900 to-steel-950 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-steel-800">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-steel-800/80 border border-steel-700 text-xs font-semibold uppercase tracking-wider text-accent-teal mb-4">
            Technical Resources & Media
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-3xl font-heading">
            Media Gallery & Technical Assets
          </h1>
          <p className="mt-4 text-lg text-steel-300 max-w-3xl leading-relaxed">
            High-resolution product imagery, technical drawing references, and downloadable engineering datasheets for sanitary piping designers and procurement engineers.
          </p>

          {/* Navigation Tabs */}
          <div className="flex gap-2 mt-8 border-b border-steel-800 pb-px">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-4 py-2.5 font-semibold text-sm rounded-t-lg transition-all ${
                activeTab === 'gallery'
                  ? 'bg-steel-800 text-white border-t-2 border-primary-500'
                  : 'text-steel-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4" />
                Product Photography
              </div>
            </button>
            <button
              onClick={() => setActiveTab('downloads')}
              className={`px-4 py-2.5 font-semibold text-sm rounded-t-lg transition-all ${
                activeTab === 'downloads'
                  ? 'bg-steel-800 text-white border-t-2 border-primary-500'
                  : 'text-steel-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Technical Downloads
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {activeTab === 'gallery' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {galleryItems.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-steel-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className="h-64 overflow-hidden relative bg-steel-900">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute top-4 left-4 bg-steel-900/80 backdrop-blur-sm text-steel-200 text-xs px-2.5 py-1 rounded-md border border-steel-700/50">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-steel-900 font-heading mb-2">
                      {item.title}
                    </h3>
                    <p className="text-steel-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-white rounded-xl p-8 border border-steel-200 text-center max-w-2xl mx-auto">
              <Shield className="w-10 h-10 text-primary-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-steel-900 font-heading">
                Authentic Media Transparency
              </h3>
              <p className="text-steel-600 text-sm mt-2 leading-relaxed">
                Lotus Impex provides genuine photographic documentation of physical stock batches upon customer request. High-resolution multi-angle photographs and video borescope recordings of internal tube surfaces can be arranged prior to dispatch.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'downloads' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            {downloadDocuments.map((doc, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-steel-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm hover:border-steel-300 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary-50 border border-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-steel-900 font-heading">
                      {doc.title}
                    </h3>
                    <p className="text-steel-500 text-xs mt-1 leading-relaxed">
                      {doc.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-xs font-semibold text-steel-400">
                      <span className="uppercase">{doc.format}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span className="text-primary-600">English Specification</span>
                    </div>
                  </div>
                </div>

                <a
                  href="/request-quote"
                  className="inline-flex items-center gap-2 bg-steel-900 hover:bg-steel-800 text-white text-xs font-semibold px-4 py-2.5 rounded-lg whitespace-nowrap transition-colors flex-shrink-0"
                >
                  <Download className="w-4 h-4 text-accent-teal" />
                  Request Document
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
