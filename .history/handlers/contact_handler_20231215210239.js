const contactService = require('../services/contact_service.js')
const validator = require('validator')
const Enum = require('../config/Enum.js')
const CustomError = require('../lib/Error.js')
const Response = require('../lib/Response.js')
const nodeMailer = require('nodemailer'); // Import nodemailer 
require('dotenv').config();

const sendEmail = async (options) => {
  const { name, email, message } = req.body;

  console.log('Formdan Gelen Veriler:', req.body);

  // Nodemailer ile e-posta gönderme işlemi
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tahakorkut02@gmail.com', // Gönderen e-posta adresi
      pass: 'rqarjwuftliyofud' // E-posta adresinin şifresi
    }
  });

  const mailOptions = {
    from: req.body.email, // Gönderenin e-posta adresi olarak formdan alınan e-posta adresini kullan
    to: 'tahakorkut02@gmail.com', // Alıcı e-posta adresi
    subject: 'Yeni İletişim Formu Mesajı',
    text: `Ad : ${name}\nE-posta: ${email}\nMesaj: ${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.json({ success: false, message: 'E-posta gönderme hatası.' });
    }
    res.json({ success: true, message: 'E-posta başarıyla gönderildi.' });
  });
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
