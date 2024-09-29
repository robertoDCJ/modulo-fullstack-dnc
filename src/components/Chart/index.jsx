import { BarChart } from "@mui/x-charts/BarChart";
import axios from "axios";
import { useEffect, useState } from "react";

export const Chart = () => {
  const [transacoes, setTransacoes] = useState([]);
  const [transacoesChart, setTransacoesChart] = useState([]);
  const [anos, setAnos] = useState();
  const [ano, setAno] = useState("Todos");
  const [dataset, setDataset] = useState([]);

  useEffect(() => {
    const getTransacao = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:8080/transacoes`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const anos = response.data.data
          .map((transacao) => new Date(transacao.date).getFullYear())
          .filter((ano, index, anos) => anos.indexOf(ano) === index)
          .sort((a, b) => a - b);
        setAnos(["Todos", ...anos]);

        setTransacoes(response.data.data);
        setTransacoesChart(response.data.data);

        const somatorio = [];

        for (const transacao of response.data.data) {
          const ano = new Date(transacao.date).getFullYear();
          somatorio[ano] = somatorio[ano] ?? {};

          if (transacao.type === "Receita") {
            somatorio[ano].receita = somatorio[ano].receita
              ? somatorio[ano].receita + transacao.value
              : transacao.value;
          }
          if (transacao.type === "Despesa") {
            somatorio[ano].despesa = somatorio[ano].despesa
              ? somatorio[ano].despesa + transacao.value
              : transacao.value;
          }
        }

        const dataset = [];
        somatorio.forEach((item, index) => {
          dataset.push({
            ano: index,
            receita: item.receita ?? 0,
            despesa: item.despesa ?? 0,
          });
        });

        setDataset(dataset);
      } catch (error) {
        setNotification({
          open: true,
          message: error.response.data.message,
          severity: "error",
        });
      }
    };

    getTransacao();
  }, []);

  const chartSetting = {
    width: 900,
    height: 400,
  };

  function valueFormatter(value) {
    return `R$ ${value / 100}`;
  }

  return (
    <div>
      {dataset.length && (
        <BarChart
          dataset={dataset}
          xAxis={[{ scaleType: "band", dataKey: "ano" }]}
          series={[
            { dataKey: "receita", label: "Receita", valueFormatter },
            { dataKey: "despesa", label: "Despesa", valueFormatter },
          ]}
          {...chartSetting}
        />
      )}
    </div>
  );
};

export default Chart;
