
// -- -------------------------------------------------------
// -- sketch.js - ficheiro principal
// -- Gere os ecrãs, o setup, o draw, o rodapé e os cliques.
// -- -------------------------------------------------------

// -- Dados do aluno
let NOME = "Igor José da Graça de Brito";
let NUMERO = "34577";
let CURSO = "ECGM";
let TEMA = "Prevenção de Incêndios Florestais";

// -- Ecrã atual
// "menu", "calibracao", "execucao", "resultado" ou "detalhe"
let estado = "menu";

// -- Fontes
let fonteNormal, fonteBold;

// -- Imagens
let imgArvore, imgNuvem, imgSol;
let imgchama, imgArvoreArder, imgArvoreQueimada;


// -- -------------------------------------------------------
// -- preload
// -- -------------------------------------------------------
function preload() {
    fonteNormal = loadFont(
        "media/SourceSansPro/SourceSansPro-Regular.ttf"
    );

    fonteBold = loadFont(
        "media/SourceSansPro/SourceSansPro-Bold.ttf"
    );

    imgArvore = loadImage("media/arvore.png");
    imgNuvem = loadImage("media/nuvem.png");
    imgSol = loadImage("media/sol.png");

    imgchama = loadImage("media/chama.png");
    imgArvoreArder = loadImage("media/arvore_a_arder.png");
    imgArvoreQueimada = loadImage("media/arvore_queimada.png");
}


// -- -------------------------------------------------------
// -- setup
// -- -------------------------------------------------------
function setup() {
    createCanvas(1920, 1080);

    smooth();
    frameRate(30);

    iniciarMenu();
}


// -- -------------------------------------------------------
// -- draw
// -- -------------------------------------------------------
function draw() {
    switch (estado) {
        case "menu":
            desenharMenu();
            break;

        case "detalhe":
            desenharDetalhe();
            break;

        case "calibracao":
            desenharEmConstrucao();
            break;

        case "execucao":
            desenharEmConstrucao();
            break;

        case "resultado":
            desenharEmConstrucao();
            break;

        default:
            estado = "menu";
            desenharMenu();
            break;
    }

    desenharRodape();
}


// -- -------------------------------------------------------
// -- mousePressed
// -- -------------------------------------------------------
function mousePressed() {
    switch (estado) {
        case "menu":
            cliqueMenu();
            break;

        case "detalhe":
            // Volta à página de informação
            estado = "menu";
            break;

        default:
            // Enquanto os outros ecrãs não estão implementados
            estado = "menu";
            break;
    }
}


// -- -------------------------------------------------------
// -- desenharRodape
// -- -------------------------------------------------------
function desenharRodape() {
    noStroke();

    fill(255, 255, 255, 190);
    rect(0, height - 48, width, 48);

    fill(40, 90, 40);

    textFont(fonteNormal);
    textSize(24);

    textAlign(LEFT);
    text(
        TEMA,
        20,
        height - 14
    );

    textAlign(RIGHT);
    text(
        NOME + " · " + NUMERO + " · " + CURSO,
        width - 20,
        height - 14
    );

    textAlign(LEFT);
}


// -- -------------------------------------------------------
// -- desenharEmConstrucao
// -- -------------------------------------------------------
function desenharEmConstrucao() {
    background(255, 247, 220);

    fill(40, 90, 40);

    textAlign(CENTER);
    textFont(fonteBold);
    textSize(48);

    text(
        'Ecrã "' + estado + '" em construção',
        width / 2,
        height / 2 - 20
    );

    textFont(fonteNormal);
    textSize(28);

    text(
        "Clica para voltar ao menu",
        width / 2,
        height / 2 + 30
    );

    textAlign(LEFT);
}
