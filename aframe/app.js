
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

const camara =
    document.querySelector("a-camera");


// =====================================================
// VARIABLES DEL OBJETO
// =====================================================

let objetoAgarrado = false;
let grabSource = null;


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
// GATILLO DERECHO
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


        if (
            intersections.length === 0
        ) {

            console.log(
                "No estoy apuntando a ningún objeto"
            );

            return;
        }


        // Obtener el objeto detectado

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


        // Comprobar si es agarrable

        if (
            elemento.classList.contains(
                "grabbable"
            )
        ) {

            objetoAgarrado = true;
            grabSource = "controller";

            console.log(
                "🔴 OBJETO AGARRADO"
            );

        }

    }
);

// =====================================================
// MOUSE GRAB PARA DESKTOP
// =====================================================

objetoMovible.addEventListener(
    "click",
    () => {

        objetoAgarrado = true;
        grabSource = "mouse";

        console.log(
            "🔴 ESFERA ROJA AGARRADA POR MOUSE"
        );

    }
);

window.addEventListener(
    "mouseup",
    () => {

        if (objetoAgarrado) {
            console.log(
                "🔴 OBJETO SOLTADO"
            );
        }

        objetoAgarrado = false;
        grabSource = null;

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
// ACTUALIZAR POSICIÓN DEL OBJETO
// =====================================================

function actualizarObjeto() {

    if (!objetoAgarrado) {
        return;
    }

    if (grabSource === "controller") {

        const controllerPosition =
            new THREE.Vector3();

        rightController.object3D.getWorldPosition(
            controllerPosition
        );

        objetoMovible.object3D.parent.worldToLocal(
            controllerPosition
        );

        objetoMovible.object3D.position.copy(
            controllerPosition
        );

        return;
    }

    if (grabSource === "mouse") {

        const cameraWorldPos =
            new THREE.Vector3();
        const cameraDir =
            new THREE.Vector3();

        camara.object3D.getWorldPosition(
            cameraWorldPos
        );

        camara.object3D.getWorldDirection(
            cameraDir
        );

        const plane = new THREE.Plane(
            new THREE.Vector3(0, 1, 0),
            -objetoMovible.object3D.position.y
        );

        const ray = new THREE.Ray(
            cameraWorldPos,
            cameraDir
        );

        const intersection =
            new THREE.Vector3();

        ray.intersectPlane(
            plane,
            intersection
        );

        if (intersection) {
            objetoMovible.object3D.parent.worldToLocal(
                intersection
            );

            objetoMovible.object3D.position.copy(
                intersection
            );
        }

    }

}


// =====================================================
// BOTÓN VOLVER
// =====================================================

volver.addEventListener(
    "click",
    () => {

        console.log("VOLVER PRESIONADO");

        window.location.href =
            "../index.html";

    }
);


// =====================================================
// LOOP PRINCIPAL
// =====================================================

function loop() {

    actualizarObjeto();

    requestAnimationFrame(
        loop
    );

}


// Iniciar loop

loop();