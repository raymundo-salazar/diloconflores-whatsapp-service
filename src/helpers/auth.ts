export const convertPermissionToRegex = (permission: string) => {
	// Reemplaza {id} o cualquier otro parámetro con un patrón numérico
	const regexPattern = permission.replace(/{\w+}/g, "\\d+")
	return new RegExp(`^${regexPattern}$`)
}
