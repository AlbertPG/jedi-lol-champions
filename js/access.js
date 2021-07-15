const emailRegex =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const passwordRegex = /^^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

const baseUrl = "https://jedi-server.herokuapp.com/users";

const validateEmail = (email) => {
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return passwordRegex.test(password);
};

const sha256 = async (message) => {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
};

const getUser = async (email) => {
  const users = await get(baseUrl);
  return users.find((user) => user.email == email);
};

const navigateBack = async (redirect) => {
  if (redirect !== null && redirect !== undefined) {
    window.location.replace(redirect);
  }
};

const makeLogIn = async (redirect) => {
  const email = $("#logInEmail").val();
  const password = $("#logInPassword").val();

  if (!validateEmail(email)) {
    alert("Email is empty or invalid");
    return;
  }

  if (!validatePassword(password)) {
    alert(
      "Password should contain at least 8 characters, including 1 digit, 1 lowercase letter and 1 uppercase letter"
    );
    return;
  }

  const passwordHash = await sha256(password);
  const currentUser = await getUser(email);

  if (currentUser === undefined) {
    alert(`User with email ${email} does not exist`);
    return;
  }

  if (currentUser.password !== passwordHash) {
    alert(`Password is wrong`);
    return;
  }

  storeUserInSessionStorage(currentUser);
  navigateBack(redirect);
};

const makeSignUp = async (redirect) => {
  const email = $("#signUpEmail").val();
  const password = $("#signUpPassword").val();
  const repeatPassword = $("#signUpRepeatPassword").val();

  if (!validateEmail(email)) {
    alert("Email is empty or invalid");
    return;
  }

  if (!validatePassword(password)) {
    alert(
      "Password should contain at least 8 characters, including 1 digit, 1 lowercase letter and 1 uppercase letter"
    );
    return;
  }

  if (password !== repeatPassword) {
    alert("Passwords do not match");
    return;
  }

  const currentUser = await getUser(email);

  if (currentUser !== undefined) {
    alert(`User with email ${email} already exists`);
    return;
  }

  const passwordHash = await sha256(password);
  const user = {
    email: email,
    password: passwordHash,
    favourites: [],
  };

  await post(baseUrl, user);
  storeUserInSessionStorage(user);

  alert(`A confirmation email has been sent to ${email}`);
  navigateBack(redirect);
};

$(window).on("load", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const redirect = urlParams.get("redirect");

  $("#btnLogIn").on("click", async (event) => {
    event.preventDefault();
    await makeLogIn(redirect);
  });

  $("#btnSignUp").on("click", async (event) => {
    event.preventDefault();
    await makeSignUp(redirect);
  });
});
