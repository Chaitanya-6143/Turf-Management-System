export default class LoginForm {
  constructor() {
    this.form = document.querySelector("#login-form");
    this.allFields = document.querySelectorAll("#login-form .form-control");
    this.insertValidationElements();
    this.email = document.querySelector("#exampleInputEmail2");
    this.email.previousValue = "";
    this.password = document.querySelector("#exampleInputPassword2");
    this.password.previousValue = "";
    this.events();
  }

  //events
  events() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.formSubmitHandler();
    });
    this.email.addEventListener("keyup", () => {
      this.isDifferent(this.email, this.emailHandler);
    });
    this.password.addEventListener("keyup", () => {
      this.isDifferent(this.password, this.passwordHandler);
    });
  }

  //methods
  formSubmitHandler() {
    this.emailAfterDelay();
    this.passwordImmediately();
    this.passwordAfterDelay();
    if (!this.email.errors && !this.password.errors) {
      this.form.submit();
    }
  }
  isDifferent(el, handler) {
    if (el.previousValue != el.value) {
      handler.call(this);
    }
    el.previousValue = el.value;
  }
  emailHandler() {
    this.email.errors = false;
    clearTimeout(this.email.timer);
    this.email.timer = setTimeout(() => {
      this.emailAfterDelay();
    }, 800);
  }
  passwordHandler() {
    this.password.errors = false;
    this.passwordImmediately();
    clearTimeout(this.password.timer);
    this.password.timer = setTimeout(() => {
      this.passwordAfterDelay();
    }, 800);
  }
  emailAfterDelay() {
    if (!/^\S+@\S+$/.test(this.email.value)) {
      this.showValidationError(this.email, "Enter valid email!!");
    }
    if (!this.email.errors) {
      this.hideValidationError(this.email);
    }
  }
  passwordImmediately() {
    if (this.password.value.length > 30) {
      this.showValidationError(
        this.password,
        "password cannot exceed 30 characters!!"
      );
    }
    if (!this.password.errors) {
      this.hideValidationError(this.password);
    }
  }
  passwordAfterDelay() {
    if (this.password.value.length < 12) {
      this.showValidationError(
        this.password,
        "password you provided while registration is atleast 12 characters long!!"
      );
    }
  }
  hideValidationError(el) {
    el.nextElementSibling.style.display = "none";
  }
  showValidationError(el, message) {
    el.nextElementSibling.innerHTML = message;
    el.nextElementSibling.style.display = "block";
    el.errors = true;
  }
  insertValidationElements() {
    this.allFields.forEach(function (el) {
      el.insertAdjacentHTML(
        "afterend",
        '<div class="alert alert-danger small liveValidateMessage" style="display:none"></div>'
      );
    });
  }
}
