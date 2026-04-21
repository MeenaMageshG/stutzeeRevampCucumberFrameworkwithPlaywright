import { LocatorUtils } from "../utils/locatorUtils";
export const dashboardLocators = {
  eventsMenu: LocatorUtils.containsTextIn("h6", "Events", 1),
  eventCard: LocatorUtils.containsTextIn("p", "Organiser 1 Event", 1),
};