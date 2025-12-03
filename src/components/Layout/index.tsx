import { Outlet } from "react-router";
import Header from "../common/Header";
import Footer from "../common/Footer";

const Layout = () => {
  return (
    <>
      <Header />
      <div className="">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default Layout;
