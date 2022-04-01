import React, { createContext, FC, useMemo, useState } from "react";

import { AuthContextType } from "./types/authContextStateType";
import { AuthContextState } from "./utils/authContextState";

const AuthContext = createContext<AuthContextType | null>(null);

const AuthContextProvider: FC = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [formError, setFormError] = useState("");
  const [errorAlert, setErrorAlert] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [successAlert, setSuccessAlert] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [isConfirmAccountPage, setIsConfirmAccountPage] = useState(false);

  const authContextStateParams = {
    isAuth,
    userEmail,
    formError,
    errorAlert,
    loadingAuth,
    successAlert,
    userPassword,
    isConfirmAccountPage,
    setIsAuth,
    setUserEmail,
    setFormError,
    setErrorAlert,
    setLoadingAuth,
    setUserPassword,
    setSuccessAlert,
    setIsConfirmAccountPage,
  };

  const AuthContextStateInstance = useMemo(
    () => new AuthContextState(authContextStateParams),
    Object.values(authContextStateParams)
  );

  return (
    <AuthContext.Provider
      value={{
        logout: AuthContextStateInstance.logout,
        signUp: AuthContextStateInstance.signUp,
        signIn: AuthContextStateInstance.signIn,
        getSession: AuthContextStateInstance.getSession,
        setFormError: AuthContextStateInstance.setFormError,
        setErrorAlert: AuthContextStateInstance.setErrorAlert,
        changePassword: AuthContextStateInstance.changePassword,
        setLoadingAuth: AuthContextStateInstance.setLoadingAuth,
        setSuccessAlert: AuthContextStateInstance.setSuccessAlert,
        confirmAccountEmail: AuthContextStateInstance.confirmAccountEmail,
        setIsConfirmAccountPage: AuthContextStateInstance.setIsConfirmAccountPage,
        isAuth: AuthContextStateInstance.isAuth,
        formError: AuthContextStateInstance.formError,
        errorAlert: AuthContextStateInstance.errorAlert,
        loadingAuth: AuthContextStateInstance.loadingAuth,
        successAlert: AuthContextStateInstance.successAlert,
        isConfirmAccountPage: AuthContextStateInstance.isConfirmAccountPage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export { AuthContextProvider, AuthContext };
