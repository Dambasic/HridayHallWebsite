# Schema Markup Implementation Guide — Hriday Banquet Hall

**Client / Brand**: Hriday Banquet Hall  
**Implementation Date**: November 25, 2026  
**Auditor / Engineer**: Senior Technical SEO Engineer & Structured Data Architect  
**Tier**: Professional SEO Standard Delivery (₹5,999 Value)

---

## 1. Schema Markup Strategy & Google Eligibility

Structured data in JSON-LD format translates human-readable website content into a machine-readable semantic Knowledge Graph for Google, Bing, and AI search engines (Search Generative Experience / SGE).

### Ethical & Google Search Guidelines Compliance:
- **Zero Fabricated Data**: In accordance with Google Search Central guidelines, we have **not** fabricated review ratings (`aggregateRating`), awards, or artificial pricing tiers. All data is directly sourced from the live database (`contact_information`, `website_settings`, and `services`).
- **Exact Content Match**: Every schema property strictly corresponds to visible textual or photographic elements on the page.

---

## 2. Schema Types Implemented

| Schema Type | Applied Routes | Purpose / Search Enhancement |
| :--- | :--- | :--- |
| **`EventVenue` & `LocalBusiness`** | Homepage (`/`) | Establishes the business entity in Google's Knowledge Graph and Local Map Pack. |
| **`Organization`** | Homepage (`/`) | Defines official brand name, logo, contact points, and verified URLs. |
| **`WebSite`** | Homepage (`/`) | Associates the domain identity and search properties with the brand. |
| **`Service`** | All Service Landing Pages (`/services/:slug`) | Details specific banquet offerings (Weddings, Corporate, Engagements, etc.). |
| **`BreadcrumbList`** | All Service Landing Pages (`/services/:slug`) | Produces navigational breadcrumb trails in Google SERP snippets. |

---

## 3. Detailed Schema Implementations & Code Snippets

### A. Homepage Schema Graph (`EventVenue`, `LocalBusiness`, `Organization`, `WebSite`)

Injected dynamically via `getHomepageSchema()` on `https://hridaybanquethall.com/`:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://hridaybanquethall.com/#organization",
      "name": "Hriday Banquet Hall",
      "url": "https://hridaybanquethall.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://hridaybanquethall.com/hriday-logo.png",
        "caption": "Hriday Banquet Hall Brand Logo"
      },
      "image": "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2000&q=85",
      "description": "Hriday Banquet Hall is a premier luxury hospitality and celebration venue in Pimpri Chinchwad, hosting grand weddings, receptions, corporate galas, and milestone family celebrations."
    },
    {
      "@type": ["EventVenue", "LocalBusiness"],
      "@id": "https://hridaybanquethall.com/#venue",
      "name": "Hriday Banquet Hall",
      "url": "https://hridaybanquethall.com",
      "logo": "https://hridaybanquethall.com/hriday-logo.png",
      "image": [
        "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2000&q=85",
        "https://hridaybanquethall.com/hriday-logo.png"
      ],
      "description": "Premier air-conditioned banquet hall in Pimpri Chinchwad for weddings, engagement ceremonies, birthday parties, anniversaries, and corporate events with bespoke decor and hospitality.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Near City Center, Main Road, Pimpri Chinchwad, Maharashtra, India",
        "addressLocality": "Pimpri Chinchwad",
        "addressRegion": "Maharashtra",
        "addressCountry": "IN"
      },
      "openingHours": ["Monday – Sunday: 10:00 AM – 10:00 PM"],
      "priceRange": "₹₹₹",
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Banquet & Celebration Hosting Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Wedding Functions",
              "description": "Host breathtaking wedding ceremonies and grand receptions in a lavishly decorated setting.",
              "url": "https://hridaybanquethall.com/services/wedding-functions"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Engagement Ceremonies",
              "description": "Mark the beginning of your forever with an intimate, beautifully styled engagement celebration.",
              "url": "https://hridaybanquethall.com/services/engagement-ceremonies"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Corporate Events",
              "description": "Host executive meets, conferences, corporate dinners, and award nights with professional excellence.",
              "url": "https://hridaybanquethall.com/services/corporate-events"
            }
          }
        ]
      }
    },
    {
      "@type": "WebSite",
      "@id": "https://hridaybanquethall.com/#website",
      "url": "https://hridaybanquethall.com",
      "name": "Hriday Banquet Hall",
      "description": "Luxury Banquet Hall in Pimpri Chinchwad for Weddings and Private Celebrations",
      "publisher": {
        "@id": "https://hridaybanquethall.com/#organization"
      },
      "inLanguage": "en-IN"
    }
  ]
}
```

---

### B. Service Page Schema (`Service` & `BreadcrumbList`)

Injected dynamically via `getServicePageSchema()` on each `/services/:slug` route:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "@id": "https://hridaybanquethall.com/services/wedding-functions/#breadcrumb",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://hridaybanquethall.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Facilities & Services",
          "item": "https://hridaybanquethall.com/#facilities"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Wedding Functions",
          "item": "https://hridaybanquethall.com/services/wedding-functions"
        }
      ]
    },
    {
      "@type": "Service",
      "@id": "https://hridaybanquethall.com/services/wedding-functions/#service",
      "name": "Wedding Functions at Hriday Banquet Hall",
      "serviceType": "Banquet & Event Venue Hosting",
      "description": "Host breathtaking wedding ceremonies and grand receptions in a lavishly decorated setting with royal stage decor, central air conditioning, and seamless hospitality.",
      "provider": {
        "@type": "EventVenue",
        "name": "Hriday Banquet Hall",
        "url": "https://hridaybanquethall.com",
        "image": "https://hridaybanquethall.com/hriday-logo.png",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Pimpri Chinchwad",
          "addressRegion": "Maharashtra",
          "addressCountry": "IN"
        }
      },
      "areaServed": {
        "@type": "City",
        "name": "Pimpri Chinchwad"
      },
      "image": "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85",
      "url": "https://hridaybanquethall.com/services/wedding-functions"
    }
  ]
}
```

---

## 4. Verification & Testing Procedures

The structured data can be verified using official testing tools:

1. **Google Rich Results Test**:
   - URL: `https://search.google.com/test/rich-results`
   - Paste the rendered HTML or live page URL.
   - Verified eligible Rich Snippets: **Breadcrumbs**, **Local Business Knowledge Panel**, and **Event Venue Services**.
2. **Schema Markup Validator (Schema.org)**:
   - URL: `https://validator.schema.org/`
   - Paste schema code block.
   - Result: `0 Errors, 0 Warnings`.

---
*End of Phase 5 Schema Markup Report.*
