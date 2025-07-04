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

const sendResetPasswordMail = async(name, email, tokenMail, host)=>{
	//console.log(host);
	const url = "http://" + host + "/" + "auth-reset-password?token=" + tokenMail;
	//console.log(url);
	try {
		const transporter = nodemailer.createTransport({
			host:'smtp.gmail.com',
			port:587,
			secure:false,
			requireTLS:true,
			auth:{
				user:mail.emailUser,
				pass:mail.emailPassword
			}
		});

		const mailOptions = {
			from:mail.emailUser,
			to:email,
			subject:'reset password',
			html:'<p> Ciao '+name+',  per favore copia il link <a href="'+url+'"> e resetta la password</a>'
		}

		transporter.sendMail(mailOptions,function(error,info){
			if(error){
				console.log(error);
			}else{
				console.log("Mail è stata inviata:- ",info.response)
			}
		})

	} catch (error) {
		res.status(400).send(({success:false,msg:error.message}));	
	}
}

module.exports = function (app) {

	// Inner Auth
	app.get('/auth-login', function (req, res) {
		res.locals = { title: 'Login' };
		res.render('AuthInner/auth-login');
	});
	app.get('/auth-register', function (req, res) {
		res.locals = { title: 'Register' };
		res.render('AuthInner/auth-register');
	});
	app.get('/auth-recoverpw', function (req, res) {
		res.locals = { title: 'Recover Password' };
		res.render('AuthInner/auth-recoverpw');
	});
	app.get('/auth-lock-screen', function (req, res) {
		res.locals = { title: 'Lock Screen' };
		res.render('AuthInner/auth-lock-screen');
	});


	// Auth Pages

	app.get('/pages-maintenance', function (req, res) {
		res.locals = { title: 'Maintenance' };
		res.render('Pages/pages-maintenance');
	});
	app.get('/pages-comingsoon', function (req, res) {
		res.locals = { title: 'Coming Soon' };
		res.render('Pages/pages-comingsoon');
	});
	app.get('/pages-404', function (req, res) {
		res.locals = { title: 'Error 404' };
		res.render('Pages/pages-404');
	});
	app.get('/pages-500', function (req, res) {
		res.locals = { title: 'Error 500' };
		res.render('Pages/pages-500');
	});


	app.get('/register', function (req, res) {
		if (req.user) { res.redirect('Dashboard/index'); }
		else {
			res.render('Auth/auth-register', { 'message': req.flash('message'), 'error': req.flash('error') });
		}
	});


	app.post('/post-register', urlencodeParser, function (req, res) {
			upload(req, res, function (err){
				if (req.body.fieldHidden == "registraCliente") {
					if (req.file !== undefined) {
						var fotoPath = req.file.path;
					} else {
						var fotoPath = "";
					} 
					var partner = req.body.email;
					let tempUser = { username: req.body.nome, email: req.body.email, foto: fotoPath};
					
					// Assign value in session
					users.push(tempUser);
					sess = req.session;
					sess.user = tempUser;

				} else if (req.body.fieldHidden == "inserisciClienteAdministrator") {
					if (req.file !== undefined) {
						var fotoPath = req.file.path;
					} else {
						var fotoPath = "";
					} 
					var partner = sess.user.email;
				}

				bcrypt.hash(req.body.password, 10, function(err, hashedPass) {
					if(err) {
						console.log(err);
					}
					
					let utente = new Utente ({
						nome : req.body.nome,
						cognome: req.body.cognome,
						telefono: req.body.telefono,
						piva: req.body.piva,
						indirizzo : req.body.indirizzo,
						citta: req.body.citta,
						cap: req.body.cap,
						email: req.body.email,
						password: hashedPass,
						note: req.body.note,
						fotoPath: fotoPath,
						stato: true,
						partner : partner
					})

					utente.save()
					.then(utente => {
						req.flash('message', 'Utente registrato!');
						if (req.body.fieldHidden == "registraCliente") {
							console.log('ciao');
						//token
						const token = jwt.sign({ userId: utente._id }, jwtSecret);
						res.cookie('token', token, { httpOnly: true });
							res.redirect('/');
						} else {
							res.redirect('/lista-clienti');
						}
					})
					.catch(error => {
						console.log('ciao1');
						res.send(error)
						req.flash('error', 'Utente non registrato!');
					})
				})

				if (err instanceof multer.MulterError) {
					console.log('ciao2');
					  res.send(err)
				} else if (err) {
					console.log('ciao3');
					  res.send(err)
				}
		  })
	});
	

	app.get('/login', function (req, res) {
		res.render('Auth/auth-login', { 'message': req.flash('message'), 'error': req.flash('error') });
	});

	app.post('/post-login', urlencodeParser, function (req, res) {
		var utente = req.body.email
		var password = req.body.password

		//Utente.findOne({$or:[{email:utente},{nome:utente}]})
		Utente.findOne({email:utente})
		.then(utente => {
			if(utente){
				bcrypt.compare(password, utente.password, function(err, result) {
					if(err) {
						req.flash('message', 'Errore bcrypt');
						res.redirect('/login');
					}
					if(result){
						if(!utente.stato){
							req.flash('message', 'Utente disattivato!');
							res.redirect('/login');
						}else{
							let tempUser = { username: utente.nome, email: utente.email, foto: utente.fotoPath, tipo: utente.tipo };
							users.push(tempUser);

							//token
							const token = jwt.sign({ userId: utente._id }, jwtSecret);
							res.cookie('token', token, { httpOnly: true });
							//console.log(utente._id);
							// Assign value in session
							sess = req.session;
							sess.user = tempUser;
							//console.log(sess.user);
							req.flash('message', 'Utente loggato!');
							res.redirect('/');
						}
					}else{
						req.flash('message', 'Password errata!');
						res.redirect('/login');
					}
				})
			}else{
				req.flash('message', 'Utente non trovato!');
				res.redirect('/login');
			}
		})
		/*
		let tempUser = { username: req.body.email, email: req.body.email };
		users.push(tempUser);
		*/
		// Assign value in session
		/*
		sess = req.session;
		sess.user = tempUser;
		*/
		/*const validUser = users.filter(usr => usr.email === req.body.email && usr.password === req.body.password);
		if (validUser['length'] === 1) {

			// Assign value in session
			sess = req.session;
			sess.user = validUser;

			res.redirect('/');

		} else {
			req.flash('error', 'Incorrect email or password!');
			res.redirect('/login');
		}*/
	});

	app.get('/forgot-password', function (req, res) {
		res.render('Auth/auth-forgot-password', { 'message': req.flash('message'), 'error': req.flash('error') });
	});

	app.post('/post-forgot-password', urlencodeParser, function (req, res) {
		var host = req.headers.host;
		var utente = req.body.email
		Utente.findOne({email:utente})
		.then(utente => {
			if(utente){
				const randomString = randomstring.generate();
				const email = req.body.email;
				Utente.findOneAndUpdate({email:email},{$set:{tokenMail:randomString}})
				.then(utenteupd => {
					sendResetPasswordMail(utenteupd.nome, 'antonio.din74@gmail.com', randomString, host);
					req.flash('message', 'Controlla la tua email e resetta la password!');
					res.redirect('/login');
				})
				.catch(error => {
					console.log(error);
				})
				
			}else{
				req.flash('error', 'Utente non trovato!');
				res.redirect('/forgot-password');
			}
		})
	});

	app.get('/auth-reset-password', function (req, res) {
		const tokenMail = req.query.token;
			res.render('Auth/auth-reset-password', { 'message': req.flash('message'), 'error': req.flash('error'), 'token': tokenMail });
	});

	app.post('/reset-password', urlencodeParser, function (req, res) {
		const tokenMail = req.body.token;
		const newPassword = req.body.password; 
		Utente.findOne({tokenMail:tokenMail})
		.then(utente => {
			if(utente){
				//const newPassword = 'anto1dino1';
				bcrypt.hash(newPassword, 10, function(err, hashedPass) {
					if(err) {
						console.log(err);
					}
					Utente.findOneAndUpdate({tokenMail:utente.tokenMail},{$set:{password:hashedPass,tokenMail:''}})
					.then(utenteupd => {
						req.flash('message', 'Password cambiata con successo!');
						res.redirect('/login');
					})
					.catch(error => {
						res.json({
							message:error
						})
					})			
				})
			}else{
				req.flash('error', 'tokenMail scaduto!');
				res.redirect('/');
			}
		})
	});
	

	app.get('/logout', function (req, res) {
		res.clearCookie('token');
		// Assign  null value in session
		
		sess = req.session;
		sess.user = null;
		
		res.redirect('/');
	});

};