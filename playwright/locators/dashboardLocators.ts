import { LocatorUtils } from "../utils/locatorUtils";
export const dashboardLocators = {
  hamburgerMenu: LocatorUtils.byAttribute("button", "aria-label", "open drawer"),
  eventsMenu: LocatorUtils.containsTextIn("h6", "Events", 1),
  eventCard: LocatorUtils.containsTextIn("p", "International Leadership Summit", 1),
};