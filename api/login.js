export default function handler(req, res) {
    const clientKey = process.env.TIKTOK_CLIENT_KEY;
    const redirectUri = "https://post-connect-seven.vercel.app/callback";

    const params = new URLSearchParams({
        client_key: clientKey,
        response_type: "code",
        scope: "user.info.basic,video.publish",
        redirect_uri: redirectUri,
        state: "postconnect"
    });

    res.redirect(`https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`);
}
