import "./style/index.scss";

import { JSX, render } from "preact";
import { useEffect } from "preact/hooks";
import { ReadonlySignal, Signal, useComputed, useSignal, useSignalEffect } from "@preact/signals";
import { computePosition } from "@floating-ui/dom";

const PopUpMenu = ({
  position,
  active,
}: {
  position: ReadonlySignal<{ clientX: number; clientY: number }>;
  active: Signal<boolean>;
}) => {
  useEffect(() => {
    let seenOnce = false;
    const unsubscribe = active.subscribe(() => (seenOnce = false));

    const deactivateMenu = () => {
      if (active.value) {
        if (seenOnce) {
          active.value = false;
        } else {
          seenOnce = true;
        }
      }
    };
    window.addEventListener("mouseup", deactivateMenu);

    return () => {
      unsubscribe();
      window.removeEventListener("mouseup", deactivateMenu);
    };
  }, []);

  const menuStyle = useComputed<Partial<JSX.CSSProperties>>(() => ({
    display: active.value ? "block" : "none",
    position: "fixed",
    left: position.value.clientX,
    top: position.value.clientY,
  }));

  return (
    <ul class="popup-menu" style={menuStyle.value}>
      <li title="some info" onClick={() => console.log("woohoo1")}>
        Create Point
      </li>
      <li title="some info 2" onClick={() => console.log("woohoo2")}>
        Remove Point
      </li>
      <li title="some info 3" onClick={() => console.log("woohoo3")}>
        Modify Point
      </li>
    </ul>
  );
};

const Main = () => {
  const menuActive = useSignal(false);
  const menuPosition = useSignal({ clientX: 0, clientY: 0 });

  useEffect(() => {
    window.addEventListener("contextmenu", (evt) => {
      evt.preventDefault();
      menuActive.value = !menuActive.value;
      menuPosition.value = { clientX: evt.clientX, clientY: evt.clientY };
    });
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
      <PopUpMenu position={menuPosition} active={menuActive} />
    </>
  );
};

document.addEventListener("DOMContentLoaded", () => {
  render(<Main />, document.body);
});
