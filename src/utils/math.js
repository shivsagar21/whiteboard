import getStroke from "perfect-freehand";
import { ELEMENT_ERASE_THRESHOLD } from "../constants";
import { TOOL_ITEMS } from "../constants";
import { getSvgPathFromStroke } from "./elements";

export const isPointCloseToLine = (x1, y1, x2, y2, pointX, pointY) => {
  const distToStart = distanceBetweenPoints(x1, y1, pointX, pointY);
  const distToEnd = distanceBetweenPoints(x2, y2, pointX, pointY);
  const distLine = distanceBetweenPoints(x1, y1, x2, y2);
  return Math.abs(distToStart + distToEnd - distLine) < ELEMENT_ERASE_THRESHOLD;
};

export const isNearPoint = (x, y, x1, y1) => {
  return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5;
};

export const getArrowHeadsCoordinates = (x1, y1, x2, y2, arrowLength) => {
  const angle = Math.atan2(y2 - y1, x2 - x1);

  const x3 = x2 - arrowLength * Math.cos(angle - Math.PI / 6);
  const y3 = y2 - arrowLength * Math.sin(angle - Math.PI / 6);

  const x4 = x2 - arrowLength * Math.cos(angle + Math.PI / 6);
  const y4 = y2 - arrowLength * Math.sin(angle + Math.PI / 6);

  return {
    x3,
    y3,
    x4,
    y4,
  };
};

export const midPointBtw = (p1, p2) => {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2,
  };
};

const distanceBetweenPoints = (x1, y1, x2, y2) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
};

////////////////////////////////////////////////////////////////////////////////////////////////

export const isPointNearElement = (element, clientX, clientY) => {
  // console.log(element,clientX,clientY);
  // return false;
  switch (element.toolType) {
    case TOOL_ITEMS.LINE: {
      const { x1, y1, x2, y2 } = element;
      const dis = Math.pow(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2), 0.5);
      const dis1 = Math.pow(
        Math.pow(x1 - clientX, 2) + Math.pow(y1 - clientY, 2),
        0.5
      );
      const dis2 = Math.pow(
        Math.pow(x2 - clientX, 2) + Math.pow(y2 - clientY, 2),
        0.5
      );
      const delta = Math.abs(dis1 + dis2 - dis);
      // const m = (y2 - y1) / (x2 - x1);
      // const c = y1 - m * x1;

      // const numerator = Math.abs(m * clientX - clientY + c);
      // const denominator = Math.sqrt(m * m + 1);
      // // const dis = numerator / denominator;
      console.log(dis);
      if (delta < 1) return true;
      return false;
      break;
    }
    case TOOL_ITEMS.BRUSH: {
      //   console.log("start");
      //   console.log("x", clientX, "y", clientY);
      //   const path = element.path;
      //   // console.log(path);
      //   for (let point in path) {
      //     // console.log(path[point][0], path[point][1]);
      //     const x = path[point][0],
      //       y = path[point][1];
      //     const dis = Math.pow(
      //       Math.pow(x - clientX, 2) + Math.pow(y - clientY, 2),
      //       0.5
      //     );
      //     console.log("dis", dis);
      //     console.log("x", x, "y", y);
      //     if (dis <= 15) return true;
      //   }
      //   console.log("end");
      //   return false;
      const { path } = element;
      const context = document.getElementById("myBoard").getContext("2d");
      const outlinePoints = getStroke(path);
      const svgPath = new Path2D(getSvgPathFromStroke(outlinePoints));
      return context.isPointInPath(svgPath, clientX, clientY);
    }
    case TOOL_ITEMS.RECTANGLE: {
      const { x1, y1, x2, y2 } = element;
      const val1 =
        clientX <= x2 && clientX >= x1 && clientY >= y1 && clientY <= y2;
      const val2 =
        clientX >= x2 && clientX <= x1 && clientY <= y1 && clientY >= y2;
      if (val1 || val2) return true;
      return false;
    }
    case TOOL_ITEMS.CIRCLE: {
      const { x1, y1, x2, y2 } = element;
      const cx = (x1 + x2) / 2,
        cy = (y1 + y2) / 2;
      const a = Math.abs((x2 - x1) / 2);
      const b = Math.abs((y2 - y1) / 2);
      const dis =
        Math.pow(clientX - cx, 2) / (a * a) +
        Math.pow(clientY - cy, 2) / (b * b);
      if (dis <= 1) return true;
      return false;
    }
    case TOOL_ITEMS.ARROW: {
      const { x1, y1, x2, y2 } = element;
      const dis = Math.pow(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2), 0.5);
      const dis1 = Math.pow(
        Math.pow(x1 - clientX, 2) + Math.pow(y1 - clientY, 2),
        0.5
      );
      const dis2 = Math.pow(
        Math.pow(x2 - clientX, 2) + Math.pow(y2 - clientY, 2),
        0.5
      );
      const delta = Math.abs(dis1 + dis2 - dis);
      // const m = (y2 - y1) / (x2 - x1);
      // const c = y1 - m * x1;

      // const numerator = Math.abs(m * clientX - clientY + c);
      // const denominator = Math.sqrt(m * m + 1);
      // // const dis = numerator / denominator;
      console.log(dis);
      if (delta < 1) return true;
      return false;
      break;
    }
    case TOOL_ITEMS.TEXT: {
      const context = document.getElementById("myBoard").getContext("2d");
      // console.log("hello");
      context.font = `${element.size}px Caveat`;
      context.fillStyle = element.stroke;
      const textWidth = context.measureText(element.text).width;
      const textHeight = parseInt(element.size);
      context.restore();
      const { x1, y1 } = element;
      const x2 = x1 + textWidth;
      const y2 = y1 + textHeight;
      const val1 =
        clientX <= x2 && clientX >= x1 && clientY >= y1 && clientY <= y2;
      const val2 =
        clientX >= x2 && clientX <= x1 && clientY <= y1 && clientY >= y2;
      if (val1 || val2) return true;
      return false;
    }
    default:
      return false;
      break;
  }
};
