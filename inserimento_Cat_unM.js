const mongoose = require('mongoose');
const Categoria = require('./models/Categoria');
const UnitaMisura = require('./models/UnitaMisura');

async function inserisciDatiBase() {
  try {
    await mongoose.connect('mongodb://0.0.0.0:27017/DbMagazzino', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Categorie base
    const categorieBase = [
      { nome: 'Surgelati', descrizione: 'Prodotti conservati tramite congelamento' },
      { nome: 'Freschi', descrizione: 'Alimenti freschi e deperibili' },
      { nome: 'Conserve', descrizione: 'Alimenti confezionati a lunga conservazione' },
      { nome: 'Bevande', descrizione: 'Bibite, succhi, acqua' },
      { nome: 'Latticini', descrizione: 'Latte, yogurt, formaggi' },
      { nome: 'Carne', descrizione: 'Carni rosse, bianche e lavorate' },
      { nome: 'Pesce', descrizione: 'Pesce fresco e surgelato' },
      { nome: 'Frutta e Verdura', descrizione: 'Ortaggi e frutta fresca' },
    ];

    for (const cat of categorieBase) {
      const esiste = await Categoria.findOne({ nome: cat.nome });
      if (!esiste) {
        await new Categoria(cat).save();
        console.log(`Categoria inserita: ${cat.nome}`);
      } else {
        console.log(`Categoria già esistente: ${cat.nome}`);
      }
    }

    // Unità di misura base
    const unitaBase = [
      { sigla: 'kg', descrizione: 'chilogrammi', tipo: 'peso' },
      { sigla: 'g', descrizione: 'grammi', tipo: 'peso' },
      { sigla: 'l', descrizione: 'litri', tipo: 'volume' },
      { sigla: 'ml', descrizione: 'millilitri', tipo: 'volume' },
      { sigla: 'pz', descrizione: 'pezzi', tipo: 'unità' },
      { sigla: 'conf', descrizione: 'confezione', tipo: 'unità' },
      { sigla: 'busta', descrizione: 'busta', tipo: 'unità' }
    ];

    for (const u of unitaBase) {
      const esiste = await UnitaMisura.findOne({ sigla: u.sigla });
      if (!esiste) {
        await new UnitaMisura(u).save();
        console.log(`Unità di misura inserita: ${u.sigla}`);
      } else {
        console.log(`Unità già esistente: ${u.sigla}`);
      }
    }

  } catch (err) {
    console.error('Errore:', err.message);
  } finally {
    mongoose.connection.close();
  }
}

inserisciDatiBase();
