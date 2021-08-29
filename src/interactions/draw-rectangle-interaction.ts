import { Interaction, LineStyle, Point, ShapeProps } from '../types';
import { MouseEvent } from 'react';
import { getCanvasPoint, getTopLeftAndBottomRight } from '../utils';

class DrawRectangleInteraction implements Interaction {
  mouseDownPoint?: Point;

  constructor(private canvas: HTMLCanvasElement) {}

  handleMouseMove = (
    e: MouseEvent<HTMLCanvasElement>,
    onComplete: (shapeProps: Partial<ShapeProps>) => void
  ) => {
    if (this.mouseDownPoint) {
      const canvasRect = this.canvas.getBoundingClientRect();
      const currentMousePoint = { x: e.clientX, y: e.clientY };
      const [topLeft, bottomRight] = getTopLeftAndBottomRight(
        this.mouseDownPoint,
        currentMousePoint
      );
      const beginRectPoint = getCanvasPoint(topLeft, canvasRect);
      const endRectPoint = getCanvasPoint(bottomRight, canvasRect);

      onComplete({
        color: 'green',
        originPoint: beginRectPoint,
        width: Math.abs(beginRectPoint.x - endRectPoint.x),
        height: Math.abs(beginRectPoint.y - endRectPoint.y),
        stroke: LineStyle.dashed,
      });
    }
  };

  handleMouseUp = (
    e: MouseEvent<HTMLCanvasElement>,
    onComplete: (shapeProps: Partial<ShapeProps>) => void
  ) => {
    const mouseUpPoint = { x: e.clientX, y: e.clientY };
    const mouseUpEqualsMouseDown =
      mouseUpPoint.x === this.mouseDownPoint?.x &&
      mouseUpPoint.y === this.mouseDownPoint?.y;

    if (this.mouseDownPoint && !mouseUpEqualsMouseDown) {
      const canvasRect = this.canvas.getBoundingClientRect();
      const [topLeft, bottomRight] = getTopLeftAndBottomRight(
        this.mouseDownPoint,
        mouseUpPoint
      );
      const beginRectPoint = getCanvasPoint(topLeft, canvasRect);
      const endRectPoint = getCanvasPoint(bottomRight, canvasRect);
      const width = Math.abs(beginRectPoint.x - endRectPoint.x);
      const height = Math.abs(beginRectPoint.y - endRectPoint.y);

      onComplete({
        color: 'green',
        originPoint: beginRectPoint,
        width,
        height,
        stroke: LineStyle.solid,
      });
    }
  };

  handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!this.mouseDownPoint) {
      this.mouseDownPoint = { x: e.clientX, y: e.clientY };
    }
  };

  handleDoubleClick = (
    e: MouseEvent<HTMLCanvasElement>,
    onComplete: (shapeProps: Partial<ShapeProps>) => void
  ) => {
    const canvasRect = this.canvas.getBoundingClientRect();
    const beginRectPoint = getCanvasPoint(
      { x: e.clientX, y: e.clientY },
      canvasRect
    );
    onComplete({
      color: 'purple',
      originPoint: beginRectPoint,
      width: 100,
      height: 100,
      stroke: LineStyle.solid,
    });
  };
}

export { DrawRectangleInteraction };
