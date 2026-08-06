const msg = document.getElementById("msg");
const btn = document.getElementById("send");

btn.addEventListener("click", async () => {
  btn.disabled = true;
  msg.textContent = "Extrayendo…";
  try {
    const { adminUrl, ingestToken } = await chrome.storage.sync.get([
      "adminUrl",
      "ingestToken",
    ]);
    const base = (adminUrl || "https://ricardozuluaga.medellinweb.co").replace(
      /\/$/,
      "",
    );
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id || !tab.url?.includes("linkedin.com/jobs")) {
      throw new Error("Abre una oferta concreta en LinkedIn (/jobs/view/…).");
    }
    const job = await chrome.tabs.sendMessage(tab.id, { type: "EXTRACT_JOB" });
    if (!job?.jobDescription || job.jobDescription.length < 40) {
      throw new Error(
        "No encontré la descripción. Abre la oferta completa y reintenta.",
      );
    }

    if (ingestToken) {
      const res = await fetch(`${base}/api/admin/opportunities/ingest`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-ingest-token": ingestToken,
        },
        body: JSON.stringify({ ...job, saveAll: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      msg.textContent = data.saved
        ? `Guardada: ${data.score.verdict} (${data.score.score}%)`
        : `No guardada: ${data.reason}`;
      return;
    }

    // Sin token: abre el admin con el payload en el hash (requiere sesión).
    const b64 = btoa(unescape(encodeURIComponent(JSON.stringify(job))));
    await chrome.tabs.create({
      url: `${base}/admin/oportunidades#import=${b64}`,
    });
    msg.textContent = "Abierto en el admin. Inicia sesión si hace falta.";
  } catch (e) {
    msg.textContent = e instanceof Error ? e.message : String(e);
  } finally {
    btn.disabled = false;
  }
});
