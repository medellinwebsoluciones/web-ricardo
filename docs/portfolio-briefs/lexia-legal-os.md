# LEXIA — Legal Intelligence OS

## Negocio
Sistema operativo jurídico multi-rama con IA: API, OS web (Streamlit) y analytics (Dash). Producto completo en Python sin React.

## Arquitectura
- FastAPI (API)
- Streamlit (OS operativo)
- Dash (analytics)
- Seed demo + Docker (dev/prod)

## Decisiones
1. Python-only stack (sin React) — velocidad de producto vertical.
2. Separar OS (Streamlit) de analytics (Dash) — roles distintos de usuario.
3. Seed demo — onboarding y demos comerciales reproducibles.

## Outcomes
- Tres superficies: API / OS / Analytics
- Login demo y flujo end-to-end
- Deploy Docker documentado

## Hiring fit
Arquitecto de producto vertical (legal/regulado) con ownership full-stack Python.
