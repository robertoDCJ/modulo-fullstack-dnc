"use client";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
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

export const MetasCreate = ({ openModal, closeModal }) => {
  const [description, setDescription] = useState();
  const [value, setValue] = useState();
  const [date, setDate] = useState(new Date());

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

  const onChangeValue = (e) => {
    const { name, value } = e.target;
    if (name === "description") setDescription(value);
    if (name === "value") setValue(value);
    // if (name === "date") setDate(value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8080/metas",
        {
          description,
          value: value * 100,
          date: formatISO(date, { representation: "date", locale: "pt-BR" }),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotification({
        open: true,
        message: `Meta ${description} criada com sucesso!`,
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
        <DialogTitle>Nova Meta</DialogTitle>
        <DialogContent>
          <S.Form onSubmit={onSubmit}>
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
          </S.Form>
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

export default MetasCreate;
