import {
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
    private saveShape: (shape: ShapeProps) => void
  ) {}

  private setProps = (props: Partial<ShapeProps>) => {
    this.props = { ...this.props, ...props };
  };

  cancel = () => {};

  hitTest = (point: Point): boolean => {
    const { originPoint, width, height } = this.props;
    const xHit = point.x > originPoint.x && point.x < originPoint.x + width;
    const yHit = point.y > originPoint.y && point.y < originPoint.y + height;

    return xHit && yHit;
  };

  handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    this.interaction.handleMouseDown(e);
  };

  handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    this.interaction.handleMouseMove(e, (rect) => {
      this.setProps(rect);
      // this.saveTempShape(this.props);
    });
  };

  handleMouseUp = (e: MouseEvent<HTMLCanvasElement>) => {
    this.interaction.handleMouseUp(e, (rect) => {
      this.setProps(rect);
      this.saveShape(this.props);
    });
  };

  handleDoubleClick = (e: MouseEvent<HTMLCanvasElement>) => {
    this.interaction.handleDoubleClick(e, (rect) => {
      this.setProps(rect);
      this.saveShape(this.props);
    });
  };

  static renderSelectionBoxProps = (
    ctx: CanvasRenderingContext2D,
    shape: ShapeProps
  ) => {
    const { originPoint: origin, width, height } = shape;
    renderRectangleSelectionBox(ctx, { origin, width, height });
  };

  renderSelectionBox = (ctx: CanvasRenderingContext2D) => {
    const { originPoint: origin, width, height } = this.props;
    renderRectangleSelectionBox(ctx, { origin, width, height });
  };

  static renderProps = (ctx: CanvasRenderingContext2D, shape: ShapeProps) => {
    ctx.save();
    ctx.strokeStyle = shape.color;
    if (shape.stroke === LineStyle.dashed) {
      ctx.setLineDash([2, 5]);
    }
    ctx.strokeRect(
      shape.originPoint.x,
      shape.originPoint.y,
      shape.width,
      shape.height
    );
    ctx.restore();
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
