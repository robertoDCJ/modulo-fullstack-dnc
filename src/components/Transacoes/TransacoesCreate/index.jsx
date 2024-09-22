"use client";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import axios from "axios";
import formatISO from "date-fns/formatISO";
import { ptBR } from "date-fns/locale/pt-BR";
import { forwardRef, useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import * as S from "./style";

const NumericFormatCustom = forwardRef(function NumericFormatCustom(
  props,
  ref
) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator="."
      decimalSeparator=","
      valueIsNumericString
      prefix="R$ "
    />
  );
});

export const TransacoesCreate = ({ openModal, closeModal }) => {
  const [description, setDescription] = useState();
  const [value, setValue] = useState();
  const [date, setDate] = useState(new Date());
  const [type, setType] = useState("Receita");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "",
  });

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (openModal) {
      setOpen(true);
    }
  }, [openModal]);

  const handleCloseModal = () => {
    setOpen(false);
    closeModal(false);
  };

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
    // if (name === "date") setDate(value);
    if (name === "type") setType(value);
    if (name === "category") setCategory(value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8080/transacoes",
        {
          description,
          value: value * 100,
          date: formatISO(date, { representation: "date", locale: "pt-BR" }),
          type,
          categoria_id: category,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotification({
        open: true,
        message: `Transação ${description} criada com sucesso!`,
        severity: "success",
      });

      handleCloseModal();
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

      <Dialog
        open={open}
        onClose={handleCloseModal}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
            handleCloseModal();
          },
        }}
      >
        <DialogTitle>Nova Transação</DialogTitle>
        <DialogContent>
          <S.TextField
            name="description"
            onChange={onChangeValue}
            label="Descrição"
            variant="outlined"
            color="primary"
            fullWidth
          />
          <S.TextField
            label="Valor"
            name="value"
            onChange={onChangeValue}
            id="formatted-numberformat-input"
            slotProps={{
              input: {
                inputComponent: NumericFormatCustom,
              },
            }}
            variant="outlined"
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
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={ptBR}
            >
              <DatePicker
                onChange={(newValue) => setDate(newValue)}
                label="Data"
                variant="outlined"
                color="primary"
              />
            </LocalizationProvider>
          </S.FormControl>
        </DialogContent>
        <DialogActions style={{ display: "flex", justifyContent: "center" }}>
          <S.Button
            variant="contained"
            color="success"
            type="submit"
            onClick={onSubmit}
          >
            Salvar
          </S.Button>{" "}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TransacoesCreate;
