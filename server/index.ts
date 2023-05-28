import { AddressInfo } from "net";
import { app } from "./app";
import { ready } from "./connect";
import { Server } from "http";

let server: Server | undefined = undefined;

const startServer = async () => {
  await ready();
  server = app.listen(app.get("port"), function () {
    const { port } = server!.address() as AddressInfo;
    const date = new Date();
    console.log("Date: ", date);
    console.log("Express server listening on port " + port);
  });
};

startServer();

export { server };
