import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { next_icon } from "../../static/images";

export default function MyPageItem(props) {
  const navigate = useNavigate();

  const onClickHandler = (e, id) => {
    e.stopPropagation();
    if (id === 1) {
      navigate("/nickname");
    } else if (id === 2) {
      navigate("/password");
    } else if (id === 3) {
      console.log("로그아웃 눌림");
    }
  };

  return (
    <MyPageWrap
      onClick={(e) => {
        onClickHandler(e, props.id);
      }}
    >
      {props.text}
      <img src={next_icon} alt="next arrow" />
    </MyPageWrap>
  );
}

const MyPageWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  color: #fff;
  margin: 10px 0;
  padding: 18px 0;
  border-bottom: 1px solid #5d646b;
  cursor: pointer;
`;