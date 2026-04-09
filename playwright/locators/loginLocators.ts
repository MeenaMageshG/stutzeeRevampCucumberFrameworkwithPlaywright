import{ LocatorUtils } from "../utils/locatorUtils";
export const loginLocators = {
  username: LocatorUtils.ID("username-login"),
  password: LocatorUtils.ID("-password-login"),
  loginBtn: LocatorUtils.containsTextIn("button", "Login"),
  errorMsg: LocatorUtils.containsTextIn("p", "Login details are incorrect. Please check and try again.",1), 
};