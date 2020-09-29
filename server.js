const http = require('http');

const server = http.createServer((req, res) => {
    res.end('This is my 1st response');
})

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Listening on port ${port}..`))