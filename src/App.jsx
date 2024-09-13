import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Nav from "./components/Nav";

function App() {
  return (
    <>
      <Header />
      <div className="flex min-h-[90vh] justify-start pt-[60px]">
        <Nav />
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default App;
