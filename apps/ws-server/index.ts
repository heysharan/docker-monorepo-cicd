import { prismaClient } from "db/client"

Bun.serve({
    port: 8081,
    fetch(req, server) {
      if (server.upgrade(req)) {
        return;
      }
      return new Response("Upgrade failed", { status: 500 });
    },
    websocket: {
        async message(ws, message){
            await prismaClient.user.create({
                data: {
                    firstname: Math.random().toString(),
                    lastname: Math.random().toString(),
                    username: Math.random().toString(),
                    password: Math.random().toString()
                }
            })
            ws.send(message);
        },
    },
});