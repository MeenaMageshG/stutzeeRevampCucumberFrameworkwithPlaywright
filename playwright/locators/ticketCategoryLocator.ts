import { LocatorUtils } from "../utils/locatorUtils";
export const ticketCategoryLocators = {
  eventManagementMenu: LocatorUtils.containsTextIn('h6', 'Event Management', 1),
  ticketingMenu: LocatorUtils.containsTextIn('h6', 'Ticketing', 1),
  createTicketCategoryButton: LocatorUtils.containsTextIn('button', 'Create Ticket Category', 1),
  categoryDesignationInput: LocatorUtils.ID('category-name'),
  categoryDescriptionInput: LocatorUtils.ID('category-description'),
  createButton: "//button[normalize-space(.) = 'Create']",
}