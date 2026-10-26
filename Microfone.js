// ==========================================
// microfone.js - Microfone usado durante o jogo
// ==========================================

// Envolve o p5.AudioIn para o desafio de sopro.

class Microfone {
    constructor() {
        this.entrada = null;
        this.nivel = 0;
    }

    iniciar() {
        this.parar();
        this.entrada = new p5.AudioIn();
        this.entrada.start();
    }

    // Lê o nível atual do microfone (0 a 1) e guarda-o em this.nivel
    atualizar() {
        this.nivel = this.entrada ? this.entrada.getLevel() : 0;
        return this.nivel;
    }

    parar() {
        if (this.entrada) {
            this.entrada.stop();
            this.entrada = null;
        }
    }
}