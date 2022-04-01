import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import { AuthContext } from "./contexts/AuthContext";
import { Home } from "./pages/home/home";
import { Auth } from "./pages/auth/auth";
import { Navbar } from "./components/navbar/navbar";
import { Password } from "./pages/password/password";
import { Loading } from "./components/loading/loading";
import { AlertLayout } from "./components/AlertLayout/alertLayout";

function App() {
  const { isAuth, getSession, logout, successAlert } = useContext(AuthContext)!;
  const [isInitializing, setUsInitializing] = useState(true);

  useEffect(() => {
    const isUserAuth = async () => {
      try {
        const session = await getSession();
        if (session) {
          console.log(session);
        }
        setUsInitializing(false);
      } catch (e) {
        console.log(e);
        setUsInitializing(false);
      }
    };
    isUserAuth();

    const token = localStorage.getItem("aws-token");
    if(!token){
      logout();
    }
  }, []);

  if (isInitializing) {
    return <Loading isFull />;
  }

  return (
    <AlertLayout type="success" text={successAlert}> 
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
