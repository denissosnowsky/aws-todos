import { CognitoUser, CognitoUserSession } from "amazon-cognito-identity-js";

export type AuthContextType = {
  isAuth: boolean;
  formError: string;
  errorAlert: string;
  successAlert: string;
  loadingAuth: boolean;
  isConfirmAccountPage: boolean;
  logout: () => void;
  setFormError: (arg: string) => void;
  setErrorAlert: (arg: string) => void;
  setSuccessAlert: (arg: string) => void;
  setLoadingAuth: (arg: boolean) => void;
  setIsConfirmAccountPage: (arg: boolean) => void;
  confirmAccountEmail: (code: string) => Promise<unknown>;
  signUp: (Username: string, Password: string) => Promise<unknown>;
  signIn: (Username: string, Password: string) => Promise<unknown>;
  changePassword: (
    oldPassword: string,
    newPassword: string
  ) => Promise<unknown>;
  getSession: () => Promise<{
    user: CognitoUser;
    session: CognitoUserSession | null;
  }>;
};
