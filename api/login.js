export default function handler(req, res) {
    const clientKey = "sbawpvcn26m2mjmvwt";
    const redirectUri = "https://post-connect-seven.vercel.app/callback";

    const params = new URLSearchParams({
        client_key: clientKey,
        response_type: "code",
        scope: "user.info.basic,video.publish,video.upload",
        redirect_uri: redirectUri,
        state: "postconnect"
    });

    res.redirect(
        `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`
    );
}
