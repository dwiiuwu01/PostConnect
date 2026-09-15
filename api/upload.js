export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    const accessToken = req.headers.authorization?.replace("Bearer ", "");
    const video = req.body?.video;
    const caption = req.body?.caption || "PostConnect video";

    if (!accessToken) {
        return res.status(401).json({
            error: "Access token tidak ditemukan"
        });
    }

    if (!video) {
        return res.status(400).json({
            error: "Video tidak ditemukan"
        });
    }

    try {
        const videoBuffer = Buffer.from(video, "base64");
        const videoSize = videoBuffer.length;

        const creatorResponse = await fetch(
            "https://open.tiktokapis.com/v2/post/publish/creator_info/query/",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json; charset=UTF-8"
                }
            }
        );

        const creatorData = await creatorResponse.json();

        if (!creatorResponse.ok || creatorData.error?.code !== "ok") {
            return res.status(400).json(creatorData);
        }

        const privacyOptions =
            creatorData.data?.privacy_level_options || [];

        const privacyLevel =
            privacyOptions.includes("SELF_ONLY")
                ? "SELF_ONLY"
                : privacyOptions[0];

        if (!privacyLevel) {
            return res.status(400).json({
                error: "Privacy level TikTok tidak tersedia"
            });
        }

        const initResponse = await fetch(
            "https://open.tiktokapis.com/v2/post/publish/video/init/",
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    post_info: {
                        title: caption,
                        privacy_level: privacyLevel,
                        disable_duet: false,
                        disable_comment: false,
                        disable_stitch: false
                    },
                    source_info: {
                        source: "FILE_UPLOAD",
                        video_size: videoSize,
                        chunk_size: videoSize,
                        total_chunk_count: 1
                    }
                })
            }
        );

        const initData = await initResponse.json();

        if (!initResponse.ok || initData.error?.code !== "ok") {
            return res.status(initResponse.status || 400).json(initData);
        }

        const uploadUrl = initData.data.upload_url;
        const publishId = initData.data.publish_id;

        const uploadResponse = await fetch(uploadUrl, {
            method: "PUT",
            headers: {
                "Content-Type": "video/mp4",
                "Content-Length": String(videoSize),
                "Content-Range": `bytes 0-${videoSize - 1}/${videoSize}`
            },
            body: videoBuffer
        });

        if (!uploadResponse.ok) {
            const uploadError = await uploadResponse.text();

            return res.status(uploadResponse.status).json({
                error: "Gagal mengupload video ke TikTok",
                details: uploadError
            });
        }

        return res.status(200).json({
            success: true,
            message: "Video berhasil dikirim ke TikTok",
            publish_id: publishId
        });

    } catch (error) {
        return res.status(500).json({
            error: "Terjadi kesalahan saat upload",
            details: error.message
        });
    }
}
