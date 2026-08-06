const adminUrl = document.getElementById("adminUrl");
const ingestToken = document.getElementById("ingestToken");
const status = document.getElementById("status");

chrome.storage.sync.get(["adminUrl", "ingestToken"], (data) => {
  adminUrl.value = data.adminUrl || "https://ricardozuluaga.medellinweb.co";
  ingestToken.value = data.ingestToken || "";
});

document.getElementById("save").addEventListener("click", () => {
  chrome.storage.sync.set(
    {
      adminUrl: adminUrl.value.trim().replace(/\/$/, ""),
      ingestToken: ingestToken.value.trim(),
    },
    () => {
      status.textContent = "Guardado.";
    },
  );
});
