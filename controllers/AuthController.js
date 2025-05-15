var express = require('express');
var bodyParser = require('body-parser');
var urlencodeParser = bodyParser.urlencoded({ extended: false });

const Utente = require('../models/Utente');
const mail = require('../config/mail');

const bcrypt = require('bcryptjs');

const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;
var validator = require('express-validator');

var axios = require("axios");
var MockAdapter = require("axios-mock-adapter");

const multer = require('multer');

// Configurazione Multer per gestire l'upload dei file
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, 'uploads/clienti');
	},
	filename: function (req, file, cb) {
	  cb(null, Date.now() + '-' + file.originalname);
	}
  });
  
  var upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		  if (file.mimetype == "image/png" || file.mimetype == "image/jpeg" || file.mimetype == "text/plain"  || file.mimetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
				cb(null, true);
		  } else {
				cb(null, false);
				return cb(new Error('Ammesse solo estensioni .png, jpg'));
		  }
		  }
	}).single('file');

// This sets the mock adapter on the default instance
var mock = new MockAdapter(axios);

/*let users = [
	{ id: 1, username: 'admin', password: '123456', email: 'admin@themesbrand.com' }
];*/
let users = [];

// Mock GET request to /users when param `searchText` is 'John'
mock.onGet("/users", { params: { searchText: "John" } }).reply(200, {
	users: users,
});

const sendResetPasswordMail = async (name, email, tokenMail, host) => {
	try {
	  const resetUrl = new URL(`/auth-reset-password?token=${tokenMail}`, process.env.HOST);
  
	  const transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 587,
		secure: false,
		requireTLS: true,
		auth: {
		  user: mail.emailUser,
		  pass: mail.emailPassword
		}
	  });
  
	  const mailOptions = {
		from: `"Supporto" <${mail.emailUser}>`,
		to: email,
		subject: 'Reset della password',
		html: `
		  <p>Ciao <strong>${name}</strong>,</p>
		  <p>Hai richiesto il reset della tua password.</p>
		  <p>Clicca sul seguente link per reimpostarla:</p>
		  <p><a href="${resetUrl.href}">${resetUrl.href}</a></p>
		  <br>
		  <p>Se non hai effettuato tu questa richiesta, ignora semplicemente questa email.</p>
		  <hr>
		  <p>Grazie,<br>Il team di supporto</p>
		`
	  };
  
	  const info = await transporter.sendMail(mailOptions);
	  console.log("📨 Email inviata:", info.response);
  
	} catch (error) {
	  console.error('❌ Errore invio email di reset:', error.message);
	  throw new Error('Errore durante l\'invio della mail');
	}
  };
  

module.exports = function (app) {

	app.get('/login', (req, res) => {
		res.render('Auth/auth-login', {
		  message: req.flash('message'),
		  error: req.flash('error')
		});
	  });

	  app.post('/post-login', express.urlencoded({ extended: false }), async (req, res) => {
		const { email, password } = req.body;
	  
		try {
		  const utente = await Utente.findOne({ email });
	  
		  if (!utente) {
			req.flash('message', 'Utente non trovato!');
			return res.redirect('/login');
		  }
	  
		  const passwordMatch = await bcrypt.compare(password, utente.password);
	  
		  if (!passwordMatch) {
			req.flash('message', 'Password errata!');
			return res.redirect('/login');
		  }
	  
		  // ✅ Solo utenti con stato true possono loggarsi
		  if (utente.stato !== true) {
			req.flash('message', 'Utente disattivato. Accesso negato!');
			return res.redirect('/login');
		  }
	  
		  const token = jwt.sign({ userId: utente._id }, jwtSecret, { expiresIn: '1h' });
		  res.cookie('token', token, { httpOnly: true });
	  
		  req.session.user = {
			username: utente.nome,
			email: utente.email,
			foto: utente.fotoPath,
			tipo: utente.tipo,
			_id: utente._id
		  };
	  
		  req.flash('message', 'Utente loggato!');
		  res.redirect('/');
	  
		} catch (err) {
		  console.error('Errore login:', err);
		  req.flash('error', 'Errore interno del server.');
		  res.redirect('/login');
		}
	  });
	  


	app.get('/register', function (req, res) {
		if (req.user) { res.redirect('Dashboard/index'); }
		else {
			res.render('Auth/auth-register', { 'message': req.flash('message'), 'error': req.flash('error') });
		}
	});


	app.post('/post-register', urlencodeParser, (req, res) => {
		upload(req, res, async function (err) {
		  // Gestione errori upload
		  if (err instanceof multer.MulterError || err) {
			console.error('Errore upload:', err);
			return res.status(400).send('Errore durante il caricamento della foto.');
		  }
	  
		  const isClientRegistration = req.body.fieldHidden === 'registraCliente';
		  const isAdminInsert = req.body.fieldHidden === 'inserisciClienteAdministrator';
	  
		  const fotoPath = req.file?.path || "";
		  const sessionUser = req.session.user;
	  
		  let partnerEmail;
		  if (isClientRegistration) {
			// Utente si registra da solo
			partnerEmail = req.body.email;
	  
			// Imposta sessione utente
			const tempUser = {
			  username: req.body.nome,
			  email: req.body.email,
			  foto: fotoPath
			};
	  
			req.session.user = tempUser;
	  
		  } else if (isAdminInsert) {
			// Utente inserito da admin
			partnerEmail = sessionUser?.email || 'admin@default.it';
		  } else {
			return res.status(400).send('Tipo registrazione non valido.');
		  }

		  try {
			const hashedPass = await bcrypt.hash(req.body.password, 10);
	  
			const nuovoUtente = new Utente({
			  nome: req.body.nome,
			  cognome: req.body.cognome,
			  telefono: req.body.telefono,
			  piva: req.body.piva,
			  indirizzo: req.body.indirizzo,
			  citta: req.body.citta,
			  cap: req.body.cap,
			  email: req.body.email,
			  password: hashedPass,
			  note: req.body.note,
			  fotoPath,
			  stato: true,
			  partner: partnerEmail,
			  creatoDa: isAdminInsert && sessionUser?._id ? sessionUser._id : null
			});
	  
			await nuovoUtente.save();
	  
			req.flash('message', 'Utente registrato con successo!');
	  
			if (isClientRegistration) {
			  const token = jwt.sign({ userId: nuovoUtente._id }, jwtSecret, { expiresIn: '1h' });
			  res.cookie('token', token, { httpOnly: true });
			  return res.redirect('/');
			} else {
			  return res.redirect('/lista-clienti');
			}
	  
		  } catch (err) {
			console.error('Errore registrazione:', err);
			req.flash('error', 'Errore durante la registrazione utente.');
			return res.redirect('/register'); // pagina di fallback
		  }
		});
	  });
	  
	
	app.get('/forgot-password', function (req, res) {
		res.render('Auth/auth-forgot-password', { 'message': req.flash('message'), 'error': req.flash('error') });
	});

	app.post('/post-forgot-password', urlencodeParser, async (req, res) => {
		const email = req.body.email?.trim();
		const host = req.headers.host;
	  
		if (!email) {
		  req.flash('error', 'Email obbligatoria.');
		  return res.redirect('/forgot-password');
		}
	  
		try {
		  const utente = await Utente.findOne({ email });
	  
		  if (!utente) {
			req.flash('error', 'Utente non trovato!');
			return res.redirect('/forgot-password');
		  }
	  
		  const resetToken = randomstring.generate();
		  const expiresAt = new Date(Date.now() + 3600000); // 1 ora da adesso
		  const updatedUtente = await Utente.findOneAndUpdate(
			{ email },
			{
				$set: {
				  tokenMail: resetToken,
				  resetTokenExpires: expiresAt
				}
			  },
			{ new: true }
		  );
	  
		  await sendResetPasswordMail(updatedUtente.nome, updatedUtente.email, resetToken, host);
	  
		  req.flash('message', 'Controlla la tua email per resettare la password!');
		  res.redirect('/login');
	  
		} catch (error) {
		  console.error('Errore reset password:', error);
		  req.flash('error', 'Errore durante l\'invio dell\'email di reset.');
		  res.redirect('/forgot-password');
		}
	  });

	app.get('/auth-reset-password', function (req, res) {
		const tokenMail = req.query.token;
			res.render('Auth/auth-reset-password', { 'message': req.flash('message'), 'error': req.flash('error'), 'token': tokenMail });
	});

	app.post('/reset-password', urlencodeParser, async (req, res) => {
		const { token, password } = req.body;
	  console.log(token);
		if (!token || !password) {
		  req.flash('error', 'Token o password mancanti.');
		  return res.redirect('/');
		}
	  
		try {
		  const utente = await Utente.findOne({ tokenMail: token });
	  
		  if (!utente || !utente.resetTokenExpires || utente.resetTokenExpires < Date.now()) {
			req.flash('error', 'Token scaduto o non valido!');
			return res.redirect('/forgot-password');
		  }
	  
		  const hashedPass = await bcrypt.hash(password, 10);
	  
		  await Utente.findOneAndUpdate(
			{ tokenMail: token },
			{
				$set: {
				  password: hashedPass,
				  tokenMail: '',
				  resetTokenExpires: null
				}
			}
		  );
	  
		  req.flash('message', 'Password aggiornata con successo!');
		  res.redirect('/login');
	  
		} catch (err) {
		  console.error('Errore reset password:', err);
		  req.flash('error', 'Errore durante il reset della password.');
		  res.redirect('/');
		}
	  });
	

	app.get('/logout', function (req, res) {
		res.clearCookie('token');
		req.session.destroy(() => {
			res.redirect('/login');
		  });

		
	});

};