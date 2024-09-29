import Icon from "@mui/material/Icon";
import * as S from "./style";

export const Card = ({ children, label, value, isMeta }) => {
  return (
    <S.CardContainer>
      <S.IconWrapper>
        <Icon style={{ color: "#fff" }}>{children}</Icon>
      </S.IconWrapper>
      <S.Content>
        <S.Content>{label}</S.Content>
        <S.Content style={{ fontWeight: "600" }}>{value}</S.Content>
      </S.Content>
      {isMeta && "alguma coisa"}
    </S.CardContainer>
  );
};

export default Card;
