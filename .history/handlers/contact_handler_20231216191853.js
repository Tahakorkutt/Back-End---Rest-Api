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
        user: 'tahakorkut02@gmail.com',
        pass: 'rqarjwuftliyofud',
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
    return res.status(500).json({ success: false, message: 'E-posta gönderme hatası.', error: error.message });
  }
  console.log('E-posta gönderildi:', info.response);
  res.json({ success: true, message: 'E-posta başarıyla gönderildi.' });
});
};

// İletişim oluşturma fonksiyonu
const createContact = async (req, res, next) => {
  try {
    // Yeni bir iletişim oluştur
    const { ad, email, subject, message } = req.body;

    // Gönderici adresini env değişkeninden al
    const sender = process.env.SMPT_MAIL;

    // Alıcı adresini env değişkeninden al
    const recipient = process.env.YOUR_EMAIL;

    // E-posta gönderme işlemi
    await sendEmail({ ad, email, subject, message, to: recipient });

    // Veritabanına kaydetme işlemi
    const createdContact = await contactService.createContact(ad, email, subject, message);

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