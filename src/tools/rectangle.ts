import {
  Shape,
  LineStyle,
  ShapeProps,
  defaultShapeProps,
  Point,
  IShapeTool,
} from '../types';
import { MouseEvent } from 'react';
import { DrawRectangleInteraction } from '../interactions';
import { renderRectangleSelectionBox } from '../utils';

class Rectangle implements IShapeTool {
  interaction = new DrawRectangleInteraction(this.canvas);

  props: ShapeProps = defaultShapeProps;

  selected = false;

  constructor(
    private canvas: HTMLCanvasElement,
    private saveShape: (shape: Shape) => void,
    private saveTempShape: (shape: Shape) => void,
    private resetTool: (tool: Rectangle) => void
  ) {}

  private setProps = (props: Partial<ShapeProps>) => {
    this.props = { ...this.props, ...props };
  };

  hitTest = (point: Point): boolean => {
    const { originPoint, width, height } = this.props;
    const xHit = point.x > originPoint.x && point.x < originPoint.x + width;
    const yHit = point.y > originPoint.y && point.y < originPoint.y + height;

    return xHit && yHit;
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

  renderSelectionBox = (ctx: CanvasRenderingContext2D) => {
    const { originPoint: origin, width, height } = this.props;
    renderRectangleSelectionBox(ctx, { origin, width, height });
  };

  render = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.strokeStyle = this.props.color;
    if (this.props.stroke === LineStyle.dashed) {
      ctx.setLineDash([2, 5]);
    }
    ctx.strokeRect(
      this.props.originPoint.x,
      this.props.originPoint.y,
      this.props.width,
      this.props.height
    );
    ctx.restore();
  };
}

export { Rectangle };
