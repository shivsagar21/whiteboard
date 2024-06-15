import { TOOL_ITEMS } from "../constants";
import rough from "roughjs/bin/rough";
import { getArrowHeadsCoordinates } from "./math.js";

const gen = rough.generator();

const createNewElement = (id, x1, y1, x2, y2, stroke, fill, size, toolType) => {
  const newElement = {
    id,
    x1,
    x2,
    y1,
    y2,
    stroke,
    fill,
    size,
    toolType,
  };
  // console.log(toolType);
  // let roughEle = null;
  let options = {
    seed: id + 1, //seed cannot be zero
  };
  if (stroke) {
    options.stroke = stroke;
  }
  if (fill) {
    options.fill = fill;
  }
  if (size) {
    options.strokeWidth = size;
  }
  switch (toolType) {
    case TOOL_ITEMS.LINE: {
      newElement.roughEle = gen.line(x1, y1, x2, y2, options);
      break;
    }
    case TOOL_ITEMS.RECTANGLE: {
      newElement.roughEle = gen.rectangle(x1, y1, x2 - x1, y2 - y1, options);
      break;
    }
    case TOOL_ITEMS.CIRCLE: {
      const cx = (x1 + x2) / 2,
        cy = (y1 + y2) / 2;
      const width = x2 - x1,
        height = y2 - y1;
      newElement.roughEle = gen.ellipse(cx, cy, width, height, options);
      break;
    }
    case TOOL_ITEMS.ARROW: {
      const arrowLength = 20;
      const { x3, y3, x4, y4 } = getArrowHeadsCoordinates(
        x1,
        y1,
        x2,
        y2,
        arrowLength
      );

      const points = [
        [x1, y1],
        [x2, y2],
        [x3, y3],
        [x2, y2],
        [x4, y4],
      ];
      newElement.roughEle = gen.linearPath(points, options);
      break;
    }
    case TOOL_ITEMS.BRUSH: {
      const points = [[x1, y1]];
      newElement.path = points;
      break;
    }
    case TOOL_ITEMS.TEXT: {
      newElement.text = "";
      break;
    }
    default:
      throw new Error("Tool Item not recognized");
      break;
  }

  return newElement;
};
export default createNewElement;

export const getSvgPathFromStroke = (stroke) => {
  if (!stroke.length) return "";

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ["M", ...stroke[0], "Q"]
  );

  d.push("Z");
  return d.join(" ");
};
