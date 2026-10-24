
// ==========================================
// execucao.js - Quiz, floresta e sopro
// ==========================================

let perguntasJSON;
let perguntasJogo = [];
let perguntasPorJogo = 5;

let subestadoJogo = "pergunta";
let indicePerguntaJogo = 0;
let escolhidaJogo = -1;
let acertouJogo = false;
let pontosJogo = 0;
let errosJogo = 0;
let estagioFogo = 0;
let inicioJogo = 0;
let inicioFimJogo = 0;
let saudeVisivelJogo = 100;

let resultadoJogo = {
    vitoria: false,
    pontos: 0,
    erros: 0,
    tempo: 0,
    total: 0
};

let micJogo;
let nivelJogo = 0;
let soproAtivo = false;
let limiarSoproMax = 0.1;
let limiarSoproMin = 0.06;
let fogosAcesos = 0;
let apagarProgresso = 0;
let inicioSopro = 0;
let tempoLimiteSopro = 5000;
let duracaoSopro = 1.5;
let dificuldadePorFogo = 0.5;

let nuvensJogo = [];
let alturasArvoresJogo = [250, 290, 260, 300, 255];

let cenaX = 60;
let cenaY = 130;
let cenaW = 860;
let cenaH = 620;
let painelJogoX = 980;
let painelJogoW = 880;


// ==========================================
// CARREGAR PERGUNTAS
// ==========================================

function preloadExecucao() {
    perguntasJSON = null;

    loadJSON(
        "./perguntas.json",
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
                    "perguntas.json foi carregado, mas não contém uma lista de perguntas.",
                    dados
                );
                return;
            }

            console.log(
                "Perguntas carregadas com sucesso:",
                perguntasJSON.length
            );
        },
        function (erro) {
            perguntasJSON = null;
            console.error(
                "Não foi possível carregar ./perguntas.json. Confirma se está na mesma pasta do index.html.",
                erro
            );
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

    let todas = perguntasJSON.slice();

    // Baralhar perguntas
    for (let i = todas.length - 1; i > 0; i--) {
        let j = Math.floor(random(i + 1));
        let temp = todas[i];
        todas[i] = todas[j];
        todas[j] = temp;
    }

    // Selecionar até cinco perguntas
    perguntasJogo = todas.slice(
        0,
        Math.min(perguntasPorJogo, todas.length)
    );

    // Reiniciar estado
    subestadoJogo = "pergunta";
    indicePerguntaJogo = 0;
    escolhidaJogo = -1;
    acertouJogo = false;
    pontosJogo = 0;
    errosJogo = 0;
    estagioFogo = 0;
    saudeVisivelJogo = 100;
    fogosAcesos = 0;
    soproAtivo = false;
    apagarProgresso = 0;
    nivelJogo = 0;
    inicioJogo = millis();

    // Criar nuvens
    nuvensJogo = [];

    for (let i = 0; i < 3; i++) {
        nuvensJogo.push({
            x: random(cenaX + 120, cenaX + cenaW - 360),
            y: random(cenaY + 20, cenaY + 80),
            tam: random(110, 170)
        });
    }

    // Iniciar microfone do jogo
    pararMicJogo();
    micJogo = new p5.AudioIn();
    micJogo.start();
}


// ==========================================
// PARAR MICROFONE
// ==========================================

function pararMicJogo() {
    if (micJogo) {
        micJogo.stop();
        micJogo = null;
    }
}


// ==========================================
// DESENHAR ECRÃ DO JOGO
// ==========================================

function desenharExecucao() {
    background(255, 247, 220);

    if (subestadoJogo === "sopro") {
        atualizarSoproJogo();
    }

    desenharCabecalhoJogo();
    desenharCenaJogo();
    desenharEstadoFlorestaJogo();

    if (subestadoJogo === "pergunta") {
        desenharPerguntaJogo();
    } else if (subestadoJogo === "feedback") {
        desenharPerguntaJogo();
        desenharFeedbackJogo();
    } else if (subestadoJogo === "sopro") {
        desenharSoproJogo();
    } else if (subestadoJogo === "fim") {
        desenharFimJogo();
    }

    textAlign(LEFT);
}


// ==========================================
// RESPONDER À PERGUNTA
// ==========================================

function responderJogo(i) {
    let p = perguntasJogo[indicePerguntaJogo];
    escolhidaJogo = i;

    if (i === p.correta) {
        acertouJogo = true;
        pontosJogo++;
        subestadoJogo = "feedback";
    } else {
        acertouJogo = false;
        errosJogo++;

        if (estagioFogo === 0) {
            estagioFogo = 1;
            subestadoJogo = "feedback";
        } else {
            estagioFogo = 2;
            iniciarSoproJogo();
        }
    }
}


// ==========================================
// INICIAR DESAFIO DE SOPRO
// ==========================================

function iniciarSoproJogo() {
    fogosAcesos++;

    let base = nivelMaximo * 3;

    if (base < 0.05) {
        base = 0.05;
    }

    let multiplicador =
        1 + dificuldadePorFogo * (fogosAcesos - 1);

    limiarSoproMax = base * multiplicador;
    limiarSoproMin = limiarSoproMax * 0.6;

    soproAtivo = false;
    apagarProgresso = 0;
    inicioSopro = millis();
    subestadoJogo = "sopro";
}


// ==========================================
// ATUALIZAR SOPRO
// ==========================================

function atualizarSoproJogo() {
    if (micJogo) {
        nivelJogo = micJogo.getLevel();
    } else {
        nivelJogo = 0;
    }

    if (!soproAtivo && nivelJogo > limiarSoproMax) {
        soproAtivo = true;
    }

    if (soproAtivo && nivelJogo < limiarSoproMin) {
        soproAtivo = false;
    }

    if (soproAtivo) {
        apagarProgresso += 1 / (30 * duracaoSopro);
    } else {
        apagarProgresso -= 0.01;
    }

    if (apagarProgresso < 0) {
        apagarProgresso = 0;
    }

    if (apagarProgresso > 1) {
        apagarProgresso = 1;
    }

    if (apagarProgresso >= 1) {
        estagioFogo = 1;
        soproAtivo = false;
        proximaPerguntaJogo();
    } else if (millis() - inicioSopro > tempoLimiteSopro) {
        estagioFogo = 3;
        terminarJogo(false);
    }
}


// ==========================================
// PRÓXIMA PERGUNTA
// ==========================================

function proximaPerguntaJogo() {
    indicePerguntaJogo++;
    escolhidaJogo = -1;

    if (indicePerguntaJogo >= perguntasJogo.length) {
        terminarJogo(true);
    } else {
        subestadoJogo = "pergunta";
    }
}


// ==========================================
// TERMINAR JOGO
// ==========================================

function terminarJogo(vitoria) {
    resultadoJogo = {
        vitoria: vitoria,
        pontos: pontosJogo,
        erros: errosJogo,
        tempo: (millis() - inicioJogo) / 1000,
        total: perguntasJogo.length
    };

    pararMicJogo();

    if (vitoria) {
        estado = "resultado";
    } else {
        subestadoJogo = "fim";
        inicioFimJogo = millis();
    }
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
    if (subestadoJogo === "pergunta") {
        for (let i = 0; i < 4; i++) {
            if (ratoSobreOpcaoJogo(i)) {
                responderJogo(i);
                return;
            }
        }
    } else if (subestadoJogo === "feedback") {
        if (ratoSobreProximoJogo()) {
            proximaPerguntaJogo();
        }
    }
}


// ==========================================
// CABEÇALHO DO JOGO
// ==========================================

function desenharCabecalhoJogo() {
    let total = perguntasJogo.length;
    let numero = indicePerguntaJogo + 1;

    if (numero > total) {
        numero = total;
    }

    noStroke();
    fill(40, 110, 50);
    textAlign(LEFT);
    textFont(fonteBold);
    textSize(40);
    text("Pergunta " + numero + " de " + total, 60, 75);

    let segundos = Math.floor((millis() - inicioJogo) / 1000);

    textAlign(RIGHT);
    textFont(fonteNormal);
    textSize(34);
    text(
        "Pontos: " + pontosJogo + "      Tempo: " + segundos + " s",
        width - 60,
        75
    );

    textAlign(LEFT);

    // Barra de progresso
    let feitas = indicePerguntaJogo;

    if (subestadoJogo === "feedback") {
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

    if (estagioFogo === 0) {
        fill(135, 206, 250);
    } else if (estagioFogo === 1) {
        fill(175, 200, 220);
    } else if (estagioFogo === 2) {
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

    for (let i = 0; i < nuvensJogo.length; i++) {
        let n = nuvensJogo[i];

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

    if (estagioFogo === 3) {
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

        if (estagioFogo === 3) {
            img = imgArvoreQueimada;
        } else if (estagioFogo === 2 && i >= 3) {
            img = imgArvoreArder;
        }

        image(img, x - larg / 2, base - alt, larg, alt);
    }

    // Chamas
    if (estagioFogo === 1) {
        desenharChamaJogo(cenaX + cenaW - 50, base, 130);
        desenharChamaJogo(cenaX + cenaW - 110, base, 100);
    } else if (estagioFogo === 2) {
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

    if (estagioFogo === 1) {
        alvo = 66;
        corBarra = color(230, 170, 40);
        legenda = "O fogo aproxima-se da floresta";
    } else if (estagioFogo === 2) {
        alvo = 33;
        corBarra = color(230, 100, 30);
        legenda = "O fogo pegou na floresta!";
    } else if (estagioFogo === 3) {
        alvo = 0;
        corBarra = color(160, 40, 35);
        legenda = "A floresta ficou toda queimada";
    }

    saudeVisivelJogo += (alvo - saudeVisivelJogo) * 0.1;

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
        cenaW * saudeVisivelJogo / 100,
        30
    );

    fill(30, 90, 40);
    textFont(fonteNormal);
    textSize(32);
    text(legenda, cenaX, 880);

    textSize(26);
    text("Erros: " + errosJogo, cenaX, 925);
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
    let p = perguntasJogo[indicePerguntaJogo];
    let emFeedback = subestadoJogo === "feedback";

    // Pergunta
    noStroke();
    fill(30, 90, 40);
    textAlign(LEFT);
    textFont(fonteBold);
    textSize(40);

    let linhas = jogoQuebrarTexto(p.pergunta, 44);

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
            } else if (i === escolhidaJogo) {
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
    let p = perguntasJogo[indicePerguntaJogo];

    stroke(40, 90, 40);
    strokeWeight(3);

    if (acertouJogo) {
        fill(168, 214, 158);
    } else {
        fill(255, 130, 90);
    }

    rect(painelJogoX, 765, painelJogoW, 150);
    noStroke();

    // Título
    let corTexto = color(30, 80, 35);
    let titulo = "Resposta certa!";

    if (!acertouJogo) {
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

    if (indicePerguntaJogo === perguntasJogo.length - 1) {
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
    let p = perguntasJogo[indicePerguntaJogo];
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
        painelJogoW * apagarProgresso,
        40
    );

    // Barra do sopro
    let escala = limiarSoproMax * 1.8;
    let nivelDesenho = nivelJogo / escala;

    if (nivelDesenho > 1) {
        nivelDesenho = 1;
    }

    let xMax =
        painelJogoX +
        painelJogoW * (limiarSoproMax / escala);

    let xMin =
        painelJogoX +
        painelJogoW * (limiarSoproMin / escala);

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

    if (soproAtivo) {
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
        (tempoLimiteSopro - (millis() - inicioSopro)) / 1000;

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
        "Vezes que o fogo pegou: " + fogosAcesos,
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

    if (millis() - inicioFimJogo > 3000) {
        estado = "resultado";
    }
}
