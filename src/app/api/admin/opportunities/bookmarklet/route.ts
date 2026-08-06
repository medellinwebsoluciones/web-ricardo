import { NextRequest } from "next/server";
import { denyIfNotAdmin } from "@/lib/admin-auth";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Devuelve el bookmarklet listo para arrastrar a favoritos.
 * Extrae título/empresa/descripción de una oferta abierta en LinkedIn
 * y abre el panel de Oportunidades con el payload en el hash (sin scrapeo).
 */
export async function GET(_req: NextRequest) {
  const denied = await denyIfNotAdmin();
  if (denied) return denied;

  const base = site.url.replace(/\/$/, "");
  const js = buildBookmarklet(base);
  return Response.json({
    bookmarklet: `javascript:${js}`,
    instructions: [
      "Abre LinkedIn y entra en una oferta concreta (no el listado).",
      "Arrastra el bookmarklet a la barra de favoritos (o créalo pegando el código).",
      "Haz clic: se abre /admin/oportunidades con la oferta lista para analizar/guardar.",
      "Debes estar logueado en el admin en este mismo navegador.",
    ],
  });
}

function buildBookmarklet(adminBase: string): string {
  // Minificado a propósito: va en una URL javascript:
  const code = `(function(){
var d=document,t=(d.title||'').replace(/\\s*\\|\\s*LinkedIn.*/i,'').trim();
var role='',company='';
var h1=d.querySelector('h1'); if(h1) role=h1.innerText.trim();
var co=d.querySelector('.job-details-jobs-unified-top-card__company-name a, .job-details-jobs-unified-top-card__company-name, a.topcard__org-name-link, .topcard__flavor a');
if(co) company=co.innerText.trim();
if(!role&&t){var m=t.match(/^(.+?)\\s+([–—-]|(at|en))\\s+(.+)$/i); if(m){role=m[1].trim();company=company||m[4].trim();}}
var box=d.querySelector('#job-details, .jobs-description__content, .jobs-box__html-content, .description__text, .show-more-less-html__markup, .jobs-description-content__text');
var desc=box?(box.innerText||box.textContent||'').trim():'';
if(desc.length<40){alert('No encontré la descripción. Abre la oferta completa (no el feed) y reintenta.');return;}
var payload={v:1,source:'linkedin',company:company||'Empresa LinkedIn',role:role||t||'Oferta LinkedIn',url:location.href.split('?')[0],jobDescription:desc.slice(0,18000)};
var b64=btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
window.open(${JSON.stringify(adminBase)}+'/admin/oportunidades#import='+b64,'_blank');
})();`;
  return encodeURIComponent(code);
}