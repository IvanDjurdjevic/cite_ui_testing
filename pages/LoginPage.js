const { until } = require('selenium-webdriver');
const BasePage = require('./BasePage');
const data = require('../config/data.json');
const locator = require('../config/locators.json')

const validUser = data.validUser;
const login = locator.login;

class LoginPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.email = login.email;
    this.password = login.password;
    this.buttonLogin = login.buttonLogin
  }

  async successfulLogin() {
    await this.findAndSendKeys(this.email, validUser.email);
    await this.findAndSendKeys(this.password, validUser.password);
    await this.findAndClick(this.buttonLogin);
    await this.waitForVisibility(locator.profile.name);
  }

  async invalidLogin(email, password) {
    await this.findAndSendKeys(this.email, email);
    await this.findAndSendKeys(this.password, password);
    await this.findAndClick(this.buttonLogin);
  }

}

module.exports = LoginPage;
