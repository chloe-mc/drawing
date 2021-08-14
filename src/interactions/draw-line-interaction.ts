import { Interaction, LineStyle, Point } from '../types';
import { MouseEvent } from 'react';
import { ShapeProps } from '../types';

class DrawLineInteraction implements Interaction {
  private firstDownPoint?: Point;

  private lastDownPoint?: Point;

  private pointsAreEqual = (pointA: Point, pointB: Point): boolean => {
    return pointA.x === pointB.x && pointA.y === pointB.y;
  };

  private isNear = (pointA: Point, pointB: Point) => {
    const distance = Math.sqrt(
      (pointA.x - pointB.x) ** 2 + (pointA.y - pointB.y) ** 2
    );
    return Math.abs(distance) < 10;
  };

  private isDragging = (mouseUpPoint: Point) => {
    if (this.lastDownPoint && this.firstDownPoint) {
      return (
        this.pointsAreEqual(this.lastDownPoint, this.firstDownPoint) &&
        !this.isNear(mouseUpPoint, this.lastDownPoint)
      );
    }
  };

  private hasMoved = (): boolean => {
    if (!this.firstDownPoint || !this.lastDownPoint) return false;
    return !this.pointsAreEqual(this.firstDownPoint, this.lastDownPoint);
  };

  handleMouseDown = (
    e: MouseEvent<HTMLCanvasElement>,
    onComplete: (shapeProps: Partial<ShapeProps>) => void
  ) => {
    this.lastDownPoint = { x: e.clientX, y: e.clientY };
    if (!this.firstDownPoint) {
      this.firstDownPoint = this.lastDownPoint;
      onComplete({
        vertices: [this.firstDownPoint],
      });
    }
  };

  handleMouseMove = (
    e: MouseEvent<HTMLCanvasElement>,
    onComplete: (shapeProps: Partial<ShapeProps>) => void
  ) => {
    if (this.firstDownPoint) {
      onComplete({
        cursorPosition: { x: e.clientX, y: e.clientY },
      });
    }
  };

  handleMouseUp = (
    e: MouseEvent<HTMLCanvasElement>,
    onComplete: (shapeProps: Partial<ShapeProps>) => void
  ) => {
    if (this.firstDownPoint) {
      const mouseUpPoint = { x: e.clientX, y: e.clientY };
      if (this.isDragging(mouseUpPoint)) {
        onComplete({
          vertices: [mouseUpPoint],
          stroke: LineStyle.solid,
          temp: false,
        });
      } else if (this.hasMoved()) {
        if (this.isNear(this.firstDownPoint, mouseUpPoint)) {
          onComplete({
            stroke: LineStyle.solid,
            vertices: [this.firstDownPoint],
            temp: false,
            cursorPosition: undefined,
          });
        } else {
          onComplete({
            vertices: [mouseUpPoint],
            temp: true,
          });
        }
      }
    }
  };

  handleDoubleClick = (
    e: MouseEvent<HTMLCanvasElement>,
    onComplete: (shapeProps: Partial<ShapeProps>) => void
  ) => {
    onComplete({
      vertices: [{ x: e.clientX, y: e.clientY }],
      stroke: LineStyle.solid,
    });
  };
}

export { DrawLineInteraction };
