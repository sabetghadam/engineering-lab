const http = require('http');

const PORT = 3000;

const server = http.createServer((req, res) => {

    try {
        const response = {
            success: false,
            body: ''
        };

        // i like for simple just accept GET so POST is rejected by 500 error
        if (req.method === 'POST') {
            res.writeHead(500, {
                'Content-Type': 'application/json'
            });

            return res.end(JSON.stringify(response));
        }

        const endpoint = req.url;

        switch (endpoint) {
            case '/users': {
                response.success = true;
                response.body = [
                    { username: 'admin' }
                ];
                break;
            }

            default: {
                response.body = 'Nothing here, dude';
                break;
            }
        }

        console.log(`HTTP ${req.method} ${endpoint}`);

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        return res.end(JSON.stringify(response));
    } catch (err) {
        console.error('Request handler error:', err);


    }

});

server.listen(PORT, () => {
    console.log(`HTTP server running on http://localhost:${PORT}`);
});