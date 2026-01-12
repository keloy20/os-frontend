"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/api";
import { User } from "../../lib/types";

export default function TecnicosPage() {
  const router = useRouter();
  const [tecnicos, setTecnicos] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    carregarTecnicos();
  }, []);

  async function carregarTecnicos() {
    try {
      const data = await apiFetch("/auth/tecnicos");
      setTecnicos(data);
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* TOPO */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-black">Técnicos</h1>

        <div className="flex gap-2">
          <button
            onClick={() => router.push("/admin/tecnicos/novo")}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            + Novo Técnico
          </button>

          <button
            onClick={() => router.back()}
            className="bg-gray-600 text-white px-3 py-1 rounded"
          >
            Voltar
          </button>
        </div>
      </div>

      {/* ESTADOS */}
      {loading && <p>Carregando técnicos...</p>}
      {erro && <p className="text-red-600">{erro}</p>}

      {/* LISTA */}
      <div className="grid gap-3">
        {tecnicos.map((t) => (
          <div
            key={t._id}
            className="bg-white p-3 rounded shadow flex flex-col"
          >
            <strong className="text-black">{t.nome}</strong>
            <span className="text-gray-700">{t.email}</span>
            {t.telefone && (
              <span className="text-gray-700">📞 {t.telefone}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
