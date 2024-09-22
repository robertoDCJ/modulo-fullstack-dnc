import styled from "@emotion/styled";
import VisibilityMUI from "@mui/icons-material/Visibility";
import VisibilityOffMUI from "@mui/icons-material/VisibilityOff";
import AlertMUI from "@mui/material/Alert";
import ButtonMUI from "@mui/material/Button";
import FormControlMUI from "@mui/material/FormControl";
import IconButtonMUI from "@mui/material/IconButton";
import InputAdornmentMUI from "@mui/material/InputAdornment";
import InputLabelMUI from "@mui/material/InputLabel";
import OutlinedInputMUI from "@mui/material/OutlinedInput";
import SnackbarMUI from "@mui/material/Snackbar";
import TextFieldMUI from "@mui/material/TextField";
import TypographyMUI from "@mui/material/Typography";
import LinkNEXT from "next/link";

export const Button = styled(ButtonMUI)`
  margin-bottom: 40px;
`;

export const TextField = styled(TextFieldMUI)`
  margin-bottom: 64px;
`;

export const H1 = styled.h1``;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-width: 800px;
`;

export const Alert = styled(AlertMUI)``;

export const Snackbar = styled(SnackbarMUI)``;

export const Typography = styled(TypographyMUI)``;

export const Link = styled(LinkNEXT)`
  color: ${({ theme }) => theme.palette.primary.main};
  text-decoration: none;
`;

export const OutlinedInput = styled(OutlinedInputMUI)``;

export const InputAdornment = styled(InputAdornmentMUI)``;

export const InputLabel = styled(InputLabelMUI)``;

export const IconButton = styled(IconButtonMUI)``;

export const VisibilityOff = styled(VisibilityOffMUI)``;

export const Visibility = styled(VisibilityMUI)``;

export const FormControl = styled(FormControlMUI)``;
