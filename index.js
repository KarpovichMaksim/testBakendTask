const express = require('express');
const multer  = require('multer');
const nodemailer = require('nodemailer');

const memoryStorage = multer.memoryStorage();
const uploadMemory = multer({ storage: memoryStorage });

const app = express();

app.get('/upload', uploadMemory.array('file'), (req, res, next) => {
  res.sendFile('form.html', {root: './public/'})
});

app.post('/upload', uploadMemory.array('file'), (req, res, next) => {

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
        from: req.body.from,
        to: req.body.to,
        subject: req.body.subject,
        text: req.body.text,
        attachments: files
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) console.log(error);
        else console.log('Email sent: ' + info.response);
    });
    
	res.json({ succeed: true });
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));