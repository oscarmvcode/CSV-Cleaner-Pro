export class ManualHandler {
    static init() {
        // Verifica si es la primera vez que el usuario entra
        if (!localStorage.getItem('manualShown')) {
            const myModal = new bootstrap.Modal(document.getElementById('userManualModal'));
            myModal.show();
            localStorage.setItem('manualShown', 'true');
        }
    }
}