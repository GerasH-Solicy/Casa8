import * as nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user:
      process.env.CASA8_EMAIL_ADDRESS ?? "casa8apartment.business@gmail.com",
    pass: process.env.CASA8_EMAIL_PASS ?? "szzl sdlh elaj misx",
  },
});

export { transporter };
