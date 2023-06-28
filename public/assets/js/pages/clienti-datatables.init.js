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