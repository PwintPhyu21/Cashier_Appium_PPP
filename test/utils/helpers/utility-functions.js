// const HomeScreen = require('../screenobjects/home-screen');
// const configModule = require('../../wdio.conf');
// const { remote } = require('webdriverio');
// const Scroll = require('./custom-scroll');

class Utility {

	async testFunc() {
		console.log(await InterviewProcess.phoneNoPrefixSpinner.getAttribute('resource-id'))
	}

	async scrollToBeginning(className = 'android.widget.ScrollView') {
		const query = `android=new UiScrollable(new UiSelector().classNameMatches(\".*${className}.*\").scrollable(true)).scrollToBeginning(1,5)`;
		await $(query);
	}

	async scrollToEndByClass(className = 'android.widget.ScrollView') {
		const findByClass = `android=new UiScrollable(new UiSelector().classNameMatches(\".*${className}.*\").scrollable(true)).scrollToEnd(1,5)`;
		await $(findByClass);
	}

	async drawSignature() {
		const confirmSignBtn = await $('//*[@resource-id="com.hanamicrofinance.cashierapp.uat:id/btnDone"]')
        await confirmSignBtn.waitForExist({
          timeout: 3000,
          timeoutMsg: 'Confirm button in digital sign not found',
        });
        await browser.performActions([
            { type: 'pointer', id: 'finger1', parameters: { pointerType: 'touch' }, actions: [
              { type: 'pointerMove', duration: 0, x: 350, y: 900 },
              { type: 'pointerDown', button: 0 },
              { type: 'pause', duration: 10 },
              { type: 'pointerMove', duration: 500, x: 800, y: 1400 },
              { type: 'pointerUp', button: 0 }
            ]}
        ]);
      
        await confirmSignBtn.click();
      } 

	getRandomPos(min, max) {
		return Math.floor(Math.random() * (max - min)) * 100;
	}

}

export default new Utility()