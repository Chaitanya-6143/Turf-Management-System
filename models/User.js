const userCollection = require("../db").db().collection("UsersSignUp");
const userCollection2 = require("../db").db().collection("Booking");
const validator = require("validator");
let User = function (data) {
  this.data = data;
  this.error = [];
};
User.prototype.cleanUp = function () {
  if (typeof this.data.email != "string") {
    this.data.email = "";
  }
  if (typeof this.data.password != "string") {
    this.data.password = "";
  }
  if (typeof this.data.phoneno != "string") {
    this.data.phoneno = "";
  }
  if (typeof this.data.city != "string") {
    this.data.city = "";
  }
  // get rid of any bogus properties
  this.data = {
    email: this.data.email.trim().toLowerCase(),
    password: this.data.password,
    phoneno: this.data.phoneno,
    city: this.data.city,
  };
};
User.prototype.validate = function () {
  return new Promise(async (resolve, reject) => {
    if (this.data.email == "") {
      this.error.push("please enter email");
    }
    if (this.data.password == "") {
      this.error.push("please enter password");
    }
    if (this.data.phoneno == "") {
      this.error.push("please enter phoneno");
    }
    if (this.data.city == "") {
      this.error.push("please enter city");
    }
    if (!validator.isEmail(this.data.email)) {
      this.error.push("You must provide a valid email address.");
    }
    if (this.data.password == "") {
      this.error.push("You must provide a password.");
    }
    if (this.data.password.length > 0 && this.data.password.length < 12) {
      this.error.push("Password must be at least 12 characters.");
    }
    if (this.data.password.length > 100) {
      this.error.push("Password cannot exceed 100 characters.");
    }
    //email validation if user registers with same email present in dataabase
    if (validator.isEmail(this.data.email)) {
      let emailExist = await userCollection.findOne({ email: this.data.email });
      if (emailExist) {
        this.error.push("already registerd with this email!!");
      }
    }
    if (this.data.phoneno > 2) {
      let phonenoExist = await userCollection.findOne({
        phoneno: this.data.phoneno,
      });
      if (phonenoExist) {
        this.error.push("already registerd with this phone number!!");
      }
    }
    resolve();
  });
};
User.prototype.login = function () {
  return new Promise(async (resolve, reject) => {
    this.cleanUp();
    const attemptedUser = await userCollection.findOne({
      email: this.data.email,
    });
    if (attemptedUser && attemptedUser.password == this.data.password) {
      resolve("CONGRATSSSSS!!!!!!");
    } else {
      reject("invalid Email/Password");
    }
  });
};
User.prototype.register = function () {
  return new Promise(async (reslove, reject) => {
    this.cleanUp();
    await this.validate();
    if (!this.error.length) {
      await userCollection.insertOne(this.data);
      reslove();
    } else {
      reject(this.error);
    }
  });
};
User.prototype.bookingValidation = function () {
  if (this.data.name == "") {
    this.error.push("Name must be Provide!!!");
  }
  if (this.data.bookingEmail == "") {
    this.error.push("Email must be Provide!!!");
  }
  if (this.data.bookingNumber == "") {
    this.error.push("Number must be Provide!!!");
  }
  if (this.data.bookingDatetime == "") {
    this.error.push("Date must be Provide!!!");
  }
  if (this.data.slots == "Choose Slots") {
    this.error.push("Slot must be Provide!!!");
  }
};
User.prototype.slotsValidation = async function () {
  const attemptedSlot = await userCollection2.findOne({
    turf: this.data.turf,
    slots: this.data.slots,
    bookingDatetime: this.data.bookingDatetime,
  });
  if (attemptedSlot) {
    this.error.push("already booked");
  }
};
User.prototype.book = async function () {
  this.bookingValidation();
  await this.slotsValidation();
  if (!this.error.length) {
    await userCollection2.insertOne(this.data);
  }
};
User.doesEmailExist = function (email) {
  return new Promise(async function (resolve, reject) {
    if (typeof email != "string") {
      resolve(false);
      return;
    }
    let user = await userCollection.findOne({ email: email });
    if (user) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
};
User.doesPhoneExist = function (phone) {
  return new Promise(async function (resolve, reject) {
    if (typeof phone != "string") {
      resolve(false);
      return;
    }
    let phoneNumber = await userCollection.findOne({ phoneno: phone });
    if (phoneNumber) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
};
User.doesSlotExist = function (slot, date, turf) {
  return new Promise(async function (resolve, reject) {
    if (typeof slot != "string") {
      resolve(false);
      return;
    }
    let existSlot = await userCollection2.findOne({
      slots: slot,
      bookingDatetime: date,
      turf: turf,
    });
    if (existSlot) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
};
module.exports = User;
