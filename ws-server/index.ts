type Cliente = {
  id: string;
};
const server = Bun.serve<Cliente>({
  fetch(request, server) {
    const idDelCliente = request?.body?.arguments?.id;
    if (
      server.upgrade(request, {
        data: { id: idDelCliente },
      })
    ) {
      return new Response("Upgraded", { status: 101 });
    }
    return new Response("Not found", { status: 404 });
  },
  websocket: {
    open(ws) {
      const msg = `${ws.data.id} se ha subscripto a nuestra central meteorológica`;
      console.log(msg);
      ws.subscribe("central-meteorologica");
    },
    message(ws, message) {
      console.log(
        `El cliente ${ws.data.id} nos ha enviado la siguiente petición: ${message}`,
      );
    },
    close(ws) {
      const msg = `El cliente ${ws.data.id} nos ha abandonado`;
      console.log(msg);
    },
  },
  port: 4321,
});

setInterval(() => {
  const datos = {
    temperatura: `${(Math.random() * 40).toPrecision(2)}C`,
    humedad: `${(Math.random() * 100).toPrecision(2)}hPa`,
  };
  server.publish("central-meteorologica", JSON.stringify(datos));
}, 1000);

console.log("Servidor corriendo en ws://localhost:" + server.port);
