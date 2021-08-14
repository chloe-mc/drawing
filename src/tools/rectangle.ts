import {
  ToolEvents,
  Shape,
  LineStyle,
  ShapeProps,
  defaultShapeProps,
} from '../types';
import { MouseEvent } from 'react';
import { DrawRectangleInteraction } from '../interactions';

class Rectangle implements ToolEvents {
  interaction = new DrawRectangleInteraction(this.canvas);

  props: ShapeProps = defaultShapeProps;

  constructor(
    private canvas: HTMLCanvasElement,
    private saveShape: (shape: Shape) => void,
    private saveTempShape: (shape: Shape) => void,
    private resetTool: (tool: Rectangle) => void
  ) {}

  private setProps = (props: Partial<ShapeProps>) => {
    this.props = { ...this.props, ...props };
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

  handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    this.interaction.handleMouseDown(e);
  };

  handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    this.interaction.handleMouseMove(e, (rect) => {
      this.setProps(rect);
      this.saveTempShape(this);
    });
  };

  handleMouseUp = (e: MouseEvent<HTMLCanvasElement>) => {
    this.interaction.handleMouseUp(e, (rect) => {
      this.setProps(rect);
      this.saveShape(this);
      this.reset();
    });
  };

  handleDoubleClick = (e: MouseEvent<HTMLCanvasElement>) => {
    this.interaction.handleDoubleClick(e, (rect) => {
      this.setProps(rect);
      this.saveShape(this);
      this.reset();
    });
  };

  render = (ctx: CanvasRenderingContext2D) => {
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
  };
}

export { Rectangle };
