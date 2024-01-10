const { until } = require("selenium-webdriver");
const assert = require("assert");

class BasePage {
    constructor(driver) { 
        this.driver = driver
    }

    async navigate(url) {
        await this.driver.get(url);
    }

    async maximizeWindow() {
        await this.driver.manage().window().maximize();
    }

    async sleep(seconds) {
        await this.driver.sleep(seconds * 1000);
    }
    async find(locator) {
        return this.driver.findElement(locator);
    }

    async findAndSendKeys(locator, text) {
        await (await this.find(locator)).sendKeys(text)
    }

    async findAndClick(locator) {
        await (await this.find(locator)).click();
    }

    async getText(locator) {
        return await (await this.find(locator)).getText();
    }

    async assertTwoElementsExist(e1, e2) {
        let errorMessage = '';
        try {
            await this.find(e1);
        } catch (error) {
            errorMessage += `Element with locator '${JSON.stringify(e1)}' was not found on the page. `;
        }
        try {
            await this.find(e2);
        } catch (error) {
            errorMessage += `Element with locator '${JSON.stringify(e2)}' was not found on the page. `;
        }
        if (errorMessage) {
            assert.fail(errorMessage);
        }
    }
    

    async scrollDownAndClick(number, element) {
        await this.driver.executeScript(`window.scrollBy(0, ${number})`, "");
        await this.findAndClick(element);
    }

    async waitForUrl(url, timeout = 1000) { // explicit wait
        await this.driver.wait(until.urlIs(url), timeout); 
    }

    async waitForVisibility(locator) { // explicit wait
        const element = await this.driver.wait(until.elementLocated(locator));
        await this.driver.wait(until.elementIsVisible(element));
    }

};

module.exports = BasePage