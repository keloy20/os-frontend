"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiFetch } from "@/app/lib/api";

export default function AdminDetalheOSPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [servico, setServico] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  async function baixarPDF(id: string) {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `https://gerenciador-de-os.onrender.com/projects/${id}/pdf`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!res.ok) {
      throw new Error("Erro ao gerar PDF");
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `OS-${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);

  } catch (err: any) {
    alert(err.message || "Erro ao baixar PDF");
  }
}


  useEffect(() => {
    carregarServico();
  }, []);

  async function carregarServico() {
    try {
      const data = await apiFetch(`/projects/admin/view/${id}`);
      setServico(data);
    } catch (err: any) {
      setErro(err.message || "Erro ao carregar serviço");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <p className="p-4 text-black">Carregando...</p>;
  if (erro) return <p className="p-4 text-red-600">{erro}</p>;
  if (!servico) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-4 text-black">
      {/* TOPO */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">OS {servico.osNumero}</h1>

        <button
          onClick={() => router.back()}
          className="bg-gray-600 text-white px-3 py-1 rounded"
        >
          Voltar
        </button>
      </div>

      {/* DADOS */}
      <div className="bg-white p-4 rounded shadow mb-4 space-y-2">
        <p><strong>Cliente:</strong> {servico.cliente}</p>
        <p><strong>Subgrupo:</strong> {servico.subgrupo || "-"}</p>
        <p><strong>Unidade:</strong> {servico.unidade || "-"}</p>
        <p><strong>Marca:</strong> {servico.marca || "-"}</p>
        <p><strong>Endereço:</strong> {servico.endereco}</p>
        <p><strong>Tipo de Serviço:</strong> {servico.tipoServico}</p>

        {/* STATUS COLORIDO */}
        <div className="mt-2">
          <span className="font-bold">Status: </span>
          <span
            className={`inline-block px-3 py-1 rounded-full text-sm font-semibold
              ${
                servico.status === "concluido"
                  ? "bg-green-100 text-green-700"
                  : servico.status === "em_andamento"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-orange-100 text-orange-700"
              }`}
          >
            {servico.status === "concluido" && "Concluído"}
            {servico.status === "em_andamento" && "Em andamento"}
            {servico.status === "aguardando_tecnico" && "Aguardando técnico"}
          </span>
        </div>

        <p><strong>Técnico:</strong> {servico.tecnico?.nome || "-"}</p>
      </div>

      {/* ANTES */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-lg font-bold mb-2">Antes</h2>

        <p><strong>Relatório:</strong> {servico.antes?.relatorio || "-"}</p>
        <p><strong>Observação:</strong> {servico.antes?.observacao || "-"}</p>

        <div className="grid grid-cols-2 gap-2 mt-2">
          {servico.antes?.fotos?.map((foto: string, idx: number) => (
            <img
              key={idx}
              src={foto}
              alt="Antes"
              className="w-full h-32 object-cover rounded border"
            />
          ))}
        </div>
      </div>

      {/* DEPOIS */}
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-lg font-bold mb-2">Depois</h2>

        <p><strong>Relatório:</strong> {servico.depois?.relatorio || "-"}</p>
        <p><strong>Observação:</strong> {servico.depois?.observacao || "-"}</p>

        <div className="grid grid-cols-2 gap-2 mt-2">
          {servico.depois?.fotos?.map((foto: string, idx: number) => (
            <img
              key={idx}
              src={foto}
              alt="Depois"
              className="w-full h-32 object-cover rounded border"
            />
          ))}
        </div>
      </div>

      {/* BOTÕES */}
      <div className="flex gap-3">
        <button
          onClick={() => baixarPDF(servico._id)}

          className="flex-1 bg-blue-600 text-white py-2 rounded"
        >
          Baixar PDF
        </button>

        <button
          onClick={() => router.back()}
          className="flex-1 bg-gray-600 text-white py-2 rounded"
        >
          Voltar
        </button>
      </div>
    </div>
  );
}
