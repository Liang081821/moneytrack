import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App";
import { GlobalProvider } from "./context/GlobalContext";
import { JoyrideProvider } from "./context/JoyrideContext";
import "./index.css";
import Accounting from "./pages/Accounting";
import Analysis from "./pages/Analysis";
import Login from "./pages/Login";
import Project from "./pages/Project";
import Property from "./pages/Property";

import PrivateRoute from "./pages/Login/PrivateRoute";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <GlobalProvider>
    <JoyrideProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <App />
              </PrivateRoute>
            }
          >
            <Route
              path="/accounting"
              element={
                <PrivateRoute>
                  <Accounting />
                </PrivateRoute>
              }
            />
            <Route
              path="/analysis"
              element={
                <PrivateRoute>
                  <Analysis />
                </PrivateRoute>
              }
            />
            <Route
              path="/property"
              element={
                <PrivateRoute>
                  <Property />
                </PrivateRoute>
              }
            />
            <Route
              path="/project"
              element={
                <PrivateRoute>
                  <Project />
                </PrivateRoute>
              }
            />

            <Route path="*" element={<Navigate to="/accounting" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </JoyrideProvider>
  </GlobalProvider>,
);
