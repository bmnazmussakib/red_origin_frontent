// require('dotenv').config()
// //console.log(process.env)
const express = require('express');
const next = require('next');
const cookieParser = require('cookie-parser');
//console.log(process.env.NODE_ENV)
const port = parseInt(process.env.PORT, 10) || 9090;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
app.prepare().then(() => {

    const server = express();

    server.use(cookieParser());

    server.get('*', (req, res) => {

        return handle(req, res);
    });

    server.listen(port, (err) => {

        if (err) throw err;
        ////console.log(`> Ready on http://localhost:${port}`);
    });
}).catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
})