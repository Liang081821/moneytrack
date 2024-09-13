import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import App from "./App";
import Accounting from "./pages/Accounting";
import Analysis from "./pages/Analysis";
import Property from "./pages/Property";
import PersonalInformation from "./pages/PersonalInformation";
import Project from "./pages/Project";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route path="/accounting" element={<Accounting />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/property" element={<Property />} />
        <Route path="/personalinformation" element={<PersonalInformation />} />
        <Route path="/project" element={<Project />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  </BrowserRouter>,
);
