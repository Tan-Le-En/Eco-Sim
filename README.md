# ECO//SIM — Teluk Nusa Coastal City 2050

> **An Interactive Field Study of Coastal Resilience (2026–2050)**  
> *"Change one thing, watch everything change. Simple enough for a child; rigorous enough for a climate researcher."*

---

## 🌊 Overview

**ECO//SIM** is an interactive ecological and policy simulation engine focused on **Teluk Nusa**, a fictional coastal town situated on the Strait of Malacca. Teluk Nusa faces the real-world climate crises confronting thousands of coastal settlements across Southeast Asia: declining marine fish stocks, intensifying monsoon storm surges, saltwater intrusion in freshwater tables, and shifting socio-economic livelihoods.

The platform provides a dynamic sandbox where users manage 5 key policy levers over a 25-year timeline (2026–2050) to balance coastal protection, biodiversity, energy transition, clean water supply, and public economic well-being.

---

## ✨ Key Features

- **🎮 Interactive 25-Year Simulator (`/simulator`)**:
  - Spatial 20×20 city map rendering 400 interactive tiles in real time (60 FPS SVG rendering).
  - Multi-variable trajectory charts powered by [Recharts](https://recharts.org/).
  - Real-time event notifications for critical ecological tipping points (e.g., mangrove collapse, storm surges).
- **🎛️ Policy Lever System**:
  1. **⚡ Clean Energy Ratio**: Transition power generation from fossil fuels to solar & wind to cut carbon emissions.
  2. **🛡️ Coastal Sea Wall**: Build hard engineering barriers to absorb monsoon wave energy and reduce flood damage.
  3. **🌱 Mangrove Restoration**: Replant natural mangrove buffers to protect shorelines and restore fish nurseries.
  4. **💧 Water Recycling & Desalination**: Expand water treatment to prevent drought and combat aquifer salinization.
  5. **🐟 Fishing Quotas & Fleet Limits**: Regulate fishing activity to allow marine stocks to replenish.
- **📊 Scenario Management & Results Scorecard (`/results`)**:
  - Comprehensive 2050 verdict evaluation across environmental, economic, and social categories.
  - Side-by-side scenario comparison to save and benchmark different policy strategies.
  - Visual causal chains highlighting how specific choices led to key outcomes.
- **📖 Guided Field Story Mode (`/story`)**:
  - A 5-chapter interactive narrative introducing Teluk Nusa's ecosystem, local community, and environmental vulnerabilities.
- **🔍 Full Model Transparency (`/transparency`)**:
  - Complete mathematical formulas, differential equations, baseline values, and tipping point thresholds documented openly.
- **🎨 Editorial Aesthetic & Design System**:
  - Crafted with a field-study documentary layout, responsive light/dark themes, clean typography (*Newsreader*, *Public Sans*, *IBM Plex Mono*), and real photography.

---

## 🛠️ Technology Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS v4](https://tailwindcss.com/)
- **State & Routing**: [Wouter](https://github.com/molefrog/wouter) (Client Routing), React Context API
- **Animations & Icons**: [Framer Motion](https://www.framer.com/motion/), [Lucide React](https://lucide.dev/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/), Shadcn UI primitives, Sonner toasts
- **Backend & Server**: Node.js, [Express](https://expressjs.com/)
- **Build Tooling**: [Vite](https://vitejs.dev/), [Esbuild](https://esbuild.github.io/)

---

## 📁 Directory Structure

```
Eco-Sim/
├── client/
│   ├── index.html              # Entry HTML with preloads & Google Fonts
│   └── src/
│       ├── components/         # Reusable UI components (CityMap, Header, Footer, Charts)
│       ├── contexts/           # React Context providers (SimContext, ThemeContext)
│       ├── lib/
│       │   └── sim/            # Core Simulation Engine & Mathematical Models
│       │       ├── engine.ts   # Year-by-year 2026–2050 simulation engine logic
│       │       ├── cityMap.ts  # 20x20 Tile map generator & spatial updates
│       │       └── types.ts    # TypeScript definitions for indicators & levers
│       ├── pages/              # Application pages (Home, Briefing, Simulator, Results, Story, etc.)
│       ├── App.tsx             # Main App layout & route switchboard
│       └── index.css           # Design tokens, CSS variables, & typography rules
├── server/
│   └── index.ts                # Express production server & static asset handler
├── shared/                     # Shared type contracts and constants
├── docs/                       # Development logs & architectural specifications
├── vite.config.ts              # Vite configuration & storage proxy
└── package.json                # Dependencies and npm scripts
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **Package Manager**: `npm` or `pnpm`

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Tan-Le-En/Eco-Sim.git
   cd Eco-Sim
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Build for Production**:
   ```bash
   npm run build
   ```

5. **Start Production Server**:
   ```bash
   npm start
   ```

---

## 📈 Simulation Indicators

| Indicator | Symbol | Unit | Baseline (2026) | Target (2050) | Description |
|---|---|---|---|---|---|
| **Carbon Emissions** | ⚡ | Mt CO₂/yr | 1.00 | ≤ 0.30 | Annual carbon footprint from power and industry |
| **Flood Protection** | 🌊 | % | 30% | ≥ 80% | Combined protection against high tide & storm surges |
| **Fish Biomass** | 🐟 | Index | 40 | ≥ 75 | Coastal marine population and nursery health |
| **Freshwater Supply** | 💧 | % | 50% | ≥ 85% | Percentage of population with reliable fresh drinking water |
| **Town Economy** | 🏙️ | Index | 50 | ≥ 70 | Local business vitality, eco-tourism, & employment |
| **Community Mood** | 😊 | Index | 50 | ≥ 75 | Resident happiness, public health, & disaster security |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
