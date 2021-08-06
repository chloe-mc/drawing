import { ToolEvents, Shape, Point, LineStyle } from '../types';
import { MouseEvent } from 'react';

type PolyLineProps = {
  vertices: Point[];
  color: string;
  stroke: LineStyle;
};

class PolyLine implements ToolEvents {
  props?: PolyLineProps;

  firstDownPoint?: Point;

  lastDownPoint?: Point;

  cursorPoint?: Point;

  constructor(
    private canvas: HTMLCanvasElement,
    private saveShape: (shape: Shape) => void,
    private saveTempShape: (shape: Shape) => void,
    private resetTool: (tool: PolyLine) => void
  ) {}

  private setProps = (props: PolyLineProps) => {
    this.props = props;
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

  handleMouseMove = (
    e: MouseEvent<HTMLCanvasElement>,
    onComplete: (shape: Shape) => void
  ) => {
    if (this.firstDownPoint) {
      if (!this.props) {
        const props: PolyLineProps = {
          color: 'coral',
          stroke: LineStyle.dashed,
          vertices: [],
        };
        this.setProps(props);
      }
      this.cursorPoint = { x: e.clientX, y: e.clientY };
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
      mouseUpPoint.x === this.lastDownPoint?.x &&
      mouseUpPoint.y === this.lastDownPoint?.y;
    if (this.firstDownPoint) {
      if (this.props && !mouseUpEqualsMouseDown) {
        this.props.vertices.push(mouseUpPoint);
        this.props.stroke = LineStyle.solid;
        this.saveShape(this);
        onComplete(this);
        this.reset();
      } else if (!this.props) {
        const props: PolyLineProps = {
          color: 'coral',
          stroke: LineStyle.dashed,
          vertices: [],
        };
        this.setProps(props);
      } else {
        this.props.vertices.push(mouseUpPoint);
        this.saveTempShape(this);
      }
    }
    onComplete(this);
  };

  handleMouseDown = (
    e: MouseEvent<HTMLCanvasElement>,
    onComplete: (shape: Shape) => void
  ) => {
    this.lastDownPoint = { x: e.clientX, y: e.clientY };
    if (!this.firstDownPoint) {
      this.firstDownPoint = this.lastDownPoint;
      onComplete(this);
    }
  };

  handleDoubleClick = (
    e: MouseEvent<HTMLCanvasElement>,
    onComplete: (shape: Shape) => void
  ) => {
    if (this.props && this.props.vertices.length > 1) {
      this.props.vertices.push({ x: e.clientX, y: e.clientY });
      this.props.stroke = LineStyle.solid;
      this.saveShape(this);
      onComplete(this);
      this.reset();
    } else {
      this.firstDownPoint = { x: e.clientX, y: e.clientY };
      const props: PolyLineProps = {
        vertices: [{ x: e.clientX + 100, y: e.clientY + 100 }],
        color: 'coral',
        stroke: LineStyle.solid,
      };
      this.setProps(props);
      this.saveShape(this);
      onComplete(this);
      this.reset();
    }
  };

  render = (ctx: CanvasRenderingContext2D) => {
    if (this.props && this.firstDownPoint) {
      const { stroke, color } = this.props;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(this.firstDownPoint.x, this.firstDownPoint.y);
      this.props.vertices.map((vertex, index) => {
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
