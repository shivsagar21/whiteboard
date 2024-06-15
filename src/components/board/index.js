import {
  useEffect,
  useRef,
  useContext,
  useState,
  useLayoutEffect,
} from "react";
import rough from "roughjs";
import boardContext from "../../store/board-context";
import { TOOL_ITEMS } from "../../constants";
import getStroke from "perfect-freehand";
import { getSvgPathFromStroke } from "../../utils/elements";
import classes from "./index.module.css";

const Board = () => {
  const {
    activeToolItem,
    activeAction,
    elements,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleBlur,
    undo,
    redo,
  } = useContext(boardContext);

  // console.log(activeToolItem);
  const [val, setVal] = useState("NONE");
  const board = useRef(null);
  const textArea = useRef();
  const [text, setText] = useState("");
  useEffect(() => {
    const canvas = board.current;
    // console.log(canvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // rc.rectangle(200, 100, 400, 200, { stroke: "blue", strokeWidth: 3 });
  }, []);
  useLayoutEffect(() => {
    const canvas = board.current;
    const rc = rough.canvas(canvas);
    const context = canvas.getContext("2d");
    context.save();
    // console.log(elements);
    elements.forEach((element) => {
      const { toolType } = element;
      // console.log("hello");
      // console.log(toolType);
      switch (toolType) {
        case TOOL_ITEMS.BRUSH: {
          // console.log(element);
          const { path } = element;
          const outlinePoints = getStroke(path);
          const pathData = new Path2D(getSvgPathFromStroke(outlinePoints));
          context.fillStyle = element.stroke;
          context.fill(pathData);
          context.restore();

          break;
        }
        case TOOL_ITEMS.LINE: {
          const { roughEle } = element;
          rc.draw(roughEle);
          break;
        }
        case TOOL_ITEMS.RECTANGLE: {
          const { roughEle } = element;
          rc.draw(roughEle);
          break;
        }
        case TOOL_ITEMS.CIRCLE: {
          const { roughEle } = element;
          rc.draw(roughEle);
          break;
        }
        case TOOL_ITEMS.ARROW: {
          const { roughEle } = element;
          rc.draw(roughEle);
          break;
        }
        case TOOL_ITEMS.TEXT: {
          const { x1, y1, text, stroke, size } = element;
          context.font = `${size}px Caveat`;
          context.fillStyle = stroke;
          context.fillText(text, x1, y1);
          break;
        }
        default: {
          throw new Error("Tool Type note recognized");
          break;
        }
      }
    });
    // console.log(elem/ents);
    return () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [elements]);

  useEffect(() => {
    const handleKeyDownEvent = (event) => {
      if (event.ctrlKey && event.key === "z") {
        undo();
      } else if (event.ctrlKey && event.key === "y") {
        redo();
      }
    };
    document.addEventListener("keydown", handleKeyDownEvent);
    return () => {
      document.removeEventListener("keydown", handleKeyDownEvent);
    };
  }, [undo, redo]);
  useEffect(() => {
    const textarea = textArea.current;
    if (activeAction === "WRITING") {
      setTimeout(() => {
        textarea.focus();
      }, 0);
    }
  }, [activeAction]);

  const lastElement = elements[elements.length - 1];
  // console.log(lastElement.x1, lastElement.y1);
  return (
    <>
      {activeAction === "WRITING" && (
        <textarea
          ref={textArea}
          style={{
            position: "absolute",
            top: elements[elements.length - 1].y1,
            left: elements[elements.length - 1].x1,
            fontSize: `${elements[elements.length - 1].size}px`,
            color: elements[elements.length - 1].stroke,
          }}
          className={classes.textElementBox}
          // value={text}
          // onChange={(event) => setText(event.target.value)}
          onBlur={(event) => {
            // console.log(elements);
            // console.log("hello from handleBlurEvent");
            handleBlur(event.target.value);
            // console.log(event.target.value);
            // console.log("hello from handleBlurEvent");
          }}
        ></textarea>
      )}
      <canvas
        ref={board}
        id="myBoard"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </>
  );
};
export default Board;
