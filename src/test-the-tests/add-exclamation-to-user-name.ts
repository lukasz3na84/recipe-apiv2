export function addExclamationToUserName(user: { name: string }) {
  const computedUser = {
    ...user,
  };
  computedUser.name += '!';
  return computedUser;
}
