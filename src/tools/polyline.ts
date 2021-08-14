import { ToolEvents, Shape, Point, LineStyle } from '../types';
import { MouseEvent } from 'react';

type PolyLineProps = {
  vertices: Point[];
  color: string;
  stroke: LineStyle;
};

const defaultPolyLineProps = {
  color: 'coral',
  stroke: LineStyle.dashed,
  vertices: [],
};

class PolyLine implements ToolEvents {
  props: PolyLineProps = defaultPolyLineProps;

  firstDownPoint?: Point;

  lastDownPoint?: Point;

  cursorPoint?: Point;

  constructor(
    private canvas: HTMLCanvasElement,
    private saveShape: (shape: Shape) => void,
    private saveTempShape: (shape: Shape) => void,
    private resetTool: (tool: PolyLine) => void
  ) {}

  private setProps = (props: Partial<PolyLineProps>) => {
    if (props.vertices) {
      props.vertices = [...this.props.vertices, ...props.vertices];
    }
    this.props = { ...this.props, ...props };
  };

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
    if (this.lastDownPoint) {
      return (
        this.props.vertices.length === 0 &&
        !this.isNear(mouseUpPoint, this.lastDownPoint)
      );
    }
  };

  private hasMoved = (): boolean => {
    if (!this.firstDownPoint || !this.lastDownPoint) return false;
    return !this.pointsAreEqual(this.firstDownPoint, this.lastDownPoint);
  };

  private save = (newProps?: Partial<PolyLineProps>): void => {
    newProps && this.setProps(newProps);
    this.saveShape(this);
    this.reset();
  };

  reset = () => {
    this.resetTool(
      new PolyLine(
        this.canvas,
        this.saveShape,
        this.saveTempShape,
        this.resetTool
      )
    );
  };

  handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (this.firstDownPoint) {
      this.cursorPoint = { x: e.clientX, y: e.clientY };
      this.saveTempShape(this);
    }
  };

  handleMouseUp = (e: MouseEvent<HTMLCanvasElement>) => {
    if (this.firstDownPoint) {
      const mouseUpPoint = { x: e.clientX, y: e.clientY };
      if (this.isDragging(mouseUpPoint)) {
        this.save({
          vertices: [mouseUpPoint],
          stroke: LineStyle.solid,
        });
      } else if (this.hasMoved()) {
        if (this.isNear(this.firstDownPoint, mouseUpPoint)) {
          this.cursorPoint = undefined;
          this.save({
            stroke: LineStyle.solid,
            vertices: [this.firstDownPoint],
          });
        } else {
          this.setProps({
            vertices: [mouseUpPoint],
          });
          this.saveTempShape(this);
        }
      }
    }
  };

  handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    this.lastDownPoint = { x: e.clientX, y: e.clientY };
    if (!this.firstDownPoint) {
      this.firstDownPoint = this.lastDownPoint;
    }
  };

  handleDoubleClick = (e: MouseEvent<HTMLCanvasElement>) => {
    if (this.props.vertices.length > 1) {
      this.save({
        vertices: [{ x: e.clientX, y: e.clientY }],
        stroke: LineStyle.solid,
      });
    }
  };

  render = (ctx: CanvasRenderingContext2D) => {
    if (this.props && this.firstDownPoint) {
      const { stroke, color } = this.props;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(this.firstDownPoint.x, this.firstDownPoint.y);
      this.props.vertices.map((vertex) => {
        ctx.lineTo(vertex.x, vertex.y);
      });
      if (this.cursorPoint) {
        ctx.lineTo(this.cursorPoint.x, this.cursorPoint.y);
      }
      ctx.strokeStyle = color;
      if (stroke === LineStyle.dashed) {
        ctx.setLineDash([2, 5]);
      }
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    }
  };
}

export { PolyLine };
