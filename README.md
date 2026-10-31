# 🌾 AgriDirect — Farmer-to-Buyer Direct Agricultural Marketplace

A modern, full-stack marketplace prototype connecting regional verified farmers directly with retail consumers and institutional buyers. Built for hackathon demonstration with seamless role simulation, live inventory validation, and zero middleman markups.

---

## 🚀 Key Features

### 1. Global Role Simulation (Header Switcher)
- **`[🛒 Buyer Mode]`**: Search catalog, filter by produce categories and fulfillment types, add to basket with real-time stock ceiling checks, and track orders.
- **`[🌾 Farmer Mode]`**: View simulated crop revenue, manage live produce listings, quick-edit stock quantities, and advance incoming orders through the fulfillment pipeline (`Requested` ➔ `Accepted` ➔ `Ready` ➔ `Completed`).
- **`[🛡️ Admin Mode]`**: Marketplace moderation center with listing controls (`Approve`, `Flag/Suspend`, `Delete Duplicate`) and an immutable platform action audit log.
- **Persistent State**: In-memory + `LocalStorage` reactive persistence preserves all updates across page reloads and role transitions.
- **One-Click Demo Reset**: Restore the marketplace back to its original 5 farmers and 15 produce listings at any time.

### 2. Pre-Seeded Real-World Mock Data
- **5 Verified Regional Farmers** with complete biographies, locations, ratings, contacts, and badges:
  - Rajesh Kumar (*Green Valley Organic Farm*, Nashik, Maharashtra)
  - Sunita Devi (*Surya Agro Orchards*, Ratnagiri, Maharashtra)
  - Harpreet Singh (*Golden Fields Farmstead*, Ludhiana, Punjab)
  - Ananya Reddy (*Deccan Spice & Dairy Farms*, Guntur, Andhra Pradesh)
  - Vikram Patel (*Narmada River Greens*, Anand, Gujarat)
- **15 Agricultural Products** across 5 categories:
  - **Grains**: Sharbati Golden Wheat, Aged Basmati Paddy, Unpolished Pearl Millet
  - **Vegetables**: Vine Cherry Tomatoes, Red Bell Peppers, Nashik Red Onions, Seedless Cucumbers
  - **Fruits**: Royal Alphonso Mangoes, Sweet Kinnow Mandarins, Fresh Hill Strawberries
  - **Dairy/Poultry**: Pure A2 Desi Cow Raw Milk, Free-Range Brown Eggs
  - **Spices**: Sun-Dried Guntur Red Chillies, Cold-Pressed Mustard Oil, High-Curcumin Lakadong Turmeric
- **3 Sample Pre-existing Orders** to demonstrate live pipeline status tracking upon initial load.

### 3. Business Logic & Constraints
- **Strict Stock Verification**: When an order is placed, items decrement in real time. If stock hits 0, the item transitions to "Out of Stock".
- **Automatic Stock Restoration**: When an order is cancelled or declined, reserved inventory is automatically restored.
- **Simulated Payment Confirmations**: Instant mock UPI / NetBanking and simulated Cash on Delivery / Pickup without collecting sensitive credentials.
- **Mobile-First Responsive Layout**: Optimized for mobile devices and smartphones.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Vanilla CSS Design System
- **Icons**: Lucide React
- **Animations**: Canvas Confetti, Micro-animations

---

## 💻 Getting Started Locally

```bash
# Clone the repository
git clone https://github.com/pallepraneeth07-art/agridirect.git

# Navigate into the project
cd agridirect

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to explore the marketplace.
