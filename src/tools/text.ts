import {
  defaultShapeProps,
  IShapeTool,
  Point,
  Shape,
  ShapeProps,
} from '../types';
import { MouseEvent } from 'react';

class Text implements IShapeTool {
  private textElement?: HTMLSpanElement;

  private container?: HTMLDivElement;

  private props: ShapeProps = { ...defaultShapeProps };

  private mouseDownPoint?: Point;

  selected = false;

  constructor(
    private canvas: HTMLCanvasElement,
    private saveShape: (shape: Shape) => void,
    private saveTempShape: (shape: Shape) => void,
    private resetTool: (tool: Text) => void
  ) {}

  reset = () => {
    this.resetTool(
      new Text(this.canvas, this.saveShape, this.saveTempShape, this.resetTool)
    );
  };

  hitTest = (point: Point): Shape | undefined => {
    const { originPoint, width, height } = this.props;
    const xHit = point.x > originPoint.x && point.x < originPoint.x + width;
    const yHit = point.y > originPoint.y && point.y < originPoint.y + height;

    return xHit && yHit ? this : undefined;
  };

  handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!this.mouseDownPoint) {
      this.mouseDownPoint = { x: e.clientX, y: e.clientY };

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

      this.textElement.style.top = `${e.clientY}px`;
      this.textElement.style.left = `${e.clientX}px`;

      this.container = document.getElementById('container') as HTMLDivElement;
      this.container.appendChild(this.textElement);

      this.textElement.focus();
    } else {
      if (this.textElement) {
        const text = this.textElement.innerText;
        if (this.props && text.length > 0) {
          this.props.text = text;
          this.props.originPoint = {
            x: this.mouseDownPoint.x,
            y: this.mouseDownPoint.y,
          };
          this.saveShape(this);
        }
        this.container?.removeChild(this.textElement);
      }
      this.reset();
    }
  };

  handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {};

  handleMouseUp = (e: MouseEvent<HTMLCanvasElement>) => {};

  handleDoubleClick = (e: MouseEvent<HTMLCanvasElement>) => {};

  renderSelectionBox = (ctx: CanvasRenderingContext2D) => {};

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
