import { Tool, ToolEvents } from '../types';
import { MouseEvent } from 'react';

class EventRouter implements ToolEvents {
  tool: Tool = null;

  setTool = (tool: Tool) => {
    this.tool = tool;
  };

  handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    if (this.tool) {
      this.tool.handleMouseMove(e);
    }
  };

  handleMouseUp = (e: MouseEvent<HTMLCanvasElement>) => {
    if (this.tool) this.tool.handleMouseUp(e);
  };

  handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    if (this.tool) this.tool.handleMouseDown(e);
  };

  handleDoubleClick = (e: MouseEvent<HTMLCanvasElement>) => {
    if (this.tool) this.tool.handleDoubleClick(e);
  };

  render = () => {};
  reset = () => {
    if (this.tool) this.tool.reset();
  };
}

export { EventRouter };
