const { Builder } = require("selenium-webdriver");
const LoginPage = require('../pages/LoginPage');
const locator = require("../config/locators.json");
const data = require("../config/data.json");
const assert = require("assert");

const invalidUser = data.invalidUser;
const login = locator.login
const profile = locator.profile;
const profileText = data.profile;

describe('Login Test', function () {
    let driver;
    let logIn;
  
    beforeEach(async function() {
      driver = await new Builder().forBrowser('chrome').build();
      logIn = new LoginPage(driver);
      await logIn.navigate(data.url);
      await logIn.maximizeWindow();
    })
  
    afterEach(async function() {
      await driver.quit();
    })

    it('Should log in successfully', async function() {
      await logIn.successfulLogin();
      // The link is the same and that's why some of the elements on the home page are asserted
      const profileName = await logIn.getText(profile.name);
      assert.equal(profileName.includes(profileText.nameText), true, "No profile text found on Home Page");
    })

    it('Should not log in successfully without a password', async function() {
      await logIn.invalidLogin(invalidUser.email, invalidUser.password);
      const requireEmail = await logIn.getText(login.emailHelperText);
      assert.equal(requireEmail.includes(invalidUser.requireEmailText), true, "Not caught error message 'Обавезно поље'");
    })

    it('Should not log in successfully with an invalid password', async function() {
      await logIn.invalidLogin(invalidUser.email2, invalidUser.password2);
      await logIn.sleep(4); // change with explicit wait
      const alertText = await logIn.getText(login.alertMessageText);
      assert.equal(alertText.includes(invalidUser.alertMessage), true, "Not caught error message 'Не постоји налог са овим креденцијалима'");
    })

    it('Clicking on the Forgot password opens a new Forgot password form', async function() {
      await logIn.scrollDownAndClick(150, login.forgotPassword);
      await logIn.sleep(3); // change with explicit wait
      await logIn.assertTwoElementsExist(login.emailInForgotPass, login.buttonInForgotPass, "This must be the Forgot Password Page");
    })

    it('Error in the form of the Forgot password', async function() {
      await logIn.scrollDownAndClick(150, login.forgotPassword);
      await logIn.sleep(3); // change with explicit wait
      await logIn.findAndSendKeys(login.emailInForgotPass, data.validUser.email);
      await logIn.findAndClick(login.buttonInForgotPass);
      await logIn.sleep(3); // change with explicit wait
      const alertText = await logIn.getText(login.alertInForgotPass);
      // Prepare to conflict on GitLab with Mirela :)
      assert.equal(alertText.includes(invalidUser.alertInForgotPass), true, "Not caught error message 'Error'");
    })

    it('Go to the form of the Forgot password and back', async function() {
      await logIn.scrollDownAndClick(150, login.forgotPassword);
      await logIn.sleep(3); // change with explicit wait
      await logIn.findAndClick(login.cancelForgotPassword);
      await logIn.sleep(2); // change with explicit wait
      await logIn.assertTwoElementsExist(login.email, login.password, "This must be the Login Page");
    })
})