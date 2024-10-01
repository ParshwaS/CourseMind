import { server } from "./app";

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
	console.log("> HTTP Server started on PORT " + server.address().port);
});
