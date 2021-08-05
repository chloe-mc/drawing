import { Point } from './types';

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
