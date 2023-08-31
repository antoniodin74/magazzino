var express = require('express');
var bodyParser = require('body-parser');
var urlencodeParser = bodyParser.urlencoded({ extended: false });
var validator = require('express-validator');
const Utente = require('../models/Utente');
const Articolo = require('../models/Articolo');

async function getClienti() {
	try {
	  const clienti = await Utente.find();
	  return clienti;
	} catch (error) {
	  throw new Error('Impossibile ottenere i clienti');
	}
  };

async function getCliente(email) {
try {
	var utente = email;
	const cliente = await Utente.findOne({email:utente});
	return cliente;
} catch (error) {
	throw new Error('Impossibile trovare il cliente');
}
};

async function updCliente(objUtente) {
	try {
		let utente = objUtente.email;
		let clienti = await Utente.findOneAndUpdate(
			{email:utente},
			{
				$set: objUtente
			},
			)
		return clienti;
	} catch (error) {
		throw new Error('Impossibile trovare il cliente');
	}
};

async function getArticoli() {
	try {
	  const articoli = await Articolo.find();
	  return articoli;
	} catch (error) {
	  throw new Error('Impossibile ottenere i articoli');
	}
  };



  module.exports =  {
	getClienti,
	getCliente,
	updCliente,
	getArticoli,
	
};