# CRM operativo MWS



## Negocio

Embudo comercial de Medellín Web Soluciones: leads desde licitaciones SECOP y scraper/IA, seguimiento por temperatura/territorio/probabilidad, conversión a cliente, cotizaciones/proyectos y puente a finanzas en el mismo admin Django.



## Arquitectura

- Admin Django custom (tema oscuro operativo)

- Fuentes: import SECOP II + captura scraper/SERP con perfilado IA

- Superficies: Resumen, Embudo, Clientes, Proyectos, Cotizaciones, Tareas, Pomodoro, Conexión Meta

- Finanzas (ingresos/gastos/flujo) con acceso directo al CRM

- Conocimiento IA de equipo en el mismo hub



## Decisiones

1. Admin Django custom frente a SaaS CRM — dominio Colombia (SECOP, COP, territorio) sin renta por asiento.

2. Embudo como superficie principal — KPIs + filtros + tabla, no solo fichas.

3. Finanzas al lado del CRM — cashflow y cierre comercial en un solo sistema.



## Outcomes

- Embudo operable con leads activos y KPIs

- Import de licitaciones SECOP y prospectos scraper/IA

- Detalle de lead con conversión a cliente

- Inteligencia financiera (ingresos, gastos, margen, flujo diario)



## Hiring fit

Full-stack / ops que construye CRM a medida con captación IA y finanzas ligadas. Discovery → embudo → integraciones → operación.

