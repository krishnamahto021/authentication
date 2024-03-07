import React from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { router } from "./router";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const App = () => {
  return (
    <>
      <Provider store={store}>
        <ToastContainer />
        <RouterProvider router={router} />
      </Provider>
    </>
  );
};

export default App;
