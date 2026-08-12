
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

const mouse = new THREE.Vector2();
const raycasterMouse = new THREE.Raycaster();
const dragPlane = new THREE.Plane();
const dragTarget = new THREE.Vector3();
const worldGrabOffset = new THREE.Vector3();
const grabLocalOffset = new THREE.Vector3();
const localTarget = new THREE.Vector3();
const velocity = new THREE.Vector3();
let activeController = null;


// =====================================================
// VARIABLES DEL OBJETO
// =====================================================

let objetoAgarrado = false;
let grabSource = null;
let isDragging = false;


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
            isDragging = true;
            activeController = rightController;

            const hitPoint = intersections[0].point;
            const objectWorldPos =
                objetoMovible.object3D.getWorldPosition(
                    new THREE.Vector3()
                );

            worldGrabOffset.copy(objectWorldPos).sub(hitPoint);
            dragTarget.copy(objectWorldPos);
            velocity.set(0, 0, 0);

            console.log(
                "🔴 OBJETO AGARRADO"
            );

        }

    }
);

// Left controller support
leftController.addEventListener(
    "triggerdown",
    () => {
        console.log("GATILLO IZQUIERDO");

        const raycaster =
            leftController.components.raycaster;

        if (!raycaster) {
            console.log("Raycaster no encontrado");
            return;
        }

        const intersections = raycaster.intersections;
        if (intersections.length === 0) {
            console.log("No estoy apuntando a ningún objeto");
            return;
        }

        const mesh = intersections[0].object;
        const elemento = mesh.el;
        if (!elemento) {
            console.log("No se encontró el elemento A-Frame");
            return;
        }

        console.log("Objeto detectado:", elemento.id);

        if (elemento.classList.contains("grabbable")) {
            objetoAgarrado = true;
            grabSource = "controller";
            isDragging = true;
            activeController = leftController;

            const hitPoint = intersections[0].point;
            const objectWorldPos =
                objetoMovible.object3D.getWorldPosition(
                    new THREE.Vector3()
                );

            worldGrabOffset.copy(objectWorldPos).sub(hitPoint);
            dragTarget.copy(objectWorldPos);
            velocity.set(0, 0, 0);

            console.log("🔴 OBJETO AGARRADO (LEFT)");
        }
    }
);

// =====================================================
// MOUSE GRAB PARA DESKTOP
// =====================================================

window.addEventListener(
    "mousedown",
    (event) => {

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        const cameraObject = camara.getObject3D("camera");

        if (!cameraObject) {
            return;
        }

        raycasterMouse.setFromCamera(
            mouse,
            cameraObject
        );

        if (!objetoMovible.object3D) {
            return;
        }

        const intersects =
            raycasterMouse.intersectObject(
                objetoMovible.object3D,
                true
            );

        if (intersects.length > 0) {
            objetoAgarrado = true;
            grabSource = "mouse";
            isDragging = true;

            const hitPoint = intersects[0].point.clone();
            const cameraObject = camara.getObject3D("camera");

            if (!cameraObject) {
                return;
            }

            grabLocalOffset.copy(
                cameraObject.worldToLocal(hitPoint)
            );

            velocity.set(0, 0, 0);

            console.log(
                "🔴 ESFERA ROJA AGARRADA POR MOUSE"
            );
        }

    }
);

window.addEventListener(
    "mousemove",
    (event) => {
        if (!objetoAgarrado || grabSource !== "mouse") {
            return;
        }

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
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
        dragPlane.makeEmpty();

    }
);


// =====================================================
// SOLTAR OBJETO
// =====================================================

rightController.addEventListener(
    "triggerup",
    () => {

        if (objetoAgarrado) {
            console.log("🔴 OBJETO SOLTADO");
        }

        objetoAgarrado = false;
        if (activeController === rightController) {
            activeController = null;
            isDragging = false;
        }

    }
);

leftController.addEventListener(
    "triggerup",
    () => {
        if (objetoAgarrado) {
            console.log("🔴 OBJETO SOLTADO");
        }
        objetoAgarrado = false;
        if (activeController === leftController) {
            activeController = null;
            isDragging = false;
        }
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
        if (!activeController) return;
        const controllerPosition = new THREE.Vector3();
        activeController.object3D.getWorldPosition(controllerPosition);
        dragTarget.copy(controllerPosition).add(worldGrabOffset);

    } else if (grabSource === "mouse") {

        const cameraObject =
            camara.getObject3D("camera");

        if (!cameraObject) {
            return;
        }

        const cameraWorldPos =
            new THREE.Vector3();
        cameraObject.getWorldPosition(cameraWorldPos);

        const cameraDir =
            new THREE.Vector3();
        cameraObject.getWorldDirection(cameraDir);

        const holdDistance = 1.2;
        const desiredWorldPos =
            cameraWorldPos.add(
                cameraDir.multiplyScalar(
                    holdDistance
                )
            );

        dragTarget.copy(desiredWorldPos);

    } else {
        return;
    }

    const currentLocal =
        objetoMovible.object3D.position;

    localTarget.copy(dragTarget);
    objetoMovible.object3D.parent.worldToLocal(
        localTarget
    );

    const smoothing = 0.22;
    const delta = new THREE.Vector3()
        .subVectors(localTarget, currentLocal)
        .multiplyScalar(smoothing);

    velocity.add(delta).multiplyScalar(0.85);
    currentLocal.add(velocity);

    if (!objetoAgarrado && velocity.lengthSq() < 0.00001) {
        velocity.set(0, 0, 0);
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