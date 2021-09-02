import { BoundingBox, Point, selectionBoxColor } from './types';

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

type RenderSelectionBoxParams = {
  origin: Point;
  width: number;
  height: number;
};

export const renderRectangleSelectionBox = (
  ctx: CanvasRenderingContext2D,
  params: RenderSelectionBoxParams
) => {
  const padding = 10;
  const { origin, width, height } = params;
  const selectionBoxOrigin = {
    x: origin.x - padding,
    y: origin.y - padding,
  };
  const selectionBoxWidth = width + padding * 2;
  const selectionBoxHeight = height + padding * 2;

  renderSelectionBox(ctx, {
    origin: selectionBoxOrigin,
    height: selectionBoxHeight,
    width: selectionBoxWidth,
  });
};

export const renderSelectionBox = (
  ctx: CanvasRenderingContext2D,
  params: RenderSelectionBoxParams
) => {
  const { origin, width, height } = params;
  ctx.save();
  ctx.strokeStyle = selectionBoxColor;
  ctx.setLineDash([3, 3]);
  ctx.strokeRect(origin.x, origin.y, width, height);
  ctx.restore();
};

export const getBoundingBoxFromVertices = (vertices: Point[]): BoundingBox => {
  let minX = vertices[0].x,
    minY = vertices[0].y,
    maxX = 0,
    maxY = 0;

  vertices.forEach((vertex) => {
    minX = Math.min(vertex.x, minX);
    minY = Math.min(vertex.y, minY);
    maxX = Math.max(vertex.x, maxX);
    maxY = Math.max(vertex.y, maxY);
  });

  return {
    origin: { x: minX, y: minY },
    width: maxX - minX,
    height: maxY - minY,
  };
};
