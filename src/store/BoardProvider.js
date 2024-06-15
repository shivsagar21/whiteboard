import boardContext from "./board-context";
import { useState, useReducer, useContext, useCallback } from "react";
import { TOOL_ITEMS } from "../constants";
import rough from "roughjs/bin/rough";
import createNewElement from "../utils/elements";
import toolboxContext from "./toolbox-context";
import { isPointNearElement } from "../utils/math";

const gen = rough.generator();

const boardReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_ACTIVE_ACTION": {
      return {
        ...state,
        activeAction: action.payload.action,
      };
    }
    case "CHANGE_TOOL": {
      return {
        ...state,
        activeToolItem: action.payload.tool,
      };
    }
    case "HANDLE_MOUSE_DOWN": {
      const { clientX, clientY, stroke, fill, size, toolType } = action.payload;
      console.log(state.elements);
      const newElement = createNewElement(
        state.elements.length,
        clientX,
        clientY,
        clientX,
        clientY,
        stroke,
        fill,
        size,
        toolType
      );
      const prevElements = state.elements;
      return {
        ...state,
        elements: [...prevElements, newElement],
      };
    }
    case "HANDLE_TEXT": {
      const { clientX, clientY, stroke, fill, size, toolType } = action.payload;
      const newElement = createNewElement(
        state.elements.length,
        clientX,
        clientY,
        clientX,
        clientY,
        stroke,
        fill,
        size,
        toolType
      );
      const prevElements = state.elements;
      return {
        ...state,
        activeAction: "WRITING",
        elements: [...prevElements, newElement],
      };
      // return { ...state };
    }
    case "HANDLE_SAVE_TEXT": {
      const { text } = action.payload;
      const prevElements = [...state.elements];
      const index = prevElements.length - 1;
      prevElements[index].text = text;
      const newHistory = state.history.slice(0, state.index + 1);
      // const
      return {
        ...state,
        activeAction: "NONE",
        index: state.index + 1,
        elements: [...prevElements],
        history: [...newHistory, prevElements],
      };
    }
    case "HANDLE_MOUSE_MOVE": {
      const { clientX, clientY, element_type } = action.payload;
      const newElements = [...state.elements];

      const index = newElements.length - 1;
      const { id, x1, y1, x2, y2, stroke, fill, size, toolType } =
        newElements[index];
      switch (toolType) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.ARROW:
        case TOOL_ITEMS.CIRCLE: {
          const newELement = createNewElement(
            id,
            x1,
            y1,
            clientX,
            clientY,
            stroke,
            fill,
            size,
            toolType
          );
          newElements[index] = newELement;
          break;
        }
        case TOOL_ITEMS.BRUSH: {
          let { path } = newElements[index];
          path = [...path, [clientX, clientY]];
          const newELement = {
            id,
            x1,
            y1,
            clientX,
            clientY,
            stroke,
            fill,
            size,
            toolType,
            path,
          };
          newElements[index] = newELement;
          break;
        }

        default:
          break;
      }
      return {
        ...state,
        elements: newElements,
      };
    }

    case "HANDLE_MOUSE_UP": {
      // console.log("from mouse_up", newHistory);

      const newHistory = state.history.slice(0, state.index + 1);

      // const
      return {
        ...state,
        index: state.index + 1,
        history: [...newHistory, state.elements],
      };
    }
    case "HANDLE_ERASE": {
      const { clientX, clientY } = action.payload;
      // const newHistory = state.history.slice(0, state.index + 1);
      let elements = state.elements;
      elements = elements.filter((element) => {
        return !isPointNearElement(element, clientX, clientY);
      });
      return {
        ...state,
        index: state.index + 1,
        history: [...state.history, elements],
        elements: elements,
      };
    }
    case "UNDO": {
      if (state.index <= 0) return state;
      return {
        ...state,
        elements: state.history[state.index - 1],
        index: state.index - 1,
      };
    }
    case "REDO": {
      if (state.index >= state.history.length - 1) return state;
      return {
        ...state,
        elements: state.history[state.index + 1],
        index: state.index + 1,
      };
    }
    default:
      return state;
  }
};

//
const initialBoardState = {
  activeToolItem: TOOL_ITEMS.BRUSH,
  elements: [],
  history: [[]],
  index: 0,
  activeAction: "NONE",
};

//BOARD PROVIDER

const BoardProvider = ({ children }) => {
  //   const [activeToolItem, setActiveToolItem] = useState(TOOL_ITEMS.LINE);
  const [elements, setElements] = useState([]);
  const [activeAction, setActiveAction] = useState("NONE");
  const [boardState, dispatchBoardAction] = useReducer(
    boardReducer,
    initialBoardState
  );
  const { toolboxState } = useContext(toolboxContext);

  const handleToolItemClick = (tool) => {
    // console.log(tool);
    dispatchBoardAction({ type: "CHANGE_TOOL", payload: { tool } });
  };

  const handleMouseDown = (event) => {
    if (boardState.activeAction === "WRITING") return;
    if (boardState.activeToolItem === TOOL_ITEMS.TEXT) {
      console.log("from handleMouseDown", activeAction);
      setActiveAction("WRITING");
      const { clientX, clientY } = event;
      const tool = boardState.activeToolItem;
      const { stroke, fill, size } = toolboxState[tool];
      dispatchBoardAction({
        type: "HANDLE_TEXT",
        payload: {
          clientX,
          clientY,
          stroke,
          fill,
          size,
          toolType: boardState.activeToolItem,
        },
      });
      return;
    }
    if (boardState.activeToolItem === TOOL_ITEMS.ERASER) {
      dispatchBoardAction({
        type: "CHANGE_ACTIVE_ACTION",
        payload: { activeAction: "ERASING" },
      });
      setActiveAction("ERASING");
      return;
    } else {
      dispatchBoardAction({
        type: "CHANGE_ACTIVE_ACTION",
        payload: { activeAction: "DRAWING" },
      });
      setActiveAction("DRAWING");
      const tool = boardState.activeToolItem;
      const { stroke, fill, size, text } = toolboxState[tool];
      const { clientX, clientY } = event;
      dispatchBoardAction({
        type: "HANDLE_MOUSE_DOWN",
        payload: {
          clientX,
          clientY,
          stroke,
          fill,
          size,
          toolType: boardState.activeToolItem,
        },
      });
    }
  };
  const handleMouseMove = (event) => {
    // console.log(activeAction);
    if (activeAction === "WRITING") return;
    const { clientX, clientY } = event;

    if (activeAction === "DRAWING") {
      dispatchBoardAction({
        type: "HANDLE_MOUSE_MOVE",
        payload: {
          clientX,
          clientY,
          toolType: boardState.activeToolItem,
        },
      });
    } else if (activeAction === "ERASING") {
      // console.log("erasing");
      const { clientX, clientY } = event;
      dispatchBoardAction({
        type: "HANDLE_ERASE",
        payload: {
          clientX,
          clientY,
        },
      });
    }
  };
  const handleMouseUp = (event) => {
    // console.log(activeAction);
    console.log("from mouseUp");
    console.log(activeAction);
    console.log(boardState.activeAction);
    if (activeAction === "WRITING") return;

    dispatchBoardAction({
      type: "CHANGE_ACTIVE_ACTION",
      payload: { activeAction: "NONE" },
    });
    if (boardState.activeToolItem === TOOL_ITEMS.ERASER) return;
    setActiveAction("NONE");
    if (activeAction === "DRAWING") {
      console.log("hello1");
      dispatchBoardAction({ type: "HANDLE_MOUSE_UP" });
    }
  };
  const handleBlur = (text) => {
    setActiveAction("NONE");
    dispatchBoardAction({ type: "HANDLE_SAVE_TEXT", payload: { text } });
    console.log("from handleBlur", text);
    // dispatchBoardAction({
    //   type: "CHANGE_ACTIVE_ACTION",
    //   payload: {
    //     activeAction: "NONE",
    //   },
    // });
    console.log(boardState.elements);
    return;
  };
  const undo = useCallback(() => {
    console.log("undo");
    dispatchBoardAction({ type: "UNDO" });
  }, []);
  const redo = useCallback(() => {
    console.log("redo");
    dispatchBoardAction({ type: "REDO" });
  }, []);
  const handleDownload = () => {
    const canvas = document.getElementById("myBoard");
    const img = canvas.toDataURL("image/jpeg");
    const anchor = document.createElement("a");
    anchor.href = img;
    anchor.download = "board.jpeg";
    anchor.click();
  };
  const boardContextValue = {
    elements: boardState.elements,
    history: boardState.history,
    index: boardState.index,
    activeToolItem: boardState.activeToolItem,
    // activeAction: "NONE",
    handleToolItemClick,
    handleMouseDown,
    handleMouseMove,
    handleDownload,
    handleMouseUp,
    activeAction,
    handleBlur,
    undo,
    redo,
  };

  return (
    <boardContext.Provider value={boardContextValue}>
      {children}
    </boardContext.Provider>
  );
};
export default BoardProvider;
