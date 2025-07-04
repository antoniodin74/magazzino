var express = require('express');
var bodyParser = require('body-parser');
var urlencodeParser = bodyParser.urlencoded({ extended: false });
var validator = require('express-validator');
const Utente = require('../models/Utente');
const Articolo = require('../models/Articolo');
const Contatore = require('../models/Contatore');
const controller = require('../controllers/Controller');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

// Configurazione Multer per gestire l'upload dei file
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
	  cb(null, 'uploads');
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

module.exports = function (app) {

      function isUserAllowed(req, res, next) {
            const token = req.cookies.token;
            if (token) {
                  var decoded = jwt.verify(token, jwtSecret);
                  req.UserId = decoded.userId;
                  return next();
            }
            else  {
                  //req.flash('error', 'Non autorizzati');
                  res.redirect('/login');      
            }

/*
            sess = req.session;
            if (sess.user) {
                  return next();
            }
            else { res.redirect('/login'); }
*/
      }

      app.get('/', isUserAllowed, function (req, res) {
            res.redirect('/lista-clienti');
            /*
            res.locals = { title: 'Dashboard' };
            res.render('Dashboard/index', {'user': sess.user.username, foto: sess.user.foto });
            */
      });

      app.get('/dashboard-2', isUserAllowed, function (req, res) {
            res.locals = { title: 'Dashboard Two' };
            res.render('Dashboard/dashboard-2');
      });

      // Layouts
      app.get('/layouts-horizontal', isUserAllowed, function (req, res) {
            res.locals = { title: 'Horizontal' };
            res.render('Dashboard/index', { layout: 'layoutsHorizontal' });
      });
      app.get('/layouts-dark-sidebar', isUserAllowed, function (req, res) {
            res.locals = { title: 'Light Sidebar' };
            res.render('Dashboard/index', { layout: 'layoutsDarkSidebar' });
      });
      app.get('/layouts-compact-sidebar', isUserAllowed, function (req, res) {
            res.locals = { title: 'Compact Sidebar' };
            res.render('Dashboard/index', { layout: 'layoutsCompactSidebar' });
      });
      app.get('/layouts-icon-sidebar', isUserAllowed, function (req, res) {
            res.locals = { title: 'Icon Sidebar' };
            res.render('Dashboard/index', { layout: 'layoutsIconSidebar' });
      });
      app.get('/layouts-boxed', isUserAllowed, function (req, res) {
            res.locals = { title: 'Boxed Width' };
            res.render('Dashboard/index', { layout: 'layoutsBoxed' });
      });
      app.get('/layouts-preloader', isUserAllowed, function (req, res) {
            res.locals = { title: 'Preloader' };
            res.render('Dashboard/index', { layout: 'layoutsPreloader' });
      });
      app.get('/layouts-colored-sidebar', isUserAllowed, function (req, res) {
            res.locals = { title: 'Colored Sidebar' };
            res.render('Dashboard/index', { layout: 'layoutsColoredSidebar' });
      });

      app.get('/layouts-hori-topbar-dark', isUserAllowed, function (req, res) {
            res.locals = { title: 'Topbar Dark' };
            res.render('Dashboard/index', { layout: 'layoutsHTopbarDark' });
      });
      app.get('/layouts-hori-boxed-width', isUserAllowed, function (req, res) {
            res.locals = { title: 'Boxed Width' };
            res.render('Dashboard/index', { layout: 'layoutsHBoxed' });
      });
      app.get('/layouts-hori-preloader', isUserAllowed, function (req, res) {
            res.locals = { title: 'Preloader' };
            res.render('Dashboard/index', { layout: 'layoutsHPreloader' });
      });
      

      // Color Theme vertical
      app.get("/vertical-dark", isUserAllowed, function (req, res) {
            res.locals = { title: 'Vertical Dark' };
            res.render("Dashboard/index", { layout: "vertical-dark-layout" });
      });
      
      app.get("/vertical-rtl", isUserAllowed, function (req, res) {
            res.locals = { title: 'Vertical Rtl' };
            res.render("Dashboard/index", { layout: "vertical-rtl-layout" });
      });
      
      // Color Theme Horizontal
      app.get("/horizontal-dark", isUserAllowed, function (req, res) {
            res.locals = { title: 'Horizontal Dark' };
            res.render("Dashboard/index", { layout: "horizontal-dark-layout" });
      });
      
      app.get("/horizontal-rtl", isUserAllowed, function (req, res) {
            res.locals = { title: 'Horizontal Rtl' };
            res.render("Dashboard/index", { layout: "horizontal-rtl-layout" });
      });

      // Calendar
      app.get('/calendar', isUserAllowed, function (req, res) {
            res.locals = { title: 'Calendar' };
            res.render('Calendar/calendar');
      });

      // Chat
      app.get('/chat', isUserAllowed, function (req, res) {
            res.locals = { title: 'Chat' };
            res.render('Chat/chat');
      });
      // Ecomerce
      app.get('/ecommerce-products', isUserAllowed, function (req, res) {
            res.locals = { title: 'Products' };
            res.render('Ecommerce/ecommerce-products');
      });
      app.get('/ecommerce-product-detail', isUserAllowed, function (req, res) {
            res.locals = { title: 'Product Detail' };
            res.render('Ecommerce/ecommerce-product-detail');
      });
      app.get('/ecommerce-orders', isUserAllowed, function (req, res) {
            res.locals = { title: 'Orders' };
            res.render('Ecommerce/ecommerce-orders');
      });
      app.get('/ecommerce-customers', isUserAllowed, function (req, res) {
            res.locals = { title: 'Customers' };
            res.render('Ecommerce/ecommerce-customers');
      });
      app.get('/ecommerce-cart', isUserAllowed, function (req, res) {
            res.locals = { title: 'Cart' };
            res.render('Ecommerce/ecommerce-cart');
      });
      app.get('/ecommerce-checkout', isUserAllowed, function (req, res) {
            res.locals = { title: 'Checkout' };
            res.render('Ecommerce/ecommerce-checkout');
      });
      app.get('/ecommerce-shops', isUserAllowed, function (req, res) {
            res.locals = { title: 'Shops' };
            res.render('Ecommerce/ecommerce-shops');
      });
      app.get('/ecommerce-add-product', isUserAllowed, function (req, res) {
            res.locals = { title: 'Add Product' };
            res.render('Ecommerce/ecommerce-add-product');
      });

      // Email
      app.get('/email-inbox', isUserAllowed, function (req, res) {
            res.locals = { title: 'Inbox' };
            res.render('Email/email-inbox');
      });
      app.get('/email-read', isUserAllowed, function (req, res) {
            res.locals = { title: 'Email Read' };
            res.render('Email/email-read');
      });
      
      // Invoice
      app.get('/invoices-list', isUserAllowed, function (req, res) {
            res.locals = { title: 'Invoice List' };
            res.render('Invoice/invoices-list');
      });
      app.get('/invoices-detail', isUserAllowed, function (req, res) {
            res.locals = { title: 'Invoice Detail' };
            res.render('Invoice/invoices-detail');
      });

      // Contacts
      app.get('/contacts-grid', isUserAllowed, function (req, res) {
            res.locals = { title: 'User Grid' };
            res.render('Contacts/contacts-grid');
      });
      app.get('/contacts-list', isUserAllowed, function (req, res) {
            res.locals = { title: 'User List' };
            res.render('Contacts/contacts-list');
      });
      app.get('/contacts-profile', isUserAllowed, function (req, res) {
            res.locals = { title: 'Profile' };
            res.render('Contacts/contacts-profile');
      });

      // Pages
      app.get('/pages-starter', isUserAllowed, function (req, res) {
            res.locals = { title: 'Starter Page' };
            res.render('Pages/pages-starter');
      });
      app.get('/pages-timeline', isUserAllowed, function (req, res) {
            res.locals = { title: 'Timeline' };
            res.render('Pages/pages-timeline');
      });
      app.get('/pages-faqs', isUserAllowed, function (req, res) {
            res.locals = { title: 'FAQs' };
            res.render('Pages/pages-faqs');
      });
      app.get('/pages-pricing', isUserAllowed, function (req, res) {
            res.locals = { title: 'Pricing' };
            res.render('Pages/pages-pricing');
      });

      // UI
      app.get('/ui-alerts', isUserAllowed, function (req, res) {
            res.locals = { title: 'Alerts' };
            res.render('Ui/ui-alerts');
      });
      app.get('/ui-buttons', isUserAllowed, function (req, res) {
            res.locals = { title: 'Buttons' };
            res.render('Ui/ui-buttons');
      });
      app.get('/ui-cards', isUserAllowed, function (req, res) {
            res.locals = { title: 'Cards' };
            res.render('Ui/ui-cards');
      });
      app.get('/ui-carousel', isUserAllowed, function (req, res) {
            res.locals = { title: 'Carousel' };
            res.render('Ui/ui-carousel');
      });
      app.get('/ui-dropdowns', isUserAllowed, function (req, res) {
            res.locals = { title: 'Dropdowns' };
            res.render('Ui/ui-dropdowns');
      });
      app.get('/ui-grid', isUserAllowed, function (req, res) {
            res.locals = { title: 'Grid' };
            res.render('Ui/ui-grid');
      });
      app.get('/ui-images', isUserAllowed, function (req, res) {
            res.locals = { title: 'Images' };
            res.render('Ui/ui-images');
      });
      app.get('/ui-lightbox', isUserAllowed, function (req, res) {
            res.locals = { title: 'Lightbox' };
            res.render('Ui/ui-lightbox');
      });
      app.get('/ui-modals', isUserAllowed, function (req, res) {
            res.locals = { title: 'Modals' };
            res.render('Ui/ui-modals');
      });
      app.get('/ui-rangeslider', isUserAllowed, function (req, res) {
            res.locals = { title: 'Range Slider' };
            res.render('Ui/ui-rangeslider');
      });
      app.get('/ui-session-timeout', isUserAllowed, function (req, res) {
            res.locals = { title: 'Session Timeout' };
            res.render('Ui/ui-session-timeout');
      });
      app.get('/ui-progressbars', isUserAllowed, function (req, res) {
            res.locals = { title: 'Progress Bars' };
            res.render('Ui/ui-progressbars');
      });
      app.get('/ui-sweet-alert', isUserAllowed, function (req, res) {
            res.locals = { title: 'Sweet Alert' };
            res.render('Ui/ui-sweet-alert');
      });
      app.get('/ui-tabs-accordions', isUserAllowed, function (req, res) {
            res.locals = { title: 'Tabs & Accordions' };
            res.render('Ui/ui-tabs-accordions');
      });
      app.get('/ui-typography', isUserAllowed, function (req, res) {
            res.locals = { title: 'Typography' };
            res.render('Ui/ui-typography');
      });
      app.get('/ui-video', isUserAllowed, function (req, res) {
            res.locals = { title: 'Video' };
            res.render('Ui/ui-video');
      });
      app.get('/ui-general', isUserAllowed, function (req, res) {
            res.locals = { title: 'General' };
            res.render('Ui/ui-general');
      });
      app.get('/ui-colors', isUserAllowed, function (req, res) {
            res.locals = { title: 'Colors' };
            res.render('Ui/ui-colors');
      });
      app.get('/ui-rating', isUserAllowed, function (req, res) {
            res.locals = { title: 'Rating' };
            res.render('Ui/ui-rating');
      });
      app.get('/ui-notifications', isUserAllowed, function (req, res) {
            res.locals = { title: 'Notifications' };
            res.render('Ui/ui-notifications');
      });
     

      // Forms
      app.get('/form-elements', isUserAllowed, function (req, res) {
            res.locals = { title: 'Basic Elements' };
            res.render('Form/form-elements');
      });
      app.get('/form-validation', isUserAllowed, function (req, res) {
            res.locals = { title: 'Validation' };
            res.render('Form/form-validation');
      });
      app.get('/form-advanced', isUserAllowed, function (req, res) {
            res.locals = { title: 'Advanced Plugins' };
            res.render('Form/form-advanced');
      });
      app.get('/form-editors', isUserAllowed, function (req, res) {
            res.locals = { title: 'Editors' };
            res.render('Form/form-editors');
      });
      app.get('/form-uploads', isUserAllowed, function (req, res) {
            res.locals = { title: 'File Uploads' };
            res.render('Form/form-uploads');
      });
      app.get('/form-xeditable', isUserAllowed, function (req, res) {
            res.locals = { title: 'Xeditable' };
            res.render('Form/form-xeditable');
      });
      app.get('/form-repeater', isUserAllowed, function (req, res) {
            res.locals = { title: 'Repeater' };
            res.render('Form/form-repeater');
      });
      app.get('/form-wizard', isUserAllowed, function (req, res) {
            res.locals = { title: 'Wizard' };
            res.render('Form/form-wizard');
      });
      app.get('/form-mask', isUserAllowed, function (req, res) {
            res.locals = { title: 'Form Mask' };
            res.render('Form/form-mask');
      });
     
      // Tables
      app.get('/tables-basic', isUserAllowed, function (req, res) {
            res.locals = { title: 'Bootstrap Basic' };
            res.render('Tables/tables-basic');
      });
      app.get('/tables-datatable', isUserAllowed, function (req, res) {
            res.locals = { title: 'Datatables' };
            res.render('Tables/tables-datatable');
      });
      app.get('/tables-responsive', isUserAllowed, function (req, res) {
            res.locals = { title: 'Responsive' };
            res.render('Tables/tables-responsive');
      });
      app.get('/tables-editable', isUserAllowed, function (req, res) {
            res.locals = { title: 'Editable' };
            res.render('Tables/tables-editable');
      });
      
      // Charts
      app.get('/charts-apex', isUserAllowed, function (req, res) {
            res.locals = { title: 'Apex' };
            res.render('Charts/charts-apex');
      });
      app.get('/charts-chartjs', isUserAllowed, function (req, res) {
            res.locals = { title: 'Chartjs' };
            res.render('Charts/charts-chartjs');
      });
      app.get('/charts-flot', isUserAllowed, function (req, res) {
            res.locals = { title: 'Flot' };
            res.render('Charts/charts-flot');
      });
      app.get('/charts-knob', isUserAllowed, function (req, res) {
            res.locals = { title: 'Jquery Knob' };
            res.render('Charts/charts-knob');
      });
      app.get('/charts-sparkline', isUserAllowed, function (req, res) {
            res.locals = { title: 'Sparkline' };
            res.render('Charts/charts-sparkline');
      });

      // Icons
      app.get('/icons-unicons', isUserAllowed, function (req, res) {
            res.locals = { title: 'Unicons' };
            res.render('Icons/icons-unicons');
      });
      app.get('/icons-boxicons', isUserAllowed, function (req, res) {
            res.locals = { title: 'Boxicons' };
            res.render('Icons/icons-boxicons');
      });
      app.get('/icons-materialdesign', isUserAllowed, function (req, res) {
            res.locals = { title: 'Material Design' };
            res.render('Icons/icons-materialdesign');
      });
      app.get('/icons-dripicons', isUserAllowed, function (req, res) {
            res.locals = { title: 'Dripicons' };
            res.render('Icons/icons-dripicons');
      });
      app.get('/icons-fontawesome', isUserAllowed, function (req, res) {
            res.locals = { title: 'Font Awesome' };
            res.render('Icons/icons-fontawesome');
      });

      // Maps
      app.get('/maps-google', isUserAllowed, function (req, res) {
            res.locals = { title: 'Google' };
            res.render('Maps/maps-google');
      });
      app.get('/maps-vector', isUserAllowed, function (req, res) {
            res.locals = { title: 'Vector' };
            res.render('Maps/maps-vector');
      });
      app.get('/maps-leaflet', isUserAllowed, function (req, res) {
            res.locals = { title: 'Leaflet' };
            res.render('Maps/maps-leaflet');
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
                        res.locals = { title: 'Clienti' };
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

      app.get('/aggiorna-cliente', isUserAllowed, urlencodeParser, async (req, res) => {
            const email = (req.query.email);
            try {
                  const utente = await controller.getCliente(email);
                  if(utente){
                        res.locals = { title: 'Modifica Cliente' };
                        res.render('Clienti/aggiorna-cliente', { 'message': req.flash('message'), 'error': req.flash('error'), 'utente': utente });
                  }else{
                        req.flash('message', 'Utente non trovato!');
                        res.redirect('/login');
                  }
            } catch (error) {
                  req.flash('message', 'Utente non trovato!');
                  res.redirect('/lista-clienti');
            }
      });

      app.get('/disabilita-cliente', isUserAllowed, urlencodeParser, async (req, res) => {
            const email = (req.query.email);
            try {
                  const utente = await controller.getCliente(email);
                  if(utente){
                        res.locals = { title: 'Modifica Cliente' };
                        res.render('Clienti/disabilita-cliente', { 'message': req.flash('message'), 'error': req.flash('error'), 'utente': utente });
                  }else{
                        req.flash('message', 'Utente non trovato!');
                        res.redirect('/login');
                  }
            } catch (error) {
                  req.flash('message', 'Utente non trovato!');
                  res.redirect('/lista-clienti');
            }
      });

      app.post('/aggiornaCliente', urlencodeParser, async (req, res) =>  {
            upload(req, res, async function (err){
                  if (req.file !== undefined) {
                        var fotoPath = req.file.path;
                  } else {
                        var fotoPath = "";
                  } 
                  let objUtente = {
                        nome : req.body.nome,
                        cognome: req.body.cognome,
                        piva: req.body.piva,
                        note: req.body.note,
                        email: req.body.emailHidden,
                        fotoPath: fotoPath,
                  }
                  try {
                        const utente = await controller.updCliente(objUtente);
                        if(utente){
                              req.flash('message', 'Utente aggiornato!');
                              res.redirect('/lista-clienti');
                        }else{
                              req.flash('message', 'Utente non aggiornato!');
                              res.redirect('/login');
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

      // Articolo
      app.get('/inserisci-articolo', isUserAllowed, function (req, res) {
            res.locals = { title: 'Inserisci Articolo' };
            res.render('Articoli/inserisci-articolo');
      });

      app.get('/lista-articoli', isUserAllowed, async (req, res) => {
            try {
                  const articolo = await controller.getArticoli();
                  if(articolo){
                        res.locals = { title: 'Articoli' };
                        res.render('Articoli/lista-articoli', { 'message': req.flash('message'), 'error': req.flash('error'), 'Articoli': articolo, 'Tipo' : sess.user.tipo, 'EmailLogin' : sess.user.email });
                  }else{
                        req.flash('message', 'Articoli non trovati!');
                        res.redirect('/login');
                  }
            } catch (error) {
                  req.flash('message', 'Articoli non trovati!');
                  res.redirect('/login');
            }
      });

      app.post('/inserisci-articolo', isUserAllowed, async (req, res) => {     
            var coll = 'Articolo'
            Contatore.findOne({collezione:coll})
            .then(contatore => {
                  if(contatore){
                        let contatoreArt = contatore.valoreContatore;
                        contatoreArt++;
                        const contatoreIncr = contatoreArt;
                        Contatore.findOneAndUpdate({collezione:contatore.collezione},{$set:{valoreContatore:contatoreIncr}},{ returnOriginal: false })
                        .then(contatoreUpd => {
                              let contatoreNew = contatoreUpd.valoreContatore;
                              upload(req, res, function (err){
                                    let articolo = new Articolo ({
                                          codiceArticolo : contatoreNew,
                                          descrizioneArticolo: req.body.descrizione,
                                          quantitaArticolo: req.body.quantita,
                                          costoArticolo: req.body.costo,
                                    })
                                    articolo.save()
                                    .then(articolo => {
                                          req.flash('message', 'Articolo inserito!');
                                          res.redirect('/lista-articoli');
                                    })
                                    .catch(error => {
                                          req.flash('error', 'Articolo non inserito!');
                                    })
                                    if (err instanceof multer.MulterError) {
                                          res.send(err)
                                    } else if (err) {
                                          res.send(err)
                                    }
                              })
                        })
                        .catch(error => {
                              console.log(error);
                        })
                  }else{
                        let contatore = new Contatore ({
                        collezione : 'Articolo',
                        valoreContatore: 1
                        })
                        contatore.save()
                        .then(contatoreSave => {
                              req.flash('message', 'Articolo inserito!');
                              res.redirect('/lista-articoli');
                        })
                        .catch(error => {
                              req.flash('error', 'Articolo non inserito!');
                        })
                  }
            })      
      });
}