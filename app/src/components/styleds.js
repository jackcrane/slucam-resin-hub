import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  max-width: 1000px;
  margin: 0 auto;
  text-align: left;
  padding: 20px;
`;

export const Between = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Dot = styled.div`
  height: 10px;
  width: 10px;
  background-color: ${(props) => {
    switch (props.status) {
      case "SUCCESS":
        return "#52c41a";
      case "IN_PROGRESS":
        return "#faad14";
      default:
        return "#f5222d";
    }
  }};
  border-radius: 50%;
  display: inline-block;
`;
