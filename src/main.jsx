import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App";
import Accounting from "./pages/Accounting";
import Analysis from "./pages/Analysis";
import Property from "./pages/Property";
import PersonalInformation from "./pages/PersonalInformation";
import Project from "./pages/Project";
import Login from "./pages/Login";
import "./index.css";
import { GlobalProvider } from "./context/GlobalContext"; // 正確導入 GlobalProvider

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <GlobalProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<App />}>
          <Route path="/accounting" element={<Accounting />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/property" element={<Property />} />
          <Route
            path="/personalinformation"
            element={<PersonalInformation />}
          />
          <Route path="/project" element={<Project />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </GlobalProvider>,
);
