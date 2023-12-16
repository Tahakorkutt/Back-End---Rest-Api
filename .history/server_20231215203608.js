const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const cors = require('cors');
const app = express();
const env = require('dotenv').config();
const connectDB = require('./config/db');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());





app.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;

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
    subject: `Message form ${req.body.subject}: ${req.body.message`,
    text: `Ad Soyad: ${name}\nE-posta: ${email}\nMesaj: ${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.json({ success: false, message: 'E-posta gönderme hatası.' });
    }
    res.json({ success: true, message: 'E-posta başarıyla gönderildi.' });
  });
});







const Router = require('./routes/users');

const { userRegisterValidationRules, userLoginValidationRules, handleInputErrors } = require('./modules/middleware');
const { registerUser, loginUser, getUserList, newPasswordUser, logoutUser, deleteUser, updatePasswordUser } = require('./handlers/user_handler');
const { protect } = require('./modules/auth');


const { subscriberCreate,getCreateSubscriber} = require('./handlers/subscriber_handler');
const { createContact,getContact} = require('./handlers/contact_handler');


app.post('/create-contact', createContact);
app.post('/get-contact', getContact);


// Port tanımlaması
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use('/api', protect, Router);

app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.post('/subscriber-create',subscriberCreate); // Abone olma
app.get('/subscriber-get', getCreateSubscriber); // abone listeleme




app.put('/new-password',handleInputErrors, newPasswordUser);
app.get('/users', handleInputErrors, getUserList);
app.post('/user-register', userRegisterValidationRules, handleInputErrors, registerUser);
app.post('/user-login', userLoginValidationRules, handleInputErrors, loginUser);
// app.post('/user-logout/:id', handleInputErrors, logoutUser);
// app.delete('/user-delete/:id', handleInputErrors, deleteUser);

const startServer = () => {
  try {
    // Connect to DB
    connectDB();

    // Start & Listen to the requests
    app.listen(port, () => console.log(`Server started listening on ${port}`));
  } catch (error) {
    console.log(error);
  }
};

startServer();
