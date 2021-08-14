import { Point } from './types';

type ArrowPoints = {
  leftBarb: Point;
  rightBarb: Point;
};

export const getCanvasPoint = (
  clientPoint: Point,
  canvasRect: DOMRect
): Point => {
  return {
    x: clientPoint.x - canvasRect.left,
    y: clientPoint.y - canvasRect.top,
  };
};

export const getTopLeftAndBottomRight = (
  mouseDownPoint: Point,
  mouseUpPoint: Point
): Point[] => {
  return [
    {
      x: Math.min(mouseDownPoint.x, mouseUpPoint.x),
      y: Math.min(mouseDownPoint.y, mouseUpPoint.y),
    },
    {
      x: Math.max(mouseDownPoint.x, mouseUpPoint.x),
      y: Math.max(mouseDownPoint.y, mouseUpPoint.y),
    },
  ];
};

export const getEndArrowPoints = (
  beginPoint: Point,
  endPoint: Point
): ArrowPoints => {
  /* Based on this excellent tutorial: http://dbp-consulting.com/tutorials/canvas/CanvasArrow.html */
  const arrowHeadLength = 20;
  const barbAngle = Math.PI / 8;
  const lineAngle = Math.atan2(
    endPoint.y - beginPoint.y,
    endPoint.x - beginPoint.x
  );
  const barbLength = Math.abs(arrowHeadLength / Math.cos(barbAngle));

  var leftAngle = lineAngle + Math.PI + barbAngle;
  const leftBarb = {
    x: endPoint.x + Math.cos(leftAngle) * barbLength,
    y: endPoint.y + Math.sin(leftAngle) * barbLength,
  };

  var rightAngle = lineAngle + Math.PI - barbAngle;
  const rightBarb = {
    x: endPoint.x + Math.cos(rightAngle) * barbLength,
    y: endPoint.y + Math.sin(rightAngle) * barbLength,
  };

  return { leftBarb, rightBarb };
};
