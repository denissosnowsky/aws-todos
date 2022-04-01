import React, { createContext, FC, useState } from "react";
import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
} from "amazon-cognito-identity-js";
import axios from "axios";

import Pool from "../store/aws/userPool";

const AuthContext = createContext<{
  isAuth: boolean;
  loadingAuth: boolean;
  isConfirmAccountPage: boolean;
  formError: string;
  successAlert: string;
  logout: () => void;
  setFormError: (arg: string) => void;
  setSuccessAlert: (arg: string) => void;
  changePassword: (
    oldPassword: string,
    newPassword: string
  ) => Promise<unknown>;
  setLoadingAuth: (arg: boolean) => void;
  setIsConfirmAccountPage: (arg: boolean) => void;
  signUp: (Username: string, Password: string) => Promise<unknown>;
  confirmAccountEmail: (code: string) => Promise<unknown>;
  signIn: (Username: string, Password: string) => Promise<unknown>;
  getSession: () => Promise<{
    user: CognitoUser;
    session: CognitoUserSession | null;
  }>;
} | null>(null);

const AuthContextProvider: FC = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [isConfirmAccountPage, setIsConfirmAccountPage] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [successAlert, setSuccessAlert] = useState("");

  const getSession = async () => {
    return await new Promise<{
      user: CognitoUser;
      session: CognitoUserSession | null;
    }>((resolve, reject) => {
      const user = Pool.getCurrentUser();
      if (user) {
        user.getSession(
          async (err: Error | null, session: CognitoUserSession | null) => {
            if (err) {
              setIsAuth(false);
              localStorage.removeItem("aws-token");
              reject(err);
            } else {
              setIsAuth(true);
              resolve({ user, session });
            }
          }
        );
      } else {
        reject("Not authorized");
      }
    });
  };

  const signIn = async (Username: string, Password: string) => {
    setLoadingAuth(true);
    return await new Promise((resolve, reject) => {
      const user = new CognitoUser({ Username, Pool });

      const authDetails = new AuthenticationDetails({ Username, Password });

      user.authenticateUser(authDetails, {
        onSuccess: (data) => {
          localStorage.setItem("aws-token", data.getIdToken().getJwtToken());
          resolve(data);
          setIsAuth(true);
          setUserEmail("");
          setUserPassword("");
          setLoadingAuth(false);
        },
        onFailure: (err) => {
          setFormError(err.message);
          if (err.message === "User is not confirmed.") {
            setUserEmail(Username);
            setUserPassword(Password);
            setIsConfirmAccountPage(true);
          }
          setLoadingAuth(false);
        },
      });
    });
  };

  const signUp = async (Username: string, Password: string) => {
    setLoadingAuth(true);
    return await new Promise((resolve, reject) => {
      Pool.signUp(Username, Password, [], [], (err, data) => {
        if (err) {
          setFormError(
            err.message.indexOf("regular expression") !== -1
              ? "Password not long enough"
              : err.message.indexOf("Password") !== -1
              ? err.message.split(": ")[1]
              : err.message
          );
          setLoadingAuth(false);
        }
        if (data) {
          setUserEmail(Username);
          setUserPassword(Password);
          setIsConfirmAccountPage(true);
          setLoadingAuth(false);
          resolve(data);
        }
      });
    });
  };

  const logout = () => {
    setLoadingAuth(false);
    const user = Pool.getCurrentUser();
    if (user) {
      user.signOut();
    }
    setIsAuth(false);
    localStorage.removeItem("aws-token");
  };

  const confirmAccountEmail = async (code: string) => {
    setLoadingAuth(true);
    return await new Promise((resolve, reject) => {
      const userData = {
        Username: userEmail,
        Pool,
      };
      const cognitoUser = new CognitoUser(userData);

      cognitoUser.confirmRegistration(code, true, async function (err, result) {
        if (err) {
          setLoadingAuth(false);
          setFormError("Code is invalid");
          return;
        }
        try {
          await axios.post(
            "https://w896wj0aol.execute-api.us-east-1.amazonaws.com/dev/users",
            {
              email: userEmail,
            }
          );

          await signIn(userEmail, userPassword);

          setLoadingAuth(false);
          setIsConfirmAccountPage(false);
          resolve(result);
        } catch (e) {
          setLoadingAuth(false);
          console.error(e);
        }
      });
    });
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    setLoadingAuth(true);
    return await new Promise(async (resolve, reject) => {
      try {
        const { user } = await getSession();
        user.changePassword(
          oldPassword,
          newPassword,
          (err: Error | undefined, result: string | undefined) => {
            if (err) {
              setLoadingAuth(false);
              setFormError(
                err.message.indexOf("regular expression") !== -1
                  ? "Password not long enough"
                  : err.message.indexOf("Password") !== -1
                  ? err.message.split(": ")[1]
                  : err.message
              );
            }
            if (result) {
              setLoadingAuth(false);
              setSuccessAlert("Password was changed!");
              setTimeout(() => {
                setSuccessAlert("");
              }, 3000);
              resolve(result);
            }
          }
        );
      } catch (e) {
        setLoadingAuth(false);
        setFormError("Server error happened: try again");
      }
    });
  };

  return (
    <AuthContext.Provider
      value={{
        logout,
        signUp,
        signIn,
        getSession,
        setFormError,
        changePassword,
        setLoadingAuth,
        setSuccessAlert,
        confirmAccountEmail,
        setIsConfirmAccountPage,
        isAuth,
        formError,
        loadingAuth,
        successAlert,
        isConfirmAccountPage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export { AuthContextProvider, AuthContext };
