import { LocatorUtils } from "../utils/locatorUtils";
export const hallManagementLocators = {
  eventManagementMenu: LocatorUtils.containsTextIn('h6', 'Event Management', 1),
  sessionManagementMenu: LocatorUtils.containsTextIn('h6', 'Session Management', 1),
  manageHallButton : LocatorUtils.containsTextIn("button", "Manage Hall", 1),
  hallCard:           LocatorUtils.byAttribute("div", "xpath", "1"),
  hallNameField:      LocatorUtils.ID("name"),
  locationField:      LocatorUtils.ID("location"),
  createBtn:          LocatorUtils.containsTextIn("button", "Create", 1),
  backToSessionBtn:   LocatorUtils.containsTextIn("button", "Back to session"),

 }
