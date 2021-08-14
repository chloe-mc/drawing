import {
  ToolEvents,
  Shape,
  LineStyle,
  ShapeProps,
  defaultShapeProps,
} from '../types';
import { MouseEvent } from 'react';
import { DrawRectangleInteraction } from '../interactions';

class Ellipse implements ToolEvents {
  interaction = new DrawRectangleInteraction(this.canvas);

  props: ShapeProps = defaultShapeProps;

  constructor(
    private canvas: HTMLCanvasElement,
    private saveShape: (shape: Shape) => void,
    private saveTempShape: (shape: Shape) => void,
    private resetTool: (tool: Ellipse) => void
  ) {}

  private setProps = (props: Partial<ShapeProps>) => {
    this.props = { ...this.props, ...props };
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

  handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    this.interaction.handleMouseDown(e);
  };

  handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    this.interaction.handleMouseMove(e, (props) => {
      this.setProps(props);
      this.saveTempShape(this);
    });
  };

  handleMouseUp = (e: MouseEvent<HTMLCanvasElement>) => {
    this.interaction.handleMouseUp(e, (props) => {
      this.setProps(props);
      this.saveShape(this);
      this.reset();
    });
  };

  handleDoubleClick = (e: MouseEvent<HTMLCanvasElement>) => {
    this.interaction.handleDoubleClick(e, (props) => {
      this.setProps(props);
      this.saveShape(this);
      this.reset();
    });
  };

  render = (ctx: CanvasRenderingContext2D) => {
    const { topLeft, width, height, color, stroke } = this.props;
    const radiusX = width / 2;
    const radiusY = height / 2;
    const center = {
      x: topLeft.x + radiusX,
      y: topLeft.y + radiusY,
    };
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
  };
}

export { Ellipse };
