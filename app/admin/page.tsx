"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/api";

export default function AdminDashboard() {
  const router = useRouter();

  const [servicos, setServicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");

  const [osHoje, setOsHoje] = useState(0);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      router.push("/login");
      return;
    }

    carregarServicos();
  }, []);

  async function carregarServicos() {
    try {
      const data = await apiFetch("/projects/admin/all");
      setServicos(data);
      calcularOsHoje(data);
    } catch (err: any) {
      setErro(err.message || "Erro ao carregar serviços");
    } finally {
      setLoading(false);
    }
  }

  function calcularOsHoje(lista: any[]) {
    const hoje = new Date();
    const hojeStr = hoje.toISOString().split("T")[0];

    const totalHoje = lista.filter((s) => {
      if (!s.createdAt) return false;
      const data = new Date(s.createdAt).toISOString().split("T")[0];
      return data === hojeStr;
    }).length;

    setOsHoje(totalHoje);
  }

  const total = servicos.length;
  const concluidos = servicos.filter((s) => s.status === "concluido").length;
  const emAndamento = servicos.filter((s) => s.status === "em_andamento").length;
  const aguardando = servicos.filter(
    (s) => s.status === "aguardando_tecnico"
  ).length;

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
        <h1 className="text-2xl font-bold">Painel Admin</h1>

        <button
          onClick={() => {
            localStorage.clear();
            router.push("/login");
          }}
          className="bg-red-600 text-white px-3 py-1 rounded"
        >
          Sair
        </button>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">

        <div className="bg-white p-3 rounded shadow text-center">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold">{total}</p>
        </div>

        <div className="bg-green-100 p-3 rounded shadow text-center">
          <p className="text-sm text-green-800">Concluídos</p>
          <p className="text-2xl font-bold text-green-900">{concluidos}</p>
        </div>

        <div className="bg-yellow-100 p-3 rounded shadow text-center">
          <p className="text-sm text-yellow-800">Em andamento</p>
          <p className="text-2xl font-bold text-yellow-900">{emAndamento}</p>
        </div>

        <div className="bg-orange-100 p-3 rounded shadow text-center">
          <p className="text-sm text-orange-800">Aguardando</p>
          <p className="text-2xl font-bold text-orange-900">{aguardando}</p>
        </div>

        <div className="bg-blue-100 p-3 rounded shadow text-center">
          <p className="text-sm text-blue-800">OS Hoje</p>
          <p className="text-2xl font-bold text-blue-900">{osHoje}</p>
        </div>

      </div>

      {/* FILTROS + AÇÕES */}
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

        <button
          onClick={() => router.push("/admin/servicos/novo")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Nova OS
        </button>

        <button
          onClick={() => router.push("/admin/tecnicos")}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Técnicos
        </button>

        <button
          onClick={() => router.push("/admin/calendario")}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          📅 Calendário
        </button>
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
              <strong>{s.osNumero}</strong>

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

            <span className="text-gray-800">Cliente: {s.cliente}</span>
            <span className="text-sm text-gray-600">{s.endereco}</span>
            <span className="text-sm text-gray-600">
              Técnico: {s.tecnico?.nome || "-"}
            </span>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => router.push(`/admin/servicos/${s._id}`)}
                className="bg-gray-800 text-white px-3 py-1 rounded"
              >
                Ver
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
