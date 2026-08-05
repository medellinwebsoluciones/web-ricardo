# Sitio MWS (landing Django + Angular)

## Negocio
Presencia comercial Medellín Web Soluciones: home, 18 servicios, proyectos, FAQ, blog, billing, portal cliente, assistant/knowledge sync.

## Arquitectura
- `landing-python-mws`: Django 6 + WhiteNoise + SMTP + agent_knowledge (RAG sync)
- `landing-mws`: Angular front histórico
- Separación front Angular vs sitio Django servido

## Decisiones
1. Django como site of record — SEO + admin + knowledge.
2. Knowledge sync desde about/architecture/quotes — chat grounded.
3. Separar tienda Woo del sitio de servicios.

## Outcomes
- Catálogo de 18 servicios
- Hub de knowledge para agente
- Stack bilingüe operable

## Hiring fit
Agency technical founder / full-stack lead con ownership de sitio + AI knowledge.
