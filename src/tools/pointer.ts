import { Point, Shape, ToolEvents } from '../types';
import { MouseEvent } from 'react';

export class Pointer implements ToolEvents {
  constructor(
    private canvas: HTMLCanvasElement,
    private hitTestAllShapes: (point: Point) => void,
    private saveTempShape: (shape: Shape) => void,
    private resetTool: (tool: Pointer) => void
  ) {}

  cancel = () => {};

  hitTest = (point: Point): boolean => {
    this.hitTestAllShapes(point);
    return true;
  };

  reset = () => {
    this.resetTool(
      new Pointer(
        this.canvas,
        this.hitTestAllShapes,
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
