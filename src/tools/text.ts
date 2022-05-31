import {
  defaultShapeProps,
  IShapeTool,
  Point,
  Shape,
  ShapeProps,
  ShapeType,
} from '../types';
import { MouseEvent } from 'react';
import { renderRectangleSelectionBox } from '../utils';

class Text implements IShapeTool {
  private textElement?: HTMLSpanElement;

  private container?: HTMLDivElement;

  private props: ShapeProps = { ...defaultShapeProps, type: ShapeType.Text };

  private mouseDownPoint?: Point;

  selected = false;

  constructor(
    private canvas: HTMLCanvasElement,
    private saveShape: (shape: ShapeProps) => void
  ) {}

  private saveText = () => {
    if (this.textElement && this.mouseDownPoint) {
      const text = this.textElement.innerText;
      if (this.props && text.length > 0) {
        const { width, height } = this.textElement.getBoundingClientRect();
        this.props.width = width;
        this.props.height = height;
        this.props.text = text;
        this.props.originPoint = {
          x: this.mouseDownPoint.x,
          y: this.mouseDownPoint.y,
        };
        this.saveShape(this.props);
      }
      this.container?.removeChild(this.textElement);
      this.textElement = undefined;
    }
  };

  private editText = () => {
    this.textElement = document.createElement('span');
    this.textElement.contentEditable = 'true';
    this.textElement.style.position = 'absolute';
    this.textElement.style.outline = 'none';
    this.textElement.style.minWidth = '3px';
    this.textElement.style.color = this.props?.font.color || 'black';
    this.textElement.style.fontSize = `${this.props?.font.size ?? 16}px`;
    this.textElement.style.fontFamily = `${
      this.props?.font.family ?? 'Helvetica'
    }`;

    this.textElement.style.top = `${this.mouseDownPoint?.y}px`;
    this.textElement.style.left = `${this.mouseDownPoint?.x}px`;

    this.container = document.getElementById('container') as HTMLDivElement;
    this.container.appendChild(this.textElement);

    this.textElement.focus();
  };

  cancel = () => {
    this.saveText();
  };

  hitTest = (point: Point): boolean => {
    const { originPoint, width, height } = this.props;
    const xHit = point.x > originPoint.x && point.x < originPoint.x + width;
    const yHit = point.y > originPoint.y && point.y < originPoint.y + height;

    return xHit && yHit;
  };

  handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!this.mouseDownPoint) {
      this.mouseDownPoint = { x: e.clientX, y: e.clientY };
      this.editText();
    } else {
      this.saveText();
    }
  };

  handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {};

  handleMouseUp = (e: MouseEvent<HTMLCanvasElement>) => {};

  handleDoubleClick = (e: MouseEvent<HTMLCanvasElement>) => {};

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
    if (shape) {
      const {
        text,
        originPoint,
        font: { size, family, color },
      } = shape;

      ctx.save();
      ctx.font = `${size}px ${family}`;
      ctx.fillStyle = color;
      ctx.textBaseline = 'top';
      ctx.fillText(text, originPoint.x, originPoint.y);
      ctx.restore();
    }
  };

  render = (ctx: CanvasRenderingContext2D) => {
    if (this.props) {
      const {
        text,
        originPoint,
        font: { size, family, color },
      } = this.props;

      ctx.save();
      ctx.font = `${size}px ${family}`;
      ctx.fillStyle = color;
      ctx.textBaseline = 'top';
      ctx.fillText(text, originPoint.x, originPoint.y);
      ctx.restore();
    }
  };
}

export { Text };
