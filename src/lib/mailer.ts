// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export const sendEmail = async (to: string, subject: string, html: string) => {
//   try {
//     const response = await resend.emails.send({
//       from: "Hottel Booking System <onboarding@resend.dev>",

//       to: "kasundushmanth404@gmail.com",
//       subject,
//       html,
//     });
//     console.log("Email sent:", response);
//     return response;
//   } catch (error) {
//     console.error("Error sending email:", error);
//     return error;
//   }
// };

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kasundushmanth404@gmail.com", // your Gmail
    pass: "fjdn mrop oxnq eoel", // the 16-char app password from Google
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const info = await transporter.sendMail({
      from: '"Hotel Booking System" <kasundushmanth404@gmail.com>',
      to,
      subject,
      html,
    });

    console.log("Email sent:", info);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    return error;
  }
};
