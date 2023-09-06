/*
Template Name: Minible - Admin & Dashboard Template
Author: Themesbrand
Website: https://themesbrand.com/
Contact: themesbrand@gmail.com
File: Ecommerce datatables Js File
*/


// datatable
$(document).ready(function() {
    $('.datatable').DataTable();
    $(".dataTables_length select").addClass('form-select form-select-sm');

    // Ottenere il riferimento al pulsante "aggiunG"
    var button = document.getElementById('aggiungiC');

    // Aggiungere un gestore di eventi click al pulsante
    button.addEventListener('click', function() {
      // Eseguire il redirect alla route /lista-clienti
      window.location.href = '/inserisci-cliente';
    });

    // Funzione per rimuovere l'elemento dopo 3 secondi
    setTimeout(function() {
        var elemento1 = document.getElementById("elementoDaRimuovere1");
        var elemento2 = document.getElementById("elementoDaRimuovere2");
        if (elemento1) {
            elemento1.parentNode.removeChild(elemento1);
        }
        if (elemento2) {
            elemento2.parentNode.removeChild(elemento2);
        }
    }, 3000); // 3000 millisecondi (3 secondi)
});
/*
$(document).ready(function() {
    $('#datatable').DataTable();

    //Buttons examples
    var table = $('#datatable-buttons').DataTable({
        lengthChange: false,
        buttons: ['copy', 'excel', 'pdf', 'colvis', 'print', 'csv']
    });

    table.buttons().container()
        .appendTo('#datatable-buttons_wrapper .col-md-6:eq(0)');
        
        $(".dataTables_length select").addClass('form-select form-select-sm');

} );*/