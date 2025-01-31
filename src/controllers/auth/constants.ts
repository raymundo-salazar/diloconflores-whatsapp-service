export const avoidPaths = [
  { path: "/api/auth/login", method: "POST" },
  { path: "/api/auth/refresh-token", method: "POST" },
  { path: "/api/auth/logout", method: "POST" },
];

export const sessionTypesExpiration = {
  daily: 1 * 60 * 1000,
  monthly: 30 * 24 * 60 * 60 * 1000,
};
