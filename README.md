# IntelliGene (RIFT) / PharmaGuard

AI-powered pharmacogenomic risk analysis for safer, gene-informed medication decisions.

## Submission Links (RIFT Requirements)

- **Live deployed web app (public):** https://rift2.vercel.app
- **Live backend API:** https://rift2.onrender.com
- **LinkedIn video demo (public, 2–5 min):** https://www.linkedin.com/posts/advait-kumar-jha-90521531b_pwioi-rift2026-rift2026-activity-7430425548889403393-LiRl
- **GitHub repository (public):** https://github.com/AkshatChauhan18/rift2

---

## Project Overview

IntelliGene analyzes pharmacogenomic variants from VCF data and provides CPIC-guided medication risk insights, including:
- risk classification (`Safe`, `Adjust Dosage`, `Toxic`, etc.)
- phenotype-aware pharmacogenomic profile
- variant-focused clinical explanation (OpenAI-backed with fallback)
- safety warnings and dosage guidance summary

---

## Architecture Overview

### High-Level Flow

1. User uploads a VCF file in the React frontend.
2. Frontend parses variant data and computes drug-gene confidence context.
3. Frontend sends normalized payload to FastAPI backend.
4. Backend validates drug/gene support and computes risk labels.
5. Backend returns structured recommendation + explanation JSON.
6. Frontend renders risk cards, profile, and downloadable outputs.

### Repository Structure

```text
.
├── backend/
│   ├── main.py               # FastAPI app and pharmacogenomic logic
│   ├── requirements.txt      # Python dependencies
│   ├── sample.vcf            # Sample test VCF
│   └── test_tpmt.vcf         # Additional sample VCF
├── frontend/
│   ├── src/
│   │   ├── pages/            # Index, Analysis, Results, History, etc.
│   │   ├── components/       # UI + domain components
│   │   ├── services/api.ts   # Backend API integration
│   │   └── utils/            # Validation, parser, mock data
│   ├── .env.example          # Frontend environment template
│   ├── package.json          # Node scripts and dependencies
│   └── vercel.json           # Vercel deployment config
├── render.yaml               # Render service config (backend)
└── README.md
```

---

## Tech Stack

### Frontend
- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui + Radix UI
- React Router, TanStack Query, Framer Motion
- Vitest + Testing Library

### Backend
- FastAPI + Uvicorn
- Pydantic
- Python Dotenv
- OpenAI SDK (optional for generated explanations)

### Deployment
- Backend: Render
- Frontend: Vercel

---

## Installation Instructions

## Prerequisites
- Python 3.10+
- Node.js 18+
- npm (or bun)

### 1) Clone Repository

```bash
git clone https://github.com/AkshatChauhan18/rift2.git
cd rift2
```

### 2) Backend Setup (FastAPI)

```bash
cd backend
python -m venv .venv
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create `.env` in `backend/`:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini
```

Run backend:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend local URL: `http://localhost:8000`

### 3) Frontend Setup (React)

```bash
cd ../frontend
npm install
```

Create `.env.local` in `frontend/` (or copy from `.env.example`):

```env
VITE_API_URL=http://localhost:8000
VITE_USE_MOCK=false
```

Run frontend:

```bash
npm run dev
```

Frontend local URL: shown by Vite (typically `http://localhost:5173`)

---

## API Documentation

Base URL (prod): `https://rift2.onrender.com`

### POST `/analyze`

Analyze a drug-gene profile with optional variant list and explanation.

**Request body**

```json
{
  "drug": "CLOPIDOGREL",
  "primary_gene": "CYP2C19",
  "diplotype": "*2/*2",
  "phenotype": "PM",
  "detected_variants": [
    {
      "rsid": "rs4244285",
      "gene": "CYP2C19",
      "variant_info": "*2 · no function"
    }
  ],
  "confidence": 0.89,
  "cpic_evidence": "A",
  "risk_level": "high",
  "include_explanation": true
}
```

**Response (shape)**
- `patient_id`, `timestamp`, `drug`
- `risk_assessment` (`risk_label`, `confidence_score`, `severity`)
- `pharmacogenomic_profile` (gene, phenotype, diplotype, variants)
- `clinical_recommendation` (summary, dosage, warnings)
- `llm_generated_explanation`
- `quality_metrics`

### POST `/variant-summary`

Generate variant-specific summary for a selected variant.

**Request body**

```json
{
  "drug": "CLOPIDOGREL",
  "primary_gene": "CYP2C19",
  "phenotype": "PM",
  "diplotype": "*2/*2",
  "variant_rsid": "rs4244285",
  "variant_gene": "CYP2C19",
  "variant_info": "*2 · no function"
}
```

---

## Usage Examples

### Frontend Workflow
1. Open the web app.
2. Upload one of the sample VCF files:
   - `backend/sample.vcf`
   - `backend/test_tpmt.vcf`
   - `frontend/public/sample.vcf`
3. Select medication and run analysis.
4. Review risk label, confidence, and recommendations.
5. Click detected variants for detailed explanation.

### cURL Example (`/analyze`)

```bash
curl -X POST "https://rift2.onrender.com/analyze" \
  -H "Content-Type: application/json" \
  -d '{
    "drug":"WARFARIN",
    "primary_gene":"CYP2C9",
    "diplotype":"*1/*3",
    "phenotype":"IM",
    "detected_variants":[{"rsid":"rs1057910","gene":"CYP2C9","variant_info":"*3 · decreased function"}],
    "confidence":0.82,
    "include_explanation":true
  }'
```

---

## Supported Drugs and Genes

| Drug | Primary Gene |
|------|--------------|
| CODEINE | CYP2D6 |
| WARFARIN | CYP2C9 |
| CLOPIDOGREL | CYP2C19 |
| SIMVASTATIN | SLCO1B1 |
| AZATHIOPRINE | TPMT |
| FLUOROURACIL | DPYD |

---

## Deployment Instructions

### Backend (Render)
- `render.yaml` is already configured.
- Build command: `pip install -r backend/requirements.txt`
- Start command: `uvicorn backend.main:app --host 0.0.0.0 --port 10000`

### Frontend (Vercel)
- `frontend/vercel.json` is configured for Vite SPA rewrites.
- Build command: `npm run build`
- Output directory: `dist`

After deployment, update the link placeholders at the top of this README.

---

## Environment Files

- Frontend template: `frontend/.env.example`
- Backend variables are expected in `backend/.env` (create locally and in deployment secrets)

Recommended backend env vars:
- `OPENAI_API_KEY`
- `OPENAI_MODEL` (default: `gpt-4o-mini`)

Recommended frontend env vars:
- `VITE_API_URL`
- `VITE_USE_MOCK`

---

## Team Members

- `ABhijeet Ojha`
- `Siddharth Sourav`
- `Akshat Chauhan`
- `Advait Kumar Jha`
