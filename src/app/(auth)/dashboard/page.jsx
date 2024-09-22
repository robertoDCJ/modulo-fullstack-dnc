"use client";

// import TransacoesCreate from "@/components/Transacoes/TransacoesCreate";
// import TransacoesUpdate from "@/components/Transacoes/TransacoesUpdate";
// import MetasCreate from "@/components/Metas/MetasCreate";
// import MetasUpdate from "@/components/Metas/MetasUpdate";
// import CategoriasUpdate from "@/components/Categorias/CategoriasUpdate";
// import CategoriasCreate from "@/components/Categorias/CategoriasCreate";
import axios from "axios";
import { useEffect, useState } from "react";

export const DashboardPage = () => {
  const [user, setUser] = useState({
    id: null,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
    axios
      .get("http://localhost:8080/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUser(response.data.data);
      })
      .catch((error) => {
        window.location.href = "/login";
      });
  }, []);
  return (
    <div>
      <h1>Dashboard</h1>
      {/* <CategoriasCreate /> */}
      {/* <CategoriasUpdate categoriaId={1} /> */}
      {/* <MetasCreate /> */}
      {/* <MetasUpdate metaId={1} /> */}
      {/* <TransacoesCreate /> */}
      {/* <TransacoesUpdate transacaoId={1} /> */}
    </div>
  );
};

export default DashboardPage;
