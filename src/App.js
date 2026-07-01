import "./App.css";
import React, { Suspense, useRef } from "react";
import { BrowserRouter } from "react-router-dom";
import { useEffect, useState } from "react";
import SiteLoader from "./views/components/SiteLoader";
import { message } from "antd";
import "./notification";
import commonObj from "./commonObj";
import service from "./services/auth";
import serviceConstatnt from "./services/constant";

import { Spin } from "antd";
import Loader from "./views/components/loader";
Spin.setDefaultIndicator(
  <div>
    <Loader />
  </div>
);
const LayoutAdmin = React.lazy(() => import("./views/layout/Layout"));
const Login = React.lazy(() => import("./views/pages/Login"));

function App() {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [ajxRequesting, setAjxRequesting] = useState(false);


  const didRun = useRef(false);
  useEffect(() => {
    if (didRun?.current) return;
    didRun.current = true;
    setAjxRequesting(true);

    console.log("Fetching constants and validating token");

    const fetchConstants = () =>
      serviceConstatnt.getConstant().then((res) => {
        // console.log("Constants response:", res.Constants);
        commonObj.constants = res?.Constants || {};
        console.log("Fetched constants:", commonObj);
      });

    const validateToken = () =>
      service.validateToken().then((res) => {
        // console.log("Token validation response:", res.data.role);
        commonObj.userType = res?.data?.role ||res?.role || "";
      });

    Promise.all([fetchConstants(), validateToken()])
      .then(() => {
        message.success("Login successful!");
        setIsLoggedin(true);
      })
      .catch((err) => {
        console.error("Initialization failed:", err);
        setIsLoggedin(false);
        window.localStorage.clear();
        // message.error("Initialization failed. Please login again.");
      })
      .finally(() => {
        setAjxRequesting(false);
      });
  }, []);

  return (
    <>
      <BrowserRouter basename="/">
        {!ajxRequesting ? (
          isLoggedin ? (
            <Suspense fallback={<SiteLoader />}>
              <LayoutAdmin />
            </Suspense>
          ) : (
            <Suspense fallback={<SiteLoader />}>
              <Login />
            </Suspense>
          )
        ) : (
          <SiteLoader />
        )}
      </BrowserRouter>
    </>
  );
}

export default App;

