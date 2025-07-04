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
const controller = require('../controllers/Controller');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const session = require('express-session');
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
            if (file.mimetype == "image/png" || file.mimetype == "image/jpeg" || file.mimetype == "text/plain" || file.mimetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
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
            if (file.mimetype == "image/png" || file.mimetype == "image/jpeg" || file.mimetype == "text/plain" || file.mimetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
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
            sess = req.session;     
            res.locals = { title: 'Inserisci Cliente' };
            res.render('Clienti/inserisci-cliente', { 'session': req.session, sess });
      });

      app.get('/lista-clienti', isUserAllowed, async (req, res) => {
            try {
                  const utente = await controller.getClienti();
                  if (utente) {
                        sess = req.session;
                        res.locals = { title: 'Utenti' };
                        res.render('Clienti/lista-clienti', { 'message': req.flash('message'), 'error': req.flash('error'), 'Dati': utente, 'Tipo': sess.user.tipo, 'EmailLogin': sess.user.email, 'Foto': sess.user.path });
                  } else {
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
                  if (utente) {
                        res.locals = { title: 'Ordine' };
                        res.json(utente);
                  } else {
                        console.log('no clienti');
                  }
            } catch (error) {
                  console.log(error);
            }
      });

      app.post('/lista-clienti-selezioni', isUserAllowed, async (req, res) => {
            try {
                  const utente = await controller.getClienti();
                  if (utente) {
                        res.locals = { title: 'Utenti' };
                        res.render('Clienti/lista-clienti', { 'message': req.flash('message'), 'error': req.flash('error'), 'Dati': utente, 'Tipo': sess.user.tipo, 'EmailLogin': sess.user.email });
                  } else {
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
                        utente,
                        session: req.session  // <-- importante!
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
                  if (utente) {
                        sess = req.session;
                        res.locals = { title: 'Modifica Utente' };
                        res.render('Clienti/disabilita-cliente', { 'message': req.flash('message'), 'error': req.flash('error'), 'utente': utente[0] });
                  } else {
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
                  /*  const fotoPath = req.file?.path || ""; */
                  const email = req.body.emailHidden?.trim();

                  if (!email) {
                        req.flash('error', 'Email cliente mancante.');
                        return res.redirect('/lista-clienti');
                  }

                  let fotoPath = '';
                  if (req.file?.path) {
                        fotoPath = req.file.path;
                  } else {
                        // 📦 Recupera la foto attuale dal DB se nessun nuovo file è stato caricato
                        try {
                              const utente = await Utente.findOne({ email });
                              if (utente) {
                                    fotoPath = utente.fotoPath || "";
                              }
                        } catch (dbErr) {
                              console.error('Errore recupero foto esistente:', dbErr);
                              req.flash('error', 'Errore durante l\'aggiornamento della foto.');
                              return res.redirect('/lista-clienti');
                        }
                  }

                  const objUtente = {
                        nome: req.body.nome?.trim(),
                        cognome: req.body.cognome?.trim(),
                        piva: req.body.piva?.trim(),
                        note: req.body.note?.trim(),
                        email,
                        fotoPath,
                        tipo: req.body.tipo || '',
                        modificatoDa: req.session.user?._id || null
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

      app.post('/disabilitaCliente', urlencodeParser, async (req, res) => {
            let objUtente = {
                  email: req.body.emailHidden,
                  stato: false
            }
            try {
                  const utente = await controller.updCliente(objUtente);
                  if (utente) {
                        req.flash('message', 'Utente aggiornato!');
                        res.redirect('/lista-clienti');
                  } else {
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
                  if (utente) {
                        res.locals = { title: 'Dettaglio Cliente' };
                        res.render('Clienti/dettaglio-cliente', { 'message': req.flash('message'), 'error': req.flash('error'), 'utente': utente[0] });
                  } else {
                        req.flash('message', 'Utente non trovato!');
                        res.redirect('/lista-clienti');
                  }
            } catch (error) {
                  req.flash('message', 'Utente non trovato!');
                  res.redirect('/lista-clienti');
            }
      });

      app.post('/toggle-stato', express.urlencoded({ extended: false }), async (req, res) => {
            if (!req.session.user || req.session.user.tipo !== 'A') {
              req.flash('error', 'Azione non autorizzata.');
              return res.redirect('/lista-clienti');
            }
          
            const email = req.body.email?.trim();
          
            try {
              const utente = await Utente.findOne({ email });
          
              if (!utente) {
                req.flash('error', 'Utente non trovato!');
                return res.redirect('/lista-clienti');
              }
          
              utente.stato = !utente.stato;
              await utente.save();
          
              req.flash('message', `Utente ${utente.stato ? 'attivato' : 'disattivato'} con successo.`);
              res.redirect('/lista-clienti');
          
            } catch (err) {
              console.error('Errore toggle stato:', err);
              req.flash('error', 'Errore durante l\'aggiornamento dello stato.');
              res.redirect('/lista-clienti');
            }
          });
          

      // Articolo
      /* app.get('/inserisci-articolo', isUserAllowed, function (req, res) {
            res.locals = { title: 'Inserisci Articolo' };
            res.render('Articoli/inserisci-articolo', { 'message': req.flash('message'), 'error': req.flash('error') });
      }); */

      app.get('/inserisci-articolo', isUserAllowed, async (req, res) => {
            const categorie = await controller.getCategorie();      // <-- Recupera categorie
            const unitaMisura = await controller.getUnitaMisura();  // <-- Recupera unità di misura
            res.render('Articoli/inserisci-articolo', {
                categorie: categorie,
                unitaMisura: unitaMisura,
                title: 'Inserisci Articolo',
                message: req.flash('message'),
                error: req.flash('error')
            });
        });
        

      /* app.get('/lista-articoli', isUserAllowed, async (req, res) => {
            try {
                  const articolo = await controller.getArticoli();
                  if (articolo[0] !== undefined) {
                        res.locals = { title: 'Articoli' };
                        res.render('Articoli/lista-articoli', { 'message': req.flash('message'), 'error': req.flash('error'), 'Articoli': articolo, 'Tipo': sess.user.tipo, 'EmailLogin': sess.user.email });
                  } else {
                        res.locals = { title: 'Articoli' };
                        req.flash('message', 'Articoli non trovati!');
                        res.render('Articoli/lista-articoli', { 'message': req.flash('message'), 'error': req.flash('error'), 'Articoli': articolo, 'Tipo': sess.user.tipo, 'EmailLogin': sess.user.email });
                  }
            } catch (error) {
                  req.flash('error', 'Errore lettura dati!');
                  res.render('/lista-clienti');
            }
      }); */

      app.get('/lista-articoli', isUserAllowed, async (req, res) => {
            try {
                const articoli = await controller.getArticoli();
                const articoliTrovati = Array.isArray(articoli) && articoli.length > 0;
        
                if (!articoliTrovati) {
                    req.flash('message', 'Articoli non trovati!');
                }
        
                res.locals.title = 'Articoli';
                res.render('Articoli/lista-articoli', {
                    message: req.flash('message'),
                    error: req.flash('error'),
                    Articoli: articoli || [],
                    Tipo: req.session.user.tipo,
                    EmailLogin: req.session.user.email
                });
            } catch (error) {
                console.error('Errore nella lettura articoli:', error);
                req.flash('error', 'Errore lettura dati!');
                return res.redirect('/lista-clienti');
            }
        });
        

      app.get('/lista-articoli-fetch', isUserAllowed, async (req, res) => {

            try {
                  const articolo = await controller.getArticoli();
                  if (articolo) {
                        res.locals = { title: 'Articolo' };
                        res.json(articolo);
                  } else {
                        console.log('no articoli');
                  }
            } catch (error) {
                  console.log(error);
            }
      });

      /* app.post('/inserisci-articolo', isUserAllowed, async (req, res) => {
            try {
                  const contatoreNew = await controller.getContatoreArt();
                  if (contatoreNew) {
                        uploadArticoli(req, res, function (err) {
                              if (req.file !== undefined) {
                                    var fotoPath = req.file.path;
                              } else {
                                    var fotoPath = "";
                              }
                              let articolo = new Articolo({
                                    codiceArticolo: contatoreNew,
                                    descrizioneArticolo: req.body.descrizione,
                                    quantitaArticolo: req.body.quantita,
                                    costoArticolo: req.body.costo,
                                    noteArticolo: req.body.note,
                                    fotoPathArticolo: fotoPath
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
                  } else {
                        console.log('Articolo non inserito!');
                        req.flash('error', 'Articolo non inserito2!');
                        res.redirect('/lista-articoli');
                  }
            } catch (error) {
                  console.log(error);
                  req.flash('error', 'Articolo non inserito!');
                  res.redirect('/lista-articoli');
            }
      }); */

      app.post('/inserisci-articolo', isUserAllowed, async (req, res) => {
            try {
                const contatoreNew = await controller.getContatoreArt();
                if (!contatoreNew) {
                    req.flash('error', 'Articolo non inserito2!');
                    return res.redirect('/lista-articoli');
                }
        
                uploadArticoli(req, res, async (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send(err);
                    }
        
                    const fotoPath = req.file?.path || "";
        
                    const nuovoArticolo = new Articolo({
                        codiceArticolo: contatoreNew,
                        descrizioneArticolo: req.body.descrizione,
                        quantitaArticolo: req.body.quantita,
                        costoArticolo: req.body.costo,
                        noteArticolo: req.body.note,
                        fotoPathArticolo: fotoPath,
                        categoria: req.body.categoria || null,
                        unitaMisura: req.body.unitaMisura || null,
                        creatoDa: req.session.user?._id || null
                    });
        
                    try {
                        await nuovoArticolo.save();
                        req.flash('message', 'Articolo inserito!');
                    } catch (saveError) {
                        console.error(saveError);
                        req.flash('error', 'Articolo non inserito!');
                    }
        
                    res.redirect('/lista-articoli');
                });
        
            } catch (error) {
                console.error(error);
                req.flash('error', 'Articolo non inserito!');
                res.redirect('/lista-articoli');
            }
        });
        

      /* app.get('/aggiorna-articolo', isUserAllowed, urlencodeParser, async (req, res) => {
            const cdArticolo = (req.query.cdArticolo);
            try {
                  const articolo = await controller.getArticolo(cdArticolo);
                  if (articolo) {
                        res.locals = { title: 'Modifica Articolo' };
                        res.render('Articoli/aggiorna-articolo', { 'message': req.flash('message'), 'error': req.flash('error'), 'articolo': articolo });
                  } else {
                        req.flash('message', 'Articolo non trovato!');
                        res.redirect('/lista-articoli');
                  }
            } catch (error) {
                  req.flash('message', 'Articolo non trovato!');
                  res.redirect('/lista-articoli');
            }
      }); */

      app.get('/aggiorna-articolo', isUserAllowed, urlencodeParser, async (req, res) => {
            const cdArticolo = req.query.cdArticolo;
        
            try {
                const articolo = await controller.getArticolo(cdArticolo);
                if (articolo) {
                  const categorie = await controller.getCategorie();      // <-- Recupera categorie
                  const unitaMisura = await controller.getUnitaMisura();  // <-- Recupera unità di misura
                    res.locals.title = 'Modifica Articolo';
                    res.render('Articoli/aggiorna-articolo', {
                        message: req.flash('message'),
                        error: req.flash('error'),
                        articolo: articolo,
                        categorie: categorie,
                        unitaMisura: unitaMisura
                    });
                } else {
                    handleError(req, res, 'Articolo non trovato!');
                }
            } catch (error) {
                handleError(req, res, 'Errore durante il recupero dell\'articolo');
            }
        });
        
        // Funzione per gestire gli errori e i redirect
        function handleError(req, res, message) {
            req.flash('message', message);
            res.redirect('/lista-articoli');
        }
        

      /* app.post('/aggiorna-articolo', urlencodeParser, async (req, res) => {
            uploadArticoli(req, res, async function (err) {
                  if (req.file !== undefined) {
                        var fotoPath = req.file.path;
                  } else {
                        var fotoPath = "";
                  }
                  const cdArticolo = req.body.codiceHidden;
                  let objArticolo = {
                        codiceArticolo: cdArticolo,
                        descrizioneArticolo: req.body.descrizione,
                        quantitaArticolo: req.body.quantita,
                        costoArticolo: req.body.costo,
                        noteArticolo: req.body.note,
                        fotoPathArticolo: fotoPath
                  }


                  try {
                        const articolo = await controller.updArticolo(objArticolo);
                        if (articolo) {
                              req.flash('message', 'Articolo aggiornato!');
                              res.redirect('/lista-articoli');
                        } else {
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

      }); */

      app.post('/aggiorna-articolo', urlencodeParser, (req, res) => {
            uploadArticoli(req, res, async (err) => {
                if (err) {
                    console.error('Errore upload:', err);
                    return res.status(500).send(err);
                }
        
                const fotoPath = req.file?.path || "";
                const objArticolo = {
                    codiceArticolo: req.body.codiceHidden,
                    descrizioneArticolo: req.body.descrizione,
                    quantitaArticolo: req.body.quantita,
                    costoArticolo: req.body.costo,
                    noteArticolo: req.body.note,
                    fotoPathArticolo: fotoPath,
                    categoria: req.body.categoria || null,  
                    unitaMisura: req.body.unitaMisura || null,  
                    modificatoDa: req.session.user?._id || null,
                    updatedAt: new Date()  
                };
        
                try {
                    const aggiornato = await controller.updArticolo(objArticolo);
                    if (aggiornato) {
                        req.flash('message', 'Articolo aggiornato!');
                    } else {
                        req.flash('error', 'Articolo non aggiornato!');
                    }
                } catch (updateError) {
                    console.error('Errore aggiornamento:', updateError);
                    req.flash('error', 'Errore durante l\'aggiornamento!');
                }
        
                res.redirect('/lista-articoli');
            });
        });
        

      /* app.get('/disabilita-articolo', isUserAllowed, urlencodeParser, async (req, res) => {
            const cdArticolo = (req.query.cdArticolo);
            try {
                  const articolo = await controller.getArticolo(cdArticolo);
                  if (articolo) {
                        res.locals = { title: 'Modifica Articolo' };
                        res.render('Articoli/disabilita-articolo', { 'message': req.flash('message'), 'error': req.flash('error'), 'articolo': articolo });
                  } else {
                        req.flash('message', 'Articolo non trovato!');
                        res.redirect('/lista-articoli');
                  }
            } catch (error) {
                  req.flash('message', 'Articolo non trovato!');
                  res.redirect('/lista-articoli');
            }
      }); */

      app.get('/disabilita-articolo', isUserAllowed, urlencodeParser, async (req, res) => {
            const codiceArticolo = req.query.cdArticolo;
        
            try {
                const articolo = await controller.getArticolo(codiceArticolo);

                if (!articolo) {
                    req.flash('message', 'Articolo non trovato!');
                    return res.redirect('/lista-articoli');
                }
        
                res.locals.title = 'Modifica Articolo';
                res.render('Articoli/disabilita-articolo', {
                    message: req.flash('message'),
                    error: req.flash('error'),
                    articolo
                });
            } catch (error) {
                console.error('Errore durante il recupero dell\'articolo:', error);
                req.flash('error', 'Errore durante il caricamento dell\'articolo.');
                res.redirect('/lista-articoli');
            }
        });
        

      /* app.post('/disabilita-articolo', urlencodeParser, async (req, res) => {
            const cdArticolo = req.body.cdArticoloHidden;
            let objArticolo = {
                  codiceArticolo: cdArticolo,
                  statoArticolo: false
            }
            try {
                  const articolo = await controller.updArticolo(objArticolo);
                  if (articolo) {
                        req.flash('message', 'Articolo aggiornato!');
                        res.redirect('/lista-articoli');
                  } else {
                        req.flash('message', 'Articolo non disabilitato!');
                        res.redirect('/lista-articoli');
                  }
            } catch (error) {

            }
      }); */

      app.post('/disabilita-articolo', urlencodeParser, async (req, res) => {
            const codiceArticolo = req.body.cdArticoloHidden;
        
            try {
                const articoloAggiornato = await controller.updArticolo({
                    codiceArticolo,
                    statoArticolo: false,
                    modificatoDa: req.session.user?._id || null,
                    updatedAt: new Date()
                });
        
                if (articoloAggiornato) {
                    req.flash('message', 'Articolo disabilitato con successo!');
                } else {
                    req.flash('error', 'Articolo non trovato o non disabilitato!');
                }
            } catch (error) {
                console.error(`Errore nella disabilitazione articolo (${codiceArticolo}):`, error.message);
                req.flash('error', 'Errore durante la disabilitazione dell\'articolo.');
            }
        
            res.redirect('/lista-articoli');
        });
        

      /* app.get('/dettaglio-articolo', isUserAllowed, urlencodeParser, async (req, res) => {
            const cdArticolo = (req.query.cdArticolo);
            try {
                  const articolo = await controller.getArticolo(cdArticolo);
                  if (articolo) {
                        res.locals = { title: 'Dettaglio Articolo' };
                        res.render('Articoli/dettaglio-articolo', { 'message': req.flash('message'), 'error': req.flash('error'), 'articolo': articolo });
                  } else {
                        req.flash('message', 'Dettaglio non trovato!');
                        res.redirect('/lista-articoli');
                  }
            } catch (error) {
                  req.flash('message', 'Dettaglio non trovato!');
                  res.redirect('/lista-articoli');
            }
      }); */

      app.get('/dettaglio-articolo', isUserAllowed, urlencodeParser, async (req, res) => {
            const codiceArticolo = req.query.cdArticolo;
        
            try {
                const articolo = await controller.getArticolo(codiceArticolo);
        
                if (!articolo) {
                    req.flash('error', 'Articolo non trovato!');
                    return res.redirect('/lista-articoli');
                }
        
                res.locals.title = 'Dettaglio Articolo';
                res.render('Articoli/dettaglio-articolo', {
                    message: req.flash('message'),
                    error: req.flash('error'),
                    articolo
                });
        
            } catch (error) {
                console.error(`Errore nel recupero dettaglio articolo (${codiceArticolo}):`, error.message);
                req.flash('error', 'Errore nel recupero del dettaglio!');
                res.redirect('/lista-articoli');
            }
        });
        
      app.get('/categorie-articolo', isUserAllowed, async (req, res) => {
      try {
            const catArticolo = await controller.getCatArticolo();
            const catArticoloTrovati = Array.isArray(catArticolo) && catArticolo.length > 0;
      
            if (!catArticoloTrovati) {
                  req.flash('message', 'Categorie articolo non trovate!');
            }
      
            res.locals.title = 'Categorie articolo';
            res.render('Articoli/categoria-articolo', {
                  message: req.flash('message'),
                  error: req.flash('error'),
                  CatArticolo: catArticolo || [],
                  Tipo: req.session.user.tipo,
                  EmailLogin: req.session.user.email
            });
      } catch (error) {
            console.error('Errore nella lettura categoria articolo:', error);
            req.flash('error', 'Errore lettura dati!');
            return res.redirect('/lista-articoli');
      }
      });

      app.get('/inserisci-catarticolo', isUserAllowed, async (req, res) => {
            res.render('Articoli/inserisci-catarticolo', {
                title: 'Inserisci Categoria Articolo',
                message: req.flash('message'),
                error: req.flash('error')
            });
        });

      app.post('/inserisci-catarticolo', isUserAllowed, async (req, res) => {
      try {
            const nuovaCategoria = new Categoria({
                  nome: req.body.nomeCategoria,
                  descrizione: req.body.descrizione,
                  creatoDa: req.session.user?._id || null
            });

            await nuovaCategoria.save();
            req.flash('message', 'Categoria articolo inserita con successo!');
      } catch (error) {
            console.error('Errore durante l\'inserimento della categoria articolo:', error);
            req.flash('error', 'Errore durante l\'inserimento della categoria.');
      }

      res.redirect('/categorie-articolo');
      });
        

      app.get('/aggiorna-catarticolo', isUserAllowed, urlencodeParser, async (req, res) => {
            const id = req.query.id; // Usa 'id' 
            
            try {
                  const Arraycatarticolo = await controller.getCatArticolo(id);
                  const catarticolo = Arraycatarticolo[0];

                  if (catarticolo) {
                        res.locals.title = 'Modifica Categoria Articolo';
                        res.render('Articoli/aggiorna-catarticolo', {
                        message: req.flash('message'),
                        error: req.flash('error'),
                        catarticolo: catarticolo
                        });
                  } else {
                        handleError(req, res, 'Categoria Articolo non trovata!');
                  }
            } catch (error) {
                  handleError(req, res, 'Errore durante il recupero della categoria articolo');
            }
      });

      app.post('/aggiorna-catarticolo', urlencodeParser, async (req, res) => {
            const categoriaId = req.body.idHidden; // id nascosto nel form
            const descrizione = req.body.descrizione;
            
            if (!categoriaId || !descrizione) {
			req.flash('error', 'Dati mancanti per l\'aggiornamento');
			return res.redirect('/categorie-articolo');
		}

            const objCategoria = {
                nome: req.body.nome,
                descrizione: req.body.descrizione,
                modificatoDa: req.session.user?._id || null,
                updatedAt: new Date()
            };
        
            try {
                const aggiornata = await controller.updCatArticolo(categoriaId, objCategoria);
        
                if (aggiornata) {
                    req.flash('message', 'Categoria aggiornata con successo!');
                } else {
                    req.flash('error', 'Categoria non trovata o non aggiornata.');
                }
            } catch (error) {
                console.error('Errore aggiornamento categoria:', error);
                req.flash('error', 'Errore durante l\'aggiornamento della categoria.');
            }
        
            res.redirect('/categorie-articolo');
      });

      app.get('/disabilita-catarticolo', isUserAllowed, urlencodeParser, async (req, res) => {
            const idCategoria = req.query.id;

            try {
                const Arraycategoria = await controller.getCatArticolo(idCategoria);
                const categoria = Arraycategoria[0];
                if (!categoria) {
                    req.flash('message', 'Categoria non trovata!');
                    return res.redirect('/categorie-articolo');
                }
        
                res.locals.title = 'Disabilita Categoria Articolo';
                res.render('Articoli/disabilita-catarticolo', {
                    message: req.flash('message'),
                    error: req.flash('error'),
                    catarticolo: categoria
                });
            } catch (error) {
                console.error('Errore durante il recupero della categoria:', error);
                req.flash('error', 'Errore durante il caricamento della categoria.');
                res.redirect('/categorie-articolo');
            }
        });
        
      app.post('/disabilita-catarticolo', isUserAllowed, urlencodeParser, async (req, res) => {
            const idCategoria = req.body.idHidden;
            
            const objcatArticolo = {
                  _id: idCategoria,
                  attiva: false,
                  modificatoDa: req.session.user?._id || null,
                  updatedAt: new Date()
            };
            
            try {
                  const risultato = await controller.updCatArticolo(idCategoria, objcatArticolo);
            
                  if (!risultato) {
                        req.flash('error', 'Categoria non trovata o non aggiornata!');
                        return res.redirect('/categorie-articolo');
                  }
            
                  req.flash('message', 'Categoria disabilitata con successo!');
            } catch (error) {
                  console.error('Errore durante la disabilitazione della categoria:', error);
                  req.flash('error', 'Errore durante la disabilitazione della categoria!');
            }
            
            res.redirect('/categorie-articolo');
      });
        
      app.get('/dettaglio-catarticolo', isUserAllowed, urlencodeParser, async (req, res) => {
            const id = req.query.id; 
            
            try {
                  const Arraycatarticolo = await controller.getCatArticolo(id);
                  const catarticolo = Arraycatarticolo[0];

                  if (catarticolo) {
                        res.locals.title = 'Dettaglio Categoria Articolo';
                        res.render('Articoli/dettaglio-catarticolo', {
                        message: req.flash('message'),
                        error: req.flash('error'),
                        catarticolo: catarticolo
                        });
                  } else {
                        handleError(req, res, 'Categoria Articolo non trovata!');
                  }
            } catch (error) {
                  handleError(req, res, 'Errore durante il recupero della categoria articolo');
            }
      });

      app.get('/unitamisure-articolo', isUserAllowed, async (req, res) => {
            try {
                  const unmArticolo = await controller.getUnmArticolo();
                  const unmArticoloTrovati = Array.isArray(unmArticolo) && unmArticolo.length > 0;
            
                  if (!unmArticoloTrovati) {
                        req.flash('message', 'Unità misure articolo non trovate!');
                  }
            
                  res.locals.title = 'Unità di misure articolo';
                  res.render('Articoli/unitamisura-articolo', {
                        message: req.flash('message'),
                        error: req.flash('error'),
                        UnmArticolo: unmArticolo || [],
                        Tipo: req.session.user.tipo,
                        EmailLogin: req.session.user.email
                  });
            } catch (error) {
                  console.error('Errore nella lettura unità misure articolo:', error);
                  req.flash('error', 'Errore lettura dati!');
                  return res.redirect('/lista-articoli');
            }
      });


      app.get('/inserisci-unmarticolo', isUserAllowed, async (req, res) => {
            res.render('Articoli/inserisci-unmarticolo', {
                  title: 'Inserisci Unitamisura Articolo',
                  message: req.flash('message'),
                  error: req.flash('error')
            });
      });
      
      app.post('/inserisci-unmarticolo', isUserAllowed, async (req, res) => {
            try {
                  const nuovaUnmarticolo = new UnitaMisura({
                        sigla: req.body.sigla,
                        descrizione: req.body.descrizione,
                        tipo: req.body.tipo,
                        creatoDa: req.session.user?._id || null
                  });

                  await nuovaUnmarticolo.save();
                  req.flash('message', 'Unità di misura articolo inserita con successo!');
            } catch (error) {
                  console.error('Errore durante l\'inserimento dell\' unità di misura articolo:', error);
                  req.flash('error', 'Errore durante l\'inserimento dell\' unità di misura.');
            }

            res.redirect('/unitamisure-articolo');
      });

      app.get('/aggiorna-unmarticolo', isUserAllowed, urlencodeParser, async (req, res) => {
            const id = req.query.id; // Usa 'id' 
            
            try {
                  const Arrayunmarticolo = await controller.getUnmArticolo(id);
                  const unmarticolo = Arrayunmarticolo[0];

                  if (unmarticolo) {
                        res.locals.title = 'Modifica Unità di misura Articolo';
                        res.render('Articoli/aggiorna-unmarticolo', {
                        message: req.flash('message'),
                        error: req.flash('error'),
                        unmarticolo: unmarticolo
                        });
                  } else {
                        handleError(req, res, 'Unità di misura Articolo non trovata!');
                  }
            } catch (error) {
                  handleError(req, res, 'Errore durante il recupero dell\' unità di misura articolo');
            }
      });

      app.post('/aggiorna-unmarticolo', urlencodeParser, async (req, res) => {
            const unitamisuraId = req.body.idHidden; // id nascosto nel form
            const descrizione = req.body.descrizione;
            const tipo = req.body.tipo;

            if (!unitamisuraId || !descrizione || !tipo) {
			req.flash('error', 'Dati mancanti per l\'aggiornamento');
			return res.redirect('/unitamisure-articolo');
		}

            const objUnitamisura = {
                sigla: req.body.sigla,
                descrizione: req.body.descrizione,
                tipo: req.body.tipo,
                modificatoDa: req.session.user?._id || null,
                updatedAt: new Date()
            };
        
            try {
                const aggiornata = await controller.updUnmArticolo(unitamisuraId, objUnitamisura);
        
                if (aggiornata) {
                    req.flash('message', 'Unità di misura aggiornata con successo!');
                } else {
                    req.flash('error', 'Unità di misura non trovata o non aggiornata.');
                }
            } catch (error) {
                console.error('Errore aggiornamento Unità di misura:', error);
                req.flash('error', 'Errore durante l\'aggiornamento dell\' unità di misura.');
            }
        
            res.redirect('/unitamisure-articolo');
      });

      app.get('/disabilita-unmarticolo', isUserAllowed, urlencodeParser, async (req, res) => {
            const idUnitamisura = req.query.id;

            try {
                const Arrayunistamisura = await controller.getUnmArticolo(idUnitamisura);
                const unitamisura = Arrayunistamisura[0];
                if (!unitamisura) {
                    req.flash('message', 'Unità di misura non trovata!');
                    return res.redirect('/unitamisure-articolo');
                }
        
                res.locals.title = 'Disabilita Unità di misura Articolo';
                res.render('Articoli/disabilita-unmarticolo', {
                    message: req.flash('message'),
                    error: req.flash('error'),
                    unmarticolo: unitamisura
                });
            } catch (error) {
                console.error('Errore durante il recupero dell\' unità di misura:', error);
                req.flash('error', 'Errore durante il caricamento dell\' unità di misura.');
                res.redirect('/unitamisure-articolo');
            }
      });
        
      app.post('/disabilita-unmarticolo', isUserAllowed, urlencodeParser, async (req, res) => {
            const idUnitamisura = req.body.idHidden;
            
            const objunmArticolo = {
                  _id: idUnitamisura,
                  attiva: false,
                  modificatoDa: req.session.user?._id || null,
                  updatedAt: new Date()
            };
            
            try {
                  const risultato = await controller.updUnmArticolo(idUnitamisura, objunmArticolo);
            
                  if (!risultato) {
                        req.flash('error', 'Unità di misura non trovata o non aggiornata!');
                        return res.redirect('/unitamisure-articolo');
                  }
            
                  req.flash('message', 'Unità di misura disabilitata con successo!');
            } catch (error) {
                  console.error('Errore durante la disabilitazione dell\' unità di misura:', error);
                  req.flash('error', 'Errore durante la disabilitazione dell\' unità di misura');
            }
            
            res.redirect('/unitamisure-articolo');
      });

      app.get('/dettaglio-unmarticolo', isUserAllowed, urlencodeParser, async (req, res) => {
            const id = req.query.id; 
            
            try {
                  const Arrayunmarticolo = await controller.getUnmArticolo(id);
                  const unmarticolo = Arrayunmarticolo[0];

                  if (unmarticolo) {
                        res.locals.title = 'Dettaglio Unità di misura Articolo';
                        res.render('Articoli/dettaglio-unmarticolo', {
                        message: req.flash('message'),
                        error: req.flash('error'),
                        unmarticolo: unmarticolo
                        });
                  } else {
                        handleError(req, res, 'Unità di misura Articolo non trovata!');
                  }
            } catch (error) {
                  handleError(req, res, 'Errore durante il recupero dell\' unità di misura articolo');
            }
      });

      // Ordine
      app.get('/inserisci-ordine', isUserAllowed, function (req, res) {
            res.locals = { title: 'Inserisci Ordine' };
            res.render('Ordini/inserisci-ordine', { 'message': req.flash('message'), 'error': req.flash('error') });
      });


      app.post('/stampa-ordine', isUserAllowed, urlencodeParser, async (req, res) => {
            const hiddenContent = req.body.txtContenuto;
            res.locals = { title: 'Stampa Ordine' };
            res.render('Ordini/stampa-ordine', { hiddenContent });
      });

      app.post('/inserisci-ordine', isUserAllowed, urlencodeParser, async (req, res) => {
            var ordiniDaInserire = req.body;
            try {
                  //reperisco numero ordine
                  const contatoreNew = await controller.getContatoreOrd();
                  if (contatoreNew) {
                        //ciclo righe ordine
                        for (var i = 0; i < ordiniDaInserire.length; i++) {
                              //reperisco numero riga
                              let rigaNew = await controller.getRigaOrd(contatoreNew);
                              if (rigaNew) {
                                    rigaNew = Number(rigaNew);
                                    var ordineNew = ordiniDaInserire[i];
                                    let nuovoOrdine = new Ordine({
                                          codiceOrdine: contatoreNew,
                                          rigaOrdine: rigaNew,
                                          codiceArticolo: ordineNew.codiceArticolo,
                                          quantitaOrdine: ordineNew.quantitaOrdine,
                                          prezzoOrdine: ordineNew.prezzoOrdine,
                                          valoreOrdine: ordineNew.valoreOrdine,
                                          clienteOrdine: ordineNew.clienteOrdine
                                    })
                                    try {
                                          const result = await nuovoOrdine.save()
                                          if (result) {
                                                //console.log('Ordine salvato con successo:', result);
                                                console.log('Ordine salvato con successo');
                                          } else {
                                                console.error('Errore nel salvataggio dell\'ordine:', error);
                                          }
                                    } catch (error) {
                                          console.log(error);
                                    }
                              }
                        }
                        res.redirect('/lista-ordini');
                  } else {
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
                  const ordini = [];
                  //const ordini = await controller.getOrdini();
                  if (ordiniX[0] !== undefined) {
                        res.locals = { title: 'Ordini' };
                        req.flash('message', 'Ordini caricati!');
                        res.render('Ordini/lista-ordini', { 'message': req.flash('message'), 'error': req.flash('error'), 'OrdiniX': ordiniX, 'Ordini': ordini, 'Tipo': sess.user.tipo, 'EmailLogin': sess.user.email });
                  } else {
                        res.locals = { title: 'Ordini' };
                        req.flash('message', 'Ordini non caricati!');
                        res.render('Ordini/lista-ordini', { 'message': req.flash('message'), 'error': req.flash('error'), 'OrdiniX': ordiniX, 'Ordini': ordini, 'Tipo': sess.user.tipo, 'EmailLogin': sess.user.email });
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
                  if (ordine) {
                        res.locals = { title: 'Ordine' };
                        res.json(ordine);
                  } else {
                        console.log('no Ordine');
                  }
            } catch (error) {
                  console.log(error);
            }
      });

      app.get('/ordini-testate-fetch', isUserAllowed, async (req, res) => {
            try {
                  const ordiniX = await controller.getOrdiniX();
                  if (ordiniX[0]) {
                        res.locals = { title: 'Ordini' };
                        res.json(ordiniX);
                  } else {
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
                  if (ordine) {
                        res.locals = { title: 'Modifica Ordine' };
                        res.render('Ordini/aggiorna-ordine', { 'message': req.flash('message'), 'error': req.flash('error'), 'ordine': ordine });
                  } else {
                        req.flash('message', 'Ordine non trovato!');
                        res.redirect('/lista-ordini');
                  }
            } catch (error) {
                  req.flash('message', 'Ordine non trovato!');
                  res.redirect('/lista-ordini');
            }
      });
}