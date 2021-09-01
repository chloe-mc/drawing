import {
  defaultShapeProps,
  Point,
  Shape,
  ShapeProps,
  ToolEvents,
} from '../types';
import { MouseEvent } from 'react';

export class Pointer implements ToolEvents {
  private mouseDownPoint?: Point;
  private props?: ShapeProps;

  constructor(
    private canvas: HTMLCanvasElement,
    private findHitMarkup: (point: Point) => Shape | undefined,
    private saveTempShape: (shape: Shape) => void,
    private resetTool: (tool: Pointer) => void
  ) {}

  hitTest = (point: Point): Shape | undefined => {
    this.findHitMarkup(point);
    return;
  };

  reset = () => {
    this.resetTool(
      new Pointer(
        this.canvas,
        this.findHitMarkup,
        this.saveTempShape,
        this.resetTool
      )
    );
  };

  handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    this.hitTest({ x: e.clientX, y: e.clientY });
  };

  handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {};

  handleMouseUp = (e: MouseEvent<HTMLCanvasElement>) => {};

  handleDoubleClick = (e: MouseEvent<HTMLCanvasElement>) => {};
}
