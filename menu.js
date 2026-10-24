// ==========================================
// MENU - PREVENÇÃO DE INCÊNDIOS FLORESTAIS
// Canvas: 1920 x 1080
// ==========================================

let nuvens = [];
let arvoresMenu = [];
let animacaoCartoes = [];
let inicioAnimacaoCartoes = 0;
let paginaCartoes = 0;
let cartoesPorPagina = 4;

let bannerX = 60;
let bannerY = 245;
let bannerW = 1800;
let bannerH = 250;

let cartoes = [
    {
        titulo: ["Limpeza de matos"],
        texto: [
            "Remove vegetação seca e",
            "folhas acumuladas junto",
            "à casa e aos caminhos."
        ],
        detalhe: [
            "Mantém a vegetação controlada",
            "nos terrenos à volta da casa.",
            "Retira folhas secas e ramos.",
            "Segue as regras de gestão",
            "de combustível aplicáveis."
        ]
    },
    {
        titulo: ["Faixas de gestão", "de combustível"],
        texto: [
            "Reduzem a vegetação que",
            "pode alimentar e espalhar",
            "as chamas."
        ],
        detalhe: [
            "Estas faixas ajudam a reduzir",
            "a continuidade da vegetação.",
            "Facilitam o acesso dos meios",
            "de combate aos incêndios.",
            "Cumpre as regras locais."
        ]
    },
    {
        titulo: ["Cuidados com queimadas"],
        texto: [
            "Nunca queimes sobrantes",
            "sem verificar as regras",
            "e as condições de risco."
        ],
        detalhe: [
            "Verifica se precisas de",
            "autorização ou comunicação.",
            "Nunca deixes o fogo sozinho.",
            "Evita dias quentes e ventosos.",
            "Respeita as proibições em vigor."
        ]
    },
    {
        titulo: ["Cigarros e lixo"],
        texto: [
            "Nunca deites cigarros",
            "para a vegetação ou",
            "para a berma da estrada."
        ],
        detalhe: [
            "Um cigarro mal apagado pode",
            "iniciar um incêndio.",
            "Não abandones garrafas ou lixo.",
            "Apaga completamente qualquer",
            "material que possa arder."
        ]
    },
    {
        titulo: ["Causas dos incêndios"],
        texto: [
            "Podem resultar de ações",
            "humanas, acidentes ou",
            "causas naturais."
        ],
        detalhe: [
            "Muitos incêndios estão ligados",
            "à atividade humana.",
            "Máquinas, faíscas e queimadas",
            "podem provocar ignições.",
            "O calor e o vento favorecem",
            "a propagação do fogo."
        ]
    },
    {
        titulo: ["Dias de risco elevado"],
        texto: [
            "Calor, vento e vegetação",
            "seca aumentam o perigo",
            "de propagação."
        ],
        detalhe: [
            "Consulta os avisos oficiais.",
            "Evita atividades que produzam",
            "faíscas ou chamas.",
            "Segue as restrições em vigor.",
            "Redobra os cuidados no verão."
        ]
    },
    {
        titulo: ["Protege a tua casa"],
        texto: [
            "Mantém os acessos livres",
            "e reduz os materiais",
            "combustíveis no exterior."
        ],
        detalhe: [
            "Limpa folhas de telhados",
            "e caleiras.",
            "Afasta materiais inflamáveis.",
            "Mantém caminhos acessíveis.",
            "Prepara um plano de emergência."
        ]
    },
    {
        titulo: ["Em caso de incêndio"],
        texto: [
            "Afasta-te do perigo,",
            "segue as autoridades",
            "e liga 112."
        ],
        detalhe: [
            "Liga 112 se detetares fogo.",
            "Indica a localização exata.",
            "Afasta-te das chamas e do fumo.",
            "Não tentes combater um fogo",
            "que coloque a tua vida em risco."
        ]
    }
];

let cartaoW = 380;
let cartaoH = 260;
let cartaoY = 520;
let cartaoGap = 20;

let botaoW = 360;
let botaoH = 76;
let botaoX = 780;
let botaoY = 935;

let setaEsq = { x: 25, y: 610, w: 50, h: 65 };
let setaDir = { x: 1845, y: 610, w: 50, h: 65 };

let cartaoSelecionado = -1;


// ==========================================
// POSIÇÃO DOS CARTÕES
// ==========================================

function posicaoCartao(posicao) {
    let larguraTotal =
        cartoesPorPagina * cartaoW +
        (cartoesPorPagina - 1) * cartaoGap;

    let margemEsquerda = (width - larguraTotal) / 2;

    return margemEsquerda +
        posicao * (cartaoW + cartaoGap);
}


// ==========================================
// INICIAR MENU
// ==========================================

function iniciarMenu() {
    inicioAnimacaoCartoes = millis();
    paginaCartoes = 0;

    animacaoCartoes = cartoes.map(() => ({
        entrada: 0,
        hover: 0
    }));

    nuvens = [];

    for (let i = 0; i < 5; i++) {
        nuvens.push({
            x: random(bannerX + 100, bannerX + bannerW - 300),
            y: random(bannerY + 15, bannerY + 60),
            tam: random(100, 170)
        });
    }

    arvoresMenu = [];

    for (
        let x = bannerX + 90;
        x < bannerX + bannerW - 90;
        x += 130
    ) {
        arvoresMenu.push({
            x: x + random(-25, 25),
            tam: random(110, 170)
        });
    }
}


// ==========================================
// DESENHAR MENU
// ==========================================

function desenharMenu() {
    background(255, 247, 220);

    desenharCabecalho();
    desenharBanner();

    let inicio = paginaCartoes * cartoesPorPagina;
    let fim = min(inicio + cartoesPorPagina, cartoes.length);

    for (let i = inicio; i < fim; i++) {
        desenharCartao(i, i - inicio);
    }

    desenharSetas();
    desenharIndicadorPagina();
    desenharTextosFinais();
    desenharBotaoQuiz();
}


// ==========================================
// CABEÇALHO
// ==========================================

function desenharCabecalho() {
    noStroke();
    fill(40, 110, 50);

    textAlign(LEFT);
    textFont(fonteBold);
    textSize(44);

    text(
        "Prevenção de Incêndios Florestais",
        60,
        70
    );

    stroke(40, 110, 50);
    strokeWeight(2);
    line(60, 95, 1860, 95);

    noStroke();
    textSize(40);

    text(
        "Aprende a prevenir incêndios e a proteger pessoas, casas e florestas.",
        60,
        165
    );

    textFont(fonteNormal);
    textSize(30);
}


// ==========================================
// BANNER DA FLORESTA
// ==========================================

function desenharBanner() {
    stroke(40, 110, 50);
strokeWeight(2);
fill(135, 206, 250);

    rect(bannerX, bannerY, bannerW, bannerH);

    noStroke();

    image(
        imgSol,
        bannerX + bannerW - 170,
        bannerY + 15,
        120,
        120
    );

    for (let n of nuvens) {
        image(
            imgNuvem,
            n.x - n.tam / 2,
            n.y,
            n.tam,
            n.tam * 0.53
        );
    }

    fill(120, 190, 90);

    rect(
        bannerX,
        bannerY + bannerH - 50,
        bannerW,
        50
    );

    for (let a of arvoresMenu) {
        let base = bannerY + bannerH - 10;
        let largura = a.tam * 0.77;

        image(
            imgArvore,
            a.x - largura / 2,
            base - a.tam,
            largura,
            a.tam
        );
    }
}


// ==========================================
// CARTÕES ANIMADOS
// ==========================================

function desenharCartao(i, posicao) {
    let x = posicaoCartao(posicao);
    let c = cartoes[i];
    let a = animacaoCartoes[i];

    let atraso = posicao * 180;

    let progresso = constrain(
        (millis() - inicioAnimacaoCartoes - atraso) / 500,
        0,
        1
    );

    let entrada = 1 - pow(1 - progresso, 3);
    a.entrada = entrada;

    let deslocamentoY = 60 * (1 - entrada);

    let centroX = x + cartaoW / 2;
    let centroY =
        cartaoY + cartaoH / 2 +
        deslocamentoY -
        8 * a.hover;

    let escalaAtual = 1 + 0.045 * a.hover;

    let ratoSobre =
        progresso >= 1 &&
        mouseX >= centroX - cartaoW * escalaAtual / 2 &&
        mouseX <= centroX + cartaoW * escalaAtual / 2 &&
        mouseY >= centroY - cartaoH * escalaAtual / 2 &&
        mouseY <= centroY + cartaoH * escalaAtual / 2;

    a.hover = lerp(a.hover, ratoSobre ? 1 : 0, 0.18);

    push();

    translate(
        x + cartaoW / 2,
        cartaoY + cartaoH / 2 +
        deslocamentoY -
        8 * a.hover
    );

    scale(1 + 0.045 * a.hover);

    drawingContext.save();
    drawingContext.shadowColor = "rgba(20,70,25,0.25)";
    drawingContext.shadowBlur = 18 * a.hover;
    drawingContext.shadowOffsetY = 5 * a.hover;

  stroke(40, 110, 50);
strokeWeight(2);

    fill(
        ratoSobre
            ? color(190, 235, 175)
            : color(168, 214, 158)
    );

    rect(
        -cartaoW / 2,
        -cartaoH / 2,
        cartaoW,
        cartaoH
    );

    drawingContext.restore();

    noStroke();
    fill(30, 80, 35);

    textAlign(LEFT);
    textFont(fonteBold);
    textSize(30);

    for (let j = 0; j < c.titulo.length; j++) {
        text(
            c.titulo[j],
            -cartaoW / 2 + 14,
            -cartaoH / 2 + 42 + j * 35
        );
    }

    textFont(fonteNormal);
    textSize(23);

    for (let j = 0; j < c.texto.length; j++) {
        text(
            c.texto[j],
            -cartaoW / 2 + 14,
            -cartaoH / 2 + 125 + j * 32
        );
    }

    fill(35, 100, 45);
    textFont(fonteBold);
    textSize(18);

    text(
        "Mais informação  →",
        -cartaoW / 2 + 14,
        cartaoH / 2 - 18
    );

    pop();
}


// ==========================================
// SETAS DE NAVEGAÇÃO
// ==========================================

function desenharSetas() {
    desenharSeta(setaEsq, "esquerda", paginaCartoes > 0);
    desenharSeta(setaDir, "direita", paginaCartoes < 1);
}

function desenharSeta(s, direcao, ativa) {
    // Desenhar o quadrado
    noStroke();

    fill(
        ativa
            ? color(40, 130, 50)
            : color(180, 190, 175)
    );

    rect(s.x, s.y, s.w, s.h, 12);

    // Centro exato do quadrado
    let centroX = s.x + s.w / 2;
    let centroY = s.y + s.h / 2;

    // Desenhar a seta com linhas
    stroke(255);
    strokeWeight(4);
    strokeCap(ROUND);
    strokeJoin(ROUND);
    noFill();

    let comprimento = 10;
    let altura = 11;

    if (direcao === "esquerda") {
        line(
            centroX + comprimento / 2,
            centroY - altura,
            centroX - comprimento / 2,
            centroY
        );

        line(
            centroX - comprimento / 2,
            centroY,
            centroX + comprimento / 2,
            centroY + altura
        );
    } else {
        line(
            centroX - comprimento / 2,
            centroY - altura,
            centroX + comprimento / 2,
            centroY
        );

        line(
            centroX + comprimento / 2,
            centroY,
            centroX - comprimento / 2,
            centroY + altura
        );
    }

    // Repor o estado gráfico
    strokeCap(ROUND);
    strokeJoin(ROUND);
    strokeWeight(1);
    noStroke();
}

// ==========================================
// INDICADOR DE PÁGINA
// ==========================================

function desenharIndicadorPagina() {
    fill(40, 100, 45);
    textAlign(CENTER);
    textFont(fonteBold);
    textSize(22);

    text(
        "Página " + (paginaCartoes + 1) + " de 2",
        width / 2,
        805
    );

    textAlign(LEFT);
}


// ==========================================
// TEXTO FINAL
// ==========================================

function desenharTextosFinais() {
    fill(30, 90, 40);
    textAlign(CENTER);
    textFont(fonteBold);
    textSize(29);

    text(
        "O teu conhecimento pode ajudar a salvar a floresta!",
        width / 2,
        850
    );

    textFont(fonteNormal);
    textSize(23);

    text(
        "Explora os cartões e testa os teus conhecimentos no quiz.",
        width / 2,
        890
    );

    textAlign(LEFT);
}


// ==========================================
// BOTÃO DO QUIZ
// ==========================================

function ratoSobreBotao() {
    return (
        mouseX > botaoX &&
        mouseX < botaoX + botaoW &&
        mouseY > botaoY &&
        mouseY < botaoY + botaoH
    );
}

function desenharBotaoQuiz() {
    stroke(30, 90, 40);
    strokeWeight(4);

    fill(
        ratoSobreBotao()
            ? color(60, 160, 70)
            : color(40, 130, 50)
    );

    rect(botaoX, botaoY, botaoW, botaoH, 12);

    noStroke();
    fill(255);
    textAlign(CENTER);
    textFont(fonteBold);
    textSize(38);

    text(
        "Ir para o quiz",
        width / 2,
        botaoY + 51
    );

    textAlign(LEFT);
}


// ==========================================
// CLIQUES NO MENU
// ==========================================

function cliqueMenu() {
    if (ratoSobreBotao()) {
        estado = "calibracao";
        return;
    }

    if (
        mouseX >= setaEsq.x &&
        mouseX <= setaEsq.x + setaEsq.w &&
        mouseY >= setaEsq.y &&
        mouseY <= setaEsq.y + setaEsq.h &&
        paginaCartoes > 0
    ) {
        paginaCartoes--;
        reiniciarAnimacaoCartoes();
        return;
    }

    if (
        mouseX >= setaDir.x &&
        mouseX <= setaDir.x + setaDir.w &&
        mouseY >= setaDir.y &&
        mouseY <= setaDir.y + setaDir.h &&
        paginaCartoes < 1
    ) {
        paginaCartoes++;
        reiniciarAnimacaoCartoes();
        return;
    }

    let inicio = paginaCartoes * cartoesPorPagina;

    for (let posicao = 0; posicao < cartoesPorPagina; posicao++) {
        let i = inicio + posicao;

        if (i >= cartoes.length) break;

        let x = posicaoCartao(posicao);

        if (
            mouseX >= x &&
            mouseX <= x + cartaoW &&
            mouseY >= cartaoY &&
            mouseY <= cartaoY + cartaoH
        ) {
            mostrarDetalheCartao(i);
            return;
        }
    }
}


// ==========================================
// REINICIAR ANIMAÇÃO
// ==========================================

function reiniciarAnimacaoCartoes() {
    inicioAnimacaoCartoes = millis();

    animacaoCartoes = cartoes.map(() => ({
        entrada: 0,
        hover: 0
    }));
}


// ==========================================
// ABRIR DETALHES
// ==========================================

function mostrarDetalheCartao(i) {
    cartaoSelecionado = i;
    estado = "detalhe";
}


// ==========================================
// PÁGINA MAIS INFORMAÇÃO
// ==========================================

function desenharDetalhe() {
    background(255, 247, 220);

    if (
        cartaoSelecionado < 0 ||
        cartaoSelecionado >= cartoes.length
    ) {
        estado = "menu";
        return;
    }

    let c = cartoes[cartaoSelecionado];

    // Barra superior
    noStroke();
    fill(40, 110, 50);
    rect(0, 0, width, 16);

    // Título
    textFont(fonteBold);
    textAlign(CENTER, CENTER);
    textSize(44);
    fill(40, 110, 50);

    text(
        c.titulo.join(" "),
        width / 2,
        105
    );

    // Subtítulo
    textFont(fonteNormal);
    textSize(25);
    fill(90, 115, 75);

    text(
        "Pequenas ações fazem uma grande diferença.",
        width / 2,
        165
    );

    // Separador
    stroke(190, 210, 160);
    strokeWeight(3);
    line(300, 205, 1620, 205);
    noStroke();

    // Agrupar as linhas em recomendações completas
    let paragrafos = [];
    let frase = "";

    for (let linha of c.detalhe) {
        frase += (frase === "" ? "" : " ") + linha.trim();

        if (/[.!?]$/.test(linha.trim())) {
            paragrafos.push(frase);
            frase = "";
        }
    }

    if (frase !== "") {
        paragrafos.push(frase);
    }

    // Painel central
    let painelX = 250;
    let painelY = 240;
    let painelW = 1420;
    let painelH = 525;

    drawingContext.save();
    drawingContext.shadowColor = "rgba(30, 70, 30, 0.12)";
    drawingContext.shadowBlur = 20;
    drawingContext.shadowOffsetY = 8;

    fill(255, 253, 243);
    stroke(220, 228, 200);
    strokeWeight(2);

    rect(
        painelX,
        painelY,
        painelW,
        painelH,
        24
    );

    drawingContext.restore();

    // Faixa verde lateral
    noStroke();
    fill(40, 130, 60);

    rect(
        painelX,
        painelY + 25,
        10,
        painelH - 50,
        5
    );

    // Título do painel
    fill(40, 100, 45);
    textFont(fonteBold);
    textAlign(LEFT, CENTER);
    textSize(29);

    text(
        "O que deves saber",
        painelX + 55,
        painelY + 55
    );

    // Calcular o espaço entre recomendações
    let inicioY = painelY + 115;
    let numeroLinhas = paragrafos.length;
    let alturaLinha = numeroLinhas > 5 ? 65 : 60;
    let alturaFaixa = 48;

    let textoX = painelX + 105;

    // Recomendações numeradas
    for (let i = 0; i < numeroLinhas; i++) {
        let centroY = inicioY + i * alturaLinha;

        // Fundo da recomendação
        fill(242, 247, 230);
        noStroke();

        rect(
            painelX + 35,
            centroY - alturaFaixa / 2,
            painelW - 70,
            alturaFaixa,
            12
        );

        // Número centrado
        fill(40, 130, 60);
        circle(
            painelX + 65,
            centroY,
            34
        );

        fill(255);
        textFont(fonteBold);
        textSize(19);
        textAlign(CENTER, CENTER);

        text(
            i + 1,
            painelX + 65,
            centroY
        );

        // TEXTO CORRIGIDO:
        // Usar apenas x e y para centrar verticalmente
        // o texto na mesma altura do centro da faixa.
        fill(45, 75, 40);
        textFont(fonteNormal);
        textSize(25);
        textAlign(LEFT, CENTER);

        text(
            paragrafos[i],
            textoX,
            centroY
        );
    }

    // Botão para voltar
    let voltarX = width / 2 - 220;
    let voltarY = 815;
    let voltarW = 440;
    let voltarH = 65;

    let ratoSobreVoltar =
        mouseX >= voltarX &&
        mouseX <= voltarX + voltarW &&
        mouseY >= voltarY &&
        mouseY <= voltarY + voltarH;

    fill(
        ratoSobreVoltar
            ? color(60, 155, 70)
            : color(40, 120, 50)
    );

    noStroke();

    rect(
        voltarX,
        voltarY,
        voltarW,
        voltarH,
        16
    );

    fill(255);
    textFont(fonteBold);
    textAlign(CENTER, CENTER);
    textSize(25);

    text(
        "←  Voltar à informação",
        width / 2,
        voltarY + voltarH / 2
    );

    textAlign(LEFT, BASELINE);
}


// ==========================================
// CLIQUE NO BOTÃO VOLTAR
// ==========================================

function cliqueDetalhe() {
    let voltarX = width / 2 - 220;
    let voltarY = 815;
    let voltarW = 440;
    let voltarH = 65;

    if (
        mouseX >= voltarX &&
        mouseX <= voltarX + voltarW &&
        mouseY >= voltarY &&
        mouseY <= voltarY + voltarH
    ) {
        estado = "menu";
    }
}