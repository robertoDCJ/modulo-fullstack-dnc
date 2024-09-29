import Icon from "@mui/material/Icon";
import { useState } from "react";
import * as S from "./style";

export const Card = ({
  children,
  label,
  value,
  isMeta,
  metas = [],
  saldo = 0,
}) => {
  const [meta, setMeta] = useState(0);
  const [metaCalc, setMetaCalc] = useState(0);

  const onChangeValue = (e) => {
    const { name, value } = e.target;
    if (name === "meta") {
      setMeta(value);
    }
  };

  return (
    <S.CardContainer>
      <S.IconWrapper>
        <Icon style={{ color: "#fff" }}>{children}</Icon>
      </S.IconWrapper>
      <S.Content>
        <S.Content>{label}</S.Content>
        {!isMeta && (
          <S.Content style={{ fontWeight: "600" }}>{value}</S.Content>
        )}
        {isMeta && (
          <S.Content style={{ fontWeight: "600" }}>
            {`${(((meta - saldo) / meta) * 100).toFixed(0)}%`}
          </S.Content>
        )}
      </S.Content>
      {isMeta && (
        <S.FormControl fullWidth>
          <S.InputLabel id="meta">Meta</S.InputLabel>
          <S.Select
            labelId="meta"
            id="select_meta"
            value={meta}
            label="Meta"
            name="meta"
            onChange={onChangeValue}
          >
            {metas.map((meta) => (
              <S.MenuItem key={meta.id} value={meta.value}>
                {meta.description}
              </S.MenuItem>
            ))}
          </S.Select>
        </S.FormControl>
      )}
    </S.CardContainer>
  );
};

export default Card;
