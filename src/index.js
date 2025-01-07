import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

//router
import { BrowserRouter, createBrowserRouter, Route, RouterProvider, Routes } from "react-router-dom";
//store
import { Provider } from "react-redux";
//reducer
import { store } from "./store";

import Index from "./views/index";
import { IndexRouters } from "./router";
import { SimpleRouter } from "./router/simple-router";
import { DefaultRouter } from "./router/default-router";
import Default from "./layouts/dashboard/default";
import VideoPage from "./views/dashboard/VideoPage";

// const router = createBrowserRouter([
const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: <Index />,
  // },
  ...DefaultRouter,
  // ...IndexRouters,
  ...SimpleRouter
] ,{basename: process.env.PUBLIC_URL || "/YouTube" });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <App> */}
      <BrowserRouter basename={"/YouTube" || process.env.REACT_APP_PUBLIC_URL || process.env.PUBLIC_URL || "/YouTube"}>
        <App>
          {console.log('process.env.PUBLIC_URL', process.env.PUBLIC_URL, "|", process.env.REACT_APP_PUBLIC_URL)}
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/:categoryId/:videoId" element={<VideoPage />} />
          </Routes>
        </App>
      </BrowserRouter>
        {/* <RouterProvider router={router}></RouterProvider> */}
      {/* </App> */}
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
