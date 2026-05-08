import { LocatorUtils } from "../utils/locatorUtils";

export const organizerTeamsLocators  = {

eventmanagmentMenu: LocatorUtils.containsTextIn('h6', 'Event Management', 1),
organizerTeamMenu: `//*[self::h6 or self::h5 or self::h4 or self::h3 or self::span or self::p or self::div or self::button or self::a][contains(translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'organizer team')]`,
addNewTeamButton: LocatorUtils.containsTextIn('button', 'Create Team Member'),
mobileNumberInput: LocatorUtils.byAttribute('input', 'placeholder', 'Mobile number'),
clicktoautofill: LocatorUtils.containsTextIn('p', 'Click To Autofill'),
emailInput: LocatorUtils.byAttribute('input', 'placeholder', 'Enter email'),
teammemberNameInput: LocatorUtils.ID('name'),
selectedRole: LocatorUtils.containsTextIn('p', 'Select Role'),
roleselectionOption: (role: string) => `//li[normalize-space(.)='${role}']`,
invitebutton: LocatorUtils.containsTextIn('button', 'Invite'),

}
