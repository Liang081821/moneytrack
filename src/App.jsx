import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Nav from "./components/Nav";
// import RightNav from "./components/RightNav";

function App() {
  return (
    <>
      <Header />
      <div className="flex min-h-[90vh] justify-start">
        <Nav />
        <Outlet />
        {/* <RightNav /> */}
      </div>
      <Footer />
    </>
  );
}

export default App;
