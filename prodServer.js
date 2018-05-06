const express = require("express"),
	fallback = require("express-history-api-fallback"),
	projectMeta = require('./configs/project.meta');

const app = express();

const root = './build';

app.use(express.static(root));

app.use(fallback("index.html", { root }));

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
	res.header("Access-Control-Allow-Headers", "X-Requested-With, content-type");
	res.header("Access-Control-Allow-Credentials", true);
	next();
});

app.use("/public", express.static("public"));

app.get("/", function (req, res, next) {
	const options = {
		root,
		dotfiles: "deny",
		headers: {
			"x-timestamp": Date.now(),
			"x-sent": true
		}
	};

	res.sendFile("index.html", options, err => {
		if (err) next(err);
	});
});

let port = process.env.PORT || 5000;
app.listen(port, function () {
	console.log(`${projectMeta.title} listening on port ${port}!`);
});