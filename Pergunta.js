// ==========================================
// pergunta.js - Uma pergunta do quiz
// ==========================================

// Guarda os dados de uma pergunta do perguntas.json.

class Pergunta {
    constructor(dados) {
        this.enunciado = dados.pergunta;
        this.opcoes = dados.opcoes;
        this.correta = dados.correta;     // índice da opção certa
        this.explicacao = dados.explicacao;
    }

    estaCorreta(indice) {
        return indice === this.correta;
    }
}