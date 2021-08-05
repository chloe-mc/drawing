import { ToolEvents, Shape, Point, LineStyle } from '../types';
import { MouseEvent } from 'react';

type PolyLineProps = {
  vertices: Point[];
  color: string;
  stroke: LineStyle;
};

class PolyLine implements ToolEvents {
  props?: PolyLineProps;

  mouseDownPoint?: Point;

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
    if (this.mouseDownPoint) {
      this.cursorPoint = { x: e.clientX, y: e.clientY };
      this.saveTempShape(this);
      onComplete(this);
    }
    // if (this.mouseDownPoint) {
    //   const canvasRect = this.canvas.getBoundingClientRect();
    //   const currentMousePoint = { x: e.clientX, y: e.clientY };
    //   const [topLeft, bottomRight] = getTopLeftAndBottomRight(
    //     this.mouseDownPoint,
    //     currentMousePoint
    //   );
    //   const beginRectPoint = getCanvasPoint(topLeft, canvasRect);
    //   const endRectPoint = getCanvasPoint(bottomRight, canvasRect);
    //   const width = Math.abs(beginRectPoint.x - endRectPoint.x);
    //   const height = Math.abs(beginRectPoint.y - endRectPoint.y);
    //   const props: EllipseProps = {
    //     color: 'red',
    //     center: {
    //       x: (beginRectPoint.x + endRectPoint.x) / 2,
    //       y: (beginRectPoint.y + endRectPoint.y) / 2,
    //     },
    //     stroke: LineStyle.dashed,
    //     radiusX: width / 2,
    //     radiusY: height / 2,
    //   };
    //   this.setProps(props);
    //   this.saveTempShape(this);
    //   onComplete(this);
    // }
  };

  handleMouseUp = (
    e: MouseEvent<HTMLCanvasElement>,
    onComplete: (shape: Shape) => void
  ) => {
    if (this.mouseDownPoint) {
      const mouseUpPoint = { x: e.clientX, y: e.clientY };
      if (this.props) {
        this.props.vertices.push(mouseUpPoint);
        this.saveShape(this);
      } else {
        const props: PolyLineProps = {
          color: 'coral',
          stroke: LineStyle.dashed,
          vertices: [],
        };
        this.setProps(props);
      }
    }
    onComplete(this);
  };

  handleMouseDown = (
    e: MouseEvent<HTMLCanvasElement>,
    onComplete: (shape: Shape) => void
  ) => {
    if (!this.mouseDownPoint) {
      this.mouseDownPoint = { x: e.clientX, y: e.clientY };
      onComplete(this);
    }
  };

  handleDoubleClick = (
    e: MouseEvent<HTMLCanvasElement>,
    onComplete: (shape: Shape) => void
  ) => {
    if (this.props && this.props.vertices.length > 0) {
      this.props.vertices.push({ x: e.clientX, y: e.clientY });
      this.props.stroke = LineStyle.solid;
      this.saveShape(this);
      onComplete(this);
      this.reset();
    } else {
      this.mouseDownPoint = { x: e.clientX, y: e.clientY };
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
    if (this.props && this.mouseDownPoint) {
      const { stroke, color } = this.props;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(this.mouseDownPoint.x, this.mouseDownPoint.y);
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
