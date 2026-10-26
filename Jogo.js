// ==========================================
// jogo.js - Uma partida do quiz
// ==========================================

// subestado: "pergunta", "feedback", "sopro" ou "fim"
//
// Usa as classes Pergunta, Fogo e Microfone, e as variáveis
// globais perguntasPorJogo, resultadoJogo, estado e nivelMaximo.

class Jogo {
    constructor(dadosPerguntas) {
        // Baralhar as perguntas (Fisher-Yates)
        let todas = dadosPerguntas.map(function (d) {
            return new Pergunta(d);
        });

        for (let i = todas.length - 1; i > 0; i--) {
            let j = Math.floor(random(i + 1));
            let temp = todas[i];
            todas[i] = todas[j];
            todas[j] = temp;
        }

        // Selecionar até cinco perguntas
        this.perguntas = todas.slice(
            0,
            Math.min(perguntasPorJogo, todas.length)
        );

        this.subestado = "pergunta";
        this.indice = 0;
        this.escolhida = -1;
        this.acertou = false;
        this.pontos = 0;
        this.erros = 0;
        this.inicio = millis();
        this.inicioFim = 0;

        this.fogo = new Fogo();
        this.microfone = new Microfone();

        // Nuvens do cenário, com posição e tamanho aleatórios
        this.nuvens = [];

        for (let i = 0; i < 3; i++) {
            this.nuvens.push({
                x: random(cenaX + 120, cenaX + cenaW - 360),
                y: random(cenaY + 20, cenaY + 80),
                tam: random(110, 170)
            });
        }

        this.microfone.iniciar();
    }

    get total() {
        return this.perguntas.length;
    }

    get perguntaAtual() {
        return this.perguntas[this.indice];
    }

    // Chamado em cada frame do ecrã de execução
    atualizar() {
        if (this.subestado !== "sopro") {
            return;
        }

        let nivel = this.microfone.atualizar();
        let resultado = this.fogo.atualizarSopro(nivel);

        if (resultado === "apagado") {
            this.proximaPergunta();
        } else if (resultado === "perdeu") {
            this.terminar(false);
        }
    }

    responder(i) {
        let p = this.perguntaAtual;
        this.escolhida = i;

        if (p.estaCorreta(i)) {
            this.acertou = true;
            this.pontos++;

            if (somCorreto && somCorreto.isLoaded()) {
                somCorreto.play();
            }

            this.subestado = "feedback";
        } else {
            this.acertou = false;
            this.erros++;

            if (somErrado && somErrado.isLoaded()) {
                somErrado.play();
            }

            if (this.fogo.estagio === 0) {
                this.fogo.aproximar();
                this.subestado = "feedback";
            } else {
                this.fogo.acender(nivelMaximo);
                this.subestado = "sopro";
            }
        }
    }

    proximaPergunta() {
        this.indice++;
        this.escolhida = -1;

        if (this.indice >= this.total) {
            this.terminar(true);
        } else {
            this.subestado = "pergunta";
        }
    }

    terminar(vitoria) {
        resultadoJogo = {
            vitoria: vitoria,
            pontos: this.pontos,
            erros: this.erros,
            tempo: (millis() - this.inicio) / 1000,
            total: this.total
        };

        this.parar();

        if (somFimJogo && somFimJogo.isLoaded()) {
            somFimJogo.play();
        }

        if (vitoria) {
            estado = "resultado";
        } else {
            this.subestado = "fim";
            this.inicioFim = millis();
        }
    }

    parar() {
        this.microfone.parar();
    }
}