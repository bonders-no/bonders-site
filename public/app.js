document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("leadForm");
const statusEl = document.getElementById("status");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusEl.textContent = "Sender...";

  const fd = new FormData(form);
  const data = Object.fromEntries(fd.entries());
  data.consent = Boolean(fd.get("consent"));

  try {
    const response = await fetch("/api/lead", {
      method: "POST",
      headers: {"content-type": "application/json"},
      body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Kunne ikke sende");
    form.reset();
    statusEl.textContent = "Takk! Forespørselen er sendt.";
  } catch {
    statusEl.textContent = "Noe gikk galt. Prøv igjen eller kontakt meg direkte.";
  }
});
