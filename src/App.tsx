import { produce } from 'immer';
import { WritableDraft } from 'immer/dist/types/types-external';
import React, { useState, MouseEvent, useRef, useEffect } from 'react';
import { Button } from './components';
import { Ellipse, PolyLine, Rectangle } from './tools';
import { EventRouter } from './tools/event-router';
import { Shape, Tool } from './types';

function App() {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [tempShapes, setTempShapes] = useState<Shape[]>([]);
  const [tool, setTool] = useState<Tool | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const eventRouter = useRef(new EventRouter());

  const resizeCanvas = () => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight * 0.9;
    }
    render(shapes);
  };

  useEffect(() => {
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

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

  const render = (shapes: Shape[], cb?: (shapes: Shape[]) => void) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (canvasRef.current && ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      shapes.map((shape) => {
        shape.render(ctx);
      });
      cb && cb(shapes);
    }
  };

  const resetTool = (tool: Tool) => {
    setTool(tool);
  };

  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!eventRouter.current.tool) return;

    eventRouter.current.handleMouseDown(e, () => {});
  };

  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!eventRouter.current.tool) return;

    eventRouter.current.handleMouseMove(e, (shape: Shape) => {});
  };

  const handleMouseUp = (e: MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!eventRouter.current.tool) return;

    eventRouter.current.handleMouseUp(e, (shape) => {
      // setTool(tool?.reset() || null);
    });
  };

  const handleDoubleClick = (e: MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!eventRouter.current.tool) return;

    eventRouter.current.handleDoubleClick(e, (shape) => {
      // setTool(tool?.reset() || null);
    });
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        style={{ backgroundColor: 'lightgray' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDoubleClick={handleDoubleClick}
      />
      <br />
      <div
        style={{ width: '100%', display: 'flex', justifyContent: 'flex-start' }}
      >
        <Button
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
              : setTool(null);
          }}
          selected={tool instanceof Rectangle}
          style={{ margin: 5 }}
        >
          Rectangle
        </Button>
        <Button
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
              : setTool(null);
          }}
          selected={tool instanceof Ellipse}
          style={{ margin: 5 }}
        >
          Ellipse
        </Button>
        <Button
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
              : setTool(null);
          }}
          selected={tool instanceof PolyLine}
          style={{ margin: 5 }}
        >
          PolyLine
        </Button>
      </div>
    </div>
  );
}

export default App;
