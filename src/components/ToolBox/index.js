import classes from "./index.module.css";
import cx from "classnames";
import {
  COLORS,
  TOOL_ITEMS,
  FILL_TOOL_TYPES,
  STROKE_TOOL_TYPES,
  SIZE_TOOL_TYPES,
} from "../../constants";
import { useContext } from "react";
import toolboxContext from "../../store/toolbox-context";
import boardContext from "../../store/board-context";

const ToolBox = () => {
  const { activeToolItem } = useContext(boardContext);

  const {
    toolboxState,
    handleStrokeChange,
    handleFillChange,
    handleChangeSize,
  } = useContext(toolboxContext);
  const strokeColor = toolboxState[activeToolItem]?.stroke;
  const fillColor = toolboxState[activeToolItem]?.fill;
  const size = toolboxState[activeToolItem].size;
  return (activeToolItem!=TOOL_ITEMS.ERASER &&
    <div className={classes.container}>
      <div className={classes.selectOptionContainer}>
        {STROKE_TOOL_TYPES.includes(activeToolItem) && (
          <>
            <div className={classes.toolBoxLabel}>Stroke Color</div>
            <div className={classes.colorsContainer}>
            <div>
              <input
                className={classes.colorPicker}
                type="color"
                value={strokeColor}
                onChange={(e) => handleStrokeChange(activeToolItem, e.target.value)}
              ></input>
            </div>
              {Object.keys(COLORS).map((key) => {
                return (
                  <div
                    key={key}
                    className={cx(classes.colorBox, {
                      [classes.activeColorBox]:
                        COLORS[key] === toolboxState[activeToolItem].stroke,
                    })}
                    style={{ backgroundColor: COLORS[key] }}
                    onClick={() =>
                      handleStrokeChange(activeToolItem, COLORS[key])
                    }
                  ></div>
                );
              })}
            </div>
          </>
        )}
        
        {FILL_TOOL_TYPES.includes(activeToolItem) && (
          <>
            <br />
            <div className={classes.toolBoxLabel}>Fill Color</div>
            <div className={classes.colorsContainer}>
            {fillColor === null ? (
              <div
                className={cx(classes.colorPicker, classes.noFillColorBox)}
                onClick={() => handleFillChange(activeToolItem, COLORS.BLACK)}
              ></div>
            ) : (
              <div>
                <input
                  className={classes.colorPicker}
                  type="color"
                  value={strokeColor}
                  onChange={(e) => handleFillChange(activeToolItem, e.target.value)}
                ></input>
              </div>
            )}
            <div
              className={cx(classes.colorBox, classes.noFillColorBox, {
                [classes.activeColorBox]: fillColor === null,
              })}
              onClick={() => handleFillChange(activeToolItem, null)}
            ></div>
              {Object.keys(COLORS).map((key) => {
                return (
                  <div
                    key={key}
                    className={cx(classes.colorBox, {
                      [classes.activeColorBox]:
                        COLORS[key] === toolboxState[activeToolItem].fill,
                    })}
                    style={{ backgroundColor: COLORS[key] }}
                    onClick={() =>
                      handleFillChange(activeToolItem, COLORS[key])
                    }
                  ></div>
                );
              })}
            </div>
          </>
        )}
        <br />
        {SIZE_TOOL_TYPES.includes(activeToolItem) && (
          <>
            <div className={classes.toolBoxLabel}>Size </div>
            <div className={classes.colorsContainer}>
              <input
                type="range"
                // min={activeToolItem === TOOL_ITEMS.TEXT ? 12 : 1}
                // max={activeToolItem === TOOL_ITEMS.TEXT ? 64 : 10}
                min={activeToolItem === TOOL_ITEMS.TEXT ? 12 : 1}
                max={activeToolItem === TOOL_ITEMS.TEXT ? 64 : 10}
                step={1}
                value={size}
                onChange={(event) =>
                  handleChangeSize(activeToolItem, event.target.value)
                }
              ></input>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default ToolBox;
