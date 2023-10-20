var express = require('express');
var bodyParser = require('body-parser');
var urlencodeParser = bodyParser.urlencoded({ extended: false });
var validator = require('express-validator');
const Utente = require('../models/Utente');
const Articolo = require('../models/Articolo');
const Contatore = require('../models/Contatore');
const Ordine = require('../models/Ordine');

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
	  const articoli = await Articolo.find({statoArticolo:{ $ne: false }});
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

async function getArticolo(cdArticolo) {
	try {
		const articolo = await Articolo.findOne({codiceArticolo:cdArticolo});
		return articolo;
	} catch (error) {
		throw new Error('Impossibile trovare articolo');
	}
	};

async function updArticolo(objArticolo) {
	const cdArticolo = objArticolo.codiceArticolo;
	try {
		let articolo = await Articolo.findOneAndUpdate(
			{codiceArticolo:cdArticolo},
			{
				$set: objArticolo
			},
			)
		return articolo;
	} catch (error) {
		throw new Error('Impossibile trovare il articolo');
	}
};

async function getContatoreOrd() {
	try {
		var coll = 'Ordine'
		const contatore = await Contatore.findOne({collezione:coll});
		if(contatore){
			let contatoreOrd = contatore.valoreContatore;
			contatoreOrd++;
			const contatoreIncr = contatoreOrd;
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
			const contatoreSave = await updContatoreOrd();
			if(contatoreSave){
				const contatoreNew = contatoreSave.valoreContatore;
				return contatoreNew;
			} else {
				console.log('aggiornamento primo contatore ordine non riuscito');
				throw new Error('aggiornamento primo contatore ordine non riuscito');
			}
		}
		
	} catch (error) {
		console.log('Impossibile aggiornare contatore');
		throw new Error('Impossibile aggiornare contatore');
	}
}

async function updContatoreOrd() {
	try {
		let contatoreNew = new Contatore ({
			collezione : 'Ordine',
			valoreContatore: 1
			})
		const contatoreSave = await contatoreNew.save()
		return contatoreSave
	} catch (error) {
		console.log('aggiornamento primo contatore ordine non riuscito');
		throw new Error('aggiornamento primo contatore ordine non riuscito');
	}
}

async function getRigaOrd(cdOrdine){
	console.log('controller: '+cdOrdine);
	var rigaOrdineIncr= 0;
	try {
		const ordine = await Ordine.findOne({codiceOrdine:cdOrdine});
		if(ordine){
			let rigaOrdine = ordine.rigaOrdine;
			rigaOrdine++;
			rigaOrdineIncr = rigaOrdine;
			console.log('controller1: '+ rigaOrdineIncr);
		}else{
			rigaOrdineIncr=1;
			console.log('controller2: '+ rigaOrdineIncr);
		}
		
		return rigaOrdineIncr;
	} catch (error) {
		throw new Error('Impossibile trovare il ordine');
		console.log('controller3: ');
	}
}

  module.exports =  {
	getClienti,
	getCliente,
	updCliente,
	getArticoli,
	getContatoreArt,
	getArticolo,
	updArticolo,
	getContatoreOrd,
	updContatoreOrd,
	getRigaOrd
};