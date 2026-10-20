
/* -------------------------------------------------------
   calibracao.js
   Calibração do microfone com p5.js e p5.sound
   Duração: 3 segundos
------------------------------------------------------- */

let microfone;

let estadoCalibracao = "inicial";

let inicioCalibracao = 0;
let duracaoCalibracao = 3000;

let nivelSom = 0;
let somaNiveis = 0;
let amostras = 0;
let ruidoMedio = 0;
let nivelMaximo = 0;
let limiteRuido = 0.04;

let erroMicrofone = "";

let botaoCalibrar = {
    x: 710,
    y: 610,
    w: 500,
    h: 90
};

let botaoVoltar = {
    x: 60,
    y: 115,
    w: 220,
    h: 65
};

let botaoContinuar = {
    x: 760,
    y: 740,
    w: 400,
    h: 75
};


// -------------------------------------------------------
// Desenhar o ecrã
// -------------------------------------------------------

function desenharCalibracao() {
    background(255, 247, 220);

    noStroke();
    fill(40, 110, 50);

    textAlign(CENTER);
    textFont(fonteBold);
    textSize(56);

    text("Calibração do microfone", width / 2, 180);

    textFont(fonteNormal);
    textSize(29);

    text(
        "Vamos preparar o microfone para o jogo!",
        width / 2,
        240
    );

    fill(50, 90, 50);
    textSize(25);

    text(
        "1. Permite o acesso ao microfone.",
        width / 2,
        320
    );

    text(
        "2. Mantém silêncio durante 3 segundos.",
        width / 2,
        365
    );

    text(
        "3. O programa vai medir o ruído ambiente.",
        width / 2,
        410
    );

    // Estado inicial
    if (estadoCalibracao === "inicial") {
        textoCalibracao(
            "Clica no botão para começar.",
            540,
            27
        );

        desenharBotaoCalibracao(
            "Calibrar microfone",
            botaoCalibrar
        );
    }

    // A iniciar o microfone
    else if (estadoCalibracao === "a_pedir") {
        textoCalibracao(
            "A iniciar o microfone...",
            530,
            32
        );
    }

    // Calibração em curso
    else if (estadoCalibracao === "a_calibrar") {
        let tempoDecorrido = millis() - inicioCalibracao;

        let restante = max(
            0,
            ceil((duracaoCalibracao - tempoDecorrido) / 1000)
        );

        // Ler o nível do microfone
        if (microfone && microfone.enabled) {
            nivelSom = microfone.getLevel();

            if (Number.isFinite(nivelSom)) {
                somaNiveis += nivelSom;
                amostras++;

                nivelMaximo = max(nivelMaximo, nivelSom);
            }
        }

        fill(40, 110, 50);
        textFont(fonteBold);
        textSize(38);

        text(
            "A calibrar... " + restante + " s",
            width / 2,
            495
        );

        // Barra de nível
        fill(215, 225, 205);
        rect(510, 535, 900, 40, 12);

        fill(40, 150, 65);
        rect(
            510,
            535,
            900 * constrain(nivelSom * 10, 0, 1),
            40,
            12
        );

        fill(40, 90, 40);
        textFont(fonteNormal);
        textSize(25);

        text(
            "Nível de som: " + nf(nivelSom, 1, 5),
            width / 2,
            620
        );

        text(
            "Nível máximo: " + nf(nivelMaximo, 1, 5),
            width / 2,
            660
        );

        // Diagnóstico na consola, a cada meio segundo
        if (frameCount % 15 === 0) {
            let contexto = getAudioContext();

            console.log(
                "Microfone ativo:", microfone.enabled,
                "| Nível:", nivelSom,
                "| Contexto:", contexto.state
            );
        }

        // Terminar após 3 segundos
        if (tempoDecorrido >= duracaoCalibracao) {
            ruidoMedio = amostras > 0
                ? somaNiveis / amostras
                : 0;

            limiteRuido = ruidoMedio + 0.04;

            if (amostras === 0) {
                erroMicrofone =
                    "Não foi possível recolher amostras de áudio.";

                estadoCalibracao = "erro";
            } else {
                estadoCalibracao = "concluida";
            }

            console.log("Amostras:", amostras);
            console.log("Ruído médio:", ruidoMedio);
            console.log("Nível máximo:", nivelMaximo);
            console.log("Limite:", limiteRuido);
        }
    }

    // Calibração concluída
    else if (estadoCalibracao === "concluida") {
        fill(40, 130, 50);
        textFont(fonteBold);
        textSize(40);

        text(
            "Calibração concluída!",
            width / 2,
            490
        );

        fill(40, 90, 40);
        textFont(fonteNormal);
        textSize(25);

        text(
            "Ruído médio: " + nf(ruidoMedio, 1, 5),
            width / 2,
            545
        );

        text(
            "Nível máximo: " + nf(nivelMaximo, 1, 5),
            width / 2,
            585
        );

        text(
            "Limite de som: " + nf(limiteRuido, 1, 5),
            width / 2,
            625
        );

        desenharBotaoCalibracao(
            "Calibrar novamente",
            botaoCalibrar
        );

        desenharBotaoCalibracao(
            "Continuar",
            botaoContinuar
        );
    }

    // Erro
    else if (estadoCalibracao === "erro") {
        fill(170, 40, 40);
        textFont(fonteBold);
        textSize(30);

        text(
            "Não foi possível calibrar o microfone.",
            width / 2,
            510
        );

        fill(70, 60, 50);
        textFont(fonteNormal);
        textSize(22);

        text(
            erroMicrofone,
            width / 2,
            555
        );

        text(
            "Verifica as permissões e o dispositivo de entrada.",
            width / 2,
            590
        );

        desenharBotaoCalibracao(
            "Tentar novamente",
            botaoCalibrar
        );
    }

    desenharBotaoCalibracao(
        "← Voltar",
        botaoVoltar
    );

    textAlign(LEFT);
}


// -------------------------------------------------------
// Texto centrado
// -------------------------------------------------------

function textoCalibracao(conteudo, y, tamanho) {
    fill(40, 90, 40);
    textAlign(CENTER);
    textFont(fonteNormal);
    textSize(tamanho);

    text(conteudo, width / 2, y);
}


// -------------------------------------------------------
// Botões
// -------------------------------------------------------

function desenharBotaoCalibracao(rotulo, b) {
    let sobre =
        mouseX >= b.x &&
        mouseX <= b.x + b.w &&
        mouseY >= b.y &&
        mouseY <= b.y + b.h;

    stroke(30, 90, 40);
    strokeWeight(3);

    fill(
        sobre
            ? color(60, 160, 70)
            : color(40, 130, 50)
    );

    rect(b.x, b.y, b.w, b.h, 14);

    noStroke();
    fill(255);

    textAlign(CENTER, CENTER);
    textFont(fonteBold);
    textSize(29);

    text(
        rotulo,
        b.x + b.w / 2,
        b.y + b.h / 2
    );

    textAlign(LEFT, BASELINE);
}


// -------------------------------------------------------
// Iniciar calibração
// -------------------------------------------------------

async function iniciarCalibracao() {
    estadoCalibracao = "a_pedir";

    nivelSom = 0;
    somaNiveis = 0;
    amostras = 0;
    ruidoMedio = 0;
    nivelMaximo = 0;
    erroMicrofone = "";

    try {
        // Ativar o contexto de áudio após o clique
        await userStartAudio();

        if (!microfone) {
            microfone = new p5.AudioIn();
        }

        microfone.start(
            function () {
                console.log("Microfone iniciado com sucesso.");

                inicioCalibracao = millis();
                estadoCalibracao = "a_calibrar";
            },
            function (erro) {
                console.error("Erro no microfone:", erro);

                erroMicrofone =
                    "O navegador não conseguiu iniciar o microfone.";

                estadoCalibracao = "erro";
            }
        );
    } catch (erro) {
        console.error("Erro ao iniciar o áudio:", erro);

        erroMicrofone =
            "Erro ao ativar o áudio. Verifica as permissões do navegador.";

        estadoCalibracao = "erro";
    }
}


// -------------------------------------------------------
// Cliques
// -------------------------------------------------------

function cliqueCalibracao() {
    // Voltar ao menu
    if (
        mouseX >= botaoVoltar.x &&
        mouseX <= botaoVoltar.x + botaoVoltar.w &&
        mouseY >= botaoVoltar.y &&
        mouseY <= botaoVoltar.y + botaoVoltar.h
    ) {
        estadoCalibracao = "inicial";
        estado = "menu";
        return;
    }

    // Calibrar novamente ou tentar de novo
    if (
        mouseX >= botaoCalibrar.x &&
        mouseX <= botaoCalibrar.x + botaoCalibrar.w &&
        mouseY >= botaoCalibrar.y &&
        mouseY <= botaoCalibrar.y + botaoCalibrar.h
    ) {
        if (
            estadoCalibracao === "inicial" ||
            estadoCalibracao === "concluida" ||
            estadoCalibracao === "erro"
        ) {
            iniciarCalibracao();
        }

        return;
    }

    // Continuar para o jogo
    if (
        estadoCalibracao === "concluida" &&
        mouseX >= botaoContinuar.x &&
        mouseX <= botaoContinuar.x + botaoContinuar.w &&
        mouseY >= botaoContinuar.y &&
        mouseY <= botaoContinuar.y + botaoContinuar.h
    ) {
        estado = "execucao";
    }
}
