export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    const accessToken = req.headers.authorization?.replace("Bearer ", "");

    if (!accessToken) {
        return res.status(401).json({
            error: "Access token tidak ditemukan"
        });
    }

    try {
        const response = await fetch(
            "https://open.tiktokapis.com/v2/post/publish/inbox/video/init/",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({})
            }
        );

        const data = await response.json();

        return res.status(response.status).json(data);
    } catch (error) {
        return res.status(500).json({
            error: "Gagal menghubungkan ke TikTok"
        });
    }
}
