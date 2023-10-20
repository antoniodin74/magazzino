// datatable
$(document).ready(function() {
    $('#datatable-buttons').DataTable();

// Seleziona l'elemento <a> con href="#finish"
var link = document.querySelector('a[href="#finish"]');

// Aggiungi un gestore di eventi al clic sul link
link.addEventListener('click', function(event) {
    // Impedisce il comportamento predefinito del link (navigazione)
    event.preventDefault();

    // Esegui le azioni desiderate quando il link con href="#finish" viene cliccato
    //alert("Hai cliccato sul link per finire!");
     // Dati da inviare
     var dati = {
        colonna1: "1",
        colonna2: "2"
    };

    // Esegui la richiesta POST utilizzando axios
    axios.post('/inserisci-ordine', dati)
        .then(function (response) {
            //console.log("Richiesta POST riuscita:", response);
            window.location.href = "/lista-ordini"; 
            // Puoi gestire la risposta del server qui
        })
        .catch(function (error) {
            console.error("Errore nella richiesta POST:", error);
        });
});
   
});