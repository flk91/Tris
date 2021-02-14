# Tris (tic tac toe)

Questa web-app è stata sviluppata nell'ambito di un corso di informatica per ragionieri programmatori allo scopo di sperimentare le funzionalità del linguaggio JavaScript e lo sviluppo di app.

Il codice è commentato al fine di illustrare gli algoritmi applicati e le scelte metodologiche.

## Struttura

* 📂 **/artwork** file grafici originali
* 📂 **/icons** file di icone dell'applicazione
* 📱 **/manifest.json** file di manifesto che permette l'installazione del sito come applicazione sui dispositivi mobili e su alcuni browser.
* 📄 **/index.html** home page
* 📖 **/readme.md** questo file
* 💄 **/style.css** foglio di stile specifico
* 🐱‍💻 **/tris.js** file di codice JavaScript per il gioco

## Gioco contro il PC

La funzionalità di gioco contro il computer non implementa alcun algoritmo per la scelta efficiente della casella giocata, che pertanto sarà casuale.
Un modo per implementare il gioco "intelligente" da parte della macchina è l'uso dell'algoritmo minimax, che tuttavia non affrontiamo nel nostro corso. (Per info: https://www.okpedia.it/algoritmo_minimax).