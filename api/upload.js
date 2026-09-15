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
        const creatorResponse = await fetch(
            "https://open.tiktokapis.com/v2/post/publish/creator_info/query/",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json; charset=UTF-8"
                }
            }
        );

        const creatorData = await creatorResponse.json();

        if (!creatorResponse.ok || creatorData.error?.code !== "ok") {
            return res.status(400).json(creatorData);
        }

        const response = await fetch(
            "https://open.tiktokapis.com/v2/post/publish/video/init/",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    post_info: {
                        title: "PostConnect video",
                        privacy_level: creatorData.data.privacy_level_options?.[0] || "SELF_ONLY",
                        disable_duet: false,
                        disable_comment: false,
                        disable_stitch: false
                    },
                    source_info: {
                        source: "FILE_UPLOAD",
                        video_size: 0,
                        chunk_size: 0,
                        total_chunk_count: 1
                    }
                })
            }
        );

        const data = await response.json();

        if (!response.ok || data.error?.code !== "ok") {
            return res.status(response.status || 400).json(data);
        }

        return res.status(200).json({
            success: true,
            message: "TikTok upload initialized",
            upload_url: data.data.upload_url,
            publish_id: data.data.publish_id
        });
    } catch (error) {
        return res.status(500).json({
            error: "Gagal menghubungkan ke TikTok",
            message: error.message
        });
    }
}
