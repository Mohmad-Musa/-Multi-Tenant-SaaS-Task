

const getUserRoleForOrg = (user, orgId) => {
  const roleObj = user.roles.find(
    (r) => r.organization.toString() === orgId.toString()
  );
  return roleObj ? roleObj.role : null;
};

export default getUserRoleForOrg;


