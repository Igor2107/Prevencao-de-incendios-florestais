
/* =========================================================
   sketch.js
   Ficheiro principal - Prevenção de Incêndios Florestais
   Liga o menu, a calibração, o quiz e o ecrã de resultados.
   ========================================================= */

// ---------------------------------------------------------
// Dados do aluno
// ---------------------------------------------------------

let NOME = "Igor José da Graça de Brito";
let NUMERO = "34577";
let CURSO = "ECGM";
let TEMA = "Prevenção de Incêndios Florestais";

// ---------------------------------------------------------
// Estado da aplicação
// ---------------------------------------------------------

let estado = "menu";
// Estados: menu, calibracao, detalhe, execucao, resultado, erroQuiz

let mensagemErroQuiz = "";

// ---------------------------------------------------------
// Fontes
// ---------------------------------------------------------

let fonteNormal;
let fonteBold;

// ---------------------------------------------------------
// Imagens
// ---------------------------------------------------------

let imgArvore;
let imgNuvem;
let imgSol;

let imgchama;
let imgArvoreArder;
let imgArvoreQueimada;

// ---------------------------------------------------------
// PRELOAD
// ---------------------------------------------------------

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

    // Carrega as perguntas antes de iniciar o quiz.
    preloadExecucao();
}

// ---------------------------------------------------------
// SETUP
// ---------------------------------------------------------

function setup() {
    createCanvas(1920, 1080);

    smooth();
    frameRate(30);

    iniciarMenu();
}

// ---------------------------------------------------------
// DRAW
// ---------------------------------------------------------

function draw() {
    switch (estado) {

        case "menu":
            desenharMenu();
            break;

        case "calibracao":
            desenharCalibracao();
            break;

        case "detalhe":
            desenharDetalhe();
            break;

        case "execucao":
            desenharExecucao();
            break;

        case "resultado":
            desenharEmConstrucao();
            break;

        case "erroQuiz":
            desenharErroQuiz();
            break;

        default:
            mensagemErroQuiz =
                "Estado desconhecido: " + String(estado);

            estado = "erroQuiz";
            desenharErroQuiz();
            break;
    }

    desenharRodape();
}

// ---------------------------------------------------------
// CLIQUES DO RATO
// ---------------------------------------------------------

function mousePressed() {

    switch (estado) {

        // .................................................
        // MENU
        // .................................................

        case "menu":

            cliqueMenu();

            if (estado === "calibracao") {
                iniciarCalibracao();
            }

            break;

        // .................................................
        // CALIBRAÇÃO
        // .................................................

        case "calibracao": {

            // Guarda o estado anterior para detetar a mudança.
            const estadoAnterior = estado;

            cliqueCalibracao();

            // Se o utilizador carregou em voltar.
            if (estado === "menu") {
                iniciarMenu();
                break;
            }

            // Se a calibração terminou e pediu para iniciar o quiz.
            if (estado === "execucao") {

                try {
                    // Verifica se o JSON foi carregado.
                    if (!Array.isArray(perguntasJSON)) {
                        throw new Error(
                            "O ficheiro perguntas.json não foi carregado " +
                            "como uma lista de perguntas."
                        );
                    }

                    if (perguntasJSON.length === 0) {
                        throw new Error(
                            "O ficheiro perguntas.json não contém perguntas."
                        );
                    }

                    // Inicia uma nova partida.
                    iniciarExecucao();

                    // Confirma que o jogo tem perguntas.
                    if (
                        !Array.isArray(perguntasJogo) ||
                        perguntasJogo.length === 0
                    ) {
                        throw new Error(
                            "Não foi possível preparar as perguntas do quiz."
                        );
                    }

                    // Garante que o ecrã apresentado é o quiz.
                    estado = "execucao";

                } catch (erro) {

                    console.error(
                        "Erro ao iniciar o quiz:",
                        erro
                    );

                    mensagemErroQuiz =
                        erro && erro.message
                            ? erro.message
                            : "Ocorreu um erro desconhecido ao iniciar o quiz.";

                    estado = "erroQuiz";
                }

                break;
            }

            // Evita alterar o estado se a calibração continua ativa.
            if (estado === estadoAnterior) {
                break;
            }

            break;
        }

        // .................................................
        // DETALHES DOS CARTÕES
        // .................................................

        case "detalhe":

            cliqueDetalhe();

            if (estado === "menu") {
                iniciarMenu();
            }

            break;

        // .................................................
        // QUIZ
        // .................................................

        case "execucao":

            cliqueExecucao();
            break;

        // .................................................
        // RESULTADO
        // .................................................

        case "resultado":

            estado = "menu";
            iniciarMenu();
            break;

        // .................................................
        // ERRO AO INICIAR O QUIZ
        // .................................................

        case "erroQuiz":

            estado = "menu";
            iniciarMenu();
            break;

        default:

            estado = "menu";
            iniciarMenu();
            break;
    }
}

// ---------------------------------------------------------
// ECRÃ DE ERRO DO QUIZ
// ---------------------------------------------------------

function desenharErroQuiz() {
    background(255, 247, 220);

    noStroke();

    fill(150, 35, 30);
    textFont(fonteBold);
    textAlign(CENTER, CENTER);
    textSize(44);

    text(
        "Não foi possível iniciar o quiz",
        width / 2,
        height / 2 - 100
    );

    fill(60, 60, 50);
    textFont(fonteNormal);
    textSize(26);

    // Divide a mensagem em linhas para caber no ecrã.
    const mensagem = String(mensagemErroQuiz || "Erro desconhecido.");
    const maxCaracteres = 85;
    const palavras = mensagem.split(/\s+/);
    const linhas = [];
    let linhaAtual = "";

    for (const palavra of palavras) {
        const teste = linhaAtual
            ? linhaAtual + " " + palavra
            : palavra;

        if (teste.length > maxCaracteres && linhaAtual) {
            linhas.push(linhaAtual);
            linhaAtual = palavra;
        } else {
            linhaAtual = teste;
        }
    }

    if (linhaAtual) {
        linhas.push(linhaAtual);
    }

    const maxLinhas = 5;

    for (let i = 0; i < linhas.length && i < maxLinhas; i++) {
        text(
            linhas[i],
            width / 2,
            height / 2 - 20 + i * 38
        );
    }

    // Botão para regressar ao menu.
    const botaoX = width / 2 - 220;
    const botaoY = height / 2 + 180;
    const botaoW = 440;
    const botaoH = 70;

    const sobreBotao =
        mouseX >= botaoX &&
        mouseX <= botaoX + botaoW &&
        mouseY >= botaoY &&
        mouseY <= botaoY + botaoH;

    fill(
        sobreBotao
            ? color(60, 155, 70)
            : color(40, 120, 50)
    );

    rect(botaoX, botaoY, botaoW, botaoH, 14);

    fill(255);
    textFont(fonteBold);
    textSize(28);

    text(
        "Voltar ao menu",
        width / 2,
        botaoY + botaoH / 2
    );

    textAlign(LEFT, BASELINE);
}

// ---------------------------------------------------------
// RODAPÉ
// ---------------------------------------------------------

function desenharRodape() {
    noStroke();

    fill(255, 255, 255, 190);
    rect(0, height - 48, width, 48);

    fill(40, 90, 40);
    textFont(fonteNormal);
    textSize(24);

    textAlign(LEFT, BASELINE);

    text(
        TEMA,
        20,
        height - 14
    );

    textAlign(RIGHT, BASELINE);

    text(
        NOME + " · " + NUMERO + " · " + CURSO,
        width - 20,
        height - 14
    );

    textAlign(LEFT, BASELINE);
}

// ---------------------------------------------------------
// ECRÃ DE RESULTADOS PROVISÓRIO
// ---------------------------------------------------------

function desenharEmConstrucao() {
    background(255, 247, 220);

    fill(40, 90, 40);
    textAlign(CENTER, CENTER);

    textFont(fonteBold);
    textSize(48);

    text(
        'Ecrã "' + estado + '" em construção',
        width / 2,
        height / 2 - 30
    );

    textFont(fonteNormal);
    textSize(28);

    text(
        "Clica para voltar ao menu",
        width / 2,
        height / 2 + 30
    );

    textAlign(LEFT, BASELINE);
}
