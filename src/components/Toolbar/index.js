import { useState, useContext } from "react";
import boardContext from "../../store/board-context";
import classes from "./index.module.css";
import cx from "classnames";
import { TOOL_ITEMS } from "../../constants";

import { LuRectangleHorizontal } from "react-icons/lu";
import { FaSlash } from "react-icons/fa";
import { FaRegCircle, FaUndo, FaRedo, FaDownload } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";
import { FaPaintBrush } from "react-icons/fa";
import { BsEraser } from "react-icons/bs";
import { FaEraser } from "react-icons/fa";
import { BsChatLeftTextFill } from "react-icons/bs";

const Toolbar = () => {
  // const [activeToolItem, setActiveToolItem] = useState("Line");
  const { activeToolItem, handleToolItemClick, undo, redo,handleDownload } =
    useContext(boardContext);
  return (
    <>
      <div className={classes.container}>
        <div
          className={cx(classes.toolItem, {
            [classes.active]: activeToolItem == TOOL_ITEMS.BRUSH,
          })}
          onClick={() => handleToolItemClick(TOOL_ITEMS.BRUSH)}
        >
          <FaPaintBrush />
        </div>
        <div
          className={cx(classes.toolItem, {
            [classes.active]: activeToolItem == TOOL_ITEMS.RECTANGLE,
          })}
          onClick={() => handleToolItemClick(TOOL_ITEMS.RECTANGLE)}
        >
          <LuRectangleHorizontal />
        </div>
        <div
          className={cx(classes.toolItem, {
            [classes.active]: activeToolItem == TOOL_ITEMS.LINE,
          })}
          onClick={() => handleToolItemClick(TOOL_ITEMS.LINE)}
        >
          <FaSlash />
        </div>
        <div
          className={cx(classes.toolItem, {
            [classes.active]: activeToolItem == TOOL_ITEMS.CIRCLE,
          })}
          onClick={() => handleToolItemClick(TOOL_ITEMS.CIRCLE)}
        >
          <FaRegCircle />
        </div>
        <div
          className={cx(classes.toolItem, {
            [classes.active]: activeToolItem == TOOL_ITEMS.ARROW,
          })}
          onClick={() => handleToolItemClick(TOOL_ITEMS.ARROW)}
        >
          <FaArrowRight />
        </div>
        <div
          className={cx(classes.toolItem, {
            [classes.active]: activeToolItem == TOOL_ITEMS.TEXT,
          })}
          onClick={() => handleToolItemClick(TOOL_ITEMS.TEXT)}
        >
          <BsChatLeftTextFill />
        </div>
        <div
          className={cx(classes.toolItem, {
            [classes.active]: activeToolItem == TOOL_ITEMS.ERASER,
          })}
          onClick={() => handleToolItemClick(TOOL_ITEMS.ERASER)}
        >
          <FaEraser />
        </div>
        <div className={classes.toolItem} onClick={undo}>
          <FaUndo />
        </div>
        <div onClick={redo} className={classes.toolItem}>
          <FaRedo />
        </div>
        <div className={classes.toolItem}
        onClick={handleDownload}>
          <FaDownload />
        </div>
      </div>
    </>
  );
};
export default Toolbar;
