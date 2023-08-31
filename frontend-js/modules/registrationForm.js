import axios from "axios";
export default class RegistrationForm {
  constructor() {
    this.form = document.querySelector("#registration-form");
    this.allFields = document.querySelectorAll(
      "#registration-form .form-control"
    );
    this.insertValidationElements();
    this.email = document.querySelector("#exampleInputEmail1");
    this.email.previousValue = "";
    this.password = document.querySelector("#exampleInputPassword1");
    this.password.previousValue = "";
    this.phone = document.querySelector("#exampleInputPhone1");
    this.phone.previousValue = "";
    this.city = document.querySelector("#exampleInputCity1");
    this.city.previousValue = "";
    this.email.isUnique = false;
    this.phone.isUnique = false;
    this.events();
  }
  //Events
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
    this.phone.addEventListener("keyup", () => {
      this.isDifferent(this.phone, this.phoneHandler);
    });
    this.city.addEventListener("keyup", () => {
      this.isDifferent(this.city, this.cityHandler);
    });
  }
  //methods
  formSubmitHandler() {
    this.emailAfterDelay();
    this.passwordImmediately();
    this.passwordAfterDelay();
    this.phoneAfterDelay();
    this.cityImmediately();
    if (
      this.email.isUnique &&
      this.phone.isUnique &&
      !this.email.errors &&
      !this.phone.errors &&
      !this.password.errors &&
      !this.city.errors
    ) {
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
  phoneHandler() {
    this.phone.errors = false;
    clearTimeout(this.phone.timer);
    this.phone.timer = setTimeout(() => {
      this.phoneAfterDelay();
    }, 800);
  }
  cityHandler() {
    this.city.errors = false;
    this.cityImmediately();
  }
  cityImmediately() {
    if (!/^[a-zA-z] ?([a-zA-z]|[a-zA-z] )*[a-zA-z]$/.test(this.city.value)) {
      this.showValidationError(this.city, "Please enter valid city!!");
    }
    if (!this.city.errors) {
      this.hideValidationError(this.city);
    }
  }
  phoneAfterDelay() {
    if (!/^(0|91)?[6-9][0-9]{9}$/.test(this.phone.value)) {
      this.showValidationError(this.phone, "please enter valid phone no!!");
    }
    if (!this.phone.errors) {
      axios
        .post("/doesPhoneExist", { phone: this.phone.value })
        .then((response) => {
          if (response.data) {
            this.phone.isUnique = false;
            this.showValidationError(
              this.phone,
              "Alerady registerd with this phone number!!!"
            );
          } else {
            this.phone.isUnique = true;
            this.hideValidationError(this.phone);
          }
        })
        .catch(() => {
          console.log("try again after some time");
        });
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
        "password must be atleast 12 characters long!!"
      );
    }
  }
  emailAfterDelay() {
    if (!/^\S+@\S+$/.test(this.email.value)) {
      this.showValidationError(this.email, "enter Valid email");
    }
    if (!this.email.errors) {
      axios
        .post("/doesEmailExist", { email: this.email.value })
        .then((response) => {
          if (response.data) {
            this.email.isUnique = false;
            this.showValidationError(
              this.email,
              "Alerady registerd with this email!!!"
            );
          } else {
            this.email.isUnique = true;
            this.hideValidationError(this.email);
          }
        })
        .catch(() => {
          console.log("try again after some time");
        });
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
