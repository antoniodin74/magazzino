var express = require('express');
var bodyParser = require('body-parser');
var urlencodeParser = bodyParser.urlencoded({ extended: false });
var validator = require('express-validator');
const Utente = require('../models/Utente');

module.exports = function (app) {

      function isUserAllowed(req, res, next) {
            sess = req.session;
            if (sess.user) {
                  return next();
            }
            else { res.redirect('/login'); }
      }

      // Clienti
	app.get('/lista-clienti', function (req, res) {
		Utente.find()
		.then(utente => {
			if(utente){
				res.locals = { title: 'Clienti' };
				res.render('Clienti/lista-clienti', { 'message': req.flash('message'), 'error': req.flash('error'), 'Dati': utente });
			}else{
				req.flash('message', 'Utenti non trovati!');
				res.redirect('/login');
			}
		})	
    });
      
}