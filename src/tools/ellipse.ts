import { ToolEvents, Shape, Point, LineStyle } from '../types';
import { MouseEvent } from 'react';
import { getCanvasPoint, getTopLeftAndBottomRight } from '../utils';

type EllipseProps = {
  center: Point;
  color: string;
  radiusX: number;
  radiusY: number;
  stroke: LineStyle;
};

class Ellipse implements ToolEvents {
  props?: EllipseProps;

  mouseDownPoint?: Point;

  constructor(
    private canvas: HTMLCanvasElement,
    private saveShape: (shape: Shape) => void,
    private saveTempShape: (shape: Shape) => void,
    private resetTool: (tool: Ellipse) => void
  ) {}

  private setProps = (props: EllipseProps) => {
    this.props = props;
  };

  reset() {
    this.resetTool(
      new Ellipse(
        this.canvas,
        this.saveShape,
        this.saveTempShape,
        this.resetTool
      )
    );
  }

  handleMouseMove = (
    e: MouseEvent<HTMLCanvasElement>,
    onComplete: (shape: Shape) => void
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
      const width = Math.abs(beginRectPoint.x - endRectPoint.x);
      const height = Math.abs(beginRectPoint.y - endRectPoint.y);

      const props: EllipseProps = {
        color: 'red',
        center: {
          x: (beginRectPoint.x + endRectPoint.x) / 2,
          y: (beginRectPoint.y + endRectPoint.y) / 2,
        },
        stroke: LineStyle.dashed,
        radiusX: width / 2,
        radiusY: height / 2,
      };

      this.setProps(props);
      this.saveTempShape(this);
      onComplete(this);
    }
  };

  handleMouseUp = (
    e: MouseEvent<HTMLCanvasElement>,
    onComplete: (shape: Shape) => void
  ) => {
    if (this.mouseDownPoint) {
      const canvasRect = this.canvas.getBoundingClientRect();
      const mouseUpPoint = { x: e.clientX, y: e.clientY };
      const [topLeft, bottomRight] = getTopLeftAndBottomRight(
        this.mouseDownPoint,
        mouseUpPoint
      );
      const beginRectPoint = getCanvasPoint(topLeft, canvasRect);
      const endRectPoint = getCanvasPoint(bottomRight, canvasRect);
      const width = Math.abs(beginRectPoint.x - endRectPoint.x);
      const height = Math.abs(beginRectPoint.y - endRectPoint.y);

      const props: EllipseProps = {
        color: 'red',
        center: {
          x: (beginRectPoint.x + endRectPoint.x) / 2,
          y: (beginRectPoint.y + endRectPoint.y) / 2,
        },
        radiusX: width / 2,
        radiusY: height / 2,
        stroke: LineStyle.solid,
      };

      this.setProps(props);
      this.saveShape(this);
      onComplete(this);
      this.reset();
    }
  };

  handleMouseDown = (
    e: MouseEvent<HTMLCanvasElement>,
    onComplete: (shape: Shape) => void
  ) => {
    this.mouseDownPoint = { x: e.clientX, y: e.clientY };
    onComplete(this);
  };

  handleDoubleClick = (
    e: MouseEvent<HTMLCanvasElement>,
    onComplete: (shape: Shape) => void
  ) => {
    this.props = {
      center: {
        x: e.clientX,
        y: e.clientY,
      },
      radiusX: 50,
      radiusY: 50,
      color: 'blue',
      stroke: LineStyle.solid,
    };
    this.saveShape(this);
    onComplete(this);
    this.reset();
  };

  render = (ctx: CanvasRenderingContext2D) => {
    if (this.props) {
      const { center, radiusX, radiusY, color, stroke } = this.props;
      ctx.save();
      ctx.beginPath();
      if (stroke === LineStyle.dashed) {
        ctx.setLineDash([2, 5]);
      }
      ctx.strokeStyle = color;
      ctx.ellipse(center.x, center.y, radiusX, radiusY, 0, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.closePath();
      ctx.restore();
    }
  };
}

export { Ellipse };
