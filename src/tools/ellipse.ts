import {
  LineStyle,
  ShapeProps,
  defaultShapeProps,
  Point,
  IShapeTool,
  ShapeType,
} from '../types';
import { MouseEvent } from 'react';
import { DrawRectangleInteraction } from '../interactions';
import { renderRectangleSelectionBox } from '../utils';

class Ellipse implements IShapeTool {
  interaction = new DrawRectangleInteraction(this.canvas);

  props: ShapeProps = { ...defaultShapeProps, type: ShapeType.Ellipse };

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

    const radiusX = width / 2;
    const radiusY = height / 2;
    const differenceX = point.x - (originPoint.x + radiusX);
    const differenceY = point.y - (originPoint.y + radiusY);

    return (
      (differenceX * differenceX) / (radiusX * radiusX) +
        (differenceY * differenceY) / (radiusY * radiusY) <=
      1
    );
  };

  handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    this.interaction.handleMouseDown(e);
  };

  handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    this.interaction.handleMouseMove(e, (props) => {
      this.setProps(props);
      // this.saveTempShape(this.props);
    });
  };

  handleMouseUp = (e: MouseEvent<HTMLCanvasElement>) => {
    this.interaction.handleMouseUp(e, (props) => {
      this.setProps(props);
      this.saveShape(this.props);
    });
  };

  handleDoubleClick = (e: MouseEvent<HTMLCanvasElement>) => {
    this.interaction.handleDoubleClick(e, (props) => {
      this.setProps(props);
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
    const { originPoint, width, height, color, stroke } = shape;
    const radiusX = width / 2;
    const radiusY = height / 2;
    const center = {
      x: originPoint.x + radiusX,
      y: originPoint.y + radiusY,
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

  render = (ctx: CanvasRenderingContext2D) => {
    const { originPoint, width, height, color, stroke } = this.props;
    const radiusX = width / 2;
    const radiusY = height / 2;
    const center = {
      x: originPoint.x + radiusX,
      y: originPoint.y + radiusY,
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
