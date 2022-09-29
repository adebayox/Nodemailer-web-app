const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');
const ___dirname = path.resolve();


const app = express();

//view engine setup
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

//static folder
app.use('/public', express.static(path.join(___dirname, 'public')));

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('contact', {
        layout: false,
        name: req.body.name,
        quote: req.body.quote
    });
});

app.post('/send', (req, res) => {
    const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>
    <li>Name: ${req.body.name}</li>
    <li>Company: ${req.body.company}</li>
    <li>Email: ${req.body.email}</li>
    <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
    `;

      // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'user@gmail.com', // generated ethereal user
      pass: 'pass' // generated ethereal password
    }
    ,
    tls:{
        rejectUnauthorized:false
    }
  });

  // setup email data with unicode symbokls
  let mailOptions = {
    from: '"Nodemailer Contact" <dadebayo200@gmail.com>', // sender address
    to: 'dadebayo200@gmail.com', // list of receivers
    subject: "Node Contact Request", // Subject line
    text: "Hello world?", // plain text body
    html: output // html body
  };
  
    //send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  res.render('contact', {msg: 'Email has been sent...'});
});
});

app.listen(3000,() => console.log('server started...'));