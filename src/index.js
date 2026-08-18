const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/realtime-token") {
      if (request.method === "OPTIONS") return new Response(null, {headers: cors});
      if (request.method !== "POST") return new Response("Method not allowed", {status:405, headers:cors});
      if (!env.OPENAI_API_KEY) return new Response("Missing OPENAI_API_KEY secret", {status:500, headers:cors});

      let body = {};
      try { body = await request.json(); } catch {}
      const model = body.model || "gpt-realtime-2.1";
      const voice = body.voice || "marin";
      const instructions = body.instructions || "You are JARVIS, a concise French voice assistant.";

      const upstream = await fetch("https://api.openai.com/v1/realtime/client_secrets", {
        method:"POST",
        headers:{
          "Authorization":`Bearer ${env.OPENAI_API_KEY}`,
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          session:{
            type:"realtime",
            model,
            instructions,
            audio:{output:{voice}}
          }
        })
      });

      const text = await upstream.text();
      return new Response(text, {
        status: upstream.status,
        headers: {"Content-Type":"application/json", ...cors}
      });
    }

    return env.ASSETS.fetch(request);
  }
};