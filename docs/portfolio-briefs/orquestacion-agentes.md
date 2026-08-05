# Orquestación de agentes (Nova MWS)

## Negocio
Agencia CrewAI (Nova) con CEO, 5 divisiones y 29 especialistas. Automatiza operaciones de consultora (research, contenido, ops) con API FastAPI, panel `/visual` (grafo 3D), `/vivo` (SSE) y configuración por agente. Complemento: backend de leads inmobiliarios con calificación IA (`agentes IA`).

## Arquitectura
- API FastAPI + panel Jinja/estáticos
- CrewAI: CEO → hubs → 29 especialistas
- Inferencia local (Ollama) + overrides de runtime
- Tools MWS / Composio / n8n / Langfuse (opcionales)
- Persistencia SQLite/PostgreSQL; Docker

## Decisiones
1. Local-first LLM vs solo cloud — privacidad y costo predecible.
2. Grafo multi-agente vs un solo asistente — especialización y routing.
3. HITL/config por agente vs hardcode — operación sin redeploy.

## Outcomes verificables
- 29 especialistas + 1 CEO
- Operación continua con trazas SSE
- Panel visual + mapa de capacidades

## Hiring fit
Ideal para empresas que buscan Solutions Architect / AI automation lead que diseña ecosistemas agenticos en producción, no demos de chatbot.
