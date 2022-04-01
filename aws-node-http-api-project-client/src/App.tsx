import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import { AuthContext } from "./contexts/AuthContext";
import { Home } from "./pages/home/home";
import { Auth } from "./pages/auth/auth";
import { Navbar } from "./components/navbar/navbar";
import { Password } from "./pages/password/password";
import { Loading } from "./components/loading/loading";
import { AlertLayout } from "./components/alertLayout/alertLayout";
import { notifyErrorAlert } from "./utils/notifyErrorAlert";

function App() {
  const { isAuth, getSession, successAlert, errorAlert, setErrorAlert } =
    useContext(AuthContext)!;
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const isUserAuth = async () => {
      try {
        await getSession();
      } catch (e) {
        return (
          e !== "Not authorized" &&
          notifyErrorAlert(JSON.stringify(e), setErrorAlert)
        );
      } finally {
        setIsInitializing(false);
      }
    };
    isUserAuth();
  }, []);

  if (isInitializing) {
    return <Loading isFull />;
  }

  return (
    <AlertLayout
      type={errorAlert ? "error" : "success"}
      text={errorAlert ? errorAlert : successAlert}
    >
      {!isAuth ? (
        <Auth />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <Navbar>
                  <Home />
                </Navbar>
              }
            />
            <Route
              path="/changePassword"
              element={
                <Navbar>
                  <Password />
                </Navbar>
              }
            />
          </Routes>
        </BrowserRouter>
      )}
    </AlertLayout>
  );
}

export default App;
