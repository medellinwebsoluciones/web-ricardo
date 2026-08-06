/**
 * Extrae título, empresa y descripción de la oferta abierta en LinkedIn.
 * No navega el feed ni hace requests a LinkedIn: solo lee el DOM visible.
 */
function extractJob() {
  const d = document;
  const title = (d.title || "").replace(/\s*\|\s*LinkedIn.*/i, "").trim();
  let role = "";
  let company = "";
  const h1 = d.querySelector("h1");
  if (h1) role = (h1.textContent || "").trim();
  const co = d.querySelector(
    ".job-details-jobs-unified-top-card__company-name a, .job-details-jobs-unified-top-card__company-name, a.topcard__org-name-link, .topcard__flavor a",
  );
  if (co) company = (co.textContent || "").trim();
  if (!role && title) {
    const m = title.match(/^(.+?)\s+([–—-]|(at|en))\s+(.+)$/i);
    if (m) {
      role = m[1].trim();
      company = company || m[4].trim();
    }
  }
  const box = d.querySelector(
    "#job-details, .jobs-description__content, .jobs-box__html-content, .description__text, .show-more-less-html__markup, .jobs-description-content__text",
  );
  const desc = box
    ? ((box).innerText || box.textContent || "").trim()
    : "";
  return {
    v: 1,
    source: "linkedin",
    company: company || "Empresa LinkedIn",
    role: role || title || "Oferta LinkedIn",
    url: location.href.split("?")[0],
    jobDescription: desc.slice(0, 18000),
    externalId: (location.pathname.match(/\/(\d+)\//) || [])[1] || null,
  };
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === "EXTRACT_JOB") {
    sendResponse(extractJob());
  }
  return true;
});
