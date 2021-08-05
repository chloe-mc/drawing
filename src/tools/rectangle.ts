import { Point, ToolEvents, Shape, LineStyle } from '../types';
import { MouseEvent } from 'react';
import { getCanvasPoint, getTopLeftAndBottomRight } from '../utils';

type RectangleProps = {
  topLeft: Point; // top left of rectangle in canvas space
  height: number;
  width: number;
  color: string;
  stroke: LineStyle;
};

class Rectangle implements ToolEvents {
  props?: RectangleProps;

  mouseDownPoint?: Point;

  constructor(
    private canvas: HTMLCanvasElement,
    private saveShape: (shape: Shape) => void,
    private saveTempShape: (shape: Shape) => void,
    private resetTool: (tool: Rectangle) => void
  ) {}

  private setProps = (props: RectangleProps) => {
    this.props = props;
  };

  reset = () => {
    this.resetTool(
      new Rectangle(
        this.canvas,
        this.saveShape,
        this.saveTempShape,
        this.resetTool
      )
    );
  };

  handleMouseDown = (
    e: MouseEvent<HTMLCanvasElement>,
    onComplete: (shape: Shape) => void
  ) => {
    this.mouseDownPoint = { x: e.clientX, y: e.clientY };
    onComplete(this);
  };

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

      const rect: RectangleProps = {
        color: 'green',
        topLeft: beginRectPoint,
        width: Math.abs(beginRectPoint.x - endRectPoint.x),
        height: Math.abs(beginRectPoint.y - endRectPoint.y),
        stroke: LineStyle.dashed,
      };

      this.setProps(rect);
      this.saveTempShape(this);
      onComplete(this);
    }
  };

  handleMouseUp = (
    e: MouseEvent<HTMLCanvasElement>,
    onComplete: (shape: Shape) => void
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

      const rect: RectangleProps = {
        color: 'green',
        topLeft: beginRectPoint,
        width,
        height,
        stroke: LineStyle.solid,
      };

      this.setProps(rect);
      onComplete(this);
      this.saveShape(this);
      this.reset();
    }
  };

  handleDoubleClick = (
    e: MouseEvent<HTMLCanvasElement>,
    onComplete: (shape: Shape) => void
  ) => {
    const canvasRect = this.canvas.getBoundingClientRect();
    const beginRectPoint = getCanvasPoint(
      { x: e.clientX, y: e.clientY },
      canvasRect
    );
    const rect: RectangleProps = {
      color: 'purple',
      topLeft: beginRectPoint,
      width: 100,
      height: 100,
      stroke: LineStyle.solid,
    };

    this.setProps(rect);
    this.saveShape(this);
    onComplete(this);
    this.reset();
  };

  render = (ctx: CanvasRenderingContext2D) => {
    if (this.props) {
      ctx.save();
      ctx.strokeStyle = this.props.color;
      if (this.props.stroke === LineStyle.dashed) {
        ctx.setLineDash([2, 5]);
      }
      ctx.strokeRect(
        this.props.topLeft.x,
        this.props.topLeft.y,
        this.props.width,
        this.props.height
      );
      ctx.restore();
    }
  };
}

export { Rectangle };
