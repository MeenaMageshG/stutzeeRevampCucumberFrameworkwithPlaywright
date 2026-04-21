import { LocatorUtils } from "../utils/locatorUtils";

export const ticketLocators = {
  createTicketButton: LocatorUtils.containsTextIn('button', 'Create Ticket', 2),
  categoryDropdown: LocatorUtils.containsTextIn('span', 'Choose Category', 2),
  ticketCategoryDropdown: LocatorUtils.byAttribute('div','role', 'combobox'),
  categoryOption: (categoryName: string) => LocatorUtils.exactTextNormalized('li', categoryName),
  ticketNameInput: LocatorUtils.ID('ticketName'),
  ticketTypeDropdown: LocatorUtils.containsTextIn('button', 'Free'),
  ticketTypeDropdownasPaid: LocatorUtils.containsTextIn('button', 'Paid'), // Free / Paid
  maxAttendeesInput: LocatorUtils.ID('attendeesPerTicket'),
  basePriceInput: LocatorUtils.ID('basePrice'),
  salesStartDateInput: LocatorUtils.byAttribute('input', 'placeholder', 'DD/MM/YYYY hh:mm aa', 1),
  salesEndDateInput: LocatorUtils.byAttribute('input', 'placeholder', 'DD/MM/YYYY hh:mm aa', 2),
  visibilityScopeDropdown: LocatorUtils.containsTextIn('button', 'Public'),
  visibilityScopeDropdownasHidden: LocatorUtils.containsTextIn('button', 'Hidden'), // Public / Private
  initialStateDropdown: LocatorUtils.containsTextIn('button', 'Active'), 
  initialStateDropdownasInactive: LocatorUtils.containsTextIn('button', 'Inactive'), // Active / Inactive
  perksInput: LocatorUtils.byAttribute('input', 'placeholder', 'Type Your Perk Here'),
  includedAccessTermsInput: LocatorUtils.byClass('div', 'ql-editor ql-blank'), 
  createButton: LocatorUtils.containsTextIn('button', 'Create'),
};
