import Search from "./modules/search";
import RegistrationForm from "./modules/registrationForm";
import LoginForm from "./modules/loginForm";
import BookForm from "./modules/bookForm";
if (document.querySelector("#myForm")) {
  new BookForm();
}
if (document.querySelector("#login-form")) {
  new LoginForm();
}
if (document.querySelector("#registration-form")) {
  new RegistrationForm();
}
new Search();
