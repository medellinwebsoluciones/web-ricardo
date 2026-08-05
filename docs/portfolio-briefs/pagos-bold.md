# pagos_bold — Integrador Bold

## Negocio
Paquete Python reutilizable para Bold pagos en línea: checkout, health checks, consola, deploy Docker VPS. Terceros no afiliados a Bold SAS.

## Arquitectura
- SDK/library (`CheckoutService`, `BoldSettings`, `IntegrationHealth`)
- Consola `bold-console serve`
- Webhooks / firma integridad
- Deploy scripts

## Decisiones
1. Librería reutilizable vs app monolito — plug-in en varios productos.
2. Health sync checks — fallar temprano en misconfig.
3. Docker VPS path — operación real, no solo local.

## Outcomes
- API de checkout reusable
- Consola operativa
- Docs de deployment producción

## Hiring fit
Payments engineer / integrations specialist (LatAm PSP).
