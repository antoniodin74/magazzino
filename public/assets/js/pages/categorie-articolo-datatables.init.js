/*
Template Name: Minible - Admin & Dashboard Template
Author: Themesbrand
Website: https://themesbrand.com/
Contact: themesbrand@gmail.com
File: Ecommerce datatables Js File
*/


// datatable
$(document).ready(function() {
    $('#datatable').DataTable();

    //Buttons examples
    var table = $('#datatable-buttons').DataTable({
        lengthChange: false,
        buttons: [
            {
              extend: 'pdfHtml5',
              text: 'PDF',
              orientation: 'landscape', // orientamento orizzontale
              pageSize: 'A4',
              exportOptions: {
                columns: ':visible' // solo le colonne visibili
              },
              customize: function (doc) {
                doc.styles.tableHeader = {
                  bold: true,
                  fontSize: 10,
                  color: 'black',
                  fillColor: '#eeeeee',
                  alignment: 'center'
                };
                doc.defaultStyle.fontSize = 9;
                doc.content[1].table.widths = Array(doc.content[1].table.body[0].length + 1).join('*').split('');
              }
            },
            'copy', 'excel', 'csv', 'print', 'colvis'
          ]
          
    });

    table.buttons().container()
        .appendTo('#datatable-buttons_wrapper .col-md-6:eq(0)');
    $(".dataTables_length select").addClass('form-select form-select-sm');

    // Ottenere il riferimento al pulsante "aggiunCat"
    var button = document.getElementById('aggiungiCat');

    // Aggiungere un gestore di eventi click al pulsante
    button.addEventListener('click', function() {
      // Eseguire il redirect alla route /lista-clienti
      window.location.href = '/inserisci-catarticolo';
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