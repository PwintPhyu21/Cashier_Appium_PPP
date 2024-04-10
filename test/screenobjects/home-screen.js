//const Util = require("../utils/utility-functions");
import Utility from "../utils/helpers/utility-functions";

class HomeScreen {

    async navigateToInterventionAssessment() {
        const desiredLabel = "Intervention Assessments";
        const desiredComponent = await $(`//*[@text="${desiredLabel}"]`);
        await $(`android=new UiScrollable(new UiSelector().classNameMatches(\".*android.view.View.*\").scrollable(true)).scrollTextIntoView("${desiredLabel}")`);
        await desiredComponent.click();
    }

}

export default new HomeScreen()