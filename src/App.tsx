import { produce } from 'immer';
import { WritableDraft } from 'immer/dist/types/types-external';
import React, { useState, MouseEvent, useRef, useEffect } from 'react';
import { Button, ToggleButton } from './components';
import { Arrow, Ellipse, Pointer, PolyLine, Rectangle, Text } from './tools';
import { EventRouter } from './tools/event-router';
import { backgroundColor, Point, Shape, Tool } from './types';
import { getColors } from './colors';

function App() {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [tempShapes, setTempShapes] = useState<Shape[]>([]);
  const [tool, setTool] = useState<Tool | null>(null);

  const { alert, white } = getColors();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const eventRouter = useRef(new EventRouter());

  useEffect(() => {
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    setDefaultTool();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  useEffect(() => {
    if (shapes.length > 0) {
      render(shapes);
    }
  }, [shapes]);

  useEffect(() => {
    if (tempShapes.length > 0) {
      render(tempShapes.concat(shapes), () => setTempShapes([]));
    }
  }, [tempShapes]);

  useEffect(() => {
    eventRouter.current.setTool(tool);
  }, [tool]);

  const createHiDPICanvas = (
    canvas: HTMLCanvasElement,
    width: number,
    height: number
  ) => {
    const ratio = window.devicePixelRatio;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    const context = canvas.getContext('2d');
    context?.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  const resizeCanvas = () => {
    if (canvasRef.current) {
      createHiDPICanvas(
        canvasRef.current,
        window.innerWidth,
        window.innerHeight * 0.9
      );
    }
    render(shapes);
  };

  const saveShape = (shape: Shape) => {
    setShapes(
      produce((draft) => {
        draft.push(shape as WritableDraft<Shape>);
      })
    );
  };

  const saveTempShape = (shape: Shape) => {
    setTempShapes(
      produce((draft) => {
        draft.push(shape as WritableDraft<Shape>);
      })
    );
  };

  const resetCanvas = (canvas: HTMLCanvasElement) => {
    clearCanvas(canvas);
    setShapes([]);
    setTempShapes([]);
    eventRouter.current.reset();
  };

  const clearCanvas = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const render = (shapes: Shape[], onComplete?: (shapes: Shape[]) => void) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (canvasRef.current && ctx) {
      clearCanvas(canvasRef.current);
      shapes.map((shape) => {
        shape.render(ctx);
        if (shape.selected) {
          shape.renderSelectionBox(ctx);
        }
      });
      onComplete && onComplete(shapes);
    }
  };

  const resetTool = (tool: Tool) => {
    setTool(tool);
  };

  const deselectAllShapes = () => {
    shapes.forEach((shape) => {
      if (shape.selected) shape.selected = false;
    });
  };

  const hitTest = (point: Point): Shape | undefined => {
    const shape = shapes.find((shape) => {
      return shape.hitTest(point);
    });
    if (shape) {
      console.log(shape);
      shape.selected = true;
      render(shapes);
    } else {
      deselectAllShapes();
      render(shapes);
    }
    return shape;
  };

  const setDefaultTool = () => {
    if (canvasRef.current) {
      setTool(
        new Pointer(canvasRef.current, hitTest, saveTempShape, resetTool)
      );
    }
  };

  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!eventRouter.current.tool) return;

    eventRouter.current.handleMouseDown(e);
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!eventRouter.current.tool) return;

    eventRouter.current.handleMouseMove(e);
  };

  const handleMouseUp = (e: MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!eventRouter.current.tool) return;

    eventRouter.current.handleMouseUp(e);
  };

  const handleDoubleClick = (e: MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!eventRouter.current.tool) return;

    eventRouter.current.handleDoubleClick(e);
  };

  return (
    <div id="container" style={{ backgroundColor: backgroundColor }}>
      <canvas
        ref={canvasRef}
        style={{ backgroundColor: backgroundColor }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDoubleClick={handleDoubleClick}
      />
      <br />
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ justifyContent: 'flex-start' }}>
          <ToggleButton
            onClick={() => {
              !(tool instanceof Rectangle) && canvasRef.current
                ? setTool(
                    new Rectangle(
                      canvasRef.current,
                      saveShape,
                      saveTempShape,
                      resetTool
                    )
                  )
                : setDefaultTool();
            }}
            selected={tool instanceof Rectangle}
            style={{ margin: 5 }}
          >
            Rectangle
          </ToggleButton>
          <ToggleButton
            onClick={() => {
              !(tool instanceof Ellipse) && canvasRef.current
                ? setTool(
                    new Ellipse(
                      canvasRef.current,
                      saveShape,
                      saveTempShape,
                      resetTool
                    )
                  )
                : setDefaultTool();
            }}
            selected={tool instanceof Ellipse}
            style={{ margin: 5 }}
          >
            Ellipse
          </ToggleButton>
          <ToggleButton
            onClick={() => {
              !(tool instanceof PolyLine) && canvasRef.current
                ? setTool(
                    new PolyLine(
                      canvasRef.current,
                      saveShape,
                      saveTempShape,
                      resetTool
                    )
                  )
                : setDefaultTool();
            }}
            selected={tool instanceof PolyLine}
            style={{ margin: 5 }}
          >
            PolyLine
          </ToggleButton>
          <ToggleButton
            onClick={() => {
              !(tool instanceof Arrow) && canvasRef.current
                ? setTool(
                    new Arrow(
                      canvasRef.current,
                      saveShape,
                      saveTempShape,
                      resetTool
                    )
                  )
                : setDefaultTool();
            }}
            selected={tool instanceof Arrow}
            style={{ margin: 5 }}
          >
            Arrow
          </ToggleButton>
          <ToggleButton
            onClick={() => {
              !(tool instanceof Text) && canvasRef.current
                ? setTool(
                    new Text(
                      canvasRef.current,
                      saveShape,
                      saveTempShape,
                      resetTool
                    )
                  )
                : setDefaultTool();
            }}
            selected={tool instanceof Text}
            style={{ margin: 5 }}
          >
            Text
          </ToggleButton>
        </div>
        <Button
          onClick={() => {
            if (canvasRef.current) {
              resetCanvas(canvasRef.current);
            }
          }}
          style={{ margin: 5, backgroundColor: alert, color: white }}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}

export default App;
