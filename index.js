const express = require('express');
const multer  = require('multer');
const nodemailer = require('nodemailer');

const memoryStorage = multer.memoryStorage();
const uploadMemory = multer({ storage: memoryStorage });

const app = express();

app.get('/', function(req, res){
   res.redirect('/upload');
});

app.get('/upload', uploadMemory.array('file'), (req, res, next) => {
  res.sendFile('index.html', {root: './public/build/'})
});

app.post('/upload', uploadMemory.array('file'), (req, res, next) => {

  if(req.body.from !== undefined &&  req.body.to !== undefined && req.body.subject !== undefined){
    res.json({ succeed: false });
  }

	let files = [];

	for (const element of req.files) {
		files.push({   
	            filename: element.originalname,
	            content: element.buffer,
	            contentType: element.mimetype,
	            encoding: element.encoding
	        })
	}
	
	const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'the.butterfly.incorporated@gmail.com',
          pass: 'Qwert87654321'
        }
    });

    let mailOptions = {
        from: req.body.senderEmail,
        to: req.body.receiverEmail,
        subject: "req.body.subject",
        text: "req.body.text",
        attachments: files
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) console.log(error);
        else console.log('Email sent: ' + info.response);
    });
    
	res.json({ succeed: true });
});

app.listen(process.env.PORT || 3000, () => console.log('Example app listening on port 3000!'));