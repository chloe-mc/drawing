import { Interaction, LineStyle, Point } from '../types';
import { MouseEvent } from 'react';
import { ShapeProps } from '../types';

type Options = {
  lineOnly?: boolean;
};

class DrawLineInteraction implements Interaction {
  private mouseDownPoints: Point[] = [];

  private lineOnly?: boolean;

  constructor(options?: Options) {
    this.lineOnly = Boolean(options?.lineOnly);
  }

  private isNear = (pointA: Point, pointB: Point) => {
    const distance = Math.sqrt(
      (pointA.x - pointB.x) ** 2 + (pointA.y - pointB.y) ** 2
    );
    return Math.abs(distance) < 10;
  };

  private isDragging = (mouseUpPoint: Point) => {
    return (
      this.mouseDownPoints.length === 1 &&
      !this.isNear(mouseUpPoint, this.mouseDownPoints[0])
    );
  };

  private hasMoved = (): boolean => {
    if (this.mouseDownPoints.length < 2) return false;
    const pointCount = this.mouseDownPoints.length;
    return !this.isNear(
      this.mouseDownPoints[pointCount - 1],
      this.mouseDownPoints[pointCount - 2]
    );
  };

  handleMouseDown = (
    e: MouseEvent<HTMLCanvasElement>,
    onComplete: (shapeProps: Partial<ShapeProps>) => void
  ) => {
    this.mouseDownPoints.push({ x: e.clientX, y: e.clientY });
    if (this.mouseDownPoints.length === 1) {
      onComplete({
        vertices: [this.mouseDownPoints[0]],
      });
    }
  };

  handleMouseMove = (
    e: MouseEvent<HTMLCanvasElement>,
    onComplete: (shapeProps: Partial<ShapeProps>) => void
  ) => {
    if (this.mouseDownPoints.length > 0) {
      onComplete({
        cursorPosition: { x: e.clientX, y: e.clientY },
      });
    }
  };

  handleMouseUp = (
    e: MouseEvent<HTMLCanvasElement>,
    onComplete: (shapeProps: Partial<ShapeProps>) => void
  ) => {
    if (this.mouseDownPoints.length > 0) {
      const mouseUpPoint = { x: e.clientX, y: e.clientY };
      if (this.isDragging(mouseUpPoint)) {
        onComplete({
          vertices: [mouseUpPoint],
          stroke: LineStyle.solid,
          temp: false,
          cursorPosition: undefined,
        });
      } else if (this.hasMoved()) {
        if (
          !this.lineOnly &&
          this.isNear(this.mouseDownPoints[0], mouseUpPoint)
        ) {
          onComplete({
            stroke: LineStyle.solid,
            vertices: [this.mouseDownPoints[0]],
            temp: false,
            cursorPosition: undefined,
          });
        } else {
          onComplete({
            vertices: [mouseUpPoint],
            temp: true,
            cursorPosition: undefined,
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
      stroke: LineStyle.solid,
      cursorPosition: undefined,
    });
  };
}

export { DrawLineInteraction };
