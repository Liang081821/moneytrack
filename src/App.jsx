import { Outlet } from "react-router-dom";
import Header from "./components/Header";
// import Footer from "./components/Footer";
import Nav from "./components/Nav";
// import RightNav from "./components/RightNav";

function App() {
  return (
    <>
      <Header />
      <div className="mt-[80px] flex min-h-[100vh] items-stretch justify-start">
        <Nav className="h-auto" />
        <Outlet />
        {/* <RightNav /> */}
      </div>
      {/* <Footer /> */}
    </>
  );
}

export default App;
