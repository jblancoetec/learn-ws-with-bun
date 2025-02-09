"use client";
import PortadaDelSitio from "@/app/components";
import { useState, useEffect } from "react";

type Clima = { temperatura: string; humedad: string };

export default function Home() {
  const [clima, cambiarDatosDelClima] = useState<Clima>({
    temperatura: "30C",
    humedad: "100hPa",
  });

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:4321");
    socket.addEventListener("open", () => {
      console.log("Conectado a la central meteorológica");
    });
    socket.addEventListener("message", (event) => {
      const datos = JSON.parse(event.data);
      cambiarDatosDelClima(datos);
    });
    socket.addEventListener("close", () => {
      console.log("Desconectado de la central meteorológica");
    });
    socket.addEventListener("error", (error) => {
      console.error("Error:", error);
    });
  }, []);
  return (
    <PortadaDelSitio humedad={clima.humedad} temperatura={clima.temperatura} />
  );
}
