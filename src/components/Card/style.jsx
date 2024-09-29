import styled from "@emotion/styled";
import FormControlMUI from "@mui/material/FormControl";
import InputLabelMUI from "@mui/material/InputLabel";
import MenuItemMUI from "@mui/material/MenuItem";
import SelectMUI from "@mui/material/Select";

export const CardContainer = styled.div`
  background-color: #fff;
  display: flex;
  align-items: center;
  padding: 24px 28px;
`;

export const IconWrapper = styled.div`
  padding: 12px 13px;
  background-color: #299d91;
  border-radius: 8px;
`;

export const Content = styled.div`
  width: 100%;
  text-align: center;
`;

export const FormControl = styled(FormControlMUI)``;
export const InputLabel = styled(InputLabelMUI)``;
export const Select = styled(SelectMUI)``;
export const MenuItem = styled(MenuItemMUI)``;
