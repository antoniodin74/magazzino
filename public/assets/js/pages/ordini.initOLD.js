$(document).ready(function() {
    var input = document.getElementById('basicpill-firstname-input');
    input.addEventListener('click', function() {
        addNewEvent();
      });

    function addNewEvent() {
        const bodyElement = document.body;
        bodyElement.classList.add('modal-open'); // Aggiunge la classe "modal-open"
        bodyElement.style.paddingRight = '17px'; // Imposta lo stile "padding-right" a "17px"
        bodyElement.setAttribute('data-bs-padding-right', ''); // Aggiunge l'attributo "data-bs-padding-right"
        const divModal = document.getElementById('exampleModalFullscreen');
        divModal.classList.add('show');
        divModal.style.paddingRight = '17px'; // Imposta lo stile "padding-right" a "17px"
        divModal.style.display = 'block'; // Imposta lo stile "padding-right" a "17px"
        divModal.removeAttribute('aria-hidden'); // Rimuove la classe "style" esistente
        divModal.classList.add('show');
        divModal.setAttribute('aria-modal', 'true'); // Aggiunge la classe "modal-open"
        divModal.setAttribute('role', 'dialog'); // Aggiunge la classe "modal-open"
    }
}
)