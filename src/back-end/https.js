const fs = require('fs');
const express = require('express');
const http = require('http');
const https = require('https');
const cors = require('cors');
const sendPost = require('./sendPost');
const PATH = `${__dirname}/build`

const cert = fs.readFileSync('/home/ubuntu/Keys/farmsignal_net.crt');
const ca = fs.readFileSync('/home/ubuntu/Keys/farmsignal_net.ca-bundle');
const key = fs.readFileSync('/home/ubuntu/Keys/private.key');

const httpsOptions = {cert, ca, key};
const hostname = 'farmsignal.net';
const httpsPort = 443;
const httpPort = 80;

const app = express();
const httpServer = http.createServer(app);
const httpsServer = https.createServer(httpsOptions, app);

app.use(cors({origin: 'http://localhost'}));

app.use((req, res, next) => {
    if (req.protocol === 'http') {
        res.redirect(301, `https://${req.headers.host}${req.url}`);
        return;
    }
    next();
});

app.use(express.static(PATH));

app.get('/resetpassword/:id/:token', (req, res) => {
    sendPost.postRequest('/api/resetpassword/' + req.params.id + '/' + req.params.token, {}, (resp) => {
        if (resp.status === 200) {
            console.log('Sending password recovery page.');
            res.send('<form action="https://farmsignal.net:8080/api/resetpassword" method="POST">' +
                '<input type="hidden" name="id" value="' + req.params.id + '" />' +
                '<input type="hidden" name="token" value="' + req.params.token + '" />' +
                '<input type="password" name="password" value="" placeholder="Enter new password..." />' +
                '<input type="submit" value="Reset Password" />' +
                '</form>');
        } else if (resp.status === 400) {
            console.log('Incorrect password recovery id');
            res.redirect(301, 'https://farmsignal.net/');
        } else {
            if (resp.status === 403) {
                console.log('Incorrect password recovery token')
            } else {
                console.log(resp.text());
            }
            res.redirect(301, 'https://farmsignal.net/404');
        }
    });
});

app.get('/*', (req, res) => {
    res.status(200).sendFile(`${PATH}/index.html`);
});

httpServer.listen(httpPort, () => {
    console.log("HTTP Server started on port 80");
});

httpsServer.listen(httpsPort, () => {
    console.log("HTTPS Server started on port 443");
});
