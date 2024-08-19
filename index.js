import http from 'http';
import fs from 'fs';

const hostname = 'localhost';
const porta = 3005;

const servidor = http.createServer(
    (req, resp) => {
        if (req.method === "GET") {
            if (req.url === '/login.html') {
                fs.createReadStream("./public" + req.url).pipe(resp);
            } else {
                resp.statusCode = 404;
                resp.setHeader('Content-type', 'text/html;charset=utf-8');
                resp.end(`<p>A página ${req.url}, não foi encontrada</p>`)
            }
        } else {
            resp.statusCode = 405; 
            resp.setHeader('Content-Type', 'text/html;charset=utf-8');
            resp.end('<p>Método não permitido</p>');
        }
});

servidor.listen(porta, hostname, () => {
    console.log(`Servidor online! ${hostname}:${porta}`);
});