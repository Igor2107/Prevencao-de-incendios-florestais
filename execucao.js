// ==========================================
// execucao.js - Quiz, floresta e sopro
// ==========================================
//
// Este ficheiro tem a configuração, o carregamento de dados e sons,
// os cliques e o desenho do ecrã de execução.
// A lógica do jogo está nas classes (um ficheiro por classe):
//   pergunta.js  - Pergunta
//   microfone.js - Microfone
//   fogo.js      - Fogo
//   jogo.js      - Jogo
// As funções desenhar...() só desenham o estado do objeto "jogo".

// ------------------------------------------
// Dados e configuração
// ------------------------------------------

let perguntasJSON;          // dados em bruto, lidos do perguntas.json
let perguntasPorJogo = 5;   // quantas perguntas tem cada partida

let jogo = null;            // partida atual (objeto da classe Jogo)

// Resultado da última partida (lido pelo ecrã de resultados em sketch.js)
let resultadoJogo = {
    vitoria: false,
    pontos: 0,
    erros: 0,
    tempo: 0,
    total: 0
};

// Configuração do desafio de sopro
let tempoLimiteSopro = 5000;   // ms para apagar o fogo
let duracaoSopro = 1.5;        // segundos de sopro contínuo para apagar
let dificuldadePorFogo = 0.5;  // aumento do limiar por cada novo fogo

// Posição e tamanho do cenário e do painel
let cenaX = 60;
let cenaY = 130;
let cenaW = 860;
let cenaH = 620;
let painelJogoX = 980;
let painelJogoW = 880;

let alturasArvoresJogo = [250, 290, 260, 300, 255];

// Sons
let somCorreto;
let somErrado;
let somFimJogo;


// ==========================================
// CARREGAR PERGUNTAS E SONS
// ==========================================

function preloadExecucao() {
    perguntasJSON = null;

    somCorreto = loadSound("media/correto.wav");
    somErrado = loadSound("media/errado.wav");
    somFimJogo = loadSound("media/fim_jogo.wav");

    loadJSON(
        "perguntas.json",
        function (dados) {
            if (Array.isArray(dados)) {
                perguntasJSON = dados;
            } else if (dados && Array.isArray(dados.perguntas)) {
                perguntasJSON = dados.perguntas;
            } else if (dados && Array.isArray(dados.questions)) {
                perguntasJSON = dados.questions;
            } else if (dados && typeof dados === "object") {
                const chaves = Object.keys(dados);
                const soIndices =
                    chaves.length > 0 &&
                    chaves.every(function (chave) {
                        return /^\d+$/.test(chave);
                    });

                if (soIndices) {
                    perguntasJSON = chaves
                        .sort(function (a, b) {
                            return Number(a) - Number(b);
                        })
                        .map(function (chave) {
                            return dados[chave];
                        });
                }
            }

            if (!Array.isArray(perguntasJSON)) {
                console.error(
                    "perguntas.json não contém uma lista de perguntas.",
                    dados
                );
            } else {
                console.log(
                    "Perguntas carregadas com sucesso:",
                    perguntasJSON.length
                );
            }
        },
        function (erro) {
            perguntasJSON = null;
            console.error("Erro ao carregar perguntas.json:", erro);
        }
    );
}


// ==========================================
// INICIAR JOGO
// ==========================================

function iniciarExecucao() {
    if (!Array.isArray(perguntasJSON) || perguntasJSON.length === 0) {
        throw new Error(
            "As perguntas ainda não foram carregadas. Verifica perguntas.json."
        );
    }

    // Garante que o microfone da partida anterior fica parado
    if (jogo) {
        jogo.parar();
    }

    jogo = new Jogo(perguntasJSON);
}


// ==========================================
// DESENHAR ECRÃ DO JOGO
// ==========================================

function desenharExecucao() {
    background(255, 247, 220);

    jogo.atualizar();

    desenharCabecalhoJogo();
    desenharCenaJogo();
    desenharEstadoFlorestaJogo();

    if (jogo.subestado === "pergunta") {
        desenharPerguntaJogo();
    } else if (jogo.subestado === "feedback") {
        desenharPerguntaJogo();
        desenharFeedbackJogo();
    } else if (jogo.subestado === "sopro") {
        desenharSoproJogo();
    } else if (jogo.subestado === "fim") {
        desenharFimJogo();
    }

    textAlign(LEFT);
}


// ==========================================
// CLIQUES
// ==========================================

function ratoSobreOpcaoJogo(i) {
    let y = 330 + i * 108;

    return (
        mouseX > painelJogoX &&
        mouseX < painelJogoX + painelJogoW &&
        mouseY > y &&
        mouseY < y + 88
    );
}

function ratoSobreProximoJogo() {
    return (
        mouseX > painelJogoX &&
        mouseX < painelJogoX + 360 &&
        mouseY > 930 &&
        mouseY < 1000
    );
}

function cliqueExecucao() {
    if (!jogo) {
        return;
    }

    if (jogo.subestado === "pergunta") {
        for (let i = 0; i < 4; i++) {
            if (ratoSobreOpcaoJogo(i)) {
                jogo.responder(i);
                return;
            }
        }
    } else if (jogo.subestado === "feedback") {
        if (ratoSobreProximoJogo()) {
            jogo.proximaPergunta();
        }
    }
}


// ==========================================
// CABEÇALHO DO JOGO
// ==========================================

function desenharCabecalhoJogo() {
    let total = jogo.total;
    let numero = jogo.indice + 1;

    if (numero > total) {
        numero = total;
    }

    noStroke();
    fill(40, 110, 50);
    textAlign(LEFT);
    textFont(fonteBold);
    textSize(40);
    text("Pergunta " + numero + " de " + total, 60, 75);

    let segundos = Math.floor((millis() - jogo.inicio) / 1000);

    textAlign(RIGHT);
    textFont(fonteNormal);
    textSize(34);
    text(
        "Pontos: " + jogo.pontos + "      Tempo: " + segundos + " s",
        width - 60,
        75
    );

    textAlign(LEFT);

    // Barra de progresso
    let feitas = jogo.indice;

    if (jogo.subestado === "feedback") {
        feitas++;
    }

    fill(230, 220, 190);
    rect(60, 95, 1800, 10);

    fill(40, 130, 50);
    rect(60, 95, 1800 * feitas / total, 10);
}


// ==========================================
// CENÁRIO DA FLORESTA
// ==========================================

function desenharCenaJogo() {
    stroke(40, 110, 50);
    strokeWeight(4);

    if (jogo.fogo.estagio === 0) {
        fill(135, 206, 250);
    } else if (jogo.fogo.estagio === 1) {
        fill(175, 200, 220);
    } else if (jogo.fogo.estagio === 2) {
        fill(205, 155, 125);
    } else {
        fill(110, 110, 120);
    }

    rect(cenaX, cenaY, cenaW, cenaH);
    noStroke();

    // Sol e nuvens
    image(
        imgSol,
        cenaX + cenaW - 170,
        cenaY + 30,
        120,
        120
    );

    for (let i = 0; i < jogo.nuvens.length; i++) {
        let n = jogo.nuvens[i];

        image(
            imgNuvem,
            n.x - n.tam / 2,
            n.y,
            n.tam,
            n.tam * 0.53
        );
    }

    // Chão
    let chaoY = cenaY + cenaH - 110;

    if (jogo.fogo.estagio === 3) {
        fill(90, 80, 60);
    } else {
        fill(120, 190, 90);
    }

    rect(cenaX + 2, chaoY, cenaW - 4, 108);

    // Árvores
    let base = chaoY + 40;

    for (let i = 0; i < 5; i++) {
        let x = cenaX + 110 + i * 135;
        let alt = alturasArvoresJogo[i];
        let larg = alt * 0.77;

        let img = imgArvore;

        if (jogo.fogo.estagio === 3) {
            img = imgArvoreQueimada;
        } else if (jogo.fogo.estagio === 2 && i >= 3) {
            img = imgArvoreArder;
        }

        image(img, x - larg / 2, base - alt, larg, alt);
    }

    // Chamas
    if (jogo.fogo.estagio === 1) {
        desenharChamaJogo(cenaX + cenaW - 50, base, 130);
        desenharChamaJogo(cenaX + cenaW - 110, base, 100);
    } else if (jogo.fogo.estagio === 2) {
        desenharChamaJogo(cenaX + 515, base, 170);
        desenharChamaJogo(cenaX + 650, base, 190);
        desenharChamaJogo(cenaX + 760, base, 160);
        desenharChamaJogo(cenaX + cenaW - 50, base, 140);
    }
}


// ==========================================
// DESENHAR CHAMA
// ==========================================

function desenharChamaJogo(x, yBase, altura) {
    let alt = altura * (1 + 0.12 * sin(frameCount * 0.4 + x));
    let larg = alt * 0.7;

    image(
        imgchama,
        x - larg / 2,
        yBase - alt,
        larg,
        alt
    );
}


// ==========================================
// ESTADO DA FLORESTA
// ==========================================

function desenharEstadoFlorestaJogo() {
    let alvo = 100;
    let corBarra = color(48, 120, 55);
    let legenda = "Floresta segura";

    if (jogo.fogo.estagio === 1) {
        alvo = 66;
        corBarra = color(230, 170, 40);
        legenda = "O fogo aproxima-se da floresta";
    } else if (jogo.fogo.estagio === 2) {
        alvo = 33;
        corBarra = color(230, 100, 30);
        legenda = "O fogo pegou na floresta!";
    } else if (jogo.fogo.estagio === 3) {
        alvo = 0;
        corBarra = color(160, 40, 35);
        legenda = "A floresta ficou toda queimada";
    }

    jogo.fogo.saudeVisivel += (alvo - jogo.fogo.saudeVisivel) * 0.1;

    fill(40, 110, 50);
    textAlign(LEFT);
    textFont(fonteBold);
    textSize(28);
    text("Estado da floresta", cenaX, 790);

    stroke(40, 90, 40);
    strokeWeight(3);
    fill(235, 225, 195);
    rect(cenaX, 805, cenaW, 30);

    noStroke();
    fill(corBarra);
    rect(
        cenaX,
        805,
        cenaW * jogo.fogo.saudeVisivel / 100,
        30
    );

    fill(30, 90, 40);
    textFont(fonteNormal);
    textSize(32);
    text(legenda, cenaX, 880);

    textSize(26);
    text("Erros: " + jogo.erros, cenaX, 925);
}


// ==========================================
// QUEBRAR TEXTO EM LINHAS
// ==========================================

function jogoQuebrarTexto(t, maxCaracteres) {
    let palavras = t.split(" ");
    let linhas = [];
    let atual = "";

    for (let i = 0; i < palavras.length; i++) {
        if (atual === "") {
            atual = palavras[i];
        } else if (
            (atual + " " + palavras[i]).length > maxCaracteres
        ) {
            linhas.push(atual);
            atual = palavras[i];
        } else {
            atual = atual + " " + palavras[i];
        }
    }

    if (atual !== "") {
        linhas.push(atual);
    }

    return linhas;
}


// ==========================================
// DESENHAR PERGUNTA E OPÇÕES
// ==========================================

function desenharPerguntaJogo() {
    let p = jogo.perguntaAtual;
    let emFeedback = jogo.subestado === "feedback";

    // Pergunta
    noStroke();
    fill(30, 90, 40);
    textAlign(LEFT);
    textFont(fonteBold);
    textSize(40);

    let linhas = jogoQuebrarTexto(p.enunciado, 44);

    for (let i = 0; i < linhas.length; i++) {
        text(linhas[i], painelJogoX, 195 + i * 48);
    }

    // Opções A, B, C e D
    let letras = ["A", "B", "C", "D"];

    for (let i = 0; i < 4; i++) {
        let y = 330 + i * 108;
        let fundo;
        let corTexto = color(40, 40, 30);

        if (!emFeedback) {
            if (ratoSobreOpcaoJogo(i)) {
                fundo = color(255, 226, 120);
            } else {
                fundo = color(255, 213, 79);
            }
        } else {
            if (i === p.correta) {
                fundo = color(168, 214, 158);
                corTexto = color(30, 80, 35);
            } else if (i === jogo.escolhida) {
                fundo = color(225, 50, 45);
                corTexto = color(255);
            } else {
                fundo = color(150, 210, 245);
            }
        }

        stroke(40, 90, 40);
        strokeWeight(3);
        fill(fundo);
        rect(painelJogoX, y, painelJogoW, 88);

        // Círculo com a letra
        fill(255);
        ellipse(painelJogoX + 50, y + 44, 52, 52);

        noStroke();
        fill(40, 90, 40);
        textAlign(CENTER);
        textFont(fonteBold);
        textSize(30);
        text(letras[i], painelJogoX + 50, y + 55);

        // Texto da opção
        fill(corTexto);
        textAlign(LEFT);
        textFont(fonteNormal);

        let partes = jogoQuebrarTexto(p.opcoes[i], 50);

        if (partes.length === 1) {
            textSize(30);
            text(partes[0], painelJogoX + 95, y + 55);
        } else {
            textSize(26);
            text(partes[0], painelJogoX + 95, y + 38);

            if (partes.length > 1) {
                text(partes.slice(1).join(" "), painelJogoX + 95, y + 70);
            }
        }
    }
}


// ==========================================
// FEEDBACK DA RESPOSTA
// ==========================================

function desenharFeedbackJogo() {
    let p = jogo.perguntaAtual;

    stroke(40, 90, 40);
    strokeWeight(3);

    if (jogo.acertou) {
        fill(168, 214, 158);
    } else {
        fill(255, 130, 90);
    }

    rect(painelJogoX, 765, painelJogoW, 150);
    noStroke();

    // Título
    let corTexto = color(30, 80, 35);
    let titulo = "Resposta certa!";

    if (!jogo.acertou) {
        corTexto = color(60, 15, 10);
        titulo = "Resposta errada! O fogo aproxima-se!";
    }

    fill(corTexto);
    textAlign(LEFT);
    textFont(fonteBold);
    textSize(34);
    text(titulo, painelJogoX + 24, 810);

    // Explicação
    textFont(fonteNormal);
    textSize(26);

    let linhas = jogoQuebrarTexto(p.explicacao, 62);

    for (let i = 0; i < linhas.length && i < 3; i++) {
        text(
            linhas[i],
            painelJogoX + 24,
            850 + i * 32
        );
    }

    // Botão para avançar
    let rotulo = "Próxima pergunta";

    if (jogo.indice === jogo.total - 1) {
        rotulo = "Ver resultado";
    }

    stroke(30, 90, 40);
    strokeWeight(4);

    if (ratoSobreProximoJogo()) {
        fill(60, 160, 70);
    } else {
        fill(40, 130, 50);
    }

    rect(painelJogoX, 930, 360, 70);

    noStroke();
    fill(255);
    textAlign(CENTER);
    textFont(fonteBold);
    textSize(32);

    text(
        rotulo,
        painelJogoX + 180,
        975
    );

    textAlign(LEFT);
}


// ==========================================
// DESAFIO DE SOPRO
// ==========================================

function desenharSoproJogo() {
    if (
        jogo.indice < 0 ||
        jogo.indice >= jogo.total
    ) {
        return;
    }

    let p = jogo.perguntaAtual;

    if (!p || !Array.isArray(p.opcoes)) {
        return;
    }

    let letras = ["A", "B", "C", "D"];

    // Aviso
    noStroke();
    textAlign(LEFT);
    fill(200, 60, 45);
    textFont(fonteBold);
    textSize(56);

    text(
        "O fogo pegou na floresta!",
        painelJogoX,
        200
    );

    fill(30, 90, 40);
    textSize(42);

    text(
        "SOPRA para o microfone para apagar!",
        painelJogoX,
        265
    );

    // Resposta correta
    fill(90, 55, 50);
    textFont(fonteNormal);
    textSize(26);

    let certa =
        "Resposta certa: " +
        letras[p.correta] +
        " - " +
        p.opcoes[p.correta];

    let linhas = jogoQuebrarTexto(certa, 62);

    for (let i = 0; i < linhas.length && i < 2; i++) {
        text(
            linhas[i],
            painelJogoX,
            315 + i * 32
        );
    }

    // Barra do fogo
    fill(30, 90, 40);
    textFont(fonteBold);
    textSize(30);

    text(
        "Fogo a apagar",
        painelJogoX,
        435
    );

    stroke(40, 90, 40);
    strokeWeight(3);
    fill(235, 225, 195);

    rect(
        painelJogoX,
        450,
        painelJogoW,
        40
    );

    noStroke();
    fill(60, 150, 220);

    rect(
        painelJogoX,
        450,
        painelJogoW * jogo.fogo.progresso,
        40
    );

    // Barra do sopro
    let escala = jogo.fogo.limiarMax * 1.8;
    let nivelDesenho = jogo.microfone.nivel / escala;

    if (nivelDesenho > 1) {
        nivelDesenho = 1;
    }

    let xMax =
        painelJogoX +
        painelJogoW * (jogo.fogo.limiarMax / escala);

    let xMin =
        painelJogoX +
        painelJogoW * (jogo.fogo.limiarMin / escala);

    fill(30, 90, 40);
    textFont(fonteBold);
    textSize(30);

    text(
        "O teu sopro",
        painelJogoX,
        550
    );

    stroke(40, 90, 40);
    strokeWeight(3);
    fill(235, 225, 195);

    rect(
        painelJogoX,
        565,
        painelJogoW,
        40
    );

    noStroke();

    if (jogo.fogo.soproAtivo) {
        fill(48, 120, 55);
    } else {
        fill(150, 160, 150);
    }

    rect(
        painelJogoX,
        565,
        painelJogoW * nivelDesenho,
        40
    );

    // Marcas dos limiares de sopro
    stroke(40, 40, 40);
    strokeWeight(4);

    line(
        xMax,
        555,
        xMax,
        615
    );

    strokeWeight(2);

    line(
        xMin,
        560,
        xMin,
        610
    );

    noStroke();

    fill(90, 100, 85);
    textFont(fonteNormal);
    textSize(24);

    text(
        "Passa a linha grossa para soprar com força suficiente.",
        painelJogoX,
        645
    );

    // Tempo restante
    let restante =
        (tempoLimiteSopro - (millis() - jogo.fogo.inicioSopro)) / 1000;

    if (restante < 0) {
        restante = 0;
    }

    fill(200, 60, 45);
    textFont(fonteBold);
    textSize(34);

    text(
        "Tempo restante: " + restante.toFixed(1) + " s",
        painelJogoX,
        715
    );

    // Barra do tempo
    fill(235, 225, 195);

    rect(
        painelJogoX,
        735,
        painelJogoW,
        20
    );

    fill(200, 60, 45);

    rect(
        painelJogoX,
        735,
        painelJogoW * restante / (tempoLimiteSopro / 1000),
        20
    );

    // Dificuldade
    fill(90, 100, 85);
    textFont(fonteNormal);
    textSize(26);

    text(
        "Vezes que o fogo pegou: " + jogo.fogo.fogosAcesos,
        painelJogoX,
        800
    );
}


// ==========================================
// FIM DO JOGO
// ==========================================

function desenharFimJogo() {
    noStroke();
    textAlign(LEFT);
    fill(200, 60, 45);
    textFont(fonteBold);
    textSize(72);

    text(
        "A floresta ardeu!",
        painelJogoX,
        300
    );

    fill(30, 90, 40);
    textFont(fonteNormal);
    textSize(36);

    text(
        "Não conseguiste apagar o fogo a tempo.",
        painelJogoX,
        370
    );

    if (millis() - jogo.inicioFim > 3000) {
        estado = "resultado";
    }
}