const sendEmail = async (options) => {
  try {
    const transporter = nodeMailer.createTransport({
      host: process.env.SMPT_HOST,
      port: process.env.SMPT_PORT,
      service: process.env.SMPT_SERVICE,
      auth: {
        user: process.env.SMPT_MAIL,
        pass: process.env.SMPT_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SMPT_MAIL,
      to: options.to,
      subject: options.subject,
      text: `Ad: ${options.ad}\n\nMesaj Konusu: ${options.subject}\n\n${options.message}`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error(`Error sending email: ${error.message}`);
  }
};