import {
  ToolEvents,
  Shape,
  LineStyle,
  defaultShapeProps,
  ShapeProps,
  Point,
} from '../types';
import { MouseEvent } from 'react';
import { DrawLineInteraction } from '../interactions';
import { getEndArrowPoints } from '../utils';

class Arrow implements ToolEvents {
  props: ShapeProps = defaultShapeProps;

  interaction = new DrawLineInteraction({
    lineOnly: true,
  });

  constructor(
    private canvas: HTMLCanvasElement,
    private saveShape: (shape: Shape) => void,
    private saveTempShape: (shape: Shape) => void,
    private resetTool: (tool: Arrow) => void
  ) {}

  private setProps = (props: Partial<ShapeProps>) => {
    if (props.vertices) {
      props.vertices = [...this.props.vertices, ...props.vertices];
    }
    this.props = { ...this.props, ...props };
  };

  private save = (newProps?: Partial<ShapeProps>): void => {
    newProps && this.setProps(newProps);
    this.saveShape(this);
    this.reset();
  };

  reset = () => {
    this.resetTool(
      new Arrow(this.canvas, this.saveShape, this.saveTempShape, this.resetTool)
    );
  };

  handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    this.interaction.handleMouseMove(e, (line) => {
      this.setProps(line);
      this.saveTempShape(this);
    });
  };

  handleMouseUp = (e: MouseEvent<HTMLCanvasElement>) => {
    this.interaction.handleMouseUp(e, (line) => {
      this.setProps(line);
      line.temp ? this.saveTempShape(this) : this.save();
    });
  };

  handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    this.interaction.handleMouseDown(e, (line) => {
      this.setProps(line);
    });
  };

  handleDoubleClick = (e: MouseEvent<HTMLCanvasElement>) => {
    this.interaction.handleDoubleClick(e, (line) => {
      if (this.props.vertices.length > 1) {
        this.save(line);
      }
    });
  };

  private drawArrow(
    ctx: CanvasRenderingContext2D,
    beginPoint: Point,
    endPoint: Point
  ) {
    const { leftBarb, rightBarb } = getEndArrowPoints(beginPoint, endPoint);
    ctx.moveTo(endPoint.x, endPoint.y);
    ctx.lineTo(leftBarb.x, leftBarb.y);
    ctx.moveTo(endPoint.x, endPoint.y);
    ctx.lineTo(rightBarb.x, rightBarb.y);
  }

  render = (ctx: CanvasRenderingContext2D) => {
    const { stroke, color, vertices, cursorPosition } = this.props;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(vertices[0].x, vertices[0].y);
    vertices.map((vertex) => {
      ctx.lineTo(vertex.x, vertex.y);
    });
    if (cursorPosition) {
      ctx.lineTo(cursorPosition.x, cursorPosition.y);
      this.drawArrow(ctx, vertices[vertices.length - 1], cursorPosition);
    } else {
      this.drawArrow(
        ctx,
        vertices[vertices.length - 2],
        vertices[vertices.length - 1]
      );
    }
    ctx.strokeStyle = color;
    if (stroke === LineStyle.dashed) {
      ctx.setLineDash([2, 5]);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  };
}

export { Arrow };
