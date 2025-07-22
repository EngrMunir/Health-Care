import nodemailer from 'nodemailer';
import config from '../../../config';

// Create a test account or replace with real credentials.
const emailSender = async (
  email:string,
  html:string,
)=>{
  const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.emailSender.email,  //j account teke email user k pataben
    pass: config.emailSender.app_pass,
  },
  tls:{
    rejectUnauthorized:false
  }
});

  const info = await transporter.sendMail({
    from: '"PH Health Care" <smsirajulmonir@mail.com>', //jei mail teke send hba
    to: email,
    subject: "Reset password link",
    // text: "Hello world?", // plain‑text body
    html, // HTML body
  });
  console.log("Message sent:", info.messageId);
}

export default emailSender;