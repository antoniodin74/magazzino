// datatable
$(document).ready(function() {
    $('#datatable-buttons').DataTable();

    // Seleziona l'elemento <a> con href="#finish"
    var link = document.querySelector('a[href="#finish"]');
    // Aggiungi un gestore di eventi al clic sul link
    link.addEventListener('click', function(event) {
        // Impedisce il comportamento predefinito del link (navigazione)
        event.preventDefault();
        // Definisci un array vuoto per memorizzare i dati
        let Dati = [];

        // Trova la tabella per l'ordine riepilogo
        const table = document.getElementById("tableOrdiniRiepilogo");
        const tbody = table.getElementsByTagName("tbody")[0];
        // Seleziona tutte le righe della tabella
        const rows = table.getElementsByTagName("tr");

        // Itera su ciascuna riga (inizia da 1 per saltare l'intestazione)
        for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
            // Trova tutte le celle con la classe "tabellaRiepilogo"
            const cells = row.getElementsByClassName("codiceRiepilogo");
            if(cells.length>0){
                const codiceArticolo = cells[0].textContent;
                console.log(codiceArticolo);
                const cellsquantitaOrdine = row.getElementsByClassName("qtaRiepilogo");
                const quantitaOrdine = cellsquantitaOrdine[0].textContent;
                console.log(quantitaOrdine);
                const cellsprezzoOrdine = row.getElementsByClassName("prezzoRiepilogo");
                const prezzoOrdine = cellsprezzoOrdine[0].textContent;
                console.log(prezzoOrdine);
                const cellsvaloreOrdine = row.getElementsByClassName("totaleRiepilogo");
                const valoreOrdine = cellsvaloreOrdine[0].textContent;
                console.log(valoreOrdine);
                const clienteOrdine ="admin@gmail.com";
                // Crea un oggetto con i dati estratti e aggiungilo all'array Dati
                Dati.push({ codiceArticolo, quantitaOrdine, prezzoOrdine, valoreOrdine, clienteOrdine });
            }
        }

        // Ora l'array Dati contiene tutti i dati estratti dalla tabella

        // Esegui la richiesta POST utilizzando axios
        axios.post('/inserisci-ordine', Dati)
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