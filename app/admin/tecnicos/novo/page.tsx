"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/app/lib/api";

export default function NovoTecnicoPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  async function salvarTecnico(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      await apiFetch("/auth/register-tecnico", {
        method: "POST",
        body: JSON.stringify({
          nome,
          email,
          telefone,
          senha,
        }),
      });

      // volta para a lista de técnicos
      router.push("/admin/tecnicos");
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
        <h1 className="text-2xl font-bold text-black">Novo Técnico</h1>

        <button
          onClick={() => router.back()}
          className="bg-gray-600 text-white px-3 py-1 rounded"
        >
          Voltar
        </button>
      </div>

      <form
        onSubmit={salvarTecnico}
        className="bg-white p-4 rounded shadow max-w-md"
      >
        {erro && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">
            {erro}
          </div>
        )}

        <div className="mb-3">
          <label className="text-sm font-medium text-black">Nome</label>
          <input
            className="w-full border p-2 rounded text-black"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="text-sm font-medium text-black">Email</label>
          <input
            type="email"
            className="w-full border p-2 rounded text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="text-sm font-medium text-black">Telefone</label>
          <input
            className="w-full border p-2 rounded text-black"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            placeholder="Ex: 11999999999"
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-black">Senha</label>
          <input
            type="password"
            className="w-full border p-2 rounded text-black"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Salvando..." : "Cadastrar Técnico"}
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
