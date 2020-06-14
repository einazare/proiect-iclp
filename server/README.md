# Client

### Comenzi

Pentru a porni server-ul, trebuie rulata comanda:
```
node index.js
```

### Rezolvare

#### index.js

Acesta este un modul care nu export nimic, practic aici se porneste server-ul.
Folosing librarie `net` din cadrul NodeJS-ului, se porneste un server care asteapta sa se contezte clienti la el (socket-uri).
In momentul in care un client se conecteaza, acesta se adauga intr-un array de clienti/socket-uri, caruia is se adauga si un ID unic.
Dupa care, server-ul asteapta mesaje de la acest nou client/socket.
Daca mesajul de la client incepe cu:
- **CREATE_ROOM**
  - Daca mesajul nu este sub forma `CREATE_ROOM room_name min_bet` (iar `room_name` nu exista deja) serverul va trimite o eroare catre client
  - Daca mesajul este formatat corect atunci serverul va crea in obiectul `rooms` o camera noua cu detaliile din mesaj, va adauga acestei noi camere un array pentru toti jucatori conectati la camera respectiva (evident, va fi gol pentru inceput) si un marcator care va spune daca jocul este deja inceput sau nu (pentru cazul in care un jucator se conecteaza la camera in timp ce este deja pornit jocul, jocul sa nu porneasca de doua ori)
- **JOIN_ROOM**
  - Daca mesajul nu este sub forma `JOIN_ROOM room_name` (cu un `room_name` corect) serverul va trimite o eroare catre client
  - Daca mesajul este formatat corect atunci serverul va modifica in obiectul `rooms` si va adauga in array-ul pentru jucatori clientul care a trimis mesajul acesta, in plus, daca numarul de jucatori a ajuns acum sa fie 2 (sau mai mare) si jocul nu este pornit, atunci se cheama functia [startGame](startGame) care va porni un nou joc.
- **LEAVE_ROOM**
  - Daca mesajul nu este sub forma `LEAVE_ROOM room_name` (cu un `room_name` corect) serverul va trimite o eroare catre client
  - Daca mesajul este formatat corect atunci din camera respectiva, clientul care a cerut sa fie scos din camera va fi scos (pe baza id-ul acela unic care se creaza la conectare)
- **BET**
  - Daca mesajul nu este sub forma `LEAVE_ROOM room_name credite` (cu un `room_name` corect si cu un `credite` mai mare sau egal cu `min_bet` pentru camera respectiva) serverul va trimite o eroare catre client
  - Daca mesajul este formatat corect atunci pentru runda curenta si pentru clientul respectiv (pe baza id-ului unic), se va modifica numarul de credite puse in joc
- **Niciuna de mai sus**
  - Serverul nu face nimic


#### startGame

Este o functie care primeste numele unei camere si incepe jocul pentru aceasta.
In primul rand (pentru prima runda) seteaza fiecarui jucator cartile si tipul de castig folosind [setAndSendCards](setAndSendCards).
Apoi, la fiecare 30 de secunde (asta de 3 ori se repeta - 3 runde), apeleaza functia [sendWinLost](sendWinLost), iar daca aceasta a fost ultima runda, reseteaza camera (sterge jucatorii si seteaza marcatorul ca fiind un joc neinceput), in caz contrar apeleaza din nou functia [setAndSendCards](setAndSendCards) pentru setarea fiecarui jucator cartile si tipul de castig.

#### setAndSendCards

Este o functie care primeste numele unei camere, si pentru toti jucatorii din camera respectiva seteaza cartile de joc, tipul de castig (adica altereaza obiectul camerei respective), folosind [get-cards.js](getcardsjs), si de asemenea trimite mesajul `GAME STARTED room_name total_credite cartea1 cartea2 cartea3 cartea4 cartea5 cartea6` catre fiecare jucator in parte.

#### sendWinLost

Este o functie care primeste numele unei camere, calculeaza numarul de credite acumulate de la toti jucatorii, si trimite cate un mesaj fiecarui jucator mesajul `GAME_WON room_name credite_castigate` daca este pentri jucatorii castigatori, sau `GAME_LOST room_name credite_pierdute` daca este printre cei pierzatori.

#### deck.js

Este un modul care exporta cartile de joc in forma unui array:
```
["1R", "2R", "3R", "4R",...,"11V", "12V", "13V"]
```
[Codul aici](./deck.js).

#### get-cards.js

Este un modul care exporta o functie, care primeste un array cu toate cartile de joc (vom vedea mai jos ca aceste carti se trimit amestecate, nu in forma de mai sus de la [deck.js](#deckjs)) si numarul de jucatori - x - si returneaza inapoi un set de x array-uri a cate 6 carti fiecare si pentru fiecare tipul castigului acelor 6 carti (cartea castigatoare si de cate ori apare - se foloseste de [get-win-type.js](#getwintypejs)), si pe langa acest set de array-uri, mai returneaza si numarul castigatorilor (examplu sunt doua seturi care au 2 carti de 10, astfel sunt 2 castigatori, si atunci castigul trebui impartit la 2 jucatori).
Algoritmul de `impartire` al cartilor l-am pastrat destul de simplu, i.e., primele 6 carti merg la primul jucator, urmatoarele 6 carti la urmatorul etc.
[Codul aici](./get-cards.js).

#### get-win-type.js

Este un modul care exporta o functie care primeste ca si input un array, in cazul nostru cu 6 elemente de tipul celor din [deck.js](#deckjs), si verifica daca sunt elemente care se repeta si de cate ori (exemplu, daca cartea 11 se repeta de 3 ori, A, G, R, va returna cartea 11 si numarul 3).
[Codul aici](./get-win-type.js).

#### shuffle.js

Este un modul care exporta o functie care primeste ca si parametru un array, in cazul nostru va primi exact array-ul exportat de [deck.js](#deckjs), si il va re-ordona aleator.
[Codul aici](./shuffle.js).
