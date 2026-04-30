  import { LocatorUtils } from "../utils/locatorUtils";
  export const ticketCategoryLocators = {
    eventManagementMenu: LocatorUtils.containsTextIn('h6', 'Event Management', 1),
    eventManagementMenuSpan: LocatorUtils.containsTextIn('span', 'Event Management', 1),
    eventManagementMenuDiv: LocatorUtils.containsTextIn('div', 'Event Management', 1),
    ticketingMenu: LocatorUtils.containsTextIn('h6', 'Ticketing', 1),
    ticketingMenuSpan: LocatorUtils.containsTextIn('span', 'Ticketing', 1),
    ticketingMenuDiv: LocatorUtils.containsTextIn('div', 'Ticketing', 1),
    createTicketCategoryButton: LocatorUtils.containsTextIn('button', 'Create Ticket Category', 1),
    categoryDesignationInput: LocatorUtils.ID('category-name'),
    categoryDescriptionInput: LocatorUtils.ID('category-description'),
    createButton: "//button[normalize-space(.) = 'Create']",
    categoryList: 'div.ticket-category-list',
    categoryItem: (name: string) =>
    `//div[contains(@class,"ticket-category-item") and normalize-space(text())="${name}"]`
  }