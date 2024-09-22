"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import * as S from "./style";

export const TransacoesUpdate = ({ transacaoId }) => {
  const [description, setDescription] = useState();
  const [value, setValue] = useState();
  const [date, setDate] = useState();
  const [type, setType] = useState("Receita");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [userId, setUserId] = useState();

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "",
  });

  useEffect(() => {
    const getCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:8080/categorias`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCategories(response.data.data);
      } catch (error) {
        setNotification({
          open: true,
          message: error.response.data.message,
          severity: "error",
        });
      }
    };
    getCategories();
  }, []);

  const onChangeValue = (e) => {
    const { name, value } = e.target;
    if (name === "description") setDescription(value);
    if (name === "value") setValue(value);
    if (name === "date") setDate(value);
    if (name === "type") setType(value);
    if (name === "category") setCategory(value);
  };

  useEffect(() => {
    const getTransacao = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:8080/transacoes/${transacaoId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setDescription(response.data.data.description);
        setValue(response.data.data.value);
        setDate(response.data.data.date);
        setUserId(response.data.data.user_id);
        setType(response.data.data.type);
        setCategory(response.data.data.categoria_id);
      } catch (error) {
        setNotification({
          open: true,
          message: error.response.data.message,
          severity: "error",
        });
      }
    };
    getTransacao();
  }, [transacaoId]);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8080/transacoes/${transacaoId}`,
        {
          description,
          value,
          date,
          type,
          categoria_id: category,
          user_id: userId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotification({
        open: true,
        message: `Transação ${description} atualizada com sucesso!`,
        severity: "success",
      });
    } catch (error) {
      setNotification({
        open: true,
        message: error.response.data.error,
        severity: "error",
      });
    }
  };

  const handleClose = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setNotification({
      open: false,
      message: "",
      severity: "",
    });
  };

  return (
    <>
      <S.Form onSubmit={onSubmit}>
        <S.H1>Atualizar Transação</S.H1>
        <S.TextField
          name="description"
          onChange={onChangeValue}
          label="Descrição"
          variant="outlined"
          value={description}
          color="primary"
          fullWidth
        />
        <S.TextField
          name="value"
          onChange={onChangeValue}
          label="Valor"
          variant="outlined"
          value={value}
          color="primary"
          fullWidth
        />
        <S.TextField
          name="date"
          onChange={onChangeValue}
          label="Data"
          variant="outlined"
          value={date}
          color="primary"
          fullWidth
        />
        <S.FormControl fullWidth>
          <S.InputLabel id="type">Tipo</S.InputLabel>
          <S.Select
            labelId="type"
            id="select_type"
            value={type}
            label="Tipo"
            name="type"
            onChange={onChangeValue}
          >
            <S.MenuItem value="Despesa">Despesa</S.MenuItem>
            <S.MenuItem value="Receita">Receita</S.MenuItem>
          </S.Select>
        </S.FormControl>
        <S.FormControl fullWidth>
          <S.InputLabel id="category">Categoria</S.InputLabel>
          <S.Select
            labelId="category"
            id="select_category"
            value={category}
            label="Categoria"
            name="category"
            onChange={onChangeValue}
          >
            {categories.map((category) => (
              <S.MenuItem key={category.id} value={category.id}>
                {category.name}
              </S.MenuItem>
            ))}
          </S.Select>
        </S.FormControl>
        <S.Button variant="contained" color="primary" type="submit">
          Enviar
        </S.Button>
      </S.Form>

      <S.Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <S.Alert
          variant="filled"
          onClose={handleClose}
          severity={notification.severity}
          sx={{ width: "100%" }}
        >
          {notification.message}
        </S.Alert>
      </S.Snackbar>
    </>
  );
};

export default TransacoesUpdate;
