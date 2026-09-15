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
            "https://open.tiktokapis.com/v2/post/publish/creator_info/query/",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json; charset=UTF-8"
                }
            }
        );

        const data = await response.json();

        if (!response.ok || data.error?.code !== "ok") {
            return res.status(response.status || 400).json(data);
        }

        return res.status(200).json({
            success: true,
            creator: data.data
        });
    } catch (error) {
        return res.status(500).json({
            error: "Gagal menghubungkan ke TikTok",
            message: error.message
        });
    }
}
