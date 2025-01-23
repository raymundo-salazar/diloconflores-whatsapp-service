import Role from "./roles";
import Permission from "./permissions";
import RolePermission from "./rolePermissions";
import Users from "./users";
import States from "./states";
import Cities from "./cities";
import Countries from "./countries";

Role.associate();
Permission.associate();
RolePermission.associate();
Countries.associate();
Cities.associate();
States.associate();
Users.associate();

export { Role, Permission, RolePermission, Users, States, Cities, Countries };
