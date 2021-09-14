import decode from "jwt-decode";

class AuthService {
  // get user data from JSON web token
  getUser() {
    return decode(this.getToken());
  }

  // return true or false if token exists
  loggedIn() {
    const token = this.getToken();
    return token ? true : false;
  }

  // retrieve user token from localStorage
  getToken() {
    return localStorage.getItem("id_token");
  }

  // save user token to localStorage and reloads app
  login(idToken, user) {
    localStorage.setItem("id_token", idToken);
    localStorage.setItem("user", JSON.stringify(user));
  }

  // clears token from localStorage and relaods app
  logout() {
    localStorage.removeItem("id_token");
  }
}

export default new AuthService();
