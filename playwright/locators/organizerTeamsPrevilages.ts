import { LocatorUtils } from "../utils/locatorUtils";

export const organizerTeamsPrivilegesLocators = {
  eventManagementMenu: LocatorUtils.containsTextIn('h6', 'Event Management', 1),
  organizerTeamMenu: LocatorUtils.containsTextIn('h6', 'Organizer Team', 1),
  manageRolesButton: LocatorUtils.containsTextIn('button', 'Manage roles'),
  addNewRoleButton: LocatorUtils.containsTextIn('button', 'Add New Role'),
  roleNameInput: LocatorUtils.ID('name'),
  createRoleButton: LocatorUtils.containsTextIn('button', 'Create Role'),
  viewPrivilegesButton: LocatorUtils.containsTextIn('button', 'View Privilege', 2),
  permissionCheckbox: (permission: string) => `//label[normalize-space(.)='${permission}']//input[@type='checkbox']`,
  updatePrivilegeButton: LocatorUtils.containsTextIn('button', 'Update Privilege'),
};
