const contactService = require('../services/contact_service.js')
const validator = require('validator')
const Enum = require('../config/Enum.js')
const CustomError = require('../lib/Error.js')
const Response = require('../lib/Response.js')
const nodemailer = require('nodemailer');

require('dotenv').config();

const sendEmail = async (options, res) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMPT_HOST,
      port: process.env.SMPT_PORT,
      service: process.env.SMPT_SERVICE,
      secure: true,
      auth: {
        user: process.env.SMPT_MAIL,
        pass: process.env.SMPT_PASSWORD,
      }
    });

    const mailOptions = {
      to: options.to,
      subject: 'Yeni İletişim Formu Mesajı Konusu: ' + options.subject,
      text: `Ad : ${options.ad}\nE-posta: ${options.email}\nMesaj: ${options.message}`,
      replyTo: `"${options.ad}" <${options.email}>`
    };

    // options.ad değerinin bir e-posta adresi olup olmadığını kontrol et
    if (!options.email.includes('@')) {
      return res.json({ success: false, message: 'Gönderen e-posta adresi geçerli değil.' });
    }

    // E-posta gönderme işlemini gerçekleştir
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('E-posta gönderme hatası:', error);
        return res.json({ success: false, message: 'E-posta gönderme hatası.' });
      }
      console.log('E-posta gönderildi:', info.response);
      res.json({ success: true, message: 'E-posta başarıyla gönderildi.' });
    });
  } catch (error) {
    console.error('Hata oluştu:', error);
    throw new Error(`Error sending email: ${error.message}`);
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
  getContact

}