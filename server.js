//node http server
const http = require('http');

const hostname = 'localhost';
const port = 3000;

const path = require('path');
const fs = require('fs');

const server = http.createServer((req, res) => {
	console.log(`Request for ${req.url} by method ${req.method}`);

	if (req.method === 'GET') {
		let fileUrl = req.url;
		if (fileUrl === '/') {
			fileUrl = '/index.html';
		}

		const filePath = path.resolve('./public' + fileUrl);
		const fileExt = path.extname(filePath);
		if (fileExt === '.html') {
			fs.access(filePath, (err) => {
				if (err) {
					res.statusCode = 404;
					res.setHeader('Content-Type', 'text/html');
					res.end(
						`<html><body><h1>Error 404: ${fileUrl} not found. </h1><body></html>`
					);
					return;
				}
				//no errors, get request for html file and file exists
				res.statusCode = 200;
				res.setHeader('Content-Type', 'text/html');

				fs.createReadStream(filePath).pipe(res); //pipe sends data between streams
			});
		} else {
			res.statusCode = 404;
			res.setHeader('Content-Type', 'text/html');
			res.end(
				`<html><body><h1>Error 404: ${fileUrl} is not an html file. </h1><body></html>`
			);
		}
	} else {
		res.statusCode = 404;
		res.setHeader('Content-Type', 'text/html');
		res.end(
			`<html><body><h1>Error 404: ${req.method} is not supported</h1><body></html>`
		);
	}
});

server.listen(port, hostname, () => {
	console.log(`Server running at: http://${hostname}:${port}`);
});
