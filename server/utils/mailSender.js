const nodemailer = require('nodemailer');
require('dotenv').config();

exports. sendEmail = async (email, title, body) => {
  try{
//2 step process

//1:- create transporter
const transporter = nodemailer.createTransport({
    host:process.env.EMAIL_HOST,
    secure:true,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
    }
});

//2.send email
let info = await transporter.sendMail({
    from: 'StudyNotion || Phani Bhusan Mohanty',
    to:`${email}`,
    subject:`${title}`,
    html:`${body}`,
});

console.log(info);
return info;

  }catch(err){
    console.error('error occured while sending email :', err);
    throw new Error('Failed to send email');
  }
} 