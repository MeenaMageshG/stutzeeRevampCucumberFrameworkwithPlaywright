import { LocatorUtils } from "../utils/locatorUtils";
export const dashboardLocators = {
  eventsMenu: LocatorUtils.containsTextIn("h6", "Events", 1),
  eventCard: LocatorUtils.containsTextIn("p", "International Leadership Summit", 1),
};