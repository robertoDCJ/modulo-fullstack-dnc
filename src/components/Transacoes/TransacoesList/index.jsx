import axios from "axios";
import { compareAsc, format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { useEffect, useState } from "react";
import * as S from "./style";

export const TransacoesList = () => {
  const [transacoes, setTransacoes] = useState([]);
  const [transacoesTable, setTransacoesTable] = useState([]);
  const [tipo, setTipo] = useState("Todas");
  const [anos, setAnos] = useState();
  const [ano, setAno] = useState("Todos");

  useEffect(() => {
    const getTransacao = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:8080/transacoes`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTransacoes(response.data.data);
        setTransacoesTable(response.data.data);

        const anos = response.data.data
          .map((transacao) => new Date(transacao.date).getFullYear())
          .filter((ano, index, anos) => anos.indexOf(ano) === index)
          .sort((a, b) => a - b);
        setAnos(["Todos", ...anos]);
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

  useEffect(() => {
    if (ano === "Todos") {
      if (tipo === "Todas") {
        setTransacoesTable(transacoes);
      }
      if (tipo === "Receita") {
        const receitas = transacoes.filter(
          (transacao) => transacao.type === "Receita"
        );
        setTransacoesTable(receitas);
      }
      if (tipo === "Despesa") {
        const despesas = transacoes.filter(
          (transacao) => transacao.type === "Despesa"
        );
        setTransacoesTable(despesas);
      }
    } else {
      if (tipo === "Todas") {
        const todas = transacoes.filter(
          (transacao) => new Date(transacao.date).getFullYear() === Number(ano)
        );
        setTransacoesTable(todas);
      }
      if (tipo === "Receita") {
        const receitas = transacoes.filter(
          (transacao) =>
            transacao.type === "Receita" &&
            new Date(transacao.date).getFullYear() === Number(ano)
        );
        setTransacoesTable(receitas);
      }
      if (tipo === "Despesa") {
        const despesas = transacoes.filter(
          (transacao) =>
            transacao.type === "Despesa" &&
            new Date(transacao.date).getFullYear() === Number(ano)
        );
        setTransacoesTable(despesas);
      }
    }
  }, [tipo, transacoes, ano]);

  return (
    <>
      <div style={{ display: "flex", gap: "15px", margin: "30px 0" }}>
        <div onClick={() => setTipo("Todas")}>Todas transações</div>
        <div onClick={() => setTipo("Receita")}>Receitas</div>
        <div onClick={() => setTipo("Despesa")}>Despesas</div>
      </div>
      <S.FormControl>
        <S.InputLabel id="years">Anos</S.InputLabel>
        <S.Select
          labelId="years"
          id="select_year"
          value={ano}
          label="Ano"
          name="year"
          onChange={(e) => setAno(e.target.value)}
        >
          {anos?.map((ano) => (
            <S.MenuItem key={ano} value={ano}>
              {ano}
            </S.MenuItem>
          ))}
        </S.Select>
      </S.FormControl>
      <S.TableContainer component={S.Paper}>
        <S.Table sx={{ minWidth: 650 }} aria-label="simple table">
          <S.TableHead>
            <S.TableRow>
              <S.TableCell>Descrição</S.TableCell>
              <S.TableCell align="right">Transações</S.TableCell>
              <S.TableCell align="right">Data</S.TableCell>
              <S.TableCell align="right">Situação</S.TableCell>
              <S.TableCell align="right">Valor</S.TableCell>
            </S.TableRow>
          </S.TableHead>
          <S.TableBody>
            {transacoesTable.map((transacao) => (
              <S.TableRow
                key={transacao.description}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <S.TableCell component="th" scope="row">
                  {transacao.description}
                </S.TableCell>
                <S.TableCell align="right">{transacao.type}</S.TableCell>
                <S.TableCell align="right">
                  {format(new Date(transacao.date), "d MMM, yyyy", {
                    locale: ptBR,
                  })}
                </S.TableCell>
                <S.TableCell align="right">
                  {compareAsc(new Date(), new Date(transacao.date)) === 1
                    ? "Realizada"
                    : "Planejada"}
                </S.TableCell>
                <S.TableCell align="right">
                  R$ {transacao.value / 100}
                </S.TableCell>
              </S.TableRow>
            ))}
          </S.TableBody>
        </S.Table>
      </S.TableContainer>
    </>
  );
};

export default TransacoesList;
