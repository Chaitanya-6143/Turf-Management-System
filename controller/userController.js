const User = require("../models/User");
exports.login = function (req, res) {
  let user = new User(req.body);
  user
    .login()
    .then(function (result) {
      req.session.user = { favColor: "blue", email: user.data.email };
      req.session.save(function () {
        res.redirect("/");
      });
    })
    .catch(function (err) {
      req.flash("errors", err);
      req.session.save(function () {
        res.redirect("/");
      });
    });
};
exports.logout = function (req, res) {
  req.session.destroy(function () {
    res.redirect("/");
  });
};
exports.register = async function (req, res) {
  let user = new User(req.body);
  await user
    .register()
    .then(() => {
      req.session.user = { email: user.data.email };
      req.session.save(function () {
        res.redirect("/");
      });
    })
    .catch((regErrors) => {
      regErrors.forEach(function (error) {
        req.flash("regErrors", error);
      });
      req.session.save(function () {
        res.redirect("/");
      });
    });
};
exports.book = async function (req, res) {
  let user = new User(req.body);
  await user.book();
  if (user.error.length) {
    user.error.forEach(function (error) {
      req.flash("bookErrors", error);
    });
    req.session.save(function () {
      res.redirect("/");
    });
  } else {
    const redirectLink = req.body.redirectLink;
    res.redirect(redirectLink);
  }
};

exports.home = function (req, res) {
  if (req.session.user) {
    res.render("home-dashboard", {
      email: req.session.user.email,
      bookErrors: req.flash("bookErrors"),
    });
  } else {
    res.render("home-guest", {
      errors: req.flash("errors"),
      regErrors: req.flash("regErrors"),
    });
  }
};
exports.doesEmailExist = async function (req, res) {
  let emailBool = await User.doesEmailExist(req.body.email);
  res.json(emailBool);
};
exports.doesPhoneExist = async function (req, res) {
  let phoneBool = await User.doesPhoneExist(req.body.phone);
  res.json(phoneBool);
};
exports.doesSlotExist = async function (req, res) {
  let slotBool = await User.doesSlotExist(
    req.body.slot,
    req.body.date,
    req.body.turf
  );
  res.json(slotBool);
};
