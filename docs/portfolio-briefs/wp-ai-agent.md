# MWS AI (WordPress / WooCommerce AI Agent)

## Negocio
Producto SaaS **MWS AI**: agente de ventas y soporte con IA para sitios WordPress + WooCommerce. Responde 24/7 con inventario real (RAG), empuja checkout y escala a humano cuando hace falta. Orientado a agencias y empresas (USA / España). Built by Medellín Web Soluciones.

## Arquitectura
- Plugin WordPress (`wp-ai-agent-manager`) + SaaS backend
- Widget de chat en tienda WooCommerce
- RAG sobre catálogo live (stock, tallas, precios, variantes)
- Base de conocimiento (PDF/CSV/políticas) + handoff humano
- Licenciamiento anual (Growth / Enterprise) sin BYOK público

## Decisiones
1. Vivir dentro de WP/Woo vs greenfield — adopción en sitios existentes sin reescribir el negocio.
2. IA en SaaS MWS (no claves de terceros en el plugin) — operación y guardrails centralizados.
3. Agente acotado a ventas/soporte con escalado humano — control de tono, costo y alucinaciones.

## Outcomes
- Agente embebible en WooCommerce con respuestas <2s y conocimiento de inventario
- Landing + flujo de licencia/activación para agencias y distribuidores
- Complemento natural al stack omnicanal / commerce de MWS

## Hiring fit
Ideal si tu stack es WordPress/Woo y quieres IA operativa de ventas sin reescritura. Audit → plugin → piloto Growth acotado.
