import { LocatorUtils } from "../utils/locatorUtils";

export const dashboardLocators = {
  organizerMenu: LocatorUtils.containsTextIn("h6", "Organisers", 1),
  organiserImpersonation: LocatorUtils.byAttribute("button", "aria-label", "Impersonate", 1),
  eventsMenu: LocatorUtils.containsTextIn("h6", "Events", 1),
  eventCard: LocatorUtils.containsTextIn("div", "Event", 1),
};