var express = require('express');
var bodyParser = require('body-parser');
var urlencodeParser = bodyParser.urlencoded({ extended: false });
var validator = require('express-validator');
const Utente = require('../models/Utente');
const Articolo = require('../models/Articolo');
const Contatore = require('../models/Contatore');

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

async function getContatoreArt() {
	try {
		var coll = 'Articolo'
		const contatore = await Contatore.findOne({collezione:coll});
		if(contatore){
			let contatoreArt = contatore.valoreContatore;
			contatoreArt++;
			const contatoreIncr = contatoreArt;
			try {
				const contatoreUpd = await Contatore.findOneAndUpdate({collezione:contatore.collezione},{$set:{valoreContatore:contatoreIncr}},{ returnOriginal: false })
				if(contatoreUpd) {
					const contatoreNew = contatoreUpd.valoreContatore;
					return contatoreNew;
				} else {
					console.log('Impossibile aggiornare contatore');
					throw new Error('Impossibile aggiornare contatore');
				}	
			} catch (error) {
				console.log('Impossibile aggiornare contatore');
				throw new Error('Impossibile aggiornare contatore');
			}
		} else {
			const contatoreSave = await updContatoreArt();
			if(contatoreSave){
				const contatoreNew = contatoreSave.valoreContatore;
				return contatoreNew;
			} else {
				console.log('aggiornamento primo contatore articolo non riuscito');
				throw new Error('aggiornamento primo contatore articolo non riuscito');
			}
		}
		
	} catch (error) {
		console.log('Impossibile aggiornare contatore');
		throw new Error('Impossibile aggiornare contatore');
	}


/*
	var coll = 'Articolo'
    Contatore.findOne({collezione:coll})
	.then(contatore => {
		if(contatore){
			console.log(contatore);
			let contatoreArt = contatore.valoreContatore;
			contatoreArt++;
			const contatoreIncr = contatoreArt;
			Contatore.findOneAndUpdate({collezione:contatore.collezione},{$set:{valoreContatore:contatoreIncr}},{ returnOriginal: false })
			.then(contatoreUpd => {
				let contatoreNew = contatoreUpd.valoreContatore;
				return contatoreNew;
			})
			.catch(error => {
				console.log(error);
			})
		}else{
			let contatoreNew = new Contatore ({
				collezione : 'Articolo',
				valoreContatore: 1
				})
				contatoreNew.save()
				.then(contatoreSave => {
					let contatoreNuovo = contatoreSave.valoreContatore;
					console.log(contatoreNuovo);
					return contatoreNuovo;
				})
				.catch(error => {
					console.log(error);
				})
		}
	})
	.catch(error => {
		console.log(error);
	})
	*/
}

async function updContatoreArt() {
	try {
		let contatoreNew = new Contatore ({
			collezione : 'Articolo',
			valoreContatore: 1
			})
		const contatoreSave = await contatoreNew.save()
		return contatoreSave
	} catch (error) {
		console.log('aggiornamento primo contatore articolo non riuscito');
		throw new Error('aggiornamento primo contatore articolo non riuscito');
	}
}



  module.exports =  {
	getClienti,
	getCliente,
	updCliente,
	getArticoli,
	getContatoreArt
};