const contactService = require('../services/contact_service.js')
const validator = require('validator')
const Enum = require('../config/Enum.js')
const CustomError = require('../lib/Error.js')
const Response = require('../lib/Response.js')
const nodemailer = require('nodemailer');

require('dotenv').config();


const sendEmail = async (options, res ) => {
  try {
  
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'tahakorkut02@gmail.com',
        pass: 'rqarjwuftliyofud',
      }

    }
    );
    const mailOptions = {
      from: 'tahakorkut02@gmail.com',
      to: options.to,
      subject: `Yeni İletişim Formu Mesajı Konusu: ${options.subject}`,
      text: `Ad : ${options.ad}\nE-posta: ${options.email}\nMesaj: ${options.message}`,
      envelope: {
        from: 'tahakorkut02@gmail.com',
        to: options.to
      },
      sender: {
        name: options.ad,
        address: 'tahakorkut02@gmail.com'
      },
      replyTo: `"${options.ad}" <${options.email}>`
    };
    
    

    // options.ad değerinin bir e-posta adresi olup olmadığını kontrol edin
    if (!options.email.includes('@')) {
      return res.json({ success: false, message: 'Gönderen e-posta adresi geçerli değil.' });
    }

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