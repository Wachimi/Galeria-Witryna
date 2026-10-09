"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react";

type Point = { x: number; y: number };
type View = Point & { scale: number };
type Gesture = { points: Point[]; view: View };
const initialView: View = { scale: 1, x: 0, y: 0 };
const maxZoom = 4;

export function ZoomablePreviewImage({
  src,
  alt,
  width,
  height,
  onBackdropClick,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  onBackdropClick: () => void;
}) {
  const [view, setView] = useState(initialView);
  const [dragging, setDragging] = useState(false);
  const viewRef = useRef(initialView);
  const stageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const pointers = useRef(new Map<number, Point>());
  const gesture = useRef<Gesture | null>(null);
  const moved = useRef(false);

  const applyView = useCallback((next: View) => {
    const stage = stageRef.current;
    const image = imageRef.current;
    if (!stage || !image) return;
    const scale = Math.min(maxZoom, Math.max(1, next.scale));
    // Nie pozwalamy odsunąć obrazu poza ekran ani odsłonić pustego obszaru na jego krawędzi.
    const limitX = Math.max(0, (image.offsetWidth * scale - stage.clientWidth) / 2);
    const limitY = Math.max(0, (image.offsetHeight * scale - stage.clientHeight) / 2);
    const updated = {
      scale,
      x: Math.min(limitX, Math.max(-limitX, next.x)),
      y: Math.min(limitY, Math.max(-limitY, next.y)),
    };
    const previous = viewRef.current;
    if (previous.scale === updated.scale && previous.x === updated.x && previous.y === updated.y)
      return;
    viewRef.current = updated;
    setView(updated);
  }, []);

  const zoomTo = useCallback(
    (nextScale: number, anchor: Point = { x: 0, y: 0 }) => {
      const current = viewRef.current;
      const scale = Math.min(maxZoom, Math.max(1, nextScale));
      const ratio = scale / current.scale;
      applyView({
        scale,
        x: anchor.x - (anchor.x - current.x) * ratio,
        y: anchor.y - (anchor.y - current.y) * ratio,
      });
    },
    [applyView],
  );

  useEffect(() => {
    const stage = stageRef.current;
    const image = imageRef.current;
    if (!stage || !image) return;
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      const bounds = stage.getBoundingClientRect();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? stage.clientHeight : 1;
      const delta = Math.min(200, Math.max(-200, event.deltaY * unit));
      zoomTo(viewRef.current.scale * Math.exp(-delta * 0.002), {
        x: event.clientX - bounds.left - bounds.width / 2,
        y: event.clientY - bounds.top - bounds.height / 2,
      });
    };
    // Niepasywny listener zatrzymuje przewijanie i natywny zoom strony wewnątrz podglądu.
    stage.addEventListener("wheel", wheel, { passive: false });
    const observer = new ResizeObserver(() => applyView(viewRef.current));
    observer.observe(stage);
    observer.observe(image);
    return () => {
      stage.removeEventListener("wheel", wheel);
      observer.disconnect();
    };
  }, [applyView, zoomTo]);

  function point(event: PointerEvent<HTMLDivElement>): Point {
    const bounds = event.currentTarget.getBoundingClientRect();
    return {
      x: event.clientX - bounds.left - bounds.width / 2,
      y: event.clientY - bounds.top - bounds.height / 2,
    };
  }

  function startGesture() {
    const points = [...pointers.current.values()].slice(0, 2);
    gesture.current = points.length ? { points, view: { ...viewRef.current } } : null;
    setDragging(points.length > 0 && (viewRef.current.scale > 1 || points.length > 1));
  }

  function endPointer(event: PointerEvent<HTMLDivElement>) {
    if (!pointers.current.delete(event.pointerId)) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    startGesture();
  }

  function isInsideImage(clientX: number, clientY: number) {
    const bounds = imageRef.current?.getBoundingClientRect();
    return (
      !!bounds &&
      clientX >= bounds.left &&
      clientX <= bounds.right &&
      clientY >= bounds.top &&
      clientY <= bounds.bottom
    );
  }

  return (
    <>
      <div
        ref={stageRef}
        className={`photo-preview-stage zoomable-preview-stage${view.scale > 1 ? " is-zoomed" : ""}${dragging ? " is-dragging" : ""}`}
        onPointerDown={(event) => {
          if (event.pointerType === "mouse" && event.button !== 0) return;
          if (!pointers.current.size) moved.current = false;
          pointers.current.set(event.pointerId, point(event));
          if (viewRef.current.scale > 1 || event.pointerType !== "mouse")
            event.currentTarget.setPointerCapture(event.pointerId);
          startGesture();
        }}
        onPointerMove={(event) => {
          if (!pointers.current.has(event.pointerId) || !gesture.current) return;
          pointers.current.set(event.pointerId, point(event));
          const points = [...pointers.current.values()].slice(0, 2);
          const start = gesture.current;
          if (points.length === 2 && start.points.length === 2) {
            const distance = (items: Point[]) =>
              Math.hypot(items[1].x - items[0].x, items[1].y - items[0].y);
            const midpoint = (items: Point[]) => ({
              x: (items[0].x + items[1].x) / 2,
              y: (items[0].y + items[1].y) / 2,
            });
            const scale = Math.min(
              maxZoom,
              Math.max(
                1,
                start.view.scale * (distance(points) / Math.max(1, distance(start.points))),
              ),
            );
            const origin = midpoint(start.points);
            const center = midpoint(points);
            const ratio = scale / start.view.scale;
            moved.current = true;
            applyView({
              scale,
              x: center.x - (origin.x - start.view.x) * ratio,
              y: center.y - (origin.y - start.view.y) * ratio,
            });
          } else if (points.length === 1 && start.view.scale > 1) {
            const dx = points[0].x - start.points[0].x;
            const dy = points[0].y - start.points[0].y;
            if (Math.hypot(dx, dy) > 3) moved.current = true;
            applyView({ ...start.view, x: start.view.x + dx, y: start.view.y + dy });
          }
        }}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
        onLostPointerCapture={endPointer}
        onClick={(event) => {
          if (moved.current || viewRef.current.scale > 1) return;
          // Przechwycony gest dotykowy może kierować kliknięcie do sceny zamiast do zdjęcia.
          if (!isInsideImage(event.clientX, event.clientY)) onBackdropClick();
        }}
        onDoubleClick={(event) => {
          if (!isInsideImage(event.clientX, event.clientY)) return;
          zoomTo(viewRef.current.scale > 1 ? 1 : 2, {
            x:
              event.clientX -
              event.currentTarget.getBoundingClientRect().left -
              event.currentTarget.clientWidth / 2,
            y:
              event.clientY -
              event.currentTarget.getBoundingClientRect().top -
              event.currentTarget.clientHeight / 2,
          });
        }}
      >
        <Image
          ref={imageRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="photo-preview-image"
          style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}
          unoptimized
          loading="eager"
          draggable={false}
          onDragStart={(event) => event.preventDefault()}
        />
      </div>
      <div
        className="photo-preview-controls artwork-zoom-controls"
        role="group"
        aria-label="Powiększenie obrazu"
      >
        <button
          type="button"
          className="photo-preview-button"
          aria-label="Oddal obraz"
          disabled={view.scale <= 1}
          onClick={() => zoomTo(viewRef.current.scale - 0.5)}
        >
          <ZoomOut size={22} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="photo-preview-button artwork-zoom-reset"
          aria-label="Dopasuj obraz do ekranu"
          onClick={() => applyView(initialView)}
        >
          <RotateCcw size={18} aria-hidden="true" />
          <span aria-live="polite">{Math.round(view.scale * 100)}%</span>
        </button>
        <button
          type="button"
          className="photo-preview-button"
          aria-label="Przybliż obraz"
          disabled={view.scale >= maxZoom}
          onClick={() => zoomTo(viewRef.current.scale + 0.5)}
        >
          <ZoomIn size={22} aria-hidden="true" />
        </button>
      </div>
    </>
  );
}
