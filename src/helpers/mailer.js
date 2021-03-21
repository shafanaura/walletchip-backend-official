// ===== Mailer
const mailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const fs = require("fs");
const mustache = require("mustache");
const path = require("path");
const config = require("../config/config");

exports.verifEmail = (receiver, token, subject, message) => {
  const template = fs.readFileSync(
    path.resolve(__dirname, "../services/mailTemplates/register.html"),
    "utf-8"
  );

  const transporter = mailer.createTransport(
    smtpTransport(config.mailerOptions)
  );

  const url = `${process.env.APP_URL}/redirect/activate?token=${token}`;

  const mailOptions = {
    from: config.mailerOptions.auth.user,
    to: receiver,
    subject,
    html: mustache.render(template, { url, subject, message }),
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      throw err;
    }

    console.log(info);
  });
};

exports.forgotPassword = (receiver, token, subject, message) => {
  const template = fs.readFileSync(
    path.resolve(__dirname, "../services/mailTemplates/forgotPassword.html"),
    "utf-8"
  );

  const transporter = mailer.createTransport(
    smtpTransport(config.mailerOptions)
  );

  const url = `${process.env.APP_URL}/redirect/forgot?token=${token}`;

  const mailOptions = {
    from: config.mailerOptions.auth.user,
    to: receiver,
    subject,
    html: mustache.render(template, { url, subject, message }),
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      throw err;
    }

    console.log(info);
  });
};
