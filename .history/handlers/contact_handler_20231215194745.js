const contactService = require('../services/contact_service.js')
const validator = require('validator')
const Enum = require('../config/Enum.js')
const CustomError = require('../lib/Error.js')
const Response = require('../lib/Response.js')
const nodemailer = require('nodemailer');

require('dotenv').config();

const sendMail = async (emailData) => {
  const htmlTemplate = `
   
  `;

  try {
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.NODE_MAIL,
        pass: process.env.NODE_PASS,
      },
    });

    // send mail with defined transport object
    await transporter.sendMail({
      to: 'tahakorkut02@gmail.com',
      subject: `MAIL FROM ${emailData.email}`,
      html: htmlTemplate,
    });

    return { succeeded: true };
  } catch (error) {
    return { succeeded: false, error };
  }
};


const getContact = async (req, res, next) => {
  // abone olan tüm kullanıcıları listeleme
try {
 const contactList = await contactService.getContactList();
 res.json({ contactList });
} catch (error) {
 console.error('Error while fetching subscribed users:', error);
 res.status(500).json({ error: 'Internal Server Error' });
}
}




module.exports = {
  createContact,
  getContact

}
