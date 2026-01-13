"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { apiFetch } from "@/app/lib/api";

export default function TesteAdminOS() {
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    console.log("ID DA OS:", id);

    apiFetch(`/admin/view/${id}`)
      .then((res) => {
        console.log("DADOS DA OS:", res);
        alert("OS carregada com sucesso, veja o console");
      })
      .catch((err) => {
        console.error("ERRO AO BUSCAR OS:", err);
        alert("DEU ERRO AO BUSCAR OS, veja o console");
      });
  }, []);

  return (
    <div className="p-4 text-black">
      <h1 className="text-xl font-bold">TESTE DETALHE OS ADMIN</h1>
      <p>Se aparecer alerta, a rota está funcionando.</p>
    </div>
  );
}
