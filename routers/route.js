var express = require('express');
var bodyParser = require('body-parser');
var urlencodeParser = bodyParser.urlencoded({ extended: false });
var validator = require('express-validator');
const Utente = require('../models/Utente');
const Articolo = require('../models/Articolo');
const Contatore = require('../models/Contatore');
const Ordine = require('../models/Ordine');
const controller = require('../controllers/Controller');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;


// Configurazione Multer Clienti per gestire l'upload dei file
const storageClienti = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, 'uploads/clienti');
	},
	filename: function (req, file, cb) {
	  cb(null, Date.now() + '-' + file.originalname);
	}
  });
  
  var uploadClienti = multer({
	storage: storageClienti,
	fileFilter: (req, file, cb) => {
		  if (file.mimetype == "image/png" || file.mimetype == "image/jpeg" || file.mimetype == "text/plain"  || file.mimetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
				cb(null, true);
		  } else {
				cb(null, false);
				return cb(new Error('Ammesse solo estensioni .png, jpg'));
		  }
		  }
	}).single('file');

// Configurazione Multer Articoli per gestire l'upload dei file
const storageArticoli = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, 'uploads/articoli');
	},
	filename: function (req, file, cb) {
	  cb(null, Date.now() + '-' + file.originalname);
	}
  });
  
  var uploadArticoli = multer({
	storage: storageArticoli,
	fileFilter: (req, file, cb) => {
		  if (file.mimetype == "image/png" || file.mimetype == "image/jpeg" || file.mimetype == "text/plain"  || file.mimetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
				cb(null, true);
		  } else {
				cb(null, false);
				return cb(new Error('Ammesse solo estensioni .png, jpg'));
		  }
		  }
	}).single('file');

module.exports = function (app) {

      function isUserAllowed(req, res, next) {

            const token = req.cookies.token;
            if (!token) return res.redirect('/login');

            try {
              const decoded = jwt.verify(token, jwtSecret);
              req.UserId = decoded.userId;
              next();
            } catch (err) {
              console.error('JWT Error:', err.message);
              return res.redirect('/login');
            }
          }

      // Homepage redirect protetto
      app.get('/', isUserAllowed, (req, res) => {
            res.redirect('/lista-clienti');
      });
      

      // Cliente
      app.get('/inserisci-cliente', isUserAllowed, function (req, res) {
            res.locals = { title: 'Inserisci Cliente' };
            res.render('Clienti/inserisci-cliente');
      });
 
      app.get('/lista-clienti', isUserAllowed, async (req, res) => {
            try {
                  const utente = await controller.getClienti();
                  if(utente){
                        sess = req.session;
                        res.locals = { title: 'Utenti' };
                        res.render('Clienti/lista-clienti', { 'message': req.flash('message'), 'error': req.flash('error'), 'Dati': utente, 'Tipo' : sess.user.tipo, 'EmailLogin' : sess.user.email });
                  }else{
                        req.flash('message', 'Utenti non trovati!');
                        res.redirect('/login');
                  }
            } catch (error) {
                  req.flash('message', 'Utenti non trovati!');
                  res.redirect('/login');
            }
      });
      app.get('/lista-clienti-fetch', isUserAllowed, async (req, res) => {
            
            try {
                  const utente = await controller.getClienti();
                  if(utente){
                        res.locals = { title: 'Ordine' };
                        res.json(utente);
                  }else{
                        console.log('no clienti');
                  }
            } catch (error) {
                  console.log(error);
            }
      });

      app.post('/lista-clienti-selezioni', isUserAllowed, async (req, res) => {
            try {
                  const utente = await controller.getClienti();
                  if(utente){
                        res.locals = { title: 'Utenti' };
                        res.render('Clienti/lista-clienti', { 'message': req.flash('message'), 'error': req.flash('error'), 'Dati': utente, 'Tipo' : sess.user.tipo, 'EmailLogin' : sess.user.email });
                  }else{
                        req.flash('message', 'Utenti non trovati!');
                        res.redirect('/login');
                  }
            } catch (error) {
                  req.flash('message', 'Utenti non trovati!');
                  res.redirect('/login');
            }
      });

      app.get('/aggiorna-cliente', isUserAllowed, async (req, res) => {
            const email = req.query.email?.trim();
          
            if (!email) {
              req.flash('error', 'Email non fornita.');
              return res.redirect('/lista-clienti');
            }
          
            try {
              const Arrayutente = await controller.getClienti(email);
              const utente = Arrayutente[0]
              if (!utente) {
                req.flash('error', 'Utente non trovato!');
                return res.redirect('/lista-clienti');
              }
              res.render('Clienti/aggiorna-cliente', {
                title: 'Modifica Cliente',
                message: req.flash('message'),
                error: req.flash('error'),
                utente
              });
          
            } catch (error) {
              console.error('Errore durante il recupero cliente:', error);
              req.flash('error', 'Errore interno. Riprova più tardi.');
              res.redirect('/lista-clienti');
            }
          });

      app.get('/disabilita-cliente', isUserAllowed, urlencodeParser, async (req, res) => {
            const email = (req.query.email);
            try {
                  const utente = await controller.getClienti(email);
                  if(utente){
                        res.locals = { title: 'Modifica Utente' };
                        res.render('Clienti/disabilita-cliente', { 'message': req.flash('message'), 'error': req.flash('error'), 'utente': utente[0] });
                  }else{
                        req.flash('message', 'Utente non trovato!');
                        res.redirect('/login');
                  }
            } catch (error) {
                  req.flash('message', 'Utente non trovato!');
                  res.redirect('/lista-clienti');
            }
      });

      app.post('/aggiornaCliente', urlencodeParser, (req, res) => {
            uploadClienti(req, res, async function (err) {
              if (err instanceof multer.MulterError || err) {
                console.error('Errore upload:', err);
                req.flash('error', 'Errore nel caricamento file.');
                return res.redirect('/lista-clienti');
              }
              const fotoPath = req.file?.path || "";
              const email = req.body.emailHidden?.trim();
          
              if (!email) {
                req.flash('error', 'Email cliente mancante.');
                return res.redirect('/lista-clienti');
              }
          
              const objUtente = {
                nome: req.body.nome?.trim(),
                cognome: req.body.cognome?.trim(),
                piva: req.body.piva?.trim(),
                note: req.body.note?.trim(),
                email,
                fotoPath,
                tipo: req.body.tipo || ''  // <-- aggiunto qui
              };
          
              try {
                const utenteAggiornato = await controller.updCliente(objUtente);
          
                if (utenteAggiornato) {
                  req.flash('message', 'Utente aggiornato con successo!');
                } else {
                  req.flash('error', 'Utente non trovato o non aggiornato.');
                }
          
                res.redirect('/lista-clienti');
          
              } catch (error) {
                console.error('Errore aggiornamento cliente:', error);
                req.flash('error', 'Errore durante l\'aggiornamento del cliente.');
                res.redirect('/lista-clienti');
              }
            });
          });

      app.post('/disabilitaCliente', urlencodeParser, async (req, res) =>  {
                  let objUtente = {
                        email: req.body.emailHidden,
                        stato: false
                  }
                  try {
                        const utente = await controller.updCliente(objUtente);
                        if(utente){
                              req.flash('message', 'Utente aggiornato!');
                              res.redirect('/lista-clienti');
                        }else{
                              req.flash('message', 'Utente non disabilitato!');
                              res.redirect('/login');
                        }
                  } catch (error) {
                        
                  }
	});

      app.get('/dettaglio-cliente', isUserAllowed, urlencodeParser, async (req, res) => {
            const email = (req.query.email);
            try {
                  const utente = await controller.getClienti(email);
                  if(utente){
                        res.locals = { title: 'Dettaglio Cliente' };
                        res.render('Clienti/dettaglio-cliente', { 'message': req.flash('message'), 'error': req.flash('error'), 'utente': utente[0] });
                  }else{
                        req.flash('message', 'Utente non trovato!');
                        res.redirect('/lista-clienti');
                  }
            } catch (error) {
                  req.flash('message', 'Utente non trovato!');
                  res.redirect('/lista-clienti');
            }
      });

      // Articolo
      app.get('/inserisci-articolo', isUserAllowed, function (req, res) {
            res.locals = { title: 'Inserisci Articolo' };
            res.render('Articoli/inserisci-articolo', { 'message': req.flash('message'), 'error': req.flash('error') });
      });

      app.get('/lista-articoli', isUserAllowed, async (req, res) => {
            try {
                  const articolo = await controller.getArticoli();
                  if(articolo[0]!==undefined){
                        res.locals = { title: 'Articoli' };
                        res.render('Articoli/lista-articoli', { 'message': req.flash('message'), 'error': req.flash('error'), 'Articoli': articolo, 'Tipo' : sess.user.tipo, 'EmailLogin' : sess.user.email });
                  }else{
                        res.locals = { title: 'Articoli' };
                        req.flash('message', 'Articoli non trovati!');
                        res.render('Articoli/lista-articoli', { 'message': req.flash('message'), 'error': req.flash('error'), 'Articoli': articolo, 'Tipo' : sess.user.tipo, 'EmailLogin' : sess.user.email });
                  }
            } catch (error) {
                  req.flash('error', 'Errore lettura dati!');
                  res.render('/lista-clienti');
            }
      });

      app.get('/lista-articoli-fetch', isUserAllowed, async (req, res) => {
            
            try {
                  const articolo = await controller.getArticoli();
                  if(articolo){
                        res.locals = { title: 'Articolo' };
                        res.json(articolo);
                  }else{
                        console.log('no articoli');
                  }
            } catch (error) {
                  console.log(error);
            }
      });

      app.post('/inserisci-articolo', isUserAllowed, async (req, res) => { 
            try {
                  const contatoreNew = await controller.getContatoreArt();
                  if(contatoreNew){
                        uploadArticoli(req, res, function (err){
                              if (req.file !== undefined) {
                                    var fotoPath = req.file.path;
                              } else {
                                    var fotoPath = "";
                              } 
                              let articolo = new Articolo ({
                                    codiceArticolo : contatoreNew,
                                    descrizioneArticolo: req.body.descrizione,
                                    quantitaArticolo: req.body.quantita,
                                    costoArticolo: req.body.costo,
                                    noteArticolo: req.body.note,
                                    fotoPathArticolo:fotoPath
                              })
                              articolo.save(err)
                              .then(articolo => {
                                    req.flash('message', 'Articolo inserito!');
                                    res.redirect('/lista-articoli');
                              })
                              .catch(error => {
                                    console.log(error);
                                    req.flash('error', 'Articolo non inserito1!');
                                    res.redirect('/lista-articoli');
                              })
                              if (err instanceof multer.MulterError) {
                                    res.send(err)
                              } else if (err) {
                                    res.send(err)
                              }
                        })
                  }else{
                        console.log('Articolo non inserito!');
                        req.flash('error', 'Articolo non inserito2!');
                        res.redirect('/lista-articoli');
                  }
            } catch (error) {
                  console.log(error);
                  req.flash('error', 'Articolo non inserito!');
                  res.redirect('/lista-articoli');
            }
      });

      app.get('/aggiorna-articolo', isUserAllowed, urlencodeParser, async (req, res) => {
            const cdArticolo = (req.query.cdArticolo);
            try {
                  const articolo = await controller.getArticolo(cdArticolo);
                  if(articolo){
                        res.locals = { title: 'Modifica Articolo' };
                        res.render('Articoli/aggiorna-articolo', { 'message': req.flash('message'), 'error': req.flash('error'), 'articolo': articolo });
                  }else{
                        req.flash('message', 'Articolo non trovato!');
                        res.redirect('/lista-articoli');
                  }
            } catch (error) {
                  req.flash('message', 'Articolo non trovato!');
                  res.redirect('/lista-articoli');
            }
      });

      app.post('/aggiorna-articolo', urlencodeParser, async (req, res) =>  {
            uploadArticoli(req, res, async function (err){
                  if (req.file !== undefined) {
                        var fotoPath = req.file.path;
                  } else {
                        var fotoPath = "";
                  } 
                  const cdArticolo = req.body.codiceHidden;
                  let objArticolo = {
                        codiceArticolo : cdArticolo,
                        descrizioneArticolo: req.body.descrizione,
                        quantitaArticolo: req.body.quantita,
                        costoArticolo: req.body.costo,
                        noteArticolo: req.body.note,
                        fotoPathArticolo:fotoPath
                  }
                  
                  
                  try {
                        const articolo = await controller.updArticolo(objArticolo);
                        if(articolo){
                              req.flash('message', 'Articolo aggiornato!');
                              res.redirect('/lista-articoli');
                        }else{
                              req.flash('message', 'Articolo non aggiornato!');
                              res.redirect('/lista-articoli');
                        }
                  } catch (error) {
                        
                  }

                  if (err instanceof multer.MulterError) {
                        res.send(err)
                  } else if (err) {
                        res.send(err)
                  }
            })
            
	});

      app.get('/disabilita-articolo', isUserAllowed, urlencodeParser, async (req, res) => {
            const cdArticolo = (req.query.cdArticolo);
            try {
                  const articolo = await controller.getArticolo(cdArticolo);
                  if(articolo){
                        res.locals = { title: 'Modifica Articolo' };
                        res.render('Articoli/disabilita-articolo', { 'message': req.flash('message'), 'error': req.flash('error'), 'articolo': articolo });
                  }else{
                        req.flash('message', 'Articolo non trovato!');
                        res.redirect('/lista-articoli');
                  }
            } catch (error) {
                  req.flash('message', 'Articolo non trovato!');
                  res.redirect('/lista-articoli');
            }
      });

      app.post('/disabilita-articolo', urlencodeParser, async (req, res) =>  {
            const cdArticolo = req.body.cdArticoloHidden;
            let objArticolo = {
                  codiceArticolo: cdArticolo,
                  statoArticolo: false
            }
            try {
                  const articolo = await controller.updArticolo(objArticolo);
                  if(articolo){
                        req.flash('message', 'Articolo aggiornato!');
                        res.redirect('/lista-articoli');
                  }else{
                        req.flash('message', 'Articolo non disabilitato!');
                        res.redirect('/lista-articoli');
                  }
            } catch (error) {
                  
            }
      });

      app.get('/dettaglio-articolo', isUserAllowed, urlencodeParser, async (req, res) => {
            const cdArticolo = (req.query.cdArticolo);
            try {
                  const articolo = await controller.getArticolo(cdArticolo);
                  if(articolo){
                        res.locals = { title: 'Dettaglio Articolo' };
                        res.render('Articoli/dettaglio-articolo', { 'message': req.flash('message'), 'error': req.flash('error'), 'articolo': articolo });
                  }else{
                        req.flash('message', 'Dettaglio non trovato!');
                        res.redirect('/lista-articoli');
                  }
            } catch (error) {
                  req.flash('message', 'Dettaglio non trovato!');
                  res.redirect('/lista-articoli');
            }
      });

       // Ordine
       app.get('/inserisci-ordine', isUserAllowed, function (req, res) {
            res.locals = { title: 'Inserisci Ordine' };
            res.render('Ordini/inserisci-ordine', { 'message': req.flash('message'), 'error': req.flash('error') });
      });

      
      app.post('/stampa-ordine', isUserAllowed, urlencodeParser, async (req, res) =>  {  
            const hiddenContent =req.body.txtContenuto;
             res.locals = { title: 'Stampa Ordine' };
             res.render('Ordini/stampa-ordine', { hiddenContent });
       });

       app.post('/inserisci-ordine', isUserAllowed, urlencodeParser, async (req, res) => { 
            var ordiniDaInserire = req.body;
            try {
                  //reperisco numero ordine
                  const contatoreNew = await controller.getContatoreOrd();
                  if(contatoreNew){
                        //ciclo righe ordine
                        for (var i = 0; i < ordiniDaInserire.length; i++) {
                              //reperisco numero riga
                              let rigaNew = await controller.getRigaOrd(contatoreNew);
                              if(rigaNew) {
                                    rigaNew = Number(rigaNew);
                                    var ordineNew = ordiniDaInserire[i];
                                    let nuovoOrdine = new Ordine ({
                                          codiceOrdine : contatoreNew,
                                          rigaOrdine: rigaNew,
                                          codiceArticolo : ordineNew.codiceArticolo,
                                          quantitaOrdine: ordineNew.quantitaOrdine,
                                          prezzoOrdine: ordineNew.prezzoOrdine,
                                          valoreOrdine: ordineNew.valoreOrdine,   
                                          clienteOrdine: ordineNew.clienteOrdine                                  
                                    })
                                    try {
                                          const result = await nuovoOrdine.save()
                                          if(result) {
                                                //console.log('Ordine salvato con successo:', result);
                                                console.log('Ordine salvato con successo');
                                          }else{
                                                console.error('Errore nel salvataggio dell\'ordine:', error);
                                          }
                                    } catch (error) {
                                          console.log(error);
                                    }
                              }
                        }
                        res.redirect('/lista-ordini');
                  }else{
                        console.log('Ordine non inserito!');
                        req.flash('error', 'Ordine non inserito!');
                        res.redirect('/lista-ordini');
                  }
            } catch (error) {
                  console.log(error);
                  req.flash('error', 'Ordine non inserito!');
                  res.redirect('/lista-ordini');
            }
      });

      app.get('/lista-ordini', isUserAllowed, async (req, res) => {
            try {
                  const ordiniX = await controller.getOrdiniX();
                  const ordini=[];
                  //const ordini = await controller.getOrdini();
                  if(ordiniX[0]!==undefined){
                        res.locals = { title: 'Ordini' };
                        req.flash('message', 'Ordini caricati!');
                        res.render('Ordini/lista-ordini', { 'message': req.flash('message'), 'error': req.flash('error'), 'OrdiniX': ordiniX, 'Ordini': ordini, 'Tipo' : sess.user.tipo, 'EmailLogin' : sess.user.email });
                  }else{
                        res.locals = { title: 'Ordini' };
                        req.flash('message', 'Ordini non caricati!');
                        res.render('Ordini/lista-ordini', { 'message': req.flash('message'), 'error': req.flash('error'), 'OrdiniX': ordiniX, 'Ordini': ordini, 'Tipo' : sess.user.tipo, 'EmailLogin' : sess.user.email });
                  }
            } catch (error) {
                  req.flash('error', 'Errore lettura dati!');
                  res.render('/lista-ordini');
            }
      });

      app.get('/ordine-dettaglio-fetch', isUserAllowed, async (req, res) => {
            const cdOrdine = (req.query.cdOrdine);
            try {
                  const ordine = await controller.getOrdine(cdOrdine);
                  if(ordine){
                        res.locals = { title: 'Ordine' };
                        res.json(ordine);
                  }else{
                        console.log('no Ordine');
                  }
            } catch (error) {
                  console.log(error);
            }
      });

      app.get('/ordini-testate-fetch', isUserAllowed, async (req, res) => {
            try {
                  const ordiniX = await controller.getOrdiniX();
                  if(ordiniX[0]){
                        res.locals = { title: 'Ordini' };
                        res.json(ordiniX);
                  }else{
                        console.log('no Ordini');
                  }
            } catch (error) {
                  console.log(error);
            }
      });

      app.get('/aggiorna-ordine', isUserAllowed, urlencodeParser, async (req, res) => {
            const cdOrdine = (req.query.cdOrdine);
            try {
                  const ordine = await controller.getOrdine(cdOrdine);
                  if(ordine){
                        res.locals = { title: 'Modifica Ordine' };
                        res.render('Ordini/aggiorna-ordine', { 'message': req.flash('message'), 'error': req.flash('error'), 'ordine': ordine });
                  }else{
                        req.flash('message', 'Ordine non trovato!');
                        res.redirect('/lista-ordini');
                  }
            } catch (error) {
                  req.flash('message', 'Ordine non trovato!');
                  res.redirect('/lista-ordini');
            }
      });
}