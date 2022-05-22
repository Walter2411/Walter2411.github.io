import ws from "ws";
import { v4 as uuid } from "uuid";
import { WebSocketServer } from "ws";

const clients = {};
const messages = [];
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  const id = uuid();
  clients[id] = ws;

  console.log(`New client ${id}`);

  ws.on("message", (rawMessage) => {
    const { name, message } = JSON.parse(rawMessage);
    console.log(name, message);
    messages.push({ name, message });
    for (const id in clients) {
      clients[id].send(JSON.stringify([{ name, message }]));
    }
  });

  ws.on("close", () => {
    delete clients[id];
    console.log(`Client is closed ${id}`);
  });
});

// wss.on("connection", function connection(ws) {
//   ws.on("message", function message(data) {
//     console.log("received: %s", data);
//   });

//   ws.send("something");
// });
