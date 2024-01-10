const { Builder } = require("selenium-webdriver");
const LoginPage = require('../pages/LoginPage');
const locator = require("../config/locators.json");
const data = require("../config/data.json");
const assert = require("assert");

const profile = locator.profile;
const video = locator.videos;
const editProfile = data.profile

describe('Profile Page Test', function () {
  let driver;
  let logIn;

  beforeEach(async function () {
    driver = await new Builder().forBrowser('chrome').build();
    logIn = new LoginPage(driver);
    await logIn.navigate(data.url);
    await logIn.maximizeWindow();
    await logIn.successfulLogin();
  })

  afterEach(async function () {
    await driver.quit();
  })

  it('Open the videos', async function () {
    await logIn.scrollDownAndClick(150, profile.javascriptVideos);
    await logIn.sleep(2); // change with explicit wait
    await logIn.assertTwoElementsExist(video.chooseVideo, video.titleJS);
  })

  it('Edit profile, correct date of birth', async function () {
    await logIn.findAndClick(profile.editProfileIcon);
    await logIn.findAndClick(profile.editDateOfBirth);
    await logIn.findAndSendKeys(profile.editDateOfBirth, editProfile.dateEdit); // format date that is entered: mm/dd/yyyy
    await logIn.findAndClick(profile.buttonEditSubmit);
    await logIn.sleep(2);
    const alert = await driver.switchTo().alert();
    await alert.accept();
    await logIn.sleep(2);
    const dateText = await logIn.getText(profile.dateOfBirth);
    assert.equal(dateText.includes(editProfile.date), true, "It is not the valid date that is entered");
  })
  it('Edit profile, date of birth is in the future', async function () {
    await logIn.findAndClick(profile.editProfileIcon);
    await logIn.findAndClick(profile.editDateOfBirth);
    await logIn.findAndSendKeys(profile.editDateOfBirth, editProfile.dateEdit2);
    await logIn.findAndClick(profile.buttonEditSubmit);
    await logIn.sleep(2);
    const alert = await driver.switchTo().alert();
    await alert.accept();
    await logIn.sleep(2); // change with explicit wait
    const dateText = await logIn.getText(profile.dateOfBirth);
    assert.equal(dateText.includes(editProfile.date2), false, "Date of birth can not be in the future");
  })

  it('Open Video Library and assert dropdown', async function () {
    await logIn.findAndClick(video.videoLibrary);
    await logIn.findAndClick(video.dropdown);
    await logIn.sleep(2); // change with explicit wait
    let dropdown = await logIn.find(video.dropdown); // Why is null??
    assert.equal(await dropdown.getAttribute('expanded'), ); 
  }) // AssertionError [ERR_ASSERTION]: null == 'true'
  // When dropdown is expended, locator dropdown is null

})
