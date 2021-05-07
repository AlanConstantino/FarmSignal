class Auth {
  constructor() {
    if (!localStorage.getItem('isLoggedIn')) {
      this.authenticated = false;
    } else {
      this.authenticated = localStorage.getItem('isLoggedIn');
    }
  }

  login(cb) {
    this.authenticated = true;
    cb();
  }

  logout() {
    this.authenticated = false;
    localStorage.clear();
  }

  isAuthenticated() {
    return this.authenticated;
  }
}

export default new Auth();
