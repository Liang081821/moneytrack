import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App";
import Accounting from "./pages/Accounting";
import Analysis from "./pages/Analysis";
import Property from "./pages/Property";
// import PersonalInformation from "./pages/PersonalInformation";
import Project from "./pages/Project";
import Login from "./pages/Login";
import "./index.css";
import { GlobalProvider } from "./context/GlobalContext";
import PrivateRoute from "./pages/Login/PrivateRoute";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <GlobalProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
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
          {/* <Route
            path="/personalinformation"
            element={<PersonalInformation />}
          /> */}
          <Route
            path="/project"
            element={
              <PrivateRoute>
                <Project />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </GlobalProvider>,
);
