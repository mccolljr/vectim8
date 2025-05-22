// import { JSX } from "preact";
// import { useCallback } from "preact/hooks";
// import { batch, Signal, useComputed, useSignal, useSignalEffect } from "@preact/signals";

// export interface SVGCanvasProps {
//   style?: JSX.SVGAttributes["style"];
//   class?: JSX.SVGAttributes["class"];

//   viewZoom: Signal<number>;
//   viewCenterX: Signal<number>;
//   viewCenterY: Signal<number>;
// }

// export const SVGCanvas = ({ viewZoom, viewCenterX, viewCenterY, ...passthrough }: SVGCanvasProps) => {
//   const svgElem = useSignal<SVGSVGElement | null>(null);
//   const setSvgElem = useCallback((el: SVGSVGElement | null) => {
//     svgElem.value = el;
//   }, []);

//   const viewWidth = useSignal(0.0);
//   const viewHeight = useSignal(0.0);
//   const canvasViewBox = useComputed(() => {
//     const w = viewWidth.value / viewZoom.value;
//     const h = viewHeight.value / viewZoom.value;
//     const x = viewCenterX.value - w / 2.0;
//     const y = viewCenterY.value - h / 2.0;
//     return `${x} ${y} ${w} ${h}`;
//   });

//   const pageToCanvas = useCallback((x: number, y: number) => {}, []);
//   const canvasToPage = useCallback((x: number, y: number) => {}, []);

//   useSignalEffect(() => {
//     const el = canvasEl.value;
//     if (!el) return;

//     const controller = new AbortController();

//     const observer = new ResizeObserver(([{ contentRect }]) =>
//       batch(() => {
//         canvasWidth.value = contentRect.width;
//         canvasHeight.value = contentRect.height;
//       }),
//     );
//     observer.observe(el);
//     controller.signal.addEventListener("abort", () => observer.disconnect());

//     let isDragging = false;
//     let dragX = 0;
//     let dragY = 0;

//     el.addEventListener(
//       "mouseup",
//       (evt: MouseEvent) => {
//         isDragging = false;
//       },
//       { signal: controller.signal },
//     );

//     el.addEventListener(
//       "mousedown",
//       (evt: MouseEvent) => {
//         isDragging = true;
//         dragX = evt.offsetX;
//         dragY = evt.offsetY;
//       },
//       { signal: controller.signal },
//     );

//     el.addEventListener(
//       "mousemove",
//       (evt: MouseEvent) => {
//         if (!isDragging) return;
//         dragX = evt.offsetX;
//         dragY = evt.offsetY;
//         console.log(dragX, dragY);
//       },
//       { signal: controller.signal, capture: true },
//     );

//     return () => controller.abort();
//   });

//   return (
//     <svg ref={setCanvasEl} width={canvasWidth} height={canvasHeight} viewBox={canvasViewBox} {...passthrough}></svg>
//   );
// };
