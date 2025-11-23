import * as RoleService from "./role.service.js";

export const assignRole = async (req, res) => {
  try {
    const { userId, roleName } = req.body;
    const role = await RoleService.assignRole(userId, roleName);
    res.json({ message: "Role assigned", role });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const revokeRole = async (req, res) => {
  try {
    const { userId, roleName } = req.body;
    await RoleService.revokeRole(userId, roleName);
    res.json({ message: "Role revoked" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const listUserRoles = async (req, res) => {
  try {
    const roles = await RoleService.getUserRoles(req.params.userId);
    res.json(roles);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
