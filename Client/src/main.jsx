import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import ScrollToTop from "./components/common/ScrollToTop.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { Toaster } from "./components/ui/toaster.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <ScrollToTop />
    <Provider store={store}>
      <App />
      <Toaster />
    </Provider>
  </BrowserRouter>
);
