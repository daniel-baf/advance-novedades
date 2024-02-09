// toggles the div and displ;ay content
function toggleBuildings(productName) {
    var buildingsContainer = document.getElementById(productName + 'Buildings');
    var toggleButton = document.getElementById('toggleButton' + productName);

    // Toggle the visibility of the buildings container
    buildingsContainer.style.display = (buildingsContainer.style.display === 'none') ? 'block' : 'none';

    // Change the text content of the button based on the current visibility state
    toggleButton.textContent = (buildingsContainer.style.display === 'none') ? 'Expandir' : 'Minimizar';
}