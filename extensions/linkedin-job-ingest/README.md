# Extensión Chrome: LinkedIn → Oportunidades

Envía la oferta **abierta** en LinkedIn al tablero admin. No scrapea el feed.

## Instalar (modo desarrollador)

1. Abre `chrome://extensions`
2. Activa **Modo de desarrollador**
3. **Cargar descomprimida** → elige esta carpeta
4. En opciones de la extensión, pon la URL del admin y (opcional) `JOB_INGEST_TOKEN`

## Uso

1. Abre una oferta en `linkedin.com/jobs/view/...`
2. Clic en el icono de la extensión → **Enviar oferta a Oportunidades**

Con token: se guarda puntuada en el tablero. Sin token: abre `/admin/oportunidades#import=...` (hace falta sesión).

## Bookmarklet (alternativa)

En el admin → Oportunidades → **Radar** → arrastra **★ Enviar a Oportunidades** a favoritos.
