// ==========================================
// CALIBRAÇÃO DO MICROFONE
// Prevenção de Incêndios Florestais
// ==========================================

let microfone;
let estadoCalibracao = "inicial";

let inicioCalibracao = 0;
let duracaoCalibracao = 3000;

let nivelSom = 0;
let nivelMaximo = 0;
let somaNiveis = 0;
let numeroAmostras = 0;
let nivelMedio = 0;

// -- Barra de volume em tempo real
let nivelVisivel = 0;       // -- valor suavizado, só para desenhar a barra
let ganhoBarraVolume = 6;   // -- amplifica o nível para a barra se notar (sobe se mexer pouco)

let erroMicrofone = "";

// -- Tamanho do texto dos botões (muda aqui para aumentar ou diminuir)
let tamanhoTextoBotao = 48;
let tamanhoTextoVoltar = 40;

let botaoCalibrar = {
    x: 680,
    y: 600,
    w: 560,
    h: 100
};

let botaoVoltar = {
    x: 60,
    y: 115,
    w: 260,
    h: 80
};

let botaoContinuar = {
    x: 740,
    y: 740,
    w: 440,
    h: 90
};


// ==========================================
// INICIALIZAÇÃO
// ==========================================

function iniciarCalibracao() {
    estadoCalibracao = "inicial";

    nivelSom = 0;
    nivelMaximo = 0;
    somaNiveis = 0;
    numeroAmostras = 0;
    nivelMedio = 0;

    erroMicrofone = "";
}


// ==========================================
// DESENHAR ECRÃ DE CALIBRAÇÃO
// ==========================================

function desenharCalibracao() {
    background(245, 248, 239);

    desenharCabecalhoCalibracao();

    textFont(fonteNormal);
    fill(65, 75, 60);
    textAlign(CENTER, CENTER);
    textSize(29);

    text(
        "Configura o microfone antes de começares.",
        width / 2,
        240
    );

    desenharInstrucoesCalibracao();

    switch (estadoCalibracao) {
        case "inicial":
            desenharEstadoInicial();
            break;

        case "prompt":
            desenharEstadoPrompt();
            break;

        case "calibrando":
            atualizarNivelMicrofone();
            desenharEstadoCalibrando();
            break;

        case "completo":
            desenharEstadoCompleto();
            break;

        case "erro":
            desenharEstadoErro();
            break;
    }

    // -- O botão Voltar aparece sempre (o sketch.js não o desenha)
    desenharBotaoVoltarCalibracao();

    textAlign(LEFT, BASELINE);
}


// ==========================================
// CABEÇALHO
// ==========================================

function desenharCabecalhoCalibracao() {
    noStroke();

    fill(40, 90, 40);
    textFont(fonteBold);
    textAlign(CENTER, CENTER);
    textSize(56);

    text(
        "Calibração do microfone",
        width / 2,
        165
    );

    fill(55, 105, 55);
    rect(
        width / 2 - 100,
        205,
        200,
        5,
        3
    );
}


// ==========================================
// INSTRUÇÕES
// ==========================================

function desenharInstrucoesCalibracao() {
    textFont(fonteNormal);
    textSize(25);
    textAlign(LEFT, CENTER);
    fill(55, 65, 50);

    text(
        "1. Permite o acesso ao microfone.",
        600,
        320
    );

    text(
        "2. Mantém algum silêncio durante a calibração.",
        600,
        365
    );

    text(
        "3. Aguarda até a calibração terminar.",
        600,
        410
    );

    textAlign(CENTER, CENTER);
}


// ==========================================
// ESTADO INICIAL
// ==========================================

function desenharEstadoInicial() {
    fill(100, 110, 90);
    textFont(fonteNormal);
    textSize(25);

    text(
        "O microfone ainda não foi calibrado.",
        width / 2,
        500
    );

    desenharBotaoCalibracao(
        "Calibrar microfone",
        botaoCalibrar,
        color(48, 120, 55),
        color(63, 135, 70),
        tamanhoTextoBotao
    );
}


// ==========================================
// ESTADO DE PREPARAÇÃO
// ==========================================

function desenharEstadoPrompt() {
    fill(100, 110, 90);
    textFont(fonteNormal);
    textSize(27);

    text(
        "Prepara-te para iniciar a calibração.",
        width / 2,
        500
    );

    desenharBotaoCalibracao(
        "Iniciar calibração",
        botaoCalibrar,
        color(48, 120, 55),
        color(63, 135, 70),
        tamanhoTextoBotao
    );
}


// ==========================================
// ESTADO DE CALIBRAÇÃO
// ==========================================

function desenharEstadoCalibrando() {
    fill(55, 75, 50);
    textFont(fonteBold);
    textSize(34);

    text(
        "A calibrar o microfone...",
        width / 2,
        485
    );

    let tempoDecorrido = millis() - inicioCalibracao;

    // -- progresso de 0 a 1
    let progresso = tempoDecorrido / duracaoCalibracao;
    if (progresso < 0) {
        progresso = 0;
    }
    if (progresso > 1) {
        progresso = 1;
    }

    let larguraBarra = 600;
    let alturaBarra = 30;
    let xBarra = (width - larguraBarra) / 2;
    let yBarra = 535;

    noStroke();

    fill(220, 225, 215);
    rect(
        xBarra,
        yBarra,
        larguraBarra,
        alturaBarra,
        15
    );

    fill(48, 120, 55);
    rect(
        xBarra,
        yBarra,
        larguraBarra * progresso,
        alturaBarra,
        15
    );

    fill(75, 85, 65);
    textFont(fonteNormal);
    textSize(24);

    text(
        Math.round(progresso * 100) + "%",
        width / 2,
        585
    );

    // -- barra com o barulho que o microfone está a ouvir
    desenharBarraVolume(xBarra, 665, larguraBarra, alturaBarra);

    if (tempoDecorrido >= duracaoCalibracao) {
        terminarCalibracao();
    }
}


// ==========================================
// BARRA DE VOLUME EM TEMPO REAL
// ==========================================
// x, y, w, h: posição e tamanho da barra

function desenharBarraVolume(x, y, w, h) {
    // -- nível atual (0 a 1), amplificado para se ver bem
    let alvo = nivelSom * ganhoBarraVolume;
    if (alvo > 1) {
        alvo = 1;
    }

    // -- aproxima aos poucos para a barra não tremer
    nivelVisivel = nivelVisivel + (alvo - nivelVisivel) * 0.3;

    // -- pico (o valor mais alto até agora)
    let pico = nivelMaximo * ganhoBarraVolume;
    if (pico > 1) {
        pico = 1;
    }

    // -- título
    fill(55, 75, 50);
    textFont(fonteBold);
    textSize(26);
    textAlign(CENTER, CENTER);
    text("Volume do microfone", width / 2, y - 28);

    // -- fundo da barra
    noStroke();
    fill(220, 225, 215);
    rect(x, y, w, h, 15);

    // -- barra: verde (baixo), amarelo (médio), vermelho (alto)
    if (nivelVisivel < 0.5) {
        fill(48, 120, 55);
    } else if (nivelVisivel < 0.8) {
        fill(230, 170, 40);
    } else {
        fill(200, 60, 45);
    }
    rect(x, y, w * nivelVisivel, h, 15);

    // -- marca do pico
    if (nivelMaximo > 0) {
        stroke(40, 40, 40);
        strokeWeight(3);
        line(x + w * pico, y - 5, x + w * pico, y + h + 5);
        noStroke();
    }

    // -- legenda
    fill(100, 110, 90);
    textFont(fonteNormal);
    textSize(22);
    text("A barra mostra o ruído ambiente. Mantém silêncio.", width / 2, y + h + 32);
}


// ==========================================
// ESTADO CONCLUÍDO
// ==========================================

function desenharEstadoCompleto() {
    fill(40, 125, 55);
    textFont(fonteBold);
    textSize(36);

    text(
        "Calibração concluída!",
        width / 2,
        480
    );

    fill(65, 75, 60);
    textFont(fonteNormal);
    textSize(25);

    text(
        "Nível médio do som: " + nivelMedio.toFixed(4),
        width / 2,
        530
    );

    text(
        "Nível máximo detetado: " + nivelMaximo.toFixed(4),
        width / 2,
        570
    );

    desenharBotaoCalibracao(
        "Continuar",
        botaoContinuar,
        color(48, 120, 55),
        color(63, 135, 70),
        tamanhoTextoBotao
    );
}


// ==========================================
// ESTADO DE ERRO
// ==========================================

function desenharEstadoErro() {
    fill(180, 45, 35);
    textFont(fonteBold);
    textSize(32);

    text(
        "Não foi possível aceder ao microfone.",
        width / 2,
        480
    );

    fill(90, 55, 50);
    textFont(fonteNormal);
    textSize(22);

    text(
        erroMicrofone || "Verifica as permissões do navegador.",
        width / 2,
        530
    );

    desenharBotaoCalibracao(
        "Tentar novamente",
        botaoCalibrar,
        color(48, 120, 55),
        color(63, 135, 70),
        tamanhoTextoBotao
    );
}


// ==========================================
// BOTÕES
// ==========================================
// rotulo: texto do botão
// b: objeto com x, y, w, h
// corNormal / corHover: cores do botão (sem rato / com rato por cima)
// tamanho: tamanho do texto

function desenharBotaoCalibracao(rotulo, b, corNormal, corHover, tamanho) {
    let sobreBotao =
        mouseX >= b.x &&
        mouseX <= b.x + b.w &&
        mouseY >= b.y &&
        mouseY <= b.y + b.h;

    // Sombra
    noStroke();
    fill(0, 0, 0, 30);

    rect(
        b.x,
        b.y + 6,
        b.w,
        b.h,
        16
    );

    // Fundo do botão
    if (sobreBotao) {
        fill(corHover);
    } else {
        fill(corNormal);
    }

    rect(
        b.x,
        b.y,
        b.w,
        b.h,
        16
    );

    // Texto do botão
    fill(255);
    textFont(fonteBold);
    textSize(tamanho);
    textAlign(CENTER, CENTER);

    text(
        rotulo,
        b.x + b.w / 2,
        b.y + b.h / 2
    );
}


// ==========================================
// MICROFONE
// ==========================================

async function iniciarMicrofoneCalibracao() {
    try {
        estadoCalibracao = "prompt";
        erroMicrofone = "";

        await userStartAudio();

        if (microfone) {
            microfone.stop();
            microfone = null;
        }

        microfone = new p5.AudioIn();

        microfone.start(
            function () {
                estadoCalibracao = "calibrando";

                inicioCalibracao = millis();

                nivelSom = 0;
                nivelMaximo = 0;
                somaNiveis = 0;
                numeroAmostras = 0;
                nivelMedio = 0;
            },
            function (erro) {
                erroMicrofone =
                    "Verifica as permissões de acesso ao microfone.";

                estadoCalibracao = "erro";

                console.error(
                    "Erro ao iniciar o microfone:",
                    erro
                );
            }
        );
    } catch (erro) {
        erroMicrofone =
            "Não foi possível iniciar o áudio.";

        estadoCalibracao = "erro";

        console.error(
            "Erro de áudio:",
            erro
        );
    }
}


// ==========================================
// ATUALIZAR NÍVEL DO MICROFONE
// ==========================================

function atualizarNivelMicrofone() {
    if (
        microfone &&
        estadoCalibracao === "calibrando"
    ) {
        nivelSom = microfone.getLevel();

        if (nivelSom > nivelMaximo) {
            nivelMaximo = nivelSom;
        }

        somaNiveis += nivelSom;
        numeroAmostras++;
    }
}


// ==========================================
// TERMINAR CALIBRAÇÃO
// ==========================================

function terminarCalibracao() {
    if (numeroAmostras > 0) {
        nivelMedio = somaNiveis / numeroAmostras;
    } else {
        nivelMedio = 0;
    }

    estadoCalibracao = "completo";

    if (microfone) {
        microfone.stop();
        microfone = null;
    }
}


// ==========================================
// CLIQUES
// ==========================================

function cliqueCalibracao() {
    // Voltar ao menu
    if (
        mouseX >= botaoVoltar.x &&
        mouseX <= botaoVoltar.x + botaoVoltar.w &&
        mouseY >= botaoVoltar.y &&
        mouseY <= botaoVoltar.y + botaoVoltar.h
    ) {
        if (microfone) {
            microfone.stop();
            microfone = null;
        }

        iniciarCalibracao();        // -- repõe o ecrã para a próxima vez
        estado = "menu";
        return;
    }

    // Botão principal
    if (
        mouseX >= botaoCalibrar.x &&
        mouseX <= botaoCalibrar.x + botaoCalibrar.w &&
        mouseY >= botaoCalibrar.y &&
        mouseY <= botaoCalibrar.y + botaoCalibrar.h
    ) {
        if (
            estadoCalibracao === "inicial" ||
            estadoCalibracao === "erro"
        ) {
            iniciarMicrofoneCalibracao();
            return;
        }

        if (estadoCalibracao === "prompt") {
            iniciarMicrofoneCalibracao();
            return;
        }
    }

    // Botão continuar
    if (
        estadoCalibracao === "completo" &&
        mouseX >= botaoContinuar.x &&
        mouseX <= botaoContinuar.x + botaoContinuar.w &&
        mouseY >= botaoContinuar.y &&
        mouseY <= botaoContinuar.y + botaoContinuar.h
    ) {
        estado = "detalhe";
        return;
    }
}


// ==========================================
// BOTÃO VOLTAR
// ==========================================

function desenharBotaoVoltarCalibracao() {
    desenharBotaoCalibracao(
        "← Voltar",
        botaoVoltar,
        color(85, 100, 80),
        color(100, 115, 95),
        tamanhoTextoVoltar
    );
}