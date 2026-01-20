export async function onRequest(context) {
  const { params } = context;
  const base64Data = params.path[0];

  // Jika tidak ada data Base64 (akses halaman utama), biarkan normal
  if (!base64Data || base64Data === "index.html") {
    return context.next();
  }

  try {
    // Decode data dari URL
    const jsonString = atob(base64Data);
    const data = JSON.parse(jsonString);

    // Ambil variabel t (title), i (image), u (url target)
    const title  = data.t || "Klik untuk melihat";
    const image  = data.i || "";
    const target = data.u || "https://google.com";

    // HTML inilah yang akan dibaca oleh bot WhatsApp/Facebook
    const html = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <meta property="og:title" content="${title}" />
      <meta property="og:image" content="${image}" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image">
      
      <script>window.location.replace("${target}");</script>
      <meta http-equiv="refresh" content="0;url=${target}">
    </head>
    <body style="background:#000;"></body>
    </html>`;

    return new Response(html, {
      headers: { "content-type": "text/html;charset=UTF-8" },
    });
  } catch (e) {
    // Jika Base64 rusak atau bukan format JSON
    return new Response("Invalid URL", { status: 400 });
  }
}
