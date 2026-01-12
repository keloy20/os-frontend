"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/api";

export default function CalendarioAdminPage() {
  const router = useRouter();

  const [servicos, setServicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  useEffect(() => {
    carregarServicos();
  }, []);

  async function carregarServicos() {
    try {
      const data = await apiFetch("/projects/admin/all");
      setServicos(data);
    } catch (err: any) {
      setErro(err.message || "Erro ao carregar serviços");
    } finally {
      setLoading(false);
    }
  }

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

  const servicosFiltrados = servicos.filter((s) => {
    if (!dataInicio && !dataFim) return true;

    const dataServico = new Date(s.dataServico || s.createdAt);
    const inicio = dataInicio ? new Date(dataInicio) : null;
    const fim = dataFim ? new Date(dataFim) : null;

    if (inicio && dataServico < inicio) return false;
    if (fim && dataServico > fim) return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4 text-black">
      {/* TOPO */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">📅 Calendário de Serviços</h1>

        <button
          onClick={() => router.push("/admin")}
          className="bg-gray-700 text-white px-3 py-1 rounded"
        >
          Voltar
        </button>
      </div>

      {/* FILTRO DE DATA */}
      <div className="bg-white p-3 rounded shadow mb-4 flex flex-col md:flex-row gap-3">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Data início</label>
          <input
            type="date"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="border p-2 rounded text-black"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium mb-1">Data fim</label>
          <input
            type="date"
            value={dataFim}
            onChange={(e) => setDataFim(e.target.value)}
            className="border p-2 rounded text-black"
          />
        </div>

        <button
          onClick={() => {
            setDataInicio("");
            setDataFim("");
          }}
          className="bg-gray-300 text-black px-4 py-2 rounded self-end"
        >
          Limpar filtro
        </button>
      </div>

      {loading && <p>Carregando serviços...</p>}
      {erro && <p className="text-red-600">{erro}</p>}

      {/* LISTA */}
      <div className="grid gap-3">
        {servicosFiltrados.map((s) => (
          <div
            key={s._id}
            className="bg-white p-4 rounded shadow flex flex-col gap-1"
          >
            <strong className="text-lg">{s.osNumero}</strong>

            <span className="text-gray-800">{s.cliente}</span>

            <span className="text-sm text-gray-600">
              {new Date(s.dataServico || s.createdAt).toLocaleDateString("pt-BR")}
            </span>

            <span className="text-sm text-gray-600">
              Técnico: {s.tecnico?.nome || "-"}
            </span>

            <span
              className={`text-sm font-semibold
                ${
                  s.status === "concluido"
                    ? "text-green-600"
                    : s.status === "em_andamento"
                    ? "text-yellow-600"
                    : "text-orange-600"
                }`}
            >
              {s.status === "concluido" && "Concluído"}
              {s.status === "em_andamento" && "Em andamento"}
              {s.status === "aguardando_tecnico" && "Aguardando"}
            </span>

            {/* BOTÃO PDF */}
            <button
              onClick={() => baixarPDF(s._id)}
              className="bg-blue-600 text-white py-2 rounded mt-2"
            >
              📄 Baixar PDF
            </button>
          </div>
        ))}

        {servicosFiltrados.length === 0 && !loading && (
          <p className="text-gray-600 text-center">
            Nenhum serviço encontrado nesse período
          </p>
        )}
      </div>
    </div>
  );
}
