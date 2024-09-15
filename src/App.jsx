import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Nav from "./components/Nav";
import { GlobalProvider } from "./context/GlobalContext"; // 正確導入 GlobalProvider

function App() {
  return (
    <GlobalProvider>
      <Header />
      <div className="flex min-h-[90vh] justify-start">
        <Nav />
        <Outlet />
      </div>
      <Footer />
    </GlobalProvider>
  );
}

export default App;
