import nodemailer from "nodemailer"
export const sendEmail = async (to ,subject,html,attachments) => {
   

const transporter = nodemailer.createTransport({
  service:"gmail",
    auth: {
    user:process.env.EMAIL ,
    pass:process.env.PASSWORD ,
  },
});


  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `"Dina👻" <${process.env.EMAIL}>`, // sender address
    to: to? to :"dr473079@gmail.com", // list of receivers
    subject:subject?subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
      html: html ? html : "<b>Hello world?</b>", // html body
    attachments:attachments?attachments:[]
  });
    if (info.accepted.length) {
    return true
    }
    return false;
   
}


