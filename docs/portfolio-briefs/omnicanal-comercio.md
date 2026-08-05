# Omnicanal + WooCommerce Colombia

## Negocio
Cerebro omnicanal híbrido (stock propio + dropship) con panel HITL, radar de oportunidades (Dropi), API catálogo y publicación Woo. Tienda `woo-store-co` solo Colombia; vertical e-commerce mascotas `tecnopets`.

## Arquitectura
- FastAPI + worker + panel Jinja/HTMX (`:8090`)
- Postgres/Redis (compose)
- Woo REST + webhooks
- Enrich OpenAI con fallback plantilla

## Decisiones
1. HITL en oportunidades vs full-auto — control de margen/riesgo.
2. Woo como checkout canónico vs checkout en landing — separación marketing/commerce.
3. Monorepo packages (domain/api/worker) — límites claros de dominio.

## Outcomes
- Panel operador operable
- Publish Woo cableado
- Radar Dropi → score → aprobación

## Hiring fit
Tech lead commerce / integrations: pricing, inventario, marketplaces, Woo.
