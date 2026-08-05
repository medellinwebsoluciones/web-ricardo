# LinkedIn — cirugía de perfil + motor de contactos

Objetivo: empleo/contrato **remoto senior** en 4–8 semanas. LinkedIn se usa como
**buscador de reclutadores + canal de DM**, no como plataforma de contenido.

Diagnóstico actual (métricas del propio perfil): 90 contactos, 3 visitas al perfil en 90 días,
**0 apariciones en búsquedas**, 4 impresiones en 7 días. El titular dice "Estudiante en
Universidad de Medellín". Traducción: para el buscador de LinkedIn Recruiter **no existes**
como arquitecto; existes como estudiante local. Eso es lo primero y único que hay que arreglar
antes de publicar nada.

---

## Fase 1 — Cirugía de perfil (3 horas, hoy)

### 1.1 Titular (headline) — 220 caracteres, es el 80% del SEO del perfil

Titular en uso (215 caracteres) — cubre los **dos tracks** a la vez: full stack senior
(ingreso rápido, LatAm) y arquitecto (España).

ES:

> Senior Full Stack Developer & Solutions Architect · End-to-end: Next.js · TypeScript · Python/FastAPI · PostgreSQL · AWS · Agentic AI / RAG (CrewAI · MCP) · Producción, no demos · Remoto (solape CET) · Relocation ES

EN (para el perfil en inglés, ver 1.7):

> Senior Full Stack Developer & Solutions Architect · End-to-end: Next.js · TypeScript · Python/FastAPI · PostgreSQL · AWS · Agentic AI / RAG (CrewAI · MCP) · Production, not demos · Remote (CET overlap) · Open to relocate to Spain

Reglas:

- Cargos **literales y completos** (`Senior Full Stack Developer`, `Solutions Architect`):
  hay reclutadores que buscan la frase exacta; con "Full Stack" a secas no sales.
  Nada de "apasionado por", nada de "estudiante", nada de emojis decorativos.
- Los **primeros 50-60 caracteres** son lo único visible en resultados de búsqueda y en
  móvil → ahí van los dos cargos. El resto alimenta el índice de palabras clave.
- El **orden no afecta** el matching (LinkedIn indexa todo el campo por igual), solo la
  lectura humana. Full stack va primero porque hay más vacantes con ese término; si se
  prioriza el track España, se invierte el orden.
- **AWS sí va**, respaldado por Carga Control: EC2, RDS, S3, SNS y SES. En entrevista hay que
  acotarlo a esos servicios sin inflarlo (no reclamar EKS, IaC ni redes avanzadas).
  Regla general: nada en el titular que no se pueda sostener 5 minutos hablando.

### 1.2 Foto y portada

- **Quitar el marco verde `#OPENTOWORK`.** Deja la señal de disponibilidad solo en
  "Abierto a trabajar → visible únicamente para reclutadores". El marco verde resta
  autoridad justo cuando también vendes MWS AI a agencias.
- Portada actual (collage de pantallas) es ilegible en móvil. Sustituir por banner con:
  propuesta de valor en una línea + `{URL_SITE}` + "Remoto · solape CET".

### 1.3 URL pública

`linkedin.com/in/ricardo-luis-zuluaga-salazar-974276103` → `linkedin.com/in/ricardozuluaga-ai`
(o similar). Se cambia en "URL y perfil público".

### 1.4 Acerca de (About) — máx. 2.600 caracteres

Texto listo para copiar: **[linkedin-acerca-de.txt](./linkedin-acerca-de.txt)** (2.540
caracteres, quedan 60 de margen). Antes de pegar, reemplazar `TODO_CORREO` y `TODO_URL`.

Criterios con los que está escrito, para mantenerlos si se edita:

- Solo se ven **~265 caracteres** antes de "ver más": el primer párrafo carga la prueba más
  fuerte (sistemas en uso nacional, +10 años, 12 sistemas) y no gasta espacio en presentarse.
- Orden por **fuerza de la evidencia**, no cronológico: telemetría satelital (Sígueme 4 y las
  integraciones con el Ministerio de Transporte) va primero porque es lo único que un
  desconocido no puede replicar ni cuestionar.
- Las **marcas van con nombre** (Bancolombia, Nutresa, Tigo, Renault, Argos, Comfama): para
  quien no te conoce, una marca reconocible pesa más que la descripción del sistema.
- El párrafo del título va **al final, en una línea, sin disculpa**, seguido de la oferta de
  demostrarlo en vivo. Ponerlo antes convierte el perfil en una defensa.
- Sin emojis ni caracteres decorativos: LinkedIn no renderiza markdown y los símbolos raros
  ensucian el parseo de los ATS que importan perfiles.

### 1.5 Experiencia — el perfil no tiene tu empresa como cargo actual

Añadir como **puesto actual** (esto es lo que alimenta la búsqueda por "cargo actual"):

```
Solutions Architect y Fundador — Medellín Web Soluciones
Autónomo · [mes año] – Actualidad · Remoto (Medellín, Colombia)

Diseño y entrego plataformas de IA aplicada para clientes en LatAm y España.
· Orquestación multiagente (CrewAI/MCP) sobre FastAPI con guardrails y observabilidad.
· RAG productivo sobre datos vivos (inventario, corpus legal, base de conocimiento).
· Entrega end-to-end: arquitectura, implementación, despliegue (Docker/VPS/Nginx) y métricas.
Aptitudes: Solutions Architecture · LLM · RAG · Python · FastAPI · Next.js · PostgreSQL
```

Faltan además dos puestos que hoy no están en el perfil y que son la mejor prueba de escala.
Los bullets completos están en [../cv/cv-data.json](../cv/cv-data.json) (campo `experiencia`);
se copian tal cual a LinkedIn:

- **Carga Control — Sígueme 4**: telemetría satelital, unificación de plataformas GPS,
  geocercas, más de 15 procesos automáticos integrados con el Ministerio de Transporte,
  desarrollo a medida para LTSA (Grupo Éxito), AWS (EC2, RDS, S3, SNS, SES).
- **Feeling Company S.A.S.**: LEED (B2B Bancolombia y Comfama), control de presupuestos y
  contratos B2B para Tigo y Comfama, DUX (premiación con códigos de empaque), campañas
  nacionales para Nutresa, Navidad Noel, Rica y Cunit, Test Drive Renault, web de Argos.

Regla para cada bullet: `qué construí + con qué + qué cambió medible`. Falta un número real
en Carga Control (vehículos monitoreados, empresas usuarias o eventos GPS por día): es el dato
que más peso añade a todo el perfil.

### 1.6 Educación y certificaciones (el punto del título)

- Educación: `Universidad de Medellín` **sin** ponerlo como titular y sin inventar grado.
  Si no la finalizaste, déjala sin fecha de fin o quítala; no hace falta explicarlo ahí.
- Añadir sección **Licencias y certificaciones**. Si hoy no tienes ninguna reconocible,
  esta es la única cosa "de papel" que vale la pena perseguir: **1 certificación cloud/IA**
  (AWS Solutions Architect Associate, Azure AI Engineer Associate o Google Cloud
  Professional ML Engineer). No enseña nada que no sepas: sirve para pasar el filtro de RRHH
  que usa el título como atajo. 3–5 semanas de estudio, y es acumulable en paralelo al search.
- Gratis y hoy mismo: **evaluaciones de aptitudes de LinkedIn** (Python, JavaScript, etc.)
  → dan insignia verificada en el perfil.
- **Lo que más sustituye al título: 3 recomendaciones** en LinkedIn de clientes o líderes con
  los que trabajaste. Pídelas hoy, con un borrador escrito por ti para que solo editen.

### 1.7 Dos ajustes que casi nadie hace y mueven la aguja

1. **Perfil secundario en inglés** (LinkedIn permite versión por idioma). Muchos reclutadores
   de EU buscan en inglés; hoy tu perfil solo existe en español.
2. **Sección "Servicios"** (Prestando servicios): te mete en un índice de búsqueda distinto
   y te habilita mensajería con quien no es contacto. Marca: consultoría IT, desarrollo de
   software, desarrollo web, consultoría de IA.
3. **Abierto a trabajar** configurado con: cargos (`Solutions Architect`, `AI Engineer`,
   `AI Architect`, `Backend Engineer`), ubicaciones `España (remoto)` + `Colombia (remoto)`,
   inicio inmediato, visible **solo para reclutadores**.

---

## Fase 2 — Motor de contactos (2 h/día, 5 días/semana)

Los 90 contactos son el problema real, pero no se arreglan "creando contenido". Se arreglan
conectando dirigido. Tus datos de audiencia dicen 51% área metropolitana de Medellín: tu red
actual no puede darte trabajo remoto en España porque no está en España.

Rutina diaria (en este orden de prioridad):

| Bloque | Cantidad | Qué |
|--------|----------|-----|
| Invitaciones | 15–20/día | Reclutadores IT en España, hiring managers y arquitectos de las 15 cuentas objetivo. Con nota de 300 caracteres. |
| DM a contactos aceptados | 5/día | Script A de [outreach-scripts.md](./outreach-scripts.md). |
| Aplicaciones | 5/día | Solo ofertas publicadas hace <48 h (ordenar por "más recientes"). Después de 72 h el CV cae en un montón de 300. |
| Comentarios | 10/día | Comentario técnico con sustancia en posts de esa gente. **A 90 seguidores, comentar te da más alcance útil que publicar.** |
| Publicación | 3/semana | Ver Fase 3. |

Límite de LinkedIn: ~100–200 invitaciones/semana. No lo superes o te restringen la cuenta.
Mantén la tasa de aceptación alta (nota corta y específica) o LinkedIn te frena.

Números realistas con este ritmo: ~350 invitaciones/mes → 500+ contactos relevantes en ~3
semanas, y de 100 aplicaciones/DM dirigidos salen entre 10 y 15 respuestas, 3–5 entrevistas
técnicas y 1 oferta. Ese es el embudo que hay que alimentar; el contenido no lo sustituye.

---

## Fase 3 — Contenido sin cámara (y por qué YouTube no es ahora)

Respuesta directa: **el contenido no te va a traer empleo en 4 semanas.** LinkedIn como
plataforma de creador tarda 3–6 meses en dar retorno, y YouTube más. Si repartes esfuerzo
entre LinkedIn + YouTube + perfil, retrasas lo único que sí es rápido (Fase 1 + Fase 2).
Decisión: **un solo canal, LinkedIn**, 3 posts/semana, cero producción. YouTube se aparca
hasta que tengas contrato firmado.

Formatos que no requieren grabarte y que ya tienes hechos:

1. **Diagrama de arquitectura + 8 líneas de explicación.** Ya tienes los `.mmd` en
   `docs/portfolio-briefs/arch/` y el script `npm run portfolio:diagrams`. Un diagrama por
   caso = 9 posts listos.
2. **Decisión técnica y su trade-off.** "Por qué usé pgvector en vez de una vector DB
   dedicada" / "Por qué el agente cita fuente obligatoriamente en LEXIA".
3. **Antes/después con número.** Proceso manual → automatizado, con el tiempo o coste real.
4. **Post de disponibilidad**, uno cada 2 semanas: qué haces, qué buscas, enlace a la web.

Sobre el bloqueo al grabarte: el problema no es que seas malo en cámara, es que estás
intentando **contar** en vez de **hacer**. Guion y "qué voy a decir" te bloquean porque
obligan a traducir. La forma que funciona para gente así: graba la pantalla **mientras
trabajas de verdad** y narra en voz alta lo que estás haciendo, sin guion, sin cara, sin
plan de edición. Luego cortas los silencios. Si algún día quieres YouTube, ese es el formato:
demo narrada en vivo, no vídeo de talking head.

---

## Fase 4 — Validar el cargo en la entrevista (esto es donde se gana sin título)

Nadie te va a rechazar por el título si sales de la primera llamada habiendo **mostrado**
un sistema funcionando. Prepara antes de empezar a aplicar:

1. **Dos casos insignia** (orquestación multiagente + LEXIA o MWS AI) con un recorrido de
   arquitectura de 5 minutos cada uno: problema → decisiones → trade-offs → resultado medible.
2. **Demo en vivo lista para compartir pantalla**, ya desplegada y con datos de prueba. Que
   arranque en 10 segundos, no "déjame levantar el entorno".
3. **Los números memorizados**: latencia, coste por ejecución, volumen, uptime.
4. **Respuestas preparadas a "¿por qué esta decisión y no la otra?"** — un arquitecto se
   evalúa por cómo justifica trade-offs, no por sintaxis.
5. **La frase del título**, una sola vez y sin disculparte:
   > "Me formé sobre documentación oficial y trabajando en producción; pasé las pruebas
   > técnicas y ejercí el rol. No tengo título universitario. Te puedo mostrar los sistemas
   > funcionando ahora mismo si quieres."
   Y sigues hablando del sistema. Si te disculpas, lo conviertes en un problema; si lo
   despachas en 15 segundos, casi siempre se cierra ahí.

Filtro práctico de mercado: como **empleado en España** necesitas patrocinio de visado — es
lento y reduce mucho tus opciones. Como **contractor B2B remoto** desde Colombia no hay
fricción legal. Prioriza en este orden: nearshore/staffing (cuentas 7–9) → consultoras con
contractor → empleador final con relocation.

---

## Métricas de control (revisar cada domingo)

| Métrica | Hoy | Semana 2 | Semana 4 |
|---------|-----|----------|----------|
| Apariciones en búsquedas (7 d) | 0 | >30 | >80 |
| Visitas al perfil (7 d) | ~0 | >25 | >60 |
| Contactos | 90 | 250 | 500+ |
| Respuestas de reclutador/mes | 0 | 3 | 10 |
| Entrevistas técnicas | 0 | 1 | 3 |

Si en la semana 2 las **apariciones en búsquedas** siguen bajas, el problema es el titular y
las aptitudes (palabras clave), no el volumen de actividad. Si hay apariciones pero no
respuestas, el problema es la portada/Acerca de o el mensaje de DM.
