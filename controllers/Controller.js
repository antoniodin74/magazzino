var express = require('express');
var bodyParser = require('body-parser');
var urlencodeParser = bodyParser.urlencoded({ extended: false });
var validator = require('express-validator');
const Utente = require('../models/Utente');
const Articolo = require('../models/Articolo');
const Categoria = require('../models/Categoria');
const UnitaMisura = require('../models/UnitaMisura');
const Contatore = require('../models/Contatore');
const Ordine = require('../models/Ordine');

async function getClienti(email = '') {
	try {
		const filtro = email
			? { email: { $regex: email, $options: 'i' } } // ricerca case-insensitive
			: {};

		const clienti = await Utente.find(filtro).sort({ nome: 1 });
		return clienti;

	} catch (error) {
		console.error('Errore in getClienti:', error);
		throw new Error('Impossibile ottenere i clienti dal database');
	}
}

/* async function getCliente(email) {
try {
	var utente = email;
	const cliente = await Utente.findOne({email:utente});
	return cliente;
} catch (error) {
	throw new Error('Impossibile trovare il cliente');
}
}; */

/* async function updCliente(objUtente) {

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
}; */
async function updCliente(objUtente) {
	try {
		const { email, ...updateData } = objUtente;

		if (!email) {
			throw new Error('Email non fornita per l\'aggiornamento');
		}

		const clienteAggiornato = await Utente.findOneAndUpdate(
			{ email },
			{ $set: updateData },
			{ new: true, runValidators: true }
		);

		return clienteAggiornato;

	} catch (error) {
		console.error('Errore in updCliente:', error);
		throw new Error('Impossibile aggiornare il cliente');
	}
}

/* async function getArticoli() {
	try {
		const articoli = await Articolo.find({ statoArticolo: { $ne: false } });
		return articoli;
	} catch (error) {
		throw new Error('Impossibile ottenere i articoli');
	}
}; */

async function getArticoli() {
    try {
        return await Articolo.find({ statoArticolo: { $ne: false } });
    } catch (error) {
        console.error('Errore in getArticoli:', error.message);
        throw new Error('Errore durante il recupero degli articoli dal database');
    }
}


/* async function getContatoreArt() {
	try {
		var coll = 'Articolo'
		const contatore = await Contatore.findOne({ collezione: coll });
		if (contatore) {
			let contatoreArt = contatore.valoreContatore;
			contatoreArt++;
			const contatoreIncr = contatoreArt;
			try {
				const contatoreUpd = await Contatore.findOneAndUpdate({ collezione: contatore.collezione }, { $set: { valoreContatore: contatoreIncr } }, { returnOriginal: false })
				if (contatoreUpd) {
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
			if (contatoreSave) {
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
} */

async function getContatoreArt() {
	try {
		const coll = 'Articolo';
		let contatore = await Contatore.findOne({ collezione: coll });

		// Se il contatore esiste, incrementalo
		if (contatore) {
			const contatoreIncr = contatore.valoreContatore + 1;
			const contatoreUpd = await Contatore.findOneAndUpdate(
				{ collezione: contatore.collezione },
				{ $set: { valoreContatore: contatoreIncr } },
				{ new: true } // Usa "new" per restituire il documento aggiornato
			);

			if (!contatoreUpd) {
				throw new Error('Impossibile aggiornare contatore');
			}

			return contatoreUpd.valoreContatore;
		}

		// Se non esiste, crea un nuovo contatore
		const contatoreSave = await updContatoreArt();
		if (!contatoreSave) {
			throw new Error('Aggiornamento primo contatore articolo non riuscito');
		}

		return contatoreSave.valoreContatore;

	} catch (error) {
		console.error(error.message || 'Impossibile aggiornare contatore');
		throw new Error('Impossibile aggiornare contatore');
	}
}

/* async function updContatoreArt() {
	try {
		const contatoreNew = new Contatore({
			collezione: 'Articolo',
			valoreContatore: 1
		});
		return await contatoreNew.save();
	} catch (error) {
		console.error('Aggiornamento primo contatore articolo non riuscito');
		throw new Error('Aggiornamento primo contatore articolo non riuscito');
	}
} */

async function updContatoreArt() {
	try {
		// Creazione del nuovo contatore
		const contatoreNew = new Contatore({
			collezione: 'Articolo',
			valoreContatore: 1
		});

		// Salvataggio del nuovo contatore
		const contatoreSaved = await contatoreNew.save();
		return contatoreSaved;
	} catch (error) {
		// Log dell'errore con maggiori dettagli
		console.error('Errore durante l\'inserimento del contatore Articolo:', error.message);
		throw new Error('Errore durante l\'inserimento del contatore Articolo');
	}
}


/* async function getArticolo(cdArticolo) {
	try {
		return await Articolo.findOne({ codiceArticolo: cdArticolo });
	} catch (error) {
		throw new Error('Impossibile trovare articolo');
	}
} */

async function getArticolo(codiceArticolo) {
    try {
        const articolo = await Articolo.findOne({ codiceArticolo });
        if (!articolo) {
            throw new Error(`Articolo con codice "${codiceArticolo}" non trovato.`);
        }
        return articolo;
    } catch (error) {
        console.error(`Errore nel recupero dell'articolo (${codiceArticolo}):`, error.message);
        throw new Error('Errore durante la ricerca dell\'articolo.');
    }
}



async function updContatoreArt() {
	try {
		let contatoreNew = new Contatore({
			collezione: 'Articolo',
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
		const articolo = await Articolo.findOne({ codiceArticolo: cdArticolo });
		return articolo;
	} catch (error) {
		throw new Error('Impossibile trovare articolo');
	}
};

/* async function updArticolo(objArticolo) {
	const cdArticolo = objArticolo.codiceArticolo;
	try {
		let articolo = await Articolo.findOneAndUpdate(
			{ codiceArticolo: cdArticolo },
			{
				$set: objArticolo
			},
		)
		return articolo;
	} catch (error) {
		throw new Error('Impossibile trovare il articolo');
	}
}; */

async function updArticolo(objArticolo) {
    try {
        const { codiceArticolo, ...updateFields } = objArticolo;

        const updated = await Articolo.findOneAndUpdate(
            { codiceArticolo },
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        return updated;
    } catch (error) {
        console.error('Errore aggiornamento articolo:', error);
        throw new Error('Impossibile aggiornare l\'articolo');
    }
}

async function getCategorie() {
    return await Categoria.find().lean();
}

async function getUnitaMisura() {
    return await UnitaMisura.find().lean();
}

async function getContatoreOrd() {
	try {
		var coll = 'Ordine'
		const contatore = await Contatore.findOne({ collezione: coll });
		if (contatore) {
			let contatoreOrd = contatore.valoreContatore;
			contatoreOrd++;
			const contatoreIncr = contatoreOrd;
			try {
				const contatoreUpd = await Contatore.findOneAndUpdate({ collezione: contatore.collezione }, { $set: { valoreContatore: contatoreIncr } }, { returnOriginal: false })
				if (contatoreUpd) {
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
			if (contatoreSave) {
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
		let contatoreNew = new Contatore({
			collezione: 'Ordine',
			valoreContatore: 1
		})
		const contatoreSave = await contatoreNew.save()
		return contatoreSave
	} catch (error) {
		console.log('aggiornamento primo contatore ordine non riuscito');
		throw new Error('aggiornamento primo contatore ordine non riuscito');
	}
}

async function getRigaOrd(cdOrdine) {
	var rigaOrdineIncr = 0;
	try {
		const ordine = await Ordine.findOne({ codiceOrdine: cdOrdine });
		if (ordine) {
			let rigaOrdine = ordine.rigaOrdine;
			rigaOrdine++;
			rigaOrdineIncr = rigaOrdine;
		} else {
			rigaOrdineIncr = 1;
		}
		return rigaOrdineIncr;
	} catch (error) {
		throw new Error('Impossibile trovare il ordine');
	}
}

async function getOrdini() {
	try {
		//const ordini = await Articolo.find({statoArticolo:{ $ne: false }});
		const ordini = await Ordine.find();
		return ordini;
	} catch (error) {
		throw new Error('Impossibile ottenere i ordini');
	}
};

async function getOrdiniX() {
	try {
		const ordini = await Ordine.aggregate([
			{
				$group: {
					_id: '$codiceOrdine', // Raggruppa per numero di ordine
					quantitaOrdine: { $sum: '$quantitaOrdine' }, // Calcola la somma dei valori di ogni riga
					valoreOrdine: { $sum: '$valoreOrdine' } // Calcola la somma dei valori di ogni riga
				}
			},
			{
				$project: {
					codiceOrdine: '$_id', // Rinomina _id a codiceOrdine
					quantitaOrdine: 1,
					valoreOrdine: 1, // Mantieni il campo valoreTotale
					_id: 0 // Escludi il campo _id dal risultato
				}
			},
			{
				$sort: {
					codiceOrdine: 1 // Ordina per codiceOrdine in ordine ascendente (1) o discendente (-1)
				}
			}
		]);
		return ordini;
	} catch (error) {
		console.log(error);
		throw new Error('Impossibile ottenere i ordini');
	}
};

async function getOrdine(cdOrdine) {
	try {
		const ordine = await Ordine.find({ codiceOrdine: cdOrdine });
		return ordine;
	} catch (error) {
		throw new Error('Impossibile ottenere ordine');
	}
};

module.exports = {
	getClienti,
	/* getCliente, */
	updCliente,
	getArticoli,
	getContatoreArt,
	getArticolo,
	updArticolo,
	getCategorie,
    getUnitaMisura,
	getContatoreOrd,
	updContatoreOrd,
	getRigaOrd,
	getOrdini,
	getOrdiniX,
	getOrdine
};