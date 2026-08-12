// =====================================================
// OBTENER ELEMENTOS
// =====================================================

const botonPrueba =
    document.getElementById("botonPrueba");

const volver =
    document.getElementById("volver");

const cromosoma1 =
    document.getElementById("cromosoma1");

const cromosoma2 =
    document.getElementById("cromosoma2");

const leftController =
    document.getElementById("leftController");

const rightController =
    document.getElementById("rightController");

const objetoMovible =
    document.getElementById("objetoMovible");


// =====================================================
// VARIABLES
// =====================================================

let objetoAgarrado = false;


// =====================================================
// BOTÓN DE PRUEBA
// =====================================================

botonPrueba.addEventListener(
    "click",
    () => {

        console.log("BOTÓN PRESIONADO");

        botonPrueba.setAttribute(
            "color",
            "#EF4444"
        );

        botonPrueba
            .querySelector("a-text")
            .setAttribute(
                "value",
                "¡FUNCIONA!"
            );

    }
);


// =====================================================
// CONTROL DERECHO
// =====================================================

rightController.addEventListener(
    "triggerdown",
    () => {

        console.log("GATILLO DERECHO");

        const raycaster =
            rightController.components.raycaster;

        if (!raycaster) {

            console.log(
                "Raycaster no encontrado"
            );

            return;
        }


        const intersections =
            raycaster.intersections;


        if (intersections.length === 0) {

            console.log(
                "No estoy apuntando a ningún objeto"
            );

            return;
        }


        const mesh =
            intersections[0].object;


        const elemento =
            mesh.el;


        if (!elemento) {

            console.log(
                "No se encontró el elemento A-Frame"
            );

            return;
        }


        console.log(
            "Objeto detectado:",
            elemento.id
        );


        // Comprobar si el objeto se puede agarrar

        if (
            elemento.classList.contains(
                "grabbable"
            )
        ) {

            objetoAgarrado = true;

            console.log(
                "🔴 OBJETO AGARRADO"
            );

        }

    }
);


// =====================================================
// SOLTAR OBJETO
// =====================================================

rightController.addEventListener(
    "triggerup",
    () => {

        if (objetoAgarrado) {

            console.log(
                "🔴 OBJETO SOLTADO"
            );

        }

        objetoAgarrado = false;

    }
);


// =====================================================
// MOVER OBJETO
// =====================================================

function actualizarObjeto() {

    if (!objetoAgarrado) {
        return;
    }


    const controllerPosition =
        new THREE.Vector3();


    // Obtener posición mundial del control

    rightController.object3D.getWorldPosition(
        controllerPosition
    );


    // Convertir posición al sistema
    // de coordenadas de la esfera

    objetoMovible.object3D.parent.worldToLocal(
        controllerPosition
    );


    // Actualizar posición de la esfera

    objetoMovible.object3D.position.copy(
        controllerPosition
    );

}


// =====================================================
// CROMOSOMA 1
// =====================================================

cromosoma1.addEventListener(
    "click",
    () => {

        console.log(
            "Cromosoma 1 seleccionado"
        );

        cromosoma1.setAttribute(
            "scale",
            "1.5 1.5 1.5"
        );

    }
);


// =====================================================
// CROMOSOMA 2
// =====================================================

cromosoma2.addEventListener(
    "click",
    () => {

        console.log(
            "Cromosoma 2 seleccionado"
        );

        cromosoma2.setAttribute(
            "scale",
            "1.5 1.5 1.5"
        );

    }
);


// =====================================================
// CONTROL IZQUIERDO
// =====================================================

leftController.addEventListener(
    "triggerdown",
    () => {

        console.log(
            "GATILLO IZQUIERDO"
        );

    }
);


// =====================================================
// VOLVER
// =====================================================

volver.addEventListener(
    "click",
    () => {

        window.location.href =
            "../index.html";

    }
);


// =====================================================
// LOOP
// =====================================================

function loop() {

    actualizarObjeto();

    requestAnimationFrame(
        loop
    );

}

loop();