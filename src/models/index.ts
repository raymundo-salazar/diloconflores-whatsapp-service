import Role from "./roles";
import Permission from "./permissions";
import RolePermission from "./rolePermissions";
import Users from "./users";
import States from "./states";
import Cities from "./cities";
import Countries from "./countries";
import Sessions from "./sessions";
import ActionTypes from "./actionTypes";
import ActivityLogs from "./activityLogs";
import EntityTypes from "./entityTypes";

Role.associate();
Permission.associate();
RolePermission.associate();
Countries.associate();
Cities.associate();
States.associate();
Users.associate();
Sessions.associate();
ActionTypes.associate();
ActivityLogs.associate();
EntityTypes.associate();

export {
  Role,
  Permission,
  RolePermission,
  Users,
  States,
  Cities,
  Countries,
  Sessions,
  ActionTypes,
  ActivityLogs,
  EntityTypes,
};
