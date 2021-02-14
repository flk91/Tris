//Uso const (costante) per i riferimenti ai controlli utente (caselle, bottoni, ...) perché non cambiano.
//Avrei potuto anche usare var, ma const è più sicuro perché impedisce di riassegnare dati allo stesso nome di variabile.

/** 
 * Casella nome primo giocatore
 * @type {HTMLInputElement} 
 */
const gioc1 = document.getElementById('gioc1');

/** 
 * Casella nome secondo giocatore
 * @type {HTMLInputElement} 
 */
const gioc2 = document.getElementById('gioc2');

/** 
 * Casella dutata partita
 * @type {HTMLInputElement} 
 */
const tempo = document.getElementById('tempo');

/** 
 * Pulsante nuova partita
 * @type {HTMLButtonElement} 
 */
const cmd_nuova_partita = document.getElementById('cmd_nuova_partita');

/** 
 * Pulsante fine partita
 * @type {HTMLButtonElement} 
 */
const cmd_termina_partita = document.getElementById('cmd_termina_partita');

/** 
 * Checkbox partita contro il PC
 * @type {HTMLInputElement} 
 */
const gioca_pc = document.getElementById('gioca_pc');

/** @type {HTMLTableElement} */
const campo = document.getElementById('campo');

/** 
 * Pulsanti delle celle all'interno del campo di gioco
 * @type {Array<HTMLButtonElement>} 
 */
const celle = document.querySelectorAll('#campo button');

/**
 * Conteggio delle celle ancora da giocare.
 * Se scende a zero vuol dire che la partita è finita
 * @type {Number}
 */
var celle_disponibili = null;

/**
 * Determina di chi è il turno. 1 o 2
 * @type {Number}
 */
var turno = 0;

/**
 * Flag partita in corso
 * @type {Boolean}
 */
var giocando = false;

/**
 * Durata della partita corrente in secondi
 * @type {Number}
 */
var durata_gioco = 0;

/**
 * Giocatore vincitore (0=nessuno)
 * @type {Number}
 */
var vince = null;

/**
 * Numero totale di partite giocate
 * @type {Number}
 */
var partite_giocate = 0;

/**
 * Blocca il campo in attesa che il computer giochi la sua mossa
 * @type {Boolean}
 */
var blocca_campo = false;

/**
 * Nomi dei vincitori e numero di partite vinte
 * @type {Object}
 */
var vincitori = {

};

/**
 * Segna la durata in secondi del gioco in corso
 */
function segnatempo() {
    if (giocando) {
        durata_gioco++;
        var ore = Math.floor(durata_gioco / 3600);
        var minuti = Math.floor((durata_gioco % 3600) / 60);
        var secondi = durata_gioco % 60;
        tempo.value = lunghezza_fissa(ore, 2) + ":" + lunghezza_fissa(minuti, 2) + ":" + lunghezza_fissa(secondi, 2);
    }
}

/**
 * Gestisce il clic su una delle caselle
 * @this {HTMLButtonElement}
 * @param {MouseEvent} ev dati dell'evento
 */
function gioca(ev) {
    //se non è in corso una partita, esco dalla funzione
    if (!giocando) {
        return false;
    }
    //idem se il campo è bloccato
    if (blocca_campo) {
        return false;
    }

    this.setAttribute('data-giocatore', turno);
    this.disabled = true;

    celle_disponibili--;
    if (celle_disponibili == 0) {
        vince = 0;
    }
    controlla();

    if (turno == 2) {
        this.innerHTML = "&#x25CB;";
        turno = 1;

    } else {
        this.innerHTML = '&times;'
        turno = 2;
        //se sto giocando contro il pc
        if (gioca_pc.checked == true && celle_disponibili > 0) {
            blocca_campo = true;
            window.setTimeout(function () {
                //sblocco il campo perché è passato il tempo
                blocca_campo = false;
                //devo ritentare finché non trovo una cella giocabile
                var tenta = true;
                while (tenta && celle_disponibili > 0) {
                    //estraggo a sorte l'indice del bottone da giocare
                    var comp = Math.floor(Math.random() * 9);
                    //se il bottone estratto non è ancora stato giocato
                    if (celle[comp].hasAttribute('data-giocatore') == false) {
                        //richiamo il click su di esso
                        //ed esco dal ciclo
                        tenta = false;
                        celle[comp].click();
                    }
                }
            }, 1500);
        }

    }

    mostra_turno();
}

/**
 * Controlla il campo di gioco
 */
function controlla() {
    //per comodità, porto i dati del campo di gioco in una matrice
    var matrice = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ];

    for (let i = 0; i < celle.length; i++) {
        let r = celle[i].getAttribute('data-r');
        let c = celle[i].getAttribute('data-c');
        let gio = celle[i].getAttribute('data-giocatore');
        if (gio != undefined) {
            matrice[r][c] = parseInt(gio);
        } else {
            matrice[r][c] = 0;
        }
    }

    //controllo le righe
    for (let r = 0; r < 3; r++) {
        if (matrice[r][0] > 0 && matrice[r][0] == matrice[r][1] && matrice[r][1] == matrice[r][2]) {
            vince = matrice[r][0];
        }
    }

    //controllo le colonne
    for (let c = 0; c < 3; c++) {
        if (matrice[0][c] > 0 && matrice[0][c] == matrice[1][c] && matrice[1][c] == matrice[2][c]) {
            vince = matrice[0][c];
        }
    }

    //controllo la diagonale principale
    if (matrice[0][0] > 0 && matrice[0][0] == matrice[1][1] && matrice[1][1] == matrice[2][2]) {
        vince = matrice[0][0];
    }

    //controllo la diagonale secondaria
    if (matrice[0][2] > 0 && matrice[0][2] == matrice[1][1] && matrice[1][1] == matrice[2][0]) {
        vince = matrice[0][2];
    }

    if (vince == 1) {
        alert("Vince " + (gioc1.value.length > 0 ? gioc1.value : 'Giocatore 1') + "!");
        gioc1.style.backgroundColor = 'yellowgreen';
        termina_partita();
    } else if (vince == 2) {
        alert("Vince " + (gioc2.value.length > 0 ? gioc2.value : 'Giocatore 2') + "!");
        gioc2.style.backgroundColor = 'yellowgreen';
        termina_partita();
    } else if (vince == 0) {
        alert("Pareggio!");
        termina_partita();
    }


}

/**
 * Trasforma una stringa di lunghezza variabile in una stringa di lunghezza fissa
 * @param {any} valore valore da rendere di lunghezza fissa
 * @param {Number} lunghezza lunghezza desiderata
 * @param {String} riempimento carattere di riempimento
 */
function lunghezza_fissa(valore, lunghezza, riempimento = '0') {
    //inizializzo variabile s e converto valore in stringa
    var s = "" + valore;
    //finché la lunghezza del valore è inferiore alla lunghezza desiderata
    while (s.length < lunghezza) {
        //aggiungo all'inizio il carattere di riempimento
        s = riempimento + s;
    }
    return s;
}

/**
 * Avvia una nuova partita
 * @param {MouseEvent} ev
 */
function nuova_partita(ev) {
    durata_gioco = 0;
    giocando = true;
    celle_disponibili = 9;
    vince = null;
    segnatempo();

    if (!gioca_pc.checked) {
        //estraggo a sorte il turno di chi gioca
        turno = Math.floor(Math.random() * 2) + 1;
    } else {
        turno = 1;
    }

    mostra_turno();

    //ciclando su ogni bottone del campo di gioco
    for (var i = 0; i < celle.length; i++) {
        //abilito il bottone
        celle[i].disabled = false;
        // annullo l'attributo del giocatore
        celle[i].removeAttribute('data-giocatore');
        //rimuovo il testo dalla casella
        celle[i].innerText = '';
    }

    //disabilito le caselle del giocatore
    gioc1.disabled = true;
    gioc2.disabled = true;
    gioca_pc.disabled = true;

    //nascondo il pulsante di nuova partita
    //mostro il pulsante di fine partita
    cmd_termina_partita.hidden = false;
    cmd_nuova_partita.hidden = true;
}

/**
 * Evidenzia la casella del giocatore a cui spetta il turno
 */
function mostra_turno() {
    if (!giocando) {
        return;
    }
    if (turno == 1) {
        gioc1.style.backgroundColor = 'yellow';
        gioc2.style.backgroundColor = 'white';
    } else if (turno==2) {
        gioc1.style.backgroundColor = 'white';
        gioc2.style.backgroundColor = 'yellow';
    }
}

/**
 * Termina la partita in corso
 */
function termina_partita() {
    giocando = false;
    //disabilito tutti i bottoni
    for (var i = 0; i < celle.length; i++) {
        celle[i].disabled = true;
    }
    //abilito le caselle del giocatore
    gioc1.disabled = false;
    gioc2.disabled = false;
    gioca_pc.disabled = false;

    //nascondo il pulsante di fine partita
    //mostro il pulsante di nuova partita
    cmd_termina_partita.hidden = true;
    cmd_nuova_partita.hidden = false;
}

/**
 * Gestisce la modifica del valore della checkbox per giocare contro il PC
 * @this {HTMLInputElement}
 */
function gioca_pc_onchange() {
    if (this.checked == true) {
        gioc2.value = "Computer";
        gioc2.disabled = true;
    } else {
        gioc2.value = "";
        gioc2.disabled = false;
    }

}

/*
richiamo la funzione segnatempo ogni 1000 millisecondi.
window.setInterval(...) restituisce come risultato un numero chiamato handle (lett. "maniglia").
Tale numero può essere passato alla funzione window.clearInterval(handle) per annullare l'esecuzione programmata.
*/
var intervallo_segnatempo = window.setInterval(segnatempo, 1000);

//Assegno gli event listener ai controlli
cmd_nuova_partita.addEventListener('click', nuova_partita);
cmd_termina_partita.addEventListener('click', termina_partita);
gioca_pc.addEventListener('change', gioca_pc_onchange);

//assegno la funzione gioca all'evento clic sui bottoni del campo
for (var i = 0; i < celle.length; i++) {
    celle[i].addEventListener('click', gioca);
}





