//import homeScreen from "../screenobjects/home-screen";
//const DisbursementScreenClass = require("../../screenobjects/disbursement-screen");
import DisbursementScreen from "../screenobjects/disbursement-screen.js";
// const DisbursementScreen = new disbursementScreen("uat");

describe('Disbursement for Individual Loan', () => {
    it('To disburse the individual loan', async () =>   {
        await DisbursementScreen.navigateToFirstIndividualInterview();
        await DisbursementScreen.checkingNRC();
        await DisbursementScreen.checkingClientPhoto();
        await DisbursementScreen.checkingHouseholdList();
        await DisbursementScreen.checkingClientSign();
        await DisbursementScreen.checkingNgasayaMember();
        await DisbursementScreen.checkingGuarantor();
        await DisbursementScreen.checkingCoapplicant();
        await DisbursementScreen.MakeDisbursenment();
        await DisbursementScreen.makeSign();

    })

});