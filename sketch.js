
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
let TEMA = "Forest Fire Prevention";
 
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
                    if (!jogo || jogo.total === 0) {
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
    cliqueResultado();
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
 
    // Título
    textAlign(CENTER, CENTER);
    textFont(fonteBold);
    textSize(64);
    fill(40, 100, 45);
 
    if (resultadoJogo.vitoria) {
        text(
            "Parabéns! Salvaste a floresta!",
            width / 2,
            170
        );
    } else {
        text("Fim do jogo!", width / 2, 170);
    }
 
    // Mensagem
    textFont(fonteNormal);
    textSize(30);
    fill(65, 75, 60);
 
    if (resultadoJogo.vitoria) {
        if (resultadoJogo.erros > 3) {
            text(
                "Salvaste a floresta, mas devias estudar mais sobre o assunto.",
                width / 2,
                245
            );
        } else {
            text(
                "Demonstraste que sabes prevenir incêndios florestais.",
                width / 2,
                245
            );
        }
    } else {
        text(
            "Tenta novamente para proteger a floresta!",
            width / 2,
            245
        );
    }
 
    // Resultado
    textSize(30);
    fill(65, 75, 60);
    // Painel de resultados
    let x = width / 2 - 350;
    let y = 320;
    let w = 700;
    let h = 350;
 
    noStroke();
    fill(220, 235, 205);
    rect(x, y, w, h, 24);
 
    fill(40, 100, 45);
    textFont(fonteBold);
    textSize(36);
    text("O teu resultado", width / 2, y + 50);
 
    let total = resultadoJogo.total;
    let certas = resultadoJogo.pontos;
    let erradas = resultadoJogo.erros;
    let tempo = Math.floor(resultadoJogo.tempo || 0);
 
    textFont(fonteNormal);
    textSize(30);
    fill(50, 70, 45);
 
    text(
        "Respostas certas: " + certas + " / " + total,
        width / 2,
        y + 115
    );
 
    text(
        "Respostas erradas: " + erradas,
        width / 2,
        y + 165
    );
 
    text(
        "Tempo: " + Math.floor(tempo / 60) + " min " +
        (tempo % 60) + " s",
        width / 2,
        y + 215
    );
 
    let percentagem = total > 0
        ? Math.round(certas / total * 100)
        : 0;
 
    text(
        "Pontuação: " + percentagem + "%",
        width / 2,
        y + 265
    );
 
    // Botão voltar ao menu
    let bx = width / 2 - 180;
    let by = 730;
    let bw = 360;
    let bh = 85;
 
    if (
        mouseX >= bx &&
        mouseX <= bx + bw &&
        mouseY >= by &&
        mouseY <= by + bh
    ) {
        fill(60, 155, 70);
    } else {
        fill(40, 125, 50);
    }
 
    stroke(30, 90, 40);
    strokeWeight(3);
    rect(bx, by, bw, bh, 18);
 
    noStroke();
    fill(255);
    textFont(fonteBold);
    textSize(32);
    text("Voltar ao menu", width / 2, by + bh / 2);
 
    textAlign(LEFT);
}
 
 
function cliqueResultado() {
    let bx = width / 2 - 180;
    let by = 730;
    let bw = 360;
    let bh = 85;
 
    if (
        mouseX >= bx &&
        mouseX <= bx + bw &&
        mouseY >= by &&
        mouseY <= by + bh
    ) {
        if (jogo) {
            jogo.parar();
        }
 
        estado = "menu";
        iniciarMenu();
    }
}
 