# Manual Client Action Checklist — Post-SEO Handover

**Client / Brand**: Hriday Banquet Hall  
**Date**: November 25, 2026  
**Tier**: Professional SEO Standard Delivery (₹5,999 Value)  
**Deliverable**: Handover Task Checklist & Integration Instructions

---

## 1. Overview

While all **website-side technical, structural, on-page, and schema SEO enhancements have been fully implemented** in the codebase, external search engine accounts require authenticated ownership actions that only the domain owner can authorize.

This checklist provides step-by-step instructions for completing the remaining off-site and account-level integrations.

---

## 2. Status Legend
- ✅ **Completed (Website-Side)**: Already implemented in code and tested.
- 🔑 **Requires Client Access**: External account setup requiring client credentials.
- 📋 **Requires Manual Verification**: Data verification by business owner.

---

## 3. Account-Level Handover Checklist

### Task 1: Google Search Console (GSC) Setup & Sitemap Submission
- **Status**: 🔑 *Requires Client Access*
- **Importance**: Critical for Google discovery, crawling, and performance tracking.
- **Step-by-Step Instructions**:
  1. Navigate to [Google Search Console](https://search.google.com/search-console/).
  2. Sign in with the official business Google account (`admin@hridaybanquet.com` or business Gmail).
  3. Select **Add Property** and choose **Domain** (recommended) or **URL prefix** (`https://hridaybanquethall.com`).
  4. **Verification Method**:
     - *Option A (Recommended - Domain)*: Copy the Google TXT record and add it to your domain's DNS manager (GoDaddy, Namecheap, Cloudflare, BigRock).
     - *Option B (URL Prefix)*: If using HTML meta tag, copy your unique code:
       `<meta name="google-site-verification" content="YOUR_UNIQUE_CODE" />`
       and paste it into `client/index.html` line 48, or provide it to our team.
  5. Once verified, open the left sidebar and click **Sitemaps**.
  6. In the "Add a new sitemap" input, enter:
     `sitemap.xml`
  7. Click **Submit**. Verify the status displays **"Success"**.

---

### Task 2: Google Analytics 4 (GA4) Property Setup
- **Status**: 🔑 *Requires Client Access*
- **Importance**: Tracks user behavior, traffic channels, and WhatsApp quotation conversion rate.
- **Step-by-Step Instructions**:
  1. Open [Google Analytics](https://analytics.google.com/).
  2. Create an Account for **Hriday Banquet Hall** and create a Web Stream.
  3. Copy your unique **Measurement ID** (Format: `G-XXXXXXXXXX`).
  4. Supply your `G-XXXXXXXXXX` to our technical team, or place it in the `<head>` of `client/index.html`:
     ```html
     <!-- Google tag (gtag.js) -->
     <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
     <script>
       window.dataLayer = window.dataLayer || [];
       function gtag(){dataLayer.push(arguments);}
       gtag('js', new Date());
       gtag('config', 'G-XXXXXXXXXX');
     </script>
     ```
  5. *Note: The website already includes an internal real-time analytics tracker on `/admin/dashboard` tracking live visitors and WhatsApp clicks independently.*

---

### Task 3: Google Business Profile (GBP / Google Maps) Optimization
- **Status**: 🔑 *Requires Client Access*
- **Importance**: Vital for ranking in the Local 3-Pack for queries like "Banquet hall near me" and "Wedding venue in Pimpri Chinchwad".
- **Action Items**:
  1. **Claim / Verify Listing**: Claim "Hriday Banquet Hall" on [Google Business Profile](https://business.google.com/).
  2. **NAP Consistency (Name, Address, Phone)**: Ensure the business name, address, and telephone number match *exactly* with what is listed on the website:
     - **Business Name**: `Hriday Banquet Hall`
     - **Primary Category**: `Banquet Hall`
     - **Secondary Categories**: `Wedding Venue`, `Event Venue`, `Party Planner`
     - **Website Link**: Set directly to `https://hridaybanquethall.com/`
     - **Appointment / Booking Link**: Set to `https://hridaybanquethall.com/#contact`
  3. **High-Resolution Photography**: Upload 25+ authentic photos of the banquet interior, stage setups, crystal chandeliers, dining area, and night facade (matching the website gallery).
  4. **Operating Hours**: Configure Monday – Sunday: 10:00 AM – 10:00 PM.

---

### Task 4: Complete Public Contact Info in Website Admin Settings
- **Status**: 📋 *Requires Manual Verification*
- **Importance**: Ensures click-to-call links and WhatsApp inquiry channels function with the owner's real business numbers.
- **Action Items**:
  1. Log into your Admin Panel at `https://hridaybanquethall.com/admin/login` (Username: `admin`, Password: `HridayAdmin@2026`).
  2. Go to **WhatsApp Settings** (`/admin/whatsapp`) -> Add the official Hriday WhatsApp number.
  3. Go to **Contact & Location** (`/admin/contact`) -> Add public phone number, venue email, and verified street address.
  4. Click **Save Changes**. The website updates immediately without code edits.

---

### Task 5: Local Directory Citations & Aggregator Profiles
- **Status**: 📋 *Recommended Future Task*
- **Importance**: High-authority citations reinforce geographic relevance and domain authority.
- **Target Directories**:
  1. **WedMeGood** (Create verified venue profile under Pimpri Chinchwad banquets).
  2. **WeddingWire India** (List venue capacity, amenities, and photo gallery).
  3. **JustDial Pimpri Chinchwad** (Complete business listing with website link).
  4. **Sulekha Events** (Banquet category listing).
  5. **IndiaMart** (Event hosting listing).

---

## 4. Summary Matrix of Post-Handover Actions

| Task | Category | Responsible Party | Estimated Time | Priority |
| :--- | :--- | :--- | :---: | :---: |
| GSC Verification & Sitemap | Indexing | Client / Webmaster | 10 mins | 🔥 High |
| GA4 Measurement ID | Analytics | Client / Webmaster | 5 mins | Medium |
| Google Business Profile Verification | Local SEO | Business Owner | 15 mins | 🔥 High |
| Enter Real Phone & WhatsApp in Admin | Conversion | Business Owner | 5 mins | 🔥 High |
| Local Directory Listings | Off-Page SEO | Marketing Team | 2–3 hours | Medium |

---
*End of Manual Client Checklist.*
