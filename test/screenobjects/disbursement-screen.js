//import {$,browser} from "@wdio/globals"
//var nrcClient= await $('//*[@resource-id="com.hanamicrofinance.cashierapp.uat:id/tvNrc"]');
class DisbursementScreen {
    // constructor(appType) {
    // this.appType = appType
    // this.MasterScreen = new MasterScreenClass(this.appType)
    //     }
   

    get toDisburseIcon() {
        return $('//*[@resource-id="com.hanamicrofinance.cashierapp.uat:id/tvDisbursementItemTitle"]');
    }

    async navigateToFirstIndividualInterview() {
        const disbursementIcon = await $('//*[@text="Disbursement"]');
        await disbursementIcon.waitForExist();
        await disbursementIcon.click();

        const DisbursementMainLabel = await $(`//*[@text="DISBURSEMENT"]`);
        await DisbursementMainLabel.waitForExist();

        const toDisburseIcon = await disbursementScreen.toDisburseIcon;
        await toDisburseIcon.waitForExist();
        await toDisburseIcon.click();

        const { individualLoansTab } = await driver.waitUntil(async () => {
    		const components = await $$('//*[@class="android.widget.LinearLayout"]');
            const individualLoans = await $('//*[@text="Individual Loans"]');
    

			if (components.length < 7) {
				return false;
			}

			return {
				//individualLoansTab: components[1]
                // Retrieve the text of the second content
                individualLoansTab: individualLoans


			}
		})

        console.table({ label: await individualLoansTab });
		await individualLoansTab.click()

		const { firstDisbursement } = await driver.waitUntil(async () => {
			const components = await $$('//*[@class="android.widget.RelativeLayout"]')

			if (components.length < 2) {
				return false 
			}

			if (components.length === 1) {
				throw new Error("No data found!")
			}

			return {
				firstDisbursement: components[1]
			}
		})
		await firstDisbursement.click()

    }

    async checkingNRC(){
        const btnKycChecking = await $('//*[@resource-id="com.hanamicrofinance.cashierapp.uat:id/btnKycChecking"]');
        await btnKycChecking.waitForExist();
        await btnKycChecking.click();
        this.fillNrc();

        const checkvalidation = await $('//*[@resource-id="com.hanamicrofinance.cashierapp.uat:id/btnValidateNrcNumber"]')
        await checkvalidation.click()

        // Find the radio button element by selector
        const radioButton = await $('//*[@resource-id="com.hanamicrofinance.cashierapp.uat:id/nrc_status"]');

        // Get the value of the selected attribute
        const isChecked = await radioButton.getAttribute('selected');

        // Assert or log the result
        if (isChecked === 'true') {
            console.log('NRC has been confirmed');
        } else {
            return false;
        }
    
    
    }

    
    async fillNrc(nrcClient) {
        //get client NRC from interview process and split
        const clientno = nrcClient
        var parts = clientno.match(/([A-Z][a-z]*)\((\w)\)(\d+)/);
    
        if (parts) {
            let [, name, number, type, code] = parts;
            var districtorregion=  name;
            var prefixNo = number;
            var NRCType = type;
            var NRCNumber = code;
        } else {
        console.log("No match found.");
        }

		const editNRC = await $(`//*[@resource-id='com.hanamicrofinance.cashierapp.uat:id/edtNrcNumber']`); 
        await editNRC.click();

        const MAX_STATE = 9
        const NRCSpinnerState =await $('//*[@resource-id="com.hanamicrofinance.cashierapp.uat:id/spinnerState"]');
		await NRCSpinnerState.waitForExist()
		NRCSpinnerState.click()

		//Enter State or Region for NRC
        const clientState = await driver.waitUntil(async () => {
			const dropdownItemList = await $$(InterviewProcess.tvDropDownTitleMultiple)
            const indexforState =document.getElementById(prefixNo)

			if (dropdownItemList.length < MAX_STATE) {
                return false
            } else {
                return dropdownItemList[indexforState]
            }
			
		})
		await clientState.click()

        //Enter Township for NRC
		const MAX_TOWNSHIP_CODE = 3
		await InterviewProcess.spinnerTownshipCode.click()
		const TownshipCode = await driver.waitUntil(async () => {
			const dropdownItemList = await $$(InterviewProcess.tvDropDownTitleMultiple)
            const indexforTownship =document.getElementById(districtorregion)

			if (dropdownItemList.length < MAX_TOWNSHIP_CODE) return false


			return dropdownItemList[indexforTownship]
		})
		await TownshipCode.click()
	
        //Enter NRC Type
		await InterviewProcess.spinnerNrcType.click()
		const MAX_TYPE = 2
		const NrcType = await driver.waitUntil(async () => {
			const dropdownItemList = await $$(InterviewProcess.tvDropDownTitleMultiple)
            const indexforType =document.getElementById(NRCType)

			if (dropdownItemList.length < MAX_TYPE) return false

			return dropdownItemList[indexforType]
		})
		await NrcType.click()
		

		//Enter NRC No
		await InterviewProcess.etNrcNo.setValue(NRCNumber)
		await $(`//*[@text="OK"]`).click()

	}

    async checkingClientPhoto(){
        await $(`//*[@text="Client Photo"]`).click()
        await $(`//*[@resource-id='com.hanamicrofinance.cashierapp.uat:id/btnYesClientPhoto']`).click()

        // Find the radio button element by selector
        const radioButton = await $('//*[@resource-id="com.hanamicrofinance.cashierapp.uat:id/client_photo_status"]');

        // Get the value of the selected attribute
        const isChecked = await radioButton.getAttribute('selected');

        // Assert or log the result
        if (isChecked === 'true') {
            console.log('Client Photo has been confirmed');
        } else {
            return false;
        }
        await $(`//*[@text="Client Photo"]`).click()
    }

    async checkingHouseholdList(){
        await Util.scrollToEndByClass()
        await $(`//*[@text="Household Lists"]`).click()
        await Util.scrollToEndByClass()
        await $(`//*[@resource-id="com.hanamicrofinance.cashierapp.uat:id/btnYesHhl"]`).click()

        // Find the radio button element by selector
        const radioButton = await $('//*[@resource-id="com.hanamicrofinance.cashierapp.uat:id/hhl_status"]');

        // Get the value of the selected attribute
        const isChecked = await radioButton.getAttribute('selected');

        // Assert or log the result
        if (isChecked === 'true') {
            console.log('Household list has been confirmed');
        } else {
            return false;
        }
    }

    async checkingClientSign(){
        await Util.scrollToEndByClass()
        await $(`//*[@text="Client Sign"]`).click()
        await Util.scrollToEndByClass()
        await $(`//*[@resource-id="com.hanamicrofinance.cashierapp.uat:id/btnYesClientSign"]`).click()

        // Find the radio button element by selector
        const radioButton = await $('//*[@resource-id="com.hanamicrofinance.cashierapp.uat:id/client_sign_status"]');

        // Get the value of the selected attribute
        const isChecked = await radioButton.getAttribute('selected');

        // Assert or log the result
        if (isChecked === 'true') {
            console.log('Client Sign has been confirmed');
        } else {
            return false;
        }
    }

    async checkingNgasayaMember(){
        await Util.scrollToEndByClass()
        await $(`//*[@text="Ngasaya Members"]`).click()
        await Util.scrollToEndByClass()
        await $(`//*[@resource-id="com.hanamicrofinance.cashierapp.uat:id/btnYesNgasayamember"]`).click()

        // Find the radio button element by selector
        const radioButton = await $('//*[@resource-id="com.hanamicrofinance.cashierapp.uat:id/ngasaya_member_status"]');

        // Get the value of the selected attribute
        const isChecked = await radioButton.getAttribute('selected');

        // Assert or log the result
        if (isChecked === 'true') {
            console.log('Ngasaya members have been confirmed');
        } else {
            return false;
        }
    }

    async checkingGuarantor(){
        await Util.scrollToEndByClass()
        await $(`//*[@text="Guarantor Photo"]`).click()
        await Util.scrollToEndByClass()
        await $(`//*[@resource-id="com.hanamicrofinance.cashierapp.uat:id/btnYesGuarantor"]`).click()

        // Find the radio button element by selector
        const radioButton = await $('//*[@resource-id="com.hanamicrofinance.cashierapp.uat:id/guarantor_status"]');

        // Get the value of the selected attribute
        const isChecked = await radioButton.getAttribute('selected');

        // Assert or log the result
        if (isChecked === 'true') {
            console.log('Guarantor photo has been confirmed');
        } else {
            return false;
        }
    }

    async checkingCoapplicant(){
        await Util.scrollToEndByClass()
        await $(`//*[@text="Coapplicant Photo"]`).click()
        await Util.scrollToEndByClass()
        await $(`//*[@resource-id="com.hanamicrofinance.cashierapp.uat:id/btnYesCa"]`).click()

        // Find the radio button element by selector
        const radioButton = await $('//*[@resource-id="com.hanamicrofinance.cashierapp.uat:id/ca_status"]');

        // Get the value of the selected attribute
        const isChecked = await radioButton.getAttribute('selected');

        // Assert or log the result
        if (isChecked === 'true') {
            console.log('Coapplicant Photo has been confirmed');
        } else {
            return false;
        }
        await $(`//*[@resource-id="com.hanamicrofinance.cashierapp.uat:id/btnContinue"]`).click()
    }

    async MakeDisbursenment(){

        // Find the button element by selector
        const disburseBtn = await $('//*[@resource-id="com.hanamicrofinance.cashierapp.uat:id/btnDisburse"]');

        // Get the value of the selected attribute
        const isChecked = await disburseBtn.getAttribute('selected');

        if (isChecked === 'true'){
            await disburseBtn.click()
        }

        else {
            console.log ("Unsuccessful KYC Checking")
            return false
        }
    }

    async makeSign(){
        
        await $('//*[@text="Client Signature"]').waitForExist({
			timeout: 15000,
		})
        await $('//*[@resource-id="com.hanamicrofinance.cashierapp.uat:id/signature"]').click()
		await Util.drawSignature()
        

        await $('//*[@text="Cashier Signature"]').waitForExist({
			timeout: 15000,
		})
        await $('//*[@resource-id="com.hanamicrofinance.cashierapp.uat:id/signature"]').click()
		await Util.drawSignature()
    }

}
export default new DisbursementScreen()