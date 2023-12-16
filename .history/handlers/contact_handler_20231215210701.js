const contactService = require('../services/contact_service.js')
const validator = require('validator')
const Enum = require('../config/Enum.js')
const CustomError = require('../lib/Error.js')
const Response = require('../lib/Response.js')
const nodemailer = require('nodemailer');
// Import nodemailer 
require('dotenv').config();
const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'tahakorkut02@gmail.com',
        pass: 'rqarjwuftliyofud',
      }
    });

    const mailOptions = {
      from: options.email, // Use the sender's email from the options
      to: 'tahakorkut02@gmail.com',
      subject: 'Yeni İletişim Formu Mesajı',
      text: `Ad : ${name}\nE-posta: ${email}\nMesaj: ${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.json({ success: false, message: 'E-posta gönderme hatası.' });
      }
      res.json({ success: true, message: 'E-posta başarıyla gönderildi.' });
    });
  } catch (error) {
    throw new Error(`Error sending email: ${error.message}`);
  }
};

// İletişim oluşturma fonksiyonu
const createContact = async (req, res, next) => {
  try {
    // Yeni bir iletişim oluştur
    const { ad, email, subject, message } = req.body;

    // Gönderici adresini env değişkeninden al
    const sender = process.env.SMTP_MAIL; // Corrected variable name

    // Alıcı adresini env değişkeninden al
    const recipient = process.env.YOUR_EMAIL;

    // E-posta gönderme işlemi
    await sendEmail({ ad, email, subject, message, to: recipient });

    res.status(200).json({ message: 'İletişim mesajı gönderildi' });
  } catch (error) {
    next(error);
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
