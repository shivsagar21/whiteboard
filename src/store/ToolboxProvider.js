import toolboxContext from "./toolbox-context";
import { TOOL_ITEMS, COLORS } from "../constants";
import { useReducer } from "react";

const toolboxReducer = (state, action) => {
  //FUNCTIONS TO CHANGE STATE
  switch (action.type) {
    case "STROKE_CHANGE": {
      //   console.log("hello");
      const prevState = { ...state };
      prevState[action.payload.tool].stroke = action.payload.color;
      //   console.log(prevState);
      return { ...prevState };
    }
    case "FILL_CHANGE": {
      const prevState = { ...state };
      prevState[action.payload.tool].fill = action.payload.color;
      return { ...prevState };
    }
    case "CHANGE_SIZE": {
      const prevState = { ...state };
      const { tool, value } = action.payload;
      prevState[tool].size = value;
      return { ...prevState };
    }
    default:
      break;
  }
};

const initialToolboxState = {
  [TOOL_ITEMS.BRUSH]: {
    stroke: COLORS.BLACK,
    fill: null,
    size: null,
  },
  [TOOL_ITEMS.LINE]: {
    stroke: COLORS.BLACK,
    fill: null,
    size: 1,
  },
  [TOOL_ITEMS.RECTANGLE]: {
    stroke: COLORS.BLACK,
    fill: COLORS.WHITE,
    size: 1,
  },
  [TOOL_ITEMS.ARROW]: {
    stroke: COLORS.BLACK,
    fill: null,
    size: 1,
  },
  [TOOL_ITEMS.CIRCLE]: {
    stroke: COLORS.BLACK,
    fill: COLORS.WHITE,
    size: 1,
  },
  [TOOL_ITEMS.ERASER]: {
    stroke: null,
    fill: null,
    size: null,
  },
  [TOOL_ITEMS.TEXT]: {
    stroke: COLORS.BLACK,
    fill: null,
    size: 32,
    text: "",
  },
};

const ToolboxProvider = ({ children }) => {
  const [toolboxState, dispatchToolboxAction] = useReducer(
    toolboxReducer,
    initialToolboxState
  );

  const handleStrokeChange = (tool, color) => {
    dispatchToolboxAction({ type: "STROKE_CHANGE", payload: { tool, color } });
  };
  const handleFillChange = (tool, color) => {
    dispatchToolboxAction({ type: "FILL_CHANGE", payload: { tool, color } });
  };
  const handleChangeSize = (tool, value) => {
    // console.log("hello from handleChangeSize");
    dispatchToolboxAction({
      type: "CHANGE_SIZE",
      payload: {
        tool,
        value,
      },
    });
  };
  const toolboxContextValue = {
    toolboxState,
    handleStrokeChange,
    handleFillChange,
    handleChangeSize,
  };

  return (
    <toolboxContext.Provider value={toolboxContextValue}>
      {children}
    </toolboxContext.Provider>
  );
};
export default ToolboxProvider;
