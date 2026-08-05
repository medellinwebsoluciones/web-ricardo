# Sistemas críticos (Carga Control / Feeling)

## Negocio
Modernización de backends de alto volumen hacia microservicios con HA, redundancia y observabilidad bajo estándares corporativos.

## Arquitectura
- Load balancer → cluster de servicios
- Replicas DB
- Observabilidad transversal (métricas/logs/trazas)
- Contenerización Docker

## Decisiones
1. Migración progresiva vs big-bang — continuidad del negocio.
2. Microservicios donde duele el monolito — no over-split.
3. Observabilidad primero — operar con evidencia.

## Outcomes
- Alta disponibilidad bajo picos
- Eliminación de SPOFs
- Conformidad operativa corporativa

## Hiring fit
Senior architect / platform: HA, performance, microservicios.
