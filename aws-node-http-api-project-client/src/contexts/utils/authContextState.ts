import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserSession,
} from "amazon-cognito-identity-js";

import Pool from "../../store/aws/userPool";
import apiService from "../../service/api.service";
import { notifyErrorAlert } from "../../utils/notifyErrorAlert";
import { notifySuccessAlert } from "../../utils/notifySuccessAlert";

export class AuthContextState {
  isAuth: boolean;
  userEmail: string;
  formError: string;
  errorAlert: string;
  successAlert: string;
  loadingAuth: boolean;
  userPassword: string;
  isConfirmAccountPage: boolean;
  setIsAuth: (arg: boolean) => void;
  setUserEmail: (arg: string) => void;
  setFormError: (arg: string) => void;
  setErrorAlert: (arg: string) => void;
  setUserPassword: (arg: string) => void;
  setSuccessAlert: (arg: string) => void;
  setLoadingAuth: (arg: boolean) => void;
  setIsConfirmAccountPage: (arg: boolean) => void;

  constructor(params: Record<string, any>) {
    this.isAuth = params.isAuth;
    this.userEmail = params.userEmail;
    this.formError = params.formError;
    this.errorAlert = params.errorAlert;
    this.loadingAuth = params.loadingAuth;
    this.successAlert = params.successAlert;
    this.userPassword = params.userPassword;
    this.isConfirmAccountPage = params.isConfirmAccountPage;
    this.setIsAuth = params.setIsAuth;
    this.setUserEmail = params.setUserEmail;
    this.setFormError = params.setFormError;
    this.setErrorAlert = params.setErrorAlert;
    this.setLoadingAuth = params.setLoadingAuth;
    this.setUserPassword = params.setUserPassword;
    this.setSuccessAlert = params.setSuccessAlert;
    this.setIsConfirmAccountPage = params.setIsConfirmAccountPage;
  }

  getSession = async () => {
    return await new Promise<{
      user: CognitoUser;
      session: CognitoUserSession | null;
    }>((resolve, reject) => {
      const user = Pool.getCurrentUser();
      if (user) {
        user.getSession(
          async (err: Error | null, session: CognitoUserSession | null) => {
            if (err) {
              this.setIsAuth(false);
              localStorage.removeItem("aws-token");
              reject(err);
            } else {
              this.setIsAuth(true);
              resolve({ user, session });
            }
          }
        );
      };
      reject("Not authorized");
    });
  };

  signIn = async (Username: string, Password: string) => {
    this.setLoadingAuth(true);
    return await new Promise((resolve, reject) => {
      const user = new CognitoUser({ Username, Pool });

      const authDetails = new AuthenticationDetails({ Username, Password });

      user.authenticateUser(authDetails, {
        onSuccess: (data) => {
          localStorage.setItem("aws-token", data.getIdToken().getJwtToken());
          resolve(data);
          this.setIsAuth(true);
          this.setUserEmail("");
          this.setUserPassword("");
          this.setLoadingAuth(false);
        },
        onFailure: (err) => {
          if (err.message === "User is not confirmed.") {
            this.setUserEmail(Username);
            this.setUserPassword(Password);
            this.setIsConfirmAccountPage(true);
          }
          this.setFormError(err.message);
          this.setLoadingAuth(false);
        },
      });
    });
  };

  signUp = async (Username: string, Password: string) => {
    this.setLoadingAuth(true);
    return await new Promise((resolve, reject) => {
      Pool.signUp(Username, Password, [], [], (err, data) => {
        if (err) {
          this.setFormError(
            err.message.indexOf("regular expression") !== -1
              ? "Password not long enough"
              : err.message.indexOf("Password") !== -1
              ? err.message.split(": ")[1]
              : err.message
          );
          this.setLoadingAuth(false);
        }
        if (data) {
          this.setUserEmail(Username);
          this.setUserPassword(Password);
          this.setIsConfirmAccountPage(true);
          this.setLoadingAuth(false);
          resolve(data);
        }
      });
    });
  };

  logout = () => {
    this.setLoadingAuth(false);
    const user = Pool.getCurrentUser();
    if (user) {
      user.signOut();
    }
    localStorage.removeItem("aws-token");
    this.setIsAuth(false);
  };

  confirmAccountEmail = async (code: string) => {
    this.setLoadingAuth(true);
    return await new Promise((resolve, reject) => {
      const userData = {
        Username: this.userEmail,
        Pool,
      };
      const cognitoUser = new CognitoUser(userData);

      cognitoUser.confirmRegistration(code, true, async (err, result) => {
        if (err) {
          this.setLoadingAuth(false);
          this.setFormError("Code is invalid");
          return;
        }
        try {
          await apiService.post(
            "https://w896wj0aol.execute-api.us-east-1.amazonaws.com/dev/users",
            {
              email: this.userEmail,
            }
          );

          await this.signIn(this.userEmail, this.userPassword);

          this.setLoadingAuth(false);
          this.setIsConfirmAccountPage(false);
          resolve(result);
        } catch (e) {
          this.setLoadingAuth(false);
          notifyErrorAlert(
            "Some error happened, try again",
            this.setErrorAlert
          );
        }
      });
    });
  };

  changePassword = async (oldPassword: string, newPassword: string) => {
    this.setLoadingAuth(true);
    return await new Promise(async (resolve, reject) => {
      try {
        const { user } = await this.getSession();
        user.changePassword(
          oldPassword,
          newPassword,
          (err: Error | undefined, result: string | undefined) => {
            if (err) {
              this.setLoadingAuth(false);
              this.setFormError(
                err.message.indexOf("regular expression") !== -1
                  ? "Password not long enough"
                  : err.message.indexOf("Password") !== -1
                  ? err.message.split(": ")[1]
                  : err.message
              );
            }
            if (result) {
              this.setLoadingAuth(false);
              notifySuccessAlert("Password was changed!", this.setSuccessAlert);
              resolve(result);
            }
          }
        );
      } catch (e) {
        this.setLoadingAuth(false);
        this.setFormError("Server error happened: try again");
      }
    });
  };
}
