// React
import React, { useState, useEffect, useRef } from "react";
// ModalSheet
import Sheet from "react-modal-sheet";
// Calendar
import Calendar from "react-calendar";
import moment from "moment";
import "react-calendar/dist/Calendar.css";
// Redux
import { useDispatch, useSelector } from "react-redux";
import {
  getCategThunk,
  addMtyTodo,
  deleteTodoThunk,
  updateTodoMemoThunk,
} from "../redux/modules/categTodoSlice.js";
import {
  getDayPlanetThunk
} from "../redux/modules/planetSlice.js";
// Styled-Component
import styled from "styled-components";
// React Component
import Header from "../components/Header";
import TodoList from "../components/TodoList";
import BtmFitNavi from "../components/btmFitNaviBar/BtmFitNavi.jsx";
import DayMover from "../components/dateMover/DayMover.jsx";
// Element
import Circle from "../element/Circle.jsx";
// React-icons
import { FiPlus } from "react-icons/fi";
import { MdModeEdit } from "react-icons/md";
import { achieved_icon, like_icon_on } from "../static/images";

const DlyTodo = () => {

  // Redux : dispatch
  const dispatch = useDispatch();

  // Hook : whether to show Modal sheet
  const [isOpen, setOpen] = useState(false);

  // Hook : To get the selected date from the calendar
  var [dateValue, setDateValue] = useState(new Date());

  // Var ; A Parsed date in format yyyy/mm/dd from the calendar  
  var parsedfullDate = `${dateValue.getFullYear()}-${String(dateValue.getMonth()+1).padStart(2,'0')}-${String(dateValue.getDate()).padStart(2,'0')}`

  // Var : A Parsed date in format mm월 dd일 from the calendar
  var parsedParDate = `${String(dateValue.getMonth()+1).padStart(2,'0')}월 ${String(dateValue.getDate()).padStart(2,'0')}일`

  // Hook : TO get the cliced Memo info from the TodoList
  const [clickedMemo, setClickedMemo] = useState("");

  // Hook : To get the clicked Cagegory index
  const [clickedCategIndex, setClickedCategIndex] = useState("");

  // Hook : To get the clicked todo info & index from the TodoList
  const [clickedTodo, setClickedTodo] = useState({
    todoInfo: "",
    todoIndex: "",
  });

  // Hook : Switching between the process planet & calendar
  const [showCalendar, setShowCalendar] = useState(false);

  // UseRef : To get the selected date from the calendar
  const concatSelDate = useRef();

  // Redux : categories useSelector 
  const categories = useSelector((state) => state.categTodoSlice.categories);
  // Redux : planet useSelector 
  const planet = useSelector((state) => state.planetSlice.planet);

  // Function to open sheetModal & Getting clicked todo Info & index as well as the todo index
  const onClickedSheet = (inputs, index, categIndex) => {
    setOpen(true);
    setClickedTodo({
      todoInfo: inputs,
      todoIndex: index,
    });
    setClickedMemo(inputs.memo);
    setClickedCategIndex(categIndex);
  };

  // UseEffect : getting categories & to-do lists as well as date from the calendar
  useEffect(() => {

    concatSelDate.current = parsedfullDate;

    dispatch(getCategThunk(concatSelDate.current));
    dispatch(getDayPlanetThunk(concatSelDate.current))
  }, [dateValue]);

  // Adding a new todo
  const addTodo = ({ input, index }) => {
    console.log("Checking input", input);
    if (input.todos[input.todos.length - 1]?.title !== "") {
      const mtyCateg = {
        categIndex: index,
        categReq: {
          todoListId: input.categoryId + 1,
          title: "",
          dueDate: concatSelDate.current,
        },
      };
      dispatch(addMtyTodo(mtyCateg));
      console.log("Checking here", document.getElementById("disable133"));
    }
  };

  // Enabling to edit todo by closing the modalSheet
  const clickEditTodo = () => {
    setOpen(false);
    document.getElementById(
      `disable${clickedTodo.todoInfo.todoId}`
    ).disabled = false;
    document.getElementById(`disable${clickedTodo.todoInfo.todoId}`).focus();
  };

  // Deleting the clicked todo by closing the modalSheet
  const clickDeleteTodo = () => {
    setOpen(false);

    const clickedTodoId = clickedTodo.todoInfo.todoId;

    const deleteTodoObj = {
      todoId: clickedTodoId,
      todoIndex: clickedTodo.todoIndex,
      categIndex: clickedCategIndex,
    };

    dispatch(deleteTodoThunk(deleteTodoObj));
  };

  // Updating memo input
  const onChangeMemoHandler = (e) => {
    setClickedMemo(e.target.value);
  };

  // When outfocused, update todo's memo
  const onCheckMemoOutFocus = () => {
    const clickedTodoId = clickedTodo.todoInfo.todoId;

    const updateTodoMemoObj = {
      todoId: clickedTodoId,
      todoIndex: clickedTodo.todoIndex,
      categIndex: clickedCategIndex,
      todoReq: {
        memo: clickedMemo,
      },
    };

    dispatch(updateTodoMemoThunk({ updateTodoMemoObj }));
  };

  return (
    <StyDlyTodoCon>
      {console.log("Checking planet", planet)}
      <Header showCalendar={showCalendar} setShowCalendar={setShowCalendar} />
      <StyHeader>
        <DayMover parsedParDate={parsedParDate}/>
        <TodoStatus>
          <div>
            <img src={achieved_icon} alt="achieved icon" />
            <span>{planet.achievementCnt}</span>
          </div>
          <div>
            <img src={like_icon_on} alt="like icon on" />
            <span>{planet.likesCnt}</span>
          </div>
        </TodoStatus>
      </StyHeader>
      {/* <SubHeader></SubHeader> */}
      <CalendarWrap>
        {showCalendar ? (
          <Calendar
            onChange={setDateValue}
            value={dateValue}
            formatDay={(locale, date) => moment(date).format("DD")}
          />
        ) : (
          <Circle planetType={planet.planetType} planetLevel={planet.planetLevel}></Circle>
        )}
        {/* <Calendar 
          onChange={setDateValue} 
          value={dateValue}
          formatDay={(locale, date) => moment(date).format("DD")}
        /> */}
        {/* {console.log("Checking showCalendar in DlyTodo", showCalendar)}
              <Circle>helo</Circle> */}
      </CalendarWrap>
      <Section>
        {categories.map((input, index) => {
          return (
            <TodoCon key={index}>
              <TodoBtn
                onClick={() => addTodo({ input, index })}
                btnColor={input.categoryColor}
              >
                {input.categoryName}
                <FiPlus></FiPlus>
              </TodoBtn>
              <TodoList
                selectedDate={concatSelDate.current}
                clickedTodo={clickedTodo}
                onClickedSheet={onClickedSheet}
                categId={input.categoryId}
                todos={input.todos}
                categIndex={index}
              ></TodoList>
            </TodoCon>
          );
        })}
      </Section>

      <CustomSheet isOpen={isOpen} onClose={() => setOpen(false)}>
        <CustomSheet.Container>
          <CustomSheet.Header />
          <CustomSheet.Content>
            <ContentHeader>
              <div className="todo-edit-title-wrap">
                <span className="todo-edit-title">
                  {clickedTodo.todoInfo.title}
                </span>
                <button
                  onClick={() => {
                    clickEditTodo();
                  }}
                >
                  <MdModeEdit />
                </button>
              </div>
              <button
                className="todo-edit-submit"
                onClick={() => setOpen(false)}
              >
                확인
              </button>
            </ContentHeader>
            <textarea
              name="memo"
              value={clickedMemo}
              onChange={onChangeMemoHandler}
              onBlur={() => onCheckMemoOutFocus()}
            ></textarea>
            <ContentFooter>
              <button
                onClick={() => {
                  clickDeleteTodo();
                }}
              >
                삭제
              </button>
              <button
                onClick={() => {
                  clickDeleteTodo();
                }}
              >
                날짜변경하기
              </button>
            </ContentFooter>
          </CustomSheet.Content>
        </CustomSheet.Container>

        <Sheet.Backdrop />
      </CustomSheet>
      <BtmFitNavi name="dlytodo" />
    </StyDlyTodoCon>
  );
};

export default DlyTodo;

const StyDlyTodoCon = styled.div`
  padding: 15px;
`;
const StyHeader = styled.div`
  display: flex;
  margin: 3% 0;
`;

const Section = styled.div`
  margin-top: 30px;
  /* padding: 15px 20px; */
  position: relative;
`;

const CalendarWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .react-calendar {
    background: transparent;
    border: none;

    &__navigation__arrow {
      color: #fff;
    }
    &__navigation__label__labelText {
      color: #fff;
      font-weight: bold;
      font-size: 18px;
    }
    abbr {
      color: #fff;
    }

    &__tile--active {
      background: #3185f3;
    }
    // &__tile--now{
    //   background: #121212;
    // }
  }
`;

const TodoStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  /* margin-bottom: 20px; */
  /* padding: 0 20px; */
  gap: 12px;

  span {
    font-weight: 400;
    color: #fff;
    margin-left: 5px;
  }
`;

const TodoCon = styled.div`
  &:not(:first-of-type) {
    margin-top: 30px;
  }
`;

const TodoBtn = styled.button`
  font-size: 18px;
  color: #fff;
  // background-color: ${(props) => props.btnColor};
  background: transparent;
  border: none;

  svg {
    color: #d9d9d9;
    margin-left: 5px;
  }
`;

const CustomSheet = styled(Sheet)`
  .react-modal-sheet-backdrop {
    /* custom styles */
    border: 3px solid #ffffff;
  }
  .react-modal-sheet-container {
    display: fixed;
    bottom: 0;
    // max-height: 290px;
    height: auto !important;
    right: 0;
    margin: 0 auto;
    max-width: 375px;
    width: 100%;
    background-color: #516d93 !important;
    padding: 24px 0 40px;
  }

  .react-modal-sheet-header {
    /* custom styles */
  }

  .react-modal-sheet-drag-indicator {
    /* custom styles */
  }

  .react-modal-sheet-content {
    /* custom styles */
    padding: 0 5% 5% 5%;
    // background: #516d93;
    background: transparent;

    textarea {
      width: 100%;
      height: 90px;
      resize: none;
      font-weight: 400;
      font-size: 14px;
      color: #fff;
      margin: 18px 0 25px;
      padding: 14px 16px;
      background: rgba(170, 188, 224, 0.2);
      border: none;
    }
  }
`;

const ContentHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  color: #fff;

  button {
    color: #fff;
    background: transparent;
    border: none;
  }

  .todo-edit-title-wrap {
    display: flex;
    align-items: center;
  }

  .todo-edit-title {
    font-weight: 600;
    font-size: 20px;
    margin-right: 8px;
  }
`;
const ContentFooter = styled.div`
  button {
    display: block;
    font-weight: 400;
    font-size: 14px;
    color: #fff;
    background: transparent;
    border: none;

    &:not(:first-child) {
      margin-top: 12px;
    }
  }
`;
