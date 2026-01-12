"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const res = await fetch("https://gerenciador-de-os.onrender.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || "Erro ao logar");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("nome", data.nome);

      console.log("TOKEN:", data.token);
      console.log("ROLE:", data.role);

      if (data.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/tecnico");
      }

    } catch (err) {
      console.error(err);
      setErro("Erro de conexão com o servidor");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white w-full max-w-sm rounded-xl p-6 shadow-lg"
      >
        <h1 className="text-2xl font-bold text-center mb-1 text-black">
          Sistema de OS
        </h1>

        <p className="text-sm text-gray-600 text-center mb-6">
          Entre com suas credenciais
        </p>

        {erro && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm text-center">
            {erro}
          </div>
        )}

        <div className="mb-3">
          <label className="text-sm font-medium text-black">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded p-2 mt-1 text-black bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-black">Senha</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded p-2 mt-1 text-black bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded hover:opacity-90 transition disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
