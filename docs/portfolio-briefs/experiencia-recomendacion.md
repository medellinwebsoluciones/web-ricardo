# Experiencia de recomendación (Chef Virtual / Comfama-style)

## Negocio
Flujo web Flask de recomendación de cursos en 60–90s: bienvenida → interés → tiempo → modalidad → menú de hasta 3 cursos con CTA a tienda.

## Arquitectura
- Flask + sesión
- Templates multi-paso
- Reglas de recomendación
- Enlaces a tienda real

## Decisiones
1. Flujo corto guiado vs catálogo abierto — conversión.
2. Reglas determinísticas — explicabilidad y costo cero IA.
3. CTA a tienda externa — no reinventar checkout.

## Outcomes
- 5 pantallas / embudo completo
- Menú recomendado ≤3 cursos
- Duración objetivo 60–90s

## Hiring fit
Product/UX engineer: embudos de recomendación y matrícula.
