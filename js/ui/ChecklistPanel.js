export class ChecklistPanel {

  static getSelectedCleaners() {
    //buscamos cualquier input que tenga el atributo 'data-cleaner' y esté marcado
    const activeCheckboxes = document.querySelectorAll('input[data-cleaner]:checked');
    
    return Array
      .from(activeCheckboxes)
      .map(cb => cb.dataset.cleaner);
  }

}