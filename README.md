# PharmaGuard (RIFT Hackathon Part 2)

AI-powered pharmacogenomic risk analysis for medication safety.

This project combines:
- a **FastAPI backend** that scores pharmacogenomic risk and generates variant-aware explanations
- a **React + Vite frontend** for VCF upload, risk visualization, and downloadable reports
- optional **Supabase integration** for authentication and analysis history

---

## Features

- Upload and parse VCF files for pharmacogenomic variants
- CPIC-guided risk assessment for supported drug-gene pairs
- Variant-specific explanation generation (OpenAI-backed, with fallback mode)
- Interactive results UI with risk cards, profile details, and recommendations
- Optional auth + persistent analysis history using Supabase
- Export/download utilities for analysis outputs

---

## Supported Drugs and Genes

Current backend support:

| Drug | Primary Gene |
|------|--------------|
| CODEINE | CYP2D6 |
| WARFARIN | CYP2C9 |
| CLOPIDOGREL | CYP2C19 |
| SIMVASTATIN | SLCO1B1 |
| AZATHIOPRINE | TPMT |
| FLUOROURACIL | DPYD |

---

## Tech Stack

**Frontend**
- React 18, TypeScript, Vite
- Tailwind CSS + shadcn/ui + Radix UI
- React Router, React Query, Framer Motion, Vitest

**Backend**
- FastAPI, Uvicorn
- Pydantic
- OpenAI SDK (optional, for generated explanations)

**Optional Services**
- Supabase (auth + result history)
- Render (backend deployment)
- Vercel (frontend deployment)

---

## Project Structure

```text
.
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── sample.vcf
│   └── test_tpmt.vcf
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── utils/
│   │   └── contexts/
│   ├── package.json
│   └── vercel.json
└── render.yaml
```

---

## Prerequisites

- **Python 3.10+**
- **Node.js 18+** and npm (or bun/pnpm/yarn)

---

## Local Development

### 1) Start backend (FastAPI)

From project root:

```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate

pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Backend docs will be available at:
- `http://localhost:8000/docs`

### 2) Configure frontend env

Create/update `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:8000
VITE_USE_MOCK=false

# Optional (needed for auth + history features)
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

### 3) Start frontend (Vite)

```bash
cd frontend
npm install
npm run dev
```

Frontend will typically run at:
- `http://localhost:5173`

---

## Environment Variables

### Backend (`backend` process)

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `OPENAI_API_KEY` | No | - | Enables generated explanations |
| `OPENAI_MODEL` | No | `gpt-4o-mini` | Model for explanation generation |

If `OPENAI_API_KEY` is missing, the API returns safe fallback explanations.

### Frontend (`frontend` process)

| Variable | Required | Purpose |
|----------|----------|---------|
| `VITE_API_URL` | Yes | Base URL of FastAPI backend |
| `VITE_USE_MOCK` | No | Optional mock toggle (if used in your local flow) |
| `VITE_SUPABASE_URL` | No | Needed for Supabase auth/history |
| `VITE_SUPABASE_ANON_KEY` | No | Needed for Supabase auth/history |

---

## API Endpoints

### `POST /analyze`

Analyzes a drug against inferred pharmacogenomic profile and returns risk + recommendation payload.

Example request body:

```json
{
  "drug": "CLOPIDOGREL",
  "primary_gene": "CYP2C19",
  "diplotype": "*1/*2",
  "phenotype": "IM",
  "detected_variants": [
    { "rsid": "rs4244285", "gene": "CYP2C19", "variant_info": "*2" }
  ],
  "confidence": 0.82,
  "cpic_evidence": "A",
  "risk_level": "MODERATE",
  "include_explanation": false
}
```

### `POST /variant-summary`

Generates a variant-focused summary for a selected variant from the results page.

Example request body:

```json
{
  "drug": "CLOPIDOGREL",
  "primary_gene": "CYP2C19",
  "diplotype": "*1/*2",
  "phenotype": "IM",
  "variant_rsid": "rs4244285",
  "variant_gene": "CYP2C19",
  "variant_info": "*2"
}
```

---

## Testing and Quality

### Frontend

```bash
cd frontend
npm run lint
npm run test
npm run build
```

### Backend

No dedicated automated test suite is currently included. You can validate quickly via:
- FastAPI docs at `/docs`
- sample files in `backend/sample.vcf` and `backend/test_tpmt.vcf`

---

## Deployment Notes

- `render.yaml` defines backend deployment using:
  - build: `pip install -r backend/requirements.txt`
  - start: `uvicorn backend.main:app --host 0.0.0.0 --port 10000`
- Frontend includes `frontend/vercel.json` for Vercel-friendly deployment
- In production, set `VITE_API_URL` to your deployed backend URL

---

## Disclaimer

This project is for educational and prototype purposes. It does **not** replace clinical judgment, official prescribing guidance, or medical advice.
