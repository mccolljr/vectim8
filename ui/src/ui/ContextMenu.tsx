import { JSX, Ref } from "preact";
import { batch, Signal, useComputed, useSignal, useSignalEffect } from "@preact/signals";
import { useImperativeHandle, useCallback, useRef, useMemo } from "preact/hooks";
import { createAbortContext } from "../utils";
import { computePosition, flip, shift } from "@floating-ui/dom";

export interface ContextMenuItemSimple {
  text: string;
  onClick: () => void;
  tooltip?: string;
}

const isSimpleItem = (c: ContextMenuItem): c is ContextMenuItemSimple => "onClick" in c;

export interface ContextMenuItemNested {
  text: string;
  items: ContextMenuItem[];
  tooltip?: string;
}

const isNestedItem = (c: ContextMenuItem): c is ContextMenuItemNested => "items" in c;

export type ContextMenuItem = ContextMenuItemSimple | ContextMenuItemNested;

export interface ContextMenuImpl {
  activate(clientX: number, clientY: number): void;
  deactivate(): void;
  getRootElement(): HTMLElement;
}

const _SimpleItem = ({ i }: { i: ContextMenuItemSimple }) => {
  return (
    <li class="simple" onClick={i.onClick} title={i.tooltip}>
      {i.text}
    </li>
  );
};

const useDebouncedSignal = <T extends unknown>(debounceTime: number, initialValue: T): Signal<T> => {
  const inner = useSignal(initialValue);
  const debounceValue = useRef<T | undefined>();
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | undefined>();

  return useMemo(
    () => ({
      get value() {
        return inner.value;
      },
      set value(v: T) {
        debounceValue.current = v;
        if (debounceTimer.current != null) return;

        debounceTimer.current = setTimeout(() => {
          debounceTimer.current = undefined;
          inner.value = debounceValue.current!;
          console.log("debounced set applied: ", inner.value);
        }, debounceTime);
      },
      brand: inner.brand,
      peek: inner.peek.bind(inner),
      toJSON: inner.toJSON.bind(inner),
      valueOf: inner.valueOf.bind(inner),
      subscribe: inner.subscribe.bind(inner),
    }),
    [inner, debounceValue, debounceTime],
  );
};

const _NestedItem = ({ i }: { i: ContextMenuItemNested }) => {
  const isHovering = useDebouncedSignal(250, false);
  const triggerRef = useRef<HTMLLIElement | null>(null);
  const submenuRef = useRef<ContextMenuImpl | null>(null);

  useSignalEffect(() => {
    if (!triggerRef.current) return;
    if (!submenuRef.current) return;

    if (isHovering.value) {
      computePosition(triggerRef.current, submenuRef.current.getRootElement(), {
        placement: "right-start",
        strategy: "fixed",
        middleware: [flip(), shift()],
      }).then(({ x, y }) => {
        console.log("activating sub-menu");
        submenuRef.current?.activate(x, y);
      });
    } else {
      console.log("deactivating sub-menu");
      submenuRef.current?.deactivate();
    }
  });

  const mouseOver = useCallback(() => (isHovering.value = true), []);
  const mouseOut = useCallback(() => (isHovering.value = false), []);

  return (
    <li class="nested" title={i.tooltip} ref={triggerRef} onMouseOver={mouseOver} onMouseOut={mouseOut}>
      {i.text}
      <i class="icofont-caret-right"></i>

      <ContextMenu menuRef={submenuRef} items={i.items} />
    </li>
  );
};

export const ContextMenu = ({ items, menuRef }: { items: ContextMenuItem[]; menuRef: Ref<ContextMenuImpl> }) => {
  const active = useSignal(false);
  const position = useSignal<[number, number]>([0, 0]);
  const rootElem = useRef<HTMLElement | null>(null);

  const activate = useCallback(
    (clientX: number, clientY: number) =>
      batch(() => {
        console.log(`ContextMenu activated at ${clientX},${clientY}`);
        active.value = true;
        position.value = [clientX, clientY];
      }),
    [],
  );

  const deactivate = useCallback(() => {
    active.value = false;
  }, []);

  const getRootElement = useCallback(() => {
    return rootElem.current!;
  }, []);

  useImperativeHandle(menuRef, () => ({ activate, deactivate, getRootElement }), [
    activate,
    deactivate,
    getRootElement,
  ]);

  const elemRef = useCallback((elem: HTMLUListElement | null) => {
    rootElem.current = elem;
    if (!rootElem.current) return;

    const { signal, abort } = createAbortContext();

    window.addEventListener(
      "click",
      () => {
        if (active.value) {
          active.value = false;
        }
      },
      { signal, passive: true },
    );

    return () => abort();
  }, []);

  const style = useComputed<JSX.CSSProperties>(() => ({
    display: active.value ? "block" : "none",
    position: "fixed",
    top: position.value[1],
    left: position.value[0],
  }));

  return (
    <ul class="popup-menu" ref={elemRef} style={style.value}>
      {items.map((i) => (isSimpleItem(i) ? <_SimpleItem i={i} /> : <_NestedItem i={i} />))}
    </ul>
  );
};
