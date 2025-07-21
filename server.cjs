const express = require('express');
require('dotenv').config();

const app = express();

app.get("/", (_, res) => {
	return res.status(200).send({ message: "Ludonium server process" });
});

app.listen(3001, (err) => {
	if (err) console.error(err);
	else console.log("Server listening on port 3001");
});
