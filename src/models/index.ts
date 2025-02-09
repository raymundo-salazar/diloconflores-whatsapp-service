import Roles from "./roles"
import Permission from "./permissions"
import RolePermission from "./rolePermissions"
import Users from "./users"
import States from "./states"
import Cities from "./cities"
import Countries from "./countries"
import Sessions from "./sessions"
import ActionTypes from "./actionTypes"
import ActivityLogs from "./activityLogs"
import EntityTypes from "./entityTypes"
import WhatsappPhones from "./whatsapp/phones"
import WhatsappChatUsers from "./whatsapp/chats/users"
import WhatsappChatSession from "./whatsapp/chats/sessions"
import WhatsappSessions from "./whatsapp/sessions"

Roles.associate()
Permission.associate()
RolePermission.associate()
Countries.associate()
Cities.associate()
States.associate()
Users.associate()
Sessions.associate()
ActionTypes.associate()
ActivityLogs.associate()
EntityTypes.associate()
WhatsappPhones.associate()
WhatsappChatUsers.associate()
WhatsappChatSession.associate()
WhatsappSessions.associate()

export {
	Roles,
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
	WhatsappPhones,
	WhatsappChatUsers,
	WhatsappChatSession,
	WhatsappSessions,
}
