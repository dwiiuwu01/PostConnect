export default function handler(req, res) {
    const clientKey = "awxm6c8nj9y80lbr";
    const redirectUri = "https://post-connect-seven.vercel.app/callback";

    const params = new URLSearchParams({
        client_key: clientKey,
        response_type: "code",
        scope: "user.info.basic",
        redirect_uri: redirectUri,
        state: "postconnect"
    });

    res.redirect(
        `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`
    );
}
