import "./style/index.scss";
import "./assets/icofont/icofont.min.css";

import { render } from "preact";
import { useEffect, useMemo, useRef } from "preact/hooks";
import { ContextMenu, ContextMenuImpl, ContextMenuItem } from "./ui/ContextMenu";

import { computePosition, flip, shift } from "@floating-ui/dom";
import { createAbortContext } from "./utils";
// const useDebouncedSignal = <T extends unknown>(debounceTime: number, initialValue: T): Signal<T> => {
//   class DebouncedSignal<T> extends Signal<T> {
//     private pendingValue?: T;
//     private pendingTimer?: ReturnType<typeof setTimeout>;

//     constructor(
//       private readonly debounceTime: number,
//       initialValue: T,
//     ) {
//       super(initialValue);
//     }

//     override set value(v: T) {
//       this.pendingValue = v;
//       if (this.pendingTimer) return;

//       this.pendingTimer = setTimeout(() => {
//         if (this.pendingValue) {
//           super["value"] = this.pendingValue;
//           this.pendingValue = undefined;
//         }

//         this.pendingTimer = undefined;
//       }, this.debounceTime);
//     }

//     override get value() {
//       return super["value"];
//     }
//   }

//   return useMemo(() => new DebouncedSignal(debounceTime, initialValue), []);
// };

// interface PopUpMenuItemDef {
//   text: string;
//   tooltip?: string;
//   onClick?: () => void;
//   subItems?: PopUpMenuItemDef[];
// }

// const _PopUpMenuItemSimple = ({ text, tooltip, onClick }: Omit<PopUpMenuItemDef, "subItems">) => {
//   return (
//     <li title={tooltip} onClick={onClick}>
//       {text}
//     </li>
//   );
// };

// const _PopUpMenuItemNested = ({
//   text,
//   tooltip,
//   subItems,
//   parentVisible,
// }: Omit<PopUpMenuItemDef, "onClick"> & { parentVisible: ReadonlySignal<boolean> }) => {
//   const triggerElem = useSignal<HTMLLIElement | null>(null);
//   const setTriggerElem = useCallback((el: HTMLLIElement | null) => {
//     triggerElem.value = el;
//   }, []);

//   const subMenuElem = useSignal<HTMLUListElement | null>(null);
//   const setSubMenuElem = useCallback((el: HTMLUListElement | null) => {
//     subMenuElem.value = el;
//   }, []);

//   const cursorOverTrigger = useSignal(false);
//   const subMenuActive = useComputed(() => parentVisible.value && cursorOverTrigger.value);
//   const subMenuPosition = useSignal({ clientX: 0, clientY: 0 });

//   useSignalEffect(() => {
//     if (triggerElem.value == null) return;
//     if (subMenuElem.value == null) return;

//     const { signal, abort } = createAbortContext();

//     triggerElem.value.addEventListener(
//       "mouseover",
//       () => {
//         console.log("mouse over trigger");
//         cursorOverTrigger.value = true;
//       },
//       { signal, passive: true },
//     );
//     triggerElem.value.addEventListener(
//       "mouseout",
//       () => {
//         console.log("mouse NOT over trigger");
//         cursorOverTrigger.value = false;
//       },
//       { signal, passive: true },
//     );

//     // subMenuElem.value.addEventListener(
//     //   "mouseover",
//     //   () => {
//     //     console.log("mouse over whole sub-menu");
//     //     cursorOverSubMenu.value = true;
//     //   },
//     //   { signal, passive: true },
//     // );
//     // subMenuElem.value.addEventListener(
//     //   "mouseout",
//     //   () => {
//     //     console.log("mouse NOT over whole sub-menu");
//     //     cursorOverSubMenu.value = false;
//     //   },
//     //   { signal, passive: true },
//     // );

//     return () => abort();
//   });

//   useSignalEffect(() => {
//     console.log("subMenuActive: ", subMenuActive.value);
//     if (!subMenuActive.value || triggerElem.value == null || subMenuElem.value == null) {
//       return;
//     }
//     computePosition(triggerElem.value, subMenuElem.value, {
//       placement: "right-start",
//       middleware: [flip(), shift()],
//     }).then(({ x, y }) => {
//       subMenuPosition.value = { clientX: x, clientY: y };
//     });
//   });

//   return (
//     <li title={tooltip} ref={setTriggerElem}>
//       {text} <i class="icofont-caret-right"></i>
//       <PopUpMenu active={subMenuActive} position={subMenuPosition} items={subItems!} elemRef={setSubMenuElem} />
//     </li>
//   );
// };

// const PopUpMenu = ({
//   position,
//   active,
//   items,
//   elemRef,
// }: {
//   position: ReadonlySignal<{ clientX: number; clientY: number }>;
//   active: ReadonlySignal<boolean>;
//   items: PopUpMenuItemDef[];
//   elemRef?: Ref<HTMLUListElement>;
// }) => {
//   const actualActive = useSignal(false);
//   useSignalEffect(() => {
//     actualActive.value = active.value;
//   });

//   useEffect(() => {
//     const { signal, abort } = createAbortContext();

//     let seenOnce = false;
//     const unsubscribe = actualActive.subscribe(() => (seenOnce = false));
//     signal.addEventListener("abort", () => unsubscribe());

//     window.addEventListener(
//       "mouseup",
//       () => {
//         if (!actualActive.value) return;

//         if (seenOnce) {
//           actualActive.value = false;
//         } else {
//           seenOnce = true;
//         }
//       },
//       { signal, passive: true },
//     );

//     return () => abort();
//   }, []);

//   const menuStyle = useComputed<Partial<JSX.CSSProperties>>(() => ({
//     display: actualActive.value ? "block" : "none",
//     position: "fixed",
//     left: position.value.clientX,
//     top: position.value.clientY,
//   }));

//   return (
//     <ul class="popup-menu" style={menuStyle.value} ref={elemRef}>
//       {items.map((def) =>
//         def.subItems ? (
//           <_PopUpMenuItemNested {...def} parentVisible={actualActive} />
//         ) : (
//           <_PopUpMenuItemSimple {...def} />
//         ),
//       )}
//     </ul>
//   );
// };

const Main = () => {
  const menuItems = useMemo<ContextMenuItem[]>(
    () => [
      {
        text: "wow it works",
        onClick: () => {
          console.log("frfr");
        },
      },
      {
        text: "it works x2",
        items: [
          {
            text: "it works x3",
            items: [
              {
                text: "it works x4",
                onClick: () => {
                  console.log("wow!");
                },
              },
            ],
          },
          {
            text: "it works x5",
            items: [
              {
                text: "it works x6",
                onClick: () => {
                  console.log("wow 2!");
                },
              },
            ],
          },
        ],
      },
    ],
    [],
  );

  const menuHandle = useRef<ContextMenuImpl | null>(null);
  useEffect(() => {
    const { signal, abort } = createAbortContext();
    window.addEventListener(
      "contextmenu",
      (evt) => {
        if (!menuHandle.current) return;

        console.log("contextmenu event!");
        evt.preventDefault();

        computePosition(
          { getBoundingClientRect: () => new DOMRect(evt.clientX, evt.clientY, 1, 1) },
          menuHandle.current.getRootElement(),
          {
            placement: "right",
            strategy: "fixed",
            middleware: [flip(), shift()],
          },
        ).then(({ x, y }) => {
          menuHandle.current?.activate(x, y);
        });
      },
      { signal },
    );

    return () => abort();
  }, []);

  return (
    <>
      <button class="primary">primary</button>
      <button class="secondary">secondary</button>
      <button class="warning">warning</button>
      <button class="danger">danger</button>
      <button class="success">success</button>
      <button class="info">info</button>
      <button class="dark">dark</button>
      <button class="light">light</button>
      <button class="clear">clear</button>

      <button class="primary rounded">primary rounded</button>
      <button class="secondary rounded">secondary rounded</button>
      <button class="success rounded">&nbsp;&nbsp;&nbsp;</button>
      <ContextMenu items={menuItems} menuRef={menuHandle} />
    </>
  );
};

document.addEventListener("DOMContentLoaded", () => {
  render(<Main />, document.body);
});
