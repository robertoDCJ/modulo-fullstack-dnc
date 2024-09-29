import { AccountBalanceWallet } from "@mui/icons-material";
import AdsClickIcon from "@mui/icons-material/AdsClick";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import Grid from "@mui/material/Grid";
import axios from "axios";
import { useEffect, useState } from "react";
import Card from "../Card";

export const Panel = () => {
  const [somatorio, setSomatorio] = useState({
    saldo: 0,
    receita: 0,
    despesa: 0,
  });
  const [metas, setMetas] = useState([]);

  useEffect(() => {
    const getTransacao = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:8080/transacoes`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const somatorio = {};

        for (const transacao of response.data.data) {
          if (transacao.type === "Receita") {
            somatorio.receita = somatorio.receita
              ? somatorio.receita + transacao.value
              : transacao.value;
          }
          if (transacao.type === "Despesa") {
            somatorio.despesa = somatorio.despesa
              ? somatorio.despesa + transacao.value
              : transacao.value;
          }
        }

        somatorio.saldo = somatorio.receita - somatorio.despesa;

        setSomatorio(somatorio);
      } catch (error) {
        console.log(error);
      }
    };

    getTransacao();
  }, []);

  useEffect(() => {
    const getMetas = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:8080/metas`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMetas(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    getMetas();
  }, []);

  return (
    <div>
      <Grid container spacing={8}>
        <Grid item xs={6}>
          <Card label="Saldo atual" value={`R$ ${somatorio.saldo / 100}`}>
            <AccountBalanceWallet />
          </Card>
          <Card label="Receitas" value={`R$ ${somatorio.receita / 100}`}>
            <SwapHorizIcon />
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card label="Despesas" value={`R$ ${somatorio.despesa / 100}`}>
            <LocalAtmIcon />
          </Card>
          <Card
            label="Metas"
            value="R$ 250,00"
            isMeta
            metas={metas}
            saldo={somatorio.saldo}
          >
            <AdsClickIcon />
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Panel;
