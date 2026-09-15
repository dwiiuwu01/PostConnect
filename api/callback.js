export default function handler(req, res) {
    const { code, state } = req.query;

    if (!code) {
        return res.status(400).send("Login TikTok gagal: authorization code tidak ditemukan.");
    }

    res.send(`
        <h1>Login TikTok Berhasil!</h1>
        <p>Authorization code berhasil diterima.</p>
        <p>Sekarang PostConnect sudah menerima respons dari TikTok.</p>
    `);
}
