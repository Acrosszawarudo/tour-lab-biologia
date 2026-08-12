AFRAME.registerComponent('chromosome', {

    init: function () {

        this.el.addEventListener('click', () => {

            console.log('Cromosoma seleccionado');

            this.el.setAttribute('color', 'green');

        });

    }

});