"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/api";

export default function TecnicoDashboard() {
  const router = useRouter();

  const [servicos, setServicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");

  useEffect(() => {
    carregarServicos();
  }, []);

  async function carregarServicos() {
    try {
      const data = await apiFetch("/projects/me");
      setServicos(data || []);
    } catch (err: any) {
      setErro(err.message || "Erro ao carregar serviços");
    } finally {
      setLoading(false);
    }
  }

  async function abrirServico(id: string) {
    try {
      await apiFetch(`/projects/${id}/abrir`, { method: "POST" });
      carregarServicos();
    } catch (err: any) {
      alert(err.message || "Erro ao abrir serviço");
    }
  }

  const servicosFiltrados = servicos.filter((s) => {
    const cliente = s.cliente || "";
    const osNumero = s.osNumero || "";

    const matchBusca =
      cliente.toLowerCase().includes(busca.toLowerCase()) ||
      osNumero.toLowerCase().includes(busca.toLowerCase());

    const matchStatus = filtroStatus ? s.status === filtroStatus : true;

    return matchBusca && matchStatus;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4 text-black">
      {/* TOPO */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Meus Serviços</h1>

        <button
          onClick={() => {
            localStorage.clear();
            router.push("/login");
          }}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Sair
        </button>
      </div>

      {/* FILTROS */}
      <div className="bg-white p-3 rounded shadow mb-4 flex flex-col md:flex-row gap-2">
        <input
          type="text"
          placeholder="Buscar por cliente ou OS..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="border p-2 rounded w-full text-black"
        />

        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="border p-2 rounded w-full md:w-60 text-black"
        >
          <option value="">Todos os status</option>
          <option value="aguardando_tecnico">Aguardando</option>
          <option value="em_andamento">Em andamento</option>
          <option value="concluido">Concluído</option>
        </select>
      </div>

      {loading && <p>Carregando serviços...</p>}
      {erro && <p className="text-red-600">{erro}</p>}

      {/* LISTA */}
      <div className="grid gap-3">
        {servicosFiltrados.map((s) => (
          <div
            key={s._id}
            className="bg-white p-4 rounded shadow flex flex-col gap-2"
          >
            <div className="flex justify-between items-center">
              <strong className="text-black">
                OS {s.osNumero || "-"}
              </strong>

              <span
                className={`text-sm font-semibold px-2 py-1 rounded
                  ${
                    s.status === "concluido"
                      ? "bg-green-100 text-green-700"
                      : s.status === "em_andamento"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
              >
                {s.status === "concluido" && "Concluído"}
                {s.status === "em_andamento" && "Em andamento"}
                {s.status === "aguardando_tecnico" && "Aguardando"}
              </span>
            </div>

            <span className="text-gray-800">{s.cliente || "-"}</span>
            <span className="text-sm text-gray-600">{s.endereco || "-"}</span>

            {/* AÇÕES */}
            <div className="flex gap-2 mt-2">
              {s.status === "aguardando_tecnico" && (
                <button
                  onClick={() => abrirServico(s._id)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Abrir Serviço
                </button>
              )}

              <button
                onClick={() => router.push(`/tecnico/${s._id}`)}
                className="bg-gray-700 text-white px-3 py-1 rounded"
              >
                Ver Detalhes
              </button>
            </div>
          </div>
        ))}

        {servicosFiltrados.length === 0 && !loading && (
          <p className="text-gray-600 text-center">
            Nenhum serviço encontrado
          </p>
        )}
      </div>
    </div>
  );
}
