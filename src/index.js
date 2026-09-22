export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/lead" && request.method === "POST") {
      try {
        const data = await request.json();

        if (!data.name || !data.phone || !data.message || !data.consent) {
          return Response.json({ error: "Mangler påkrevde felt" }, { status: 400 });
        }

        const clean = (value, max = 1000) =>
          String(value ?? "").replace(/[<>]/g, "").trim().slice(0, max);

        const lead = {
          name: clean(data.name, 120),
          phone: clean(data.phone, 80),
          email: clean(data.email, 160),
          area: clean(data.area, 160),
          message: clean(data.message, 1500),
        };

        if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
          const text = [
            "Ny forespørsel fra Bonders Tjenester",
            `Navn: ${lead.name}`,
            `Telefon: ${lead.phone}`,
            `E-post: ${lead.email || "-"}`,
            `Område: ${lead.area || "-"}`,
            `Jobb: ${lead.message}`,
          ].join("\n");

          await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text })
          });
        }

        return Response.json({ ok: true });
      } catch {
        return Response.json({ error: "Ugyldig forespørsel" }, { status: 400 });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
