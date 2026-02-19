# IntelliGene(RIFT)

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
- OpenAI SDK (optional, for generated explanations)

**Services**
- Supabase (auth + result history)
- Render (backend deployment)
- Vercel (frontend deployment)
---