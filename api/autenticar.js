export default function Autenticar(req, res) {
    const userInput = req.body.user;
    const passwordInput = req.body.password;

    if (userInput == "Renato" && passwordInput == "admin123") {
        req.session.autenticado = true;
        req.session.user = { username: userInput }
        res.render('inicial', { user: req.session.user });
    } else {
        res.send("Login falhou");
    }
}

export function verificarAutenticacao(req, res, next) {
    if (req.session.autenticado) {
        next();
    } else {
        res.redirect('./login.html');
    }
}

export function logout(req, res) {
    req.session.autenticado = undefined;
    req.session.user = null;
    res.redirect('./login.html');
}