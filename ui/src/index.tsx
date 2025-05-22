import "./style/main.scss";

import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { render } from "preact";

import { AppStateProvider } from "./state/AppState";
import { App } from "./components/App";

const Main = () => {
  return (
    <AppStateProvider>
      <App />
    </AppStateProvider>
  );
};

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("vectim8");

  render(<Main />, document.body);
});
