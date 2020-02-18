module.exports = class autoCodeRequestOptions {
  constructor(method, url, uri, uName, uPassword, veloSecurityCookie = '') {
    this.method = method;
    this.url = url;
    this.uri = uri;
    this.uName = uName;
    this.uPassword = uPassword;
    this.symbol = Symbol(uName);
    this.veloSecurityCookie = veloSecurityCookie;
    this.routeHistory = [`${this.url}${this.uri}`];
  }
  // Getters
  get options() {
    return this.requestOptions();
  }
  get identifier() {
    return this.requestSymbol();
  }

  // Setters

  // Methods
  requestOptions() {
    return {
      method: this.method,
      url: `${this.url}${this.uri}`,
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        username: this.uName,
        password: this.uPassword,
      },
      json: true,
    };
  }
  requestSymbol() {
    return this.symbol;
  }
};
