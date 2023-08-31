import axios from "axios";
export default class BookForm {
  constructor() {
    this.allFields = document.querySelectorAll("#myForm .form-control");
    this.insertValidationElements();
    this.turf = document.querySelector("#selectedInput");
    this.turf.previousValue = "ramTurf";
    this.name = document.querySelector("#exampleInputName1");
    this.name.previousValue = "";
    this.email = document.querySelector("#exampleInputEmail1");
    this.email.previousValue = "";
    this.phone = document.querySelector("#exampleInputNumber1");
    this.phone.previousValue = "";
    this.date = document.querySelector("#exampleInputDate1");
    this.date.previousValue = "";
    this.slot = document.querySelector("#exampleInputSlots1");
    this.slot.previousValue = "";
    this.events();
  }

  //events
  events() {
    this.name.addEventListener("keyup", () => {
      this.isDifferent(this.name, this.nameHandler);
    });
    this.email.addEventListener("keyup", () => {
      this.isDifferent(this.email, this.emailHandler);
    });
    this.phone.addEventListener("keyup", () => {
      this.isDifferent(this.phone, this.phoneHandler);
    });
    this.date.addEventListener("change", () => {
      this.isDifferent(this.date, this.dateHandler);
    });
    this.slot.addEventListener("change", () => {
      this.isDifferent(this.slot, this.slotHandler);
    });
  }
  //methods
  isDifferent(el, handler) {
    if (el.previousValue != el.value) {
      handler.call(this);
    }
    el.previousValue = el.value;
  }
  nameHandler() {
    this.name.errors = false;
    this.nameImmediately();
  }
  emailHandler() {
    this.email.errors = false;
    clearTimeout(this.email.timer);
    this.email.timer = setTimeout(() => {
      this.emailAfterDelay();
    }, 800);
  }
  phoneHandler() {
    this.phone.errors = false;
    clearTimeout(this.phone.timer);
    this.phone.timer = setTimeout(() => {
      this.phoneAfterDelay();
    }, 800);
  }
  dateHandler() {
    this.date.errors = false;
    this.dateImmediately();
  }
  slotHandler() {
    this.slot.errors = false;
    clearTimeout(this.slot.timer);
    this.slot.timer = setTimeout(() => {
      this.slotAfterDelay();
    }, 800);
  }
  nameImmediately() {
    if (this.name.value != "" && !/^[A-Za-z\s]*$/.test(this.name.value)) {
      this.showValidationError(this.name, "Please Enter Valid Name!!!");
    }
    if (!this.name.errors) {
      this.hideValidationError(this.name);
    }
  }
  emailAfterDelay() {
    if (!/^\S+@\S+$/.test(this.email.value)) {
      this.showValidationError(this.email, "Enter valid email!!");
    }
    if (!this.email.errors) {
      this.hideValidationError(this.email);
    }
  }
  phoneAfterDelay() {
    if (!/^(0|91)?[6-9][0-9]{9}$/.test(this.phone.value)) {
      this.showValidationError(this.phone, "please enter valid phone no!!");
    }
    if (!this.phone.errors) {
      this.hideValidationError(this.phone);
    }
  }
  dateImmediately() {
    if (this.date.value == "") {
      this.showValidationError(this.date, "must provide a date!!");
    }
    if (!this.date.errors) {
      this.hideValidationError(this.date);
    }
  }
  slotAfterDelay() {
    if (this.slot.value === "") {
      this.showValidationError(this.slot, "enter Valid slot!!");
    }
    if (!this.slot.errors) {
      axios
        .post("/doesSlotExist", {
          slot: this.slot.value,
          date: this.date.value,
          turf: this.turf.value,
        })
        .then((response) => {
          if (response.data) {
            this.slot.isUnique = false;
            this.showValidationError(this.slot, "Alerady Booked!!!");
          } else {
            this.slot.isUnique = true;
            this.hideValidationError(this.slot);
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
