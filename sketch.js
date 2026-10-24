// -- -------------------------------------------------------
// -- sketch.js - ficheiro principal
// -- Trata do que é comum a todos os ecrãs: ecrã atual,
// -- setup/draw, rodapé e redirecionar o rato para o ecrã certo.
// -- -------------------------------------------------------

// -- Dados do aluno (rodapé)
let NOME = "Igor José da Graça de Brito";
let NUMERO = "34577";
let CURSO = "ECGM";
let TEMA = "Prevenção de Incêndios Florestais";   // -- trocar pelo tema atribuído (em inglês)

// -- Ecrã atual: "menu", "calibracao", "detalhe", "execucao" ou "resultado"
let estado = "menu";

// -- Fontes de texto
let fonteNormal, fonteBold;

// -- Imagens
let imgArvore, imgNuvem, imgSol;
let imgchama, imgArvoreArder, imgArvoreQueimada;

// -- ------------------------------------------------------------------------
// -- preload
// -- -------
function preload() {
    fonteNormal = loadFont("media/SourceSansPro/SourceSansPro-Regular.ttf");
    fonteBold = loadFont("media/SourceSansPro/SourceSansPro-Bold.ttf");

    imgArvore = loadImage("media/arvore.png");
    imgNuvem = loadImage("media/nuvem.png");
    imgSol = loadImage("media/sol.png");

    imgchama = loadImage("media/chama.png");
    imgArvoreArder = loadImage("media/arvore_a_arder.png");
    imgArvoreQueimada = loadImage("media/arvore_queimada.png");
}

// -- ------------------------------------------------------------------------
// -- setup
// -- -----
function setup() {
    createCanvas(1920, 1080);
    smooth();
    frameRate(30);

    iniciarMenu();                  // -- menu.js
}

// -- ------------------------------------------------------------------------
// -- draw
// -- ----
function draw() {
    switch (estado) {
        case "menu":
            desenharMenu();             // -- menu.js
            break;

        case "calibracao":
            desenharCalibracao();       // -- calibracao.js
            break;

        case "detalhe":
            desenharDetalhe();          // -- detalhe.js
            break;

        case "execucao":
        case "resultado":
            desenharEmConstrucao();     // -- ainda não existem
            break;

        default:
            estado = "menu";
            desenharMenu();
            break;
    }

    desenharRodape();
}

// -- ------------------------------------------------------------------------
// -- mousePressed
// -- ------------
// -- Cada ecrã trata do seu clique. Depois do clique, se o ecrã mudou,
// -- o ecrã de destino é preparado para começar do início.
function mousePressed() {
    switch (estado) {
        case "menu":
            cliqueMenu();               // -- menu.js
            if (estado === "calibracao") {
                iniciarCalibracao();    // -- calibracao.js: repõe o ecrã
            }
            break;

        case "calibracao":
            cliqueCalibracao();         // -- calibracao.js
            if (estado === "menu") {
                iniciarMenu();          // -- repõe a animação dos cartões
            }
            break;

        case "detalhe":
            cliqueDetalhe();            // -- detalhe.js
            if (estado === "menu") {
                iniciarMenu();
            }
            break;

        case "execucao":
        case "resultado":
            estado = "menu";            // -- temporário: volta ao menu para testar
            iniciarMenu();
            break;

        default:
            estado = "menu";
            iniciarMenu();
            break;
    }
}

// -- ------------------------------------------------------------------------
// -- desenharRodape
// -- --------------
// -- Tema em baixo à esquerda, aluno em baixo à direita
function desenharRodape() {
    noStroke();

    fill(255, 255, 255, 190);
    rect(0, height - 48, width, 48);

    fill(40, 90, 40);
    textFont(fonteNormal);
    textSize(24);

    textAlign(LEFT);
    text(TEMA, 20, height - 14);

    textAlign(RIGHT);
    text(NOME + " · " + NUMERO + " · " + CURSO, width - 20, height - 14);

    textAlign(LEFT);
}

// -- ------------------------------------------------------------------------
// -- desenharEmConstrucao
// -- --------------------
// -- Ecrã provisório para os estados que ainda não foram feitos
function desenharEmConstrucao() {
    background(255, 247, 220);

    fill(40, 90, 40);
    textAlign(CENTER);

    textFont(fonteBold);
    textSize(48);
    text('Ecrã "' + estado + '" em construção', width / 2, height / 2 - 20);

    textFont(fonteNormal);
    textSize(28);
    text("Clica para voltar ao menu", width / 2, height / 2 + 30);

    textAlign(LEFT);
}