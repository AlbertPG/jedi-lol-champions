const idKey = "id";
const passwordKey = "password";
const emailKey = "email";
const favouritesKey = "favourites";

const storeUserInSessionStorage = (user) => {
  window.sessionStorage.setItem(idKey, user.id);
  window.sessionStorage.setItem(passwordKey, user.password);
  window.sessionStorage.setItem(emailKey, user.email);
  window.sessionStorage.setItem(favouritesKey, JSON.stringify(user.favourites));
};

const getUserFromSessionStorage = () => {
  const id = window.sessionStorage.getItem(idKey);
  const password = window.sessionStorage.getItem(passwordKey);
  const email = window.sessionStorage.getItem(emailKey);
  const favourites = JSON.parse(sessionStorage.getItem(favouritesKey));

  if (
    id === null ||
    passwordKey === null ||
    email === null ||
    favourites === null
  ) {
    return undefined;
  }

  return {
    id: id,
    email: email,
    password: password,
    favourites: favourites,
  };
};

const deleteUserInSessionStorage = () => {
  window.sessionStorage.removeItem(idKey);
  window.sessionStorage.removeItem(passwordKey);
  window.sessionStorage.removeItem(emailKey);
  window.sessionStorage.removeItem(favouritesKey);
};
