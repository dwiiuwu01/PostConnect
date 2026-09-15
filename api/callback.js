export default async function handler(req, res) {
    const { code } = req.query;

    if (!code) {
        return res.status(400).send("Authorization code tidak ditemukan.");
    }

    const clientKey = "sbawpvcn26m2mjmvwt";
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
    const redirectUri = "https://post-connect-seven.vercel.app/callback";

    try {
        const response = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                client_key: clientKey,
                client_secret: clientSecret,
                code: code,
                grant_type: "authorization_code",
                redirect_uri: redirectUri
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.send(`
            <h1>Login TikTok Berhasil!</h1>
            <p>Access token berhasil diterima.</p>
        `);
    } catch (error) {
        res.status(500).send("Terjadi kesalahan saat menghubungkan ke TikTok.");
    }
}
