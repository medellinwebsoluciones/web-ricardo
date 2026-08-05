# Plataforma curso + pagos (Claude Certified Architect)

## Negocio
Django bilingüe ES/EN: venta de curso, checkout invitado, Bold + PayPal, acceso 12 meses, examen 100 preguntas, lead magnet, tutor IA con control de costo, SEO/GEO/AEO.

## Arquitectura
- Django 5 + HTMX/Alpine + Tailwind estático
- PostgreSQL prod / SQLite dev
- Pagos Bold (HMAC) + PayPal idempotentes
- Assistant RAG + Anthropic opcional

## Decisiones
1. Checkout invitado — fricción mínima.
2. Doble PSP (Bold + PayPal) — cobertura regional/global.
3. Tutor con rate-limit/cache — control de costo IA.

## Outcomes
- Planes Fast-Track / Mentoring / B2B
- Acceso 12 meses post-pago
- Examen 100 preguntas + lead magnet

## Hiring fit
Full-stack product owner: LMS + payments + growth.
