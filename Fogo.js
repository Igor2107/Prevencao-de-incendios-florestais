// ==========================================
// fogo.js - Estágio do fogo e desafio de sopro
// ==========================================

// estagio: 0 = floresta segura, 1 = fogo a aproximar-se,
//          2 = fogo ativo (desafio de sopro), 3 = floresta queimada
//
// Usa as configurações tempoLimiteSopro, duracaoSopro e
// dificuldadePorFogo, definidas em execucao.js.

class Fogo {
    constructor() {
        this.estagio = 0;
        this.fogosAcesos = 0;
        this.soproAtivo = false;
        this.progresso = 0;       // 0 a 1: quanto do fogo já foi apagado
        this.limiarMax = 0.1;     // histerese: liga acima deste valor
        this.limiarMin = 0.06;    // histerese: desliga abaixo deste valor
        this.inicioSopro = 0;
        this.saudeVisivel = 100;  // valor suavizado da barra da floresta
    }

    aproximar() {
        this.estagio = 1;
    }

    // Acende o fogo e prepara o desafio de sopro.
    // ruidoCalibrado = nível máximo medido na calibração.
    acender(ruidoCalibrado) {
        this.estagio = 2;
        this.fogosAcesos++;

        let base = ruidoCalibrado * 3;

        if (base < 0.05) {
            base = 0.05;
        }

        let multiplicador =
            1 + dificuldadePorFogo * (this.fogosAcesos - 1);

        this.limiarMax = base * multiplicador;
        this.limiarMin = this.limiarMax * 0.6;

        this.soproAtivo = false;
        this.progresso = 0;
        this.inicioSopro = millis();
    }

    // Atualiza o sopro com histerese. Devolve:
    // "apagado", "perdeu" ou "a-decorrer".
    atualizarSopro(nivel) {
        if (!this.soproAtivo && nivel > this.limiarMax) {
            this.soproAtivo = true;
        }

        if (this.soproAtivo && nivel < this.limiarMin) {
            this.soproAtivo = false;
        }

        if (this.soproAtivo) {
            this.progresso += 1 / (30 * duracaoSopro);
        } else {
            this.progresso -= 0.01;
        }

        if (this.progresso < 0) {
            this.progresso = 0;
        }

        if (this.progresso > 1) {
            this.progresso = 1;
        }

        if (this.progresso >= 1) {
            this.estagio = 1;
            this.soproAtivo = false;
            return "apagado";
        }

        if (millis() - this.inicioSopro > tempoLimiteSopro) {
            this.estagio = 3;
            return "perdeu";
        }

        return "a-decorrer";
    }
}