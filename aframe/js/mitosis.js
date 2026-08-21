/* =========================================================
   MITOSIS VR
========================================================= */

AFRAME.registerComponent("mitosis-model-position", {
    init() {
        this.el.addEventListener("model-loaded", () => {
            const model = this.el.getObject3D("mesh");
            if (!model) return;

            const bounds = new THREE.Box3().setFromObject(model);
            const center = bounds.getCenter(new THREE.Vector3());
            this.el.object3D.worldToLocal(center);
            model.position.sub(center);
        });
    }
});

AFRAME.registerComponent("mitosis-model-animation", {
    init() {
        this.mixer = null;

        this.el.addEventListener("model-loaded", (event) => {
            const model = event.detail.model || this.el.getObject3D("mesh");
            const animations = model && model.animations;

            if (!model || !animations || animations.length === 0) {
                console.warn("El modelo no contiene animaciones");
                return;
            }

            this.mixer = new THREE.AnimationMixer(model);

            animations.forEach((clip) => {
                this.mixer.clipAction(clip).play();
            });
        });
    },

    tick(time, delta) {
        if (this.mixer) {
            this.mixer.update(delta / 1000);
        }
    },

    remove() {
        if (this.mixer) {
            this.mixer.stopAllAction();
            this.mixer = null;
        }
    }
});

const botonPrueba =
    document.getElementById("botonPrueba");

    
/* =========================================================
   DATOS DE LAS FASES
========================================================= */

const phases = [

    {
        name: "Interfase",

        description:
            "La célula crece y duplica su ADN antes de comenzar la mitosis."
    },

    {
        name: "Profase",

        description:
            "La cromatina se condensa y forma cromosomas visibles. Los centrosomas comienzan a desplazarse hacia polos opuestos."
    },

    {
        name: "Prometafase",

        description:
            "La membrana nuclear desaparece y los microtúbulos del huso mitótico comienzan a conectarse con los cromosomas."
    },

    {
        name: "Metafase",

        description:
            "Los cromosomas se alinean en el centro de la célula formando la placa ecuatorial."
    },

    {
        name: "Anafase",

        description:
            "Las cromátidas hermanas se separan y son transportadas hacia polos opuestos."
    },

    {
        name: "Telofase",

        description:
            "Se forman dos nuevos núcleos y los cromosomas comienzan a descondensarse."
    },

    {
        name: "Citocinesis",

        description:
            "El citoplasma se divide y se forman dos células hijas."
    }

];


let currentPhase = 0;


/* =========================================================
   ELEMENTOS HTML
========================================================= */

const scene =
    document.querySelector("#mitosis-scene");

const title =
    document.querySelector("#phase-title");

const description =
    document.querySelector("#phase-description");

const counter =
    document.querySelector("#phase-counter");

const nextButton =
    document.querySelector("#next-btn");

const previousButton =
    document.querySelector("#previous-btn");

const resetButton =
    document.querySelector("#reset-btn");


/* =========================================================
   ELEMENTOS 3D
========================================================= */

const cell =
    document.querySelector("#cell");

const membrane =
    document.querySelector("#cell-membrane");

const nucleus =
    document.querySelector("#nucleus");

const chromatin =
    document.querySelector("#chromatin");

const chromosomes =
    document.querySelector("#chromosomes");

const centrosomeLeft =
    document.querySelector("#centrosome-left");

const centrosomeRight =
    document.querySelector("#centrosome-right");

const spindle =
    document.querySelector("#spindle");


/* =========================================================
   CREAR CROMOSOMAS
========================================================= */

function createChromosome(
    x,
    y,
    z,
    id
) {

    const chromosome =
        document.createElement("a-entity");

    chromosome.setAttribute(
        "id",
        id
    );

    chromosome.setAttribute(
        "position",
        `${x} ${y} ${z}`
    );


    /*
     * Primera cromátida
     */

    const chromatid1 =
        document.createElement("a-box");

    chromatid1.setAttribute(
        "width",
        "0.12"
    );

    chromatid1.setAttribute(
        "height",
        "0.9"
    );

    chromatid1.setAttribute(
        "depth",
        "0.12"
    );

    chromatid1.setAttribute(
        "rotation",
        "0 0 -30"
    );

    chromatid1.setAttribute(
        "color",
        "#ff4fa3"
    );


    /*
     * Segunda cromátida
     */

    const chromatid2 =
        document.createElement("a-box");

    chromatid2.setAttribute(
        "width",
        "0.12"
    );

    chromatid2.setAttribute(
        "height",
        "0.9"
    );

    chromatid2.setAttribute(
        "depth",
        "0.12"
    );

    chromatid2.setAttribute(
        "rotation",
        "0 0 30"
    );

    chromatid2.setAttribute(
        "color",
        "#ff4fa3"
    );


    chromosome.appendChild(
        chromatid1
    );

    chromosome.appendChild(
        chromatid2
    );


    chromosomes.appendChild(
        chromosome
    );


    return chromosome;
}


/* =========================================================
   GENERAR CROMOSOMAS
========================================================= */

function generateChromosomes() {

    chromosomes.innerHTML = "";


    const positions = [

        [-0.8, 0.5, 0],

        [0, 0.7, 0.1],

        [0.8, 0.3, -0.1],

        [-0.5, -0.5, 0.1],

        [0.5, -0.4, -0.1]

    ];


    positions.forEach(
        (position, index) => {

            createChromosome(

                position[0],
                position[1],
                position[2],

                `chromosome-${index}`

            );

        }
    );

}


/* =========================================================
   CREAR MICROTÚBULOS
========================================================= */

function createSpindle() {

    spindle.innerHTML = "";


    /*
     * Microtúbulos superiores
     */

    for (
        let i = 0;
        i < 5;
        i++
    ) {

        const tube =
            document.createElement("a-cylinder");


        tube.setAttribute(
            "radius",
            "0.015"
        );


        tube.setAttribute(
            "height",
            "2.5"
        );


        tube.setAttribute(
            "color",
            "#00ffff"
        );


        tube.setAttribute(
            "rotation",
            "0 0 90"
        );


        tube.setAttribute(
            "position",
            "0 0 0"
        );


        spindle.appendChild(
            tube
        );

    }

}


/* =========================================================
   INTERFASE
========================================================= */

function showInterphase() {

    chromatin.setAttribute(
        "visible",
        "true"
    );

    chromosomes.setAttribute(
        "visible",
        "false"
    );

    nucleus.setAttribute(
        "visible",
        "true"
    );

    spindle.setAttribute(
        "visible",
        "false"
    );


    centrosomeLeft.setAttribute(
        "position",
        "-0.6 0 0"
    );

    centrosomeRight.setAttribute(
        "position",
        "0.6 0 0"
    );

}


/* =========================================================
   PROFASE
========================================================= */

function showProphase() {

    chromatin.setAttribute(
        "visible",
        "false"
    );

    chromosomes.setAttribute(
        "visible",
        "true"
    );

    nucleus.setAttribute(
        "visible",
        "true"
    );

    spindle.setAttribute(
        "visible",
        "false"
    );


    centrosomeLeft.setAttribute(
        "position",
        "-2 0 0"
    );

    centrosomeRight.setAttribute(
        "position",
        "2 0 0"
    );

}


/* =========================================================
   PROMETAFASE
========================================================= */

function showPrometaphase() {

    nucleus.setAttribute(
        "visible",
        "false"
    );

    chromosomes.setAttribute(
        "visible",
        "true"
    );

    spindle.setAttribute(
        "visible",
        "true"
    );

}


/* =========================================================
   METAFASE
========================================================= */

function showMetaphase() {

    nucleus.setAttribute(
        "visible",
        "false"
    );

    chromosomes.setAttribute(
        "visible",
        "true"
    );

    spindle.setAttribute(
        "visible",
        "true"
    );


    /*
     * Mover cromosomas al centro
     */

    const chromosomeList =
        chromosomes.children;


    for (
        let i = 0;
        i < chromosomeList.length;
        i++
    ) {

        const chromosome =
            chromosomeList[i];


        const positions = [

            "-0.8 0.8 0",

            "0 0.4 0",

            "0.8 0.8 0",

            "-0.5 -0.5 0",

            "0.5 -0.5 0"

        ];


        chromosome.setAttribute(
            "animation",
            `
            property: position;
            to: ${positions[i]};
            dur: 1200;
            easing: easeInOutQuad;
            `
        );

    }

}


/* =========================================================
   ANÁFASE
========================================================= */

function showAnaphase() {

    nucleus.setAttribute(
        "visible",
        "false"
    );

    spindle.setAttribute(
        "visible",
        "true"
    );


    const chromosomeList =
        chromosomes.children;


    for (
        let i = 0;
        i < chromosomeList.length;
        i++
    ) {

        const chromosome =
            chromosomeList[i];


        const direction =
            i % 2 === 0
                ? -1
                : 1;


        chromosome.setAttribute(
            "animation",
            `
            property: position;
            to: ${direction * 1.8} ${i * 0.2 - 0.4} 0;
            dur: 2000;
            easing: easeInOutQuad;
            `
        );

    }

}


/* =========================================================
   TELOFASE
========================================================= */

function showTelophase() {

    spindle.setAttribute(
        "visible",
        "false"
    );


    membrane.setAttribute(
        "scale",
        "1.2 1 1"
    );


    chromosomes.setAttribute(
        "visible",
        "true"
    );


    /*
     * Crear núcleos nuevos
     */

    createNewNucleus(
        -1.6,
        0,
        0
    );

    createNewNucleus(
        1.6,
        0,
        0
    );

}


/* =========================================================
   CREAR NÚCLEO
========================================================= */

function createNewNucleus(
    x,
    y,
    z
) {

    const newNucleus =
        document.createElement("a-sphere");


    newNucleus.setAttribute(
        "class",
        "new-nucleus"
    );


    newNucleus.setAttribute(
        "position",
        `${x} ${y} ${z}`
    );


    newNucleus.setAttribute(
        "radius",
        "0.8"
    );


    newNucleus.setAttribute(
        "material",
        `
        color:#9146ff;
        transparent:true;
        opacity:0.25;
        side:double;
        `
    );


    newNucleus.setAttribute(
        "animation",
        `
        property: scale;
        from: 0.1 0.1 0.1;
        to: 1 1 1;
        dur: 1200;
        easing: easeOutElastic;
        `
    );


    cell.appendChild(
        newNucleus
    );

}


/* =========================================================
   CITOCINESIS
========================================================= */

function showCytokinesis() {

    spindle.setAttribute(
        "visible",
        "false"
    );


    /*
     * Animación de separación
     */

    membrane.setAttribute(
        "animation",
        `
        property: scale;
        to: 0.75 1 1;
        dur: 2500;
        easing: easeInOutQuad;
        `
    );


    /*
     * Separar cromosomas
     */

    const chromosomeList =
        chromosomes.children;


    for (
        let i = 0;
        i < chromosomeList.length;
        i++
    ) {

        const chromosome =
            chromosomeList[i];


        const direction =
            i % 2 === 0
                ? -1
                : 1;


        chromosome.setAttribute(
            "animation",
            `
            property: position;
            to: ${direction * 2} ${i * 0.2 - 0.5} 0;
            dur: 2000;
            easing: easeInOutQuad;
            `
        );

    }

}


/* =========================================================
   EJECUTAR FASE
========================================================= */

function executePhase() {

    const phase =
        phases[currentPhase];


    title.textContent =
        phase.name;


    description.textContent =
        phase.description;


    counter.textContent =
        `Fase ${currentPhase + 1} / ${phases.length}`;


    /*
     * Limpiar elementos creados
     */

    document
        .querySelectorAll(".new-nucleus")
        .forEach(
            element => element.remove()
        );


    /*
     * Reset básico
     */

    membrane.removeAttribute(
        "animation"
    );


    switch (
        currentPhase
    ) {

        case 0:

            showInterphase();

            break;


        case 1:

            showProphase();

            break;


        case 2:

            showPrometaphase();

            break;


        case 3:

            showMetaphase();

            break;


        case 4:

            showAnaphase();

            break;


        case 5:

            showTelophase();

            break;


        case 6:

            showCytokinesis();

            break;

    }

}


/* =========================================================
   SIGUIENTE
========================================================= */

function nextPhase() {

    if (
        currentPhase
        <
        phases.length - 1
    ) {

        currentPhase++;

        executePhase();

    }

}


/* =========================================================
   ANTERIOR
========================================================= */

function previousPhase() {

    if (
        currentPhase
        >
        0
    ) {

        currentPhase--;

        executePhase();

    }

}


/* =========================================================
   REINICIAR
========================================================= */

function resetSimulation() {

    currentPhase = 0;


    /*
     * Eliminar núcleos creados
     */

    document
        .querySelectorAll(".new-nucleus")
        .forEach(
            element => element.remove()
        );


    /*
s     */

    membrane.removeAttribute(
        "animation"
    );


    chromosomes
        .querySelectorAll("a-entity")
        .forEach(
            chromosome => {

                chromosome.removeAttribute(
                    "animation"
                );

            }
        );


    /*
     */

    generateChromosomes();

}


/* =========================================================
   EVENTOS DE BOTONES
========================================================= */

nextButton.addEventListener(
    "click",
    nextPhase
);


previousButton.addEventListener(
    "click",
    previousPhase
);


resetButton.addEventListener(
    "click",
    () => {

        resetSimulation();

        executePhase();

    }
);


/* =========================================================
   TECLADO
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        switch (
            event.key
        ) {

            case "ArrowRight":

                nextPhase();

                break;


            case "ArrowLeft":

                previousPhase();

                break;


            case "r":
            case "R":

                resetSimulation();

                executePhase();

                break;

        }

    }
);


/* =========================================================
   INICIALIZACIÓN
========================================================= */

scene.addEventListener(
    "loaded",
    () => {

        generateChromosomes();

        createSpindle();

        executePhase();

    }
);