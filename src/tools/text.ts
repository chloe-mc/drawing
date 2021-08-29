import {
  defaultShapeProps,
  Point,
  Shape,
  ShapeProps,
  ToolEvents,
} from '../types';
import { MouseEvent } from 'react';

class Text implements ToolEvents {
  private textElement?: HTMLSpanElement;

  private container?: HTMLDivElement;

  private props?: ShapeProps;

  private mouseDownPoint?: Point;

  constructor(
    private canvas: HTMLCanvasElement,
    private saveShape: (shape: Shape) => void,
    private saveTempShape: (shape: Shape) => void,
    private resetTool: (tool: Text) => void
  ) {
    this.props = { ...defaultShapeProps };
  }

  reset = () => {
    this.resetTool(
      new Text(this.canvas, this.saveShape, this.saveTempShape, this.resetTool)
    );
  };

  handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    if (!this.mouseDownPoint) {
      this.mouseDownPoint = { x: e.clientX, y: e.clientY };

      this.textElement = document.createElement('span');
      this.textElement.contentEditable = 'true';
      this.textElement.style.position = 'absolute';
      this.textElement.style.outline = 'none';
      this.textElement.style.minWidth = '3px';
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

  render = (ctx: CanvasRenderingContext2D) => {
    if (this.props) {
      const {
        text,
        originPoint,
        font: { size, family },
      } = this.props;

      ctx.save();
      ctx.font = `${size}px ${family}`;
      ctx.textBaseline = 'top';
      ctx.fillText(text, originPoint.x, originPoint.y);
      ctx.restore();
    }
  };
}

export { Text };
