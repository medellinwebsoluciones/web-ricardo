# Plan de capturas y videos para LinkedIn

Objetivo: que un desconocido entienda en 10 segundos que los sistemas **funcionan**.
Regla transversal: **cero datos reales de clientes**. Usar datos demo/seed o difuminar.
Nunca capturar la pantalla de login con credenciales visibles.

---

## AUGE URBANO — capturas (sistema en producción, sin problema de mostrar)

Orden de subida. Las 4 primeras son las que valen; el resto son relleno opcional.

| # | Pantalla | Ruta | Por qué esta |
|---|----------|------|--------------|
| 1 | Asesor web en la web pública | ficha de propiedad con el widget abierto | Es el único que muestra **resultado de negocio**: un visitante preguntando y el agente respondiendo |
| 2 | Copiloto del panel abierto | cualquier `/admin/` con el botón flotante desplegado y una respuesta con KPIs | Demuestra function calling real, no un chat decorativo |
| 3 | Conversaciones en vivo del asesor | `/admin/asistente-ia/?tab=asesor-web` | Prueba de que hay tráfico y monitoreo, no una demo vacía |
| 4 | Dashboard con KPIs | `/admin/dashboard/` | Da la sensación de sistema operando, no de proyecto de escritorio |
| 5 | Panel SEO AEO/GEO de una propiedad | `/admin/propiedades/` → editar | Diferenciador técnico: posicionamiento en LLM |
| 6 | Mapas de infraestructura | `/admin/infraestructura/` | Habla directo a perfiles de arquitectura |
| 7 | Módulo de interacción/analíticas | `/admin/interaccion/` | Métricas propias + Google Analytics Data API |

Al subir cada una, **ponle título descriptivo** (LinkedIn lo pide). No dejes
"Screenshot 2026-08-05". Ejemplos: "Asesor IA atendiendo en ficha de propiedad",
"Copiloto del panel abriendo pantallas por function calling".

---

## VIDEO 1 — Auge Urbano: "el lead entra solo" (60-70s) · PRIORIDAD MÁXIMA

El mejor de todos porque lo entiende un reclutador no técnico.
No memorices nada: ejecuta los pasos y narra lo que estás haciendo.

**Pasos en pantalla**
1. Abre una ficha de propiedad del sitio público. (5s)
2. Abre el widget del asesor y escribe una pregunta como si fueras cliente:
   "¿este apartamento acepta mascotas y cuánto sería la cuota inicial?" (10s)
3. Deja que responda. Escribe una segunda: "me interesa verlo". (15s)
4. Muestra que el agente **propone agendar cita** en vez de tirar a WhatsApp. (10s)
5. Cambia al panel admin y muestra la conversación y el lead ya registrados. (15s)

**Qué decir mientras lo haces** (idea, no libreto)
- Al inicio: "Esto es el sitio de una inmobiliaria en producción. El asesor que
  contesta es un agente que yo desarrollé."
- En el paso 4: "Fíjate que no manda a WhatsApp. Tiene una regla de negocio:
  primero intenta agendar la cita, porque una cita agendada vale más que un chat."
- Al final: "Y esa conversación ya quedó en el CRM con el lead creado. Nadie del
  equipo tuvo que hacer nada."

---

## VIDEO 2 — Auge Urbano: "le hablo a mi panel" (45s)

**Pasos en pantalla**
1. Abre `/admin/dashboard/`. Abre el copiloto flotante. (5s)
2. Pregúntale un KPI del negocio. Deja que responda. (10s)
3. Pídele: "llévame a los contactos nuevos". Aparece el botón. Haz clic. (15s)
4. Pídele que marque un contacto como revisado. Muestra el cambio. (15s)

**Qué decir**
- "Este copiloto no solo responde: ejecuta. Usa function calling con herramientas
  acotadas, así que puede abrir pantallas y cambiar el estado de un contacto,
  pero no tiene acceso a SQL arbitrario ni a las claves."

---

## VIDEO 3 — MWS AI: stock real + traspaso a humano (60s) · ya desplegado

**Pasos**
1. Tienda WooCommerce demo. Abre el chat. (5s)
2. Pregunta por una talla o stock concreto. Responde con el dato real. (20s)
3. Muestra en el catálogo que el dato coincide. (10s)
4. Pide hablar con una persona → traspaso. Muéstralo en la bandeja del panel de
   WordPress. (20s)

**Qué decir**
- "La diferencia con un chatbot normal es que esto lee el inventario real: stock,
  tallas y precios vivos. Si dice que hay talla M, hay talla M."
- "Y cuando el cliente pide un humano, la conversación aparece en la bandeja del
  panel de WordPress."

---

## VIDEO 4 — Nova: grafo 3D de agentes (45s) · local, sin datos de cliente

**Pasos**
1. Abre `/visual`: el grafo 3D. Gíralo. (10s)
2. Lanza una tarea real. (5s)
3. Cambia a `/vivo` y muestra las trazas SSE llegando. (20s)
4. Muestra Langfuse con el coste de esa ejecución. (10s)

**Qué decir**
- "29 agentes especialistas con un CEO que enruta. Esto es la ejecución en vivo."
- "Y aquí está el coste de esa ejecución. Es lo que separa un experimento de algo
  que puedes poner en producción sin sorpresas de factura."

---

## Reglas técnicas de los 4 videos

- **Sube el archivo nativo a LinkedIn**, no un enlace de YouTube: el nativo se
  reproduce solo en el perfil y en el feed, y LinkedIn le da más alcance.
- **Subtítulos quemados obligatorios.** LinkedIn arranca los videos en silencio;
  sin subtítulos la mayoría ve un video mudo de pantallas.
- **60-90 segundos máximo.** Si no cabe, corta pasos, no aceleres el video.
- Graba a 1080p y con el navegador **sin barra de marcadores** (en tus capturas se
  ven bookmarks con nombres de clientes y servidores).
- Cada video se usa **dos veces**: multimedia del proyecto + publicación suelta.
