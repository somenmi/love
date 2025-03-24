export default function handler(req, res) {
    // Используем глобальную переменную для демо (в продакшене нужна БД)
    global.fsState = global.fsState || false;

    if (req.method === 'POST') {
        global.fsState = req.body.fullscreen;
        res.status(200).json({ success: true });
    } else {
        res.status(200).json({ fullscreen: global.fsState });
    }
}