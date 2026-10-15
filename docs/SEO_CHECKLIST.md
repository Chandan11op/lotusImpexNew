# TECHNICAL & PRODUCT SEO SPECIFICATION — LOTUS IMPEX & AERON

This document specifies the technical SEO architecture, structured data schemas, canonical URL hierarchies, sitemap protocols, and international targeting for sustainable organic B2B visibility.

---

## 1. Core Technical SEO Architecture

- [x] **Canonical URLs:** Every indexable public page specifies an explicit canonical tag (`<link rel="canonical" href="..." />`) to prevent duplicate indexing across query parameters.
- [x] **Robots Configuration (`robots.txt`):**
  - Allows public crawling of `/`, `/products`, `/industries`, `/quality`, `/about`, `/contact`, `/supply-process`.
  - Disallows internal administrative endpoints: `Disallow: /crm/`, `Disallow: /login`, `Disallow: /api/`.
  - Declares canonical XML sitemap location: `Sitemap: https://www.lotusimpex.com/sitemap.xml`.
- [x] **XML Sitemap (`sitemap.xml`):**
  - Dynamically or statically indexes all public pages, categories, and priority product detail URLs with `changefreq` and `priority` directives.
- [x] **Semantic Heading Hierarchy:**
  - Strict single `<h1>` tag per page containing high-value engineering intent.
  - Logical `<h2>` and `<h3>` technical subheadings (e.g. Dimensions, Material Grades, Surface Finish, Standards Compliance).
- [x] **Descriptive Image Alt Attributes:**
  - Every product photograph and diagram contains descriptive, context-rich alt text (e.g. *"SS 316L Electro-Polished Sanitary Pipe Ra < 0.4 µm Tri-Clamp End"*).
- [x] **Breadcrumb Navigation:**
  - Accessible visual breadcrumbs and matching schema breadcrumbs on all category and product views.

---

## 2. Product SEO & Technical Search Intent

Target queries focus on high-intent industrial procurement terms combining:
- **Material Grade:** `SS 316L`, `SS 304`, `AISI 316L`
- **Surface Finish:** `Electro-Polished (EP)`, `Mechanically Polished (MP)`, `Ra < 0.4 µm`, `Ra < 0.8 µm`
- **Component Classification:** `Sanitary Pipe`, `Hygienic Tubing`, `Tri-Clamp Ferrule`, `Sanitary Butterfly Valve`, `Diaphragm Valve`
- **Applicable Standards:** `ASTM A270`, `ASME BPE`, `DIN 11850`, `BS 4825`, `3-A Sanitary Standards`
- **Process Application:** `Pharma WFI Loop`, `Biotech Fermentation`, `Dairy Processing`, `CIP / SIP Lines`

---

## 3. Structured Data (JSON-LD Schemas)

### A. Organization Schema (Injected on Homepage)
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Lotus Impex",
  "alternateName": "Lotus Tubes",
  "url": "https://www.lotusimpex.com",
  "logo": "https://www.lotusimpex.com/logo.svg",
  "description": "Indian supplier and exporter of stainless steel sanitary tubes, hygienic fittings, valves, and tri-clamp process components.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Unit 14, Industrial Area, Kanjurmarg West",
    "addressLocality": "Mumbai",
    "addressRegion": "Maharashtra",
    "postalCode": "400078",
    "addressCountry": "IN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-98200-00000",
    "contactType": "sales",
    "availableLanguage": ["English", "Hindi"]
  }
}
```

### B. Product Schema (Injected on Individual Product Pages)
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "SS 316L Electro-Polished Sanitary Pipe",
  "sku": "LI-EP-316L-01",
  "description": "High-purity electro-polished stainless steel sanitary pipe complying with ASTM A270-S2 and ASME BPE standards for pharmaceutical WFI and bioprocessing.",
  "material": "Stainless Steel 316L",
  "category": "Sanitary Pipes and Tubes",
  "brand": {
    "@type": "Brand",
    "name": "Aeron"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "INR",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition",
    "seller": {
      "@type": "Organization",
      "name": "Lotus Impex"
    }
  }
}
```

---

## 4. International SEO & Multilingual Targeting

- [x] **Locale-Aware Meta:** Support for English (`en`), Hindi (`hi`), German (`de`), Arabic (`ar`), Spanish (`es`), and French (`fr`).
- [x] **Hreflang Tags:** Prepared hreflang mapping for multi-regional targeting:
  - `en-IN` (India)
  - `en-US` (United States)
  - `en-GB` (United Kingdom)
  - `en-AE` (United Arab Emirates)
  - `de-DE` (Germany)
  - `ar-SA` (Saudi Arabia)
- [x] **RTL Layout Readiness:** Directional stylesheet attributes (`dir="rtl"`) configured for Arabic language rendering.
- [x] **Zero Machine Keyword Stuffing:** Natural engineering language without spammy programmatic location permutations.
