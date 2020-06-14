# Proiect ICLP

### Rezolvare

- Client:
  - [Detalii aici](./client/README.md).
  - [Codul aici](./client)
- Server:
  - [Detalii aici](./server/README.md).
  - [Codul aici](./server)

### Cerinta

Joc de carti simplificat - EASYPOKER.

Un server care mentine diferite camere in care jucatorii joaca EASYPOKER:

- Un joc cu `52` de carti
  - Orice carte are un numar (de la `1` la `13`) si o culoare (`Rosu`, `Galben`, `Albastru`, `Verde`)
- Fiecare jucator trage 6 carti
- Castiga cea mai mare combinatie de `4` carti cu acelasi numar. Daca nu exista niciun jucator cu `4` carti cu acelasi numar, atunci castiga cea mai mare combinatie de `3` carti cu acelasi numar. Daca iarasi nu exista, atunci castiga cea mai mare pereche (`2` carti cu acelasi numar), si daca nici asa nu exista niciun jucator atunci nu castiga nimeni.
- Intr-o joc pot fi maxim $6$ oameni.
- Jocul e o repetitie de $3$ runde
  1. Se impart cartile aleator, fiecare jucator va vedea doar cartile lui deocamdata
  2. Fiecare jucator pariaza un numar de credite, independent de toti ceilalti jucatori. Toti pariaza deodata, nu exista o ordine anume.
  3. Toti jucatorii isi arata cartile, si castigatorul (sau castigatorii daca sunt mai multi) isi impart creditele puse in joc pana acum intre ei.
- Daca nu castiga nimeni o runda, creditele se acumuleaza pana la urmatoarea serie de $3$ runde.

Va trebui sa implementati un server care poate mentine mai multe "camere" de joc, si un client capabil sa joace in mai multe camere deodata.

Serverul si clientul comunica prin urmatoarele mesaje:

Client -&gt; Server:

- `CREATE_ROOM room_name min_bet`
  - Raspunsul e fie
    - `OK`
    - `ERROR motiv`.
- `JOIN_ROOM room_name`
  - Raspunsul e fie
    - `OK`
    - `ERROR motiv`
- `LEAVE_ROOM room_name`
  - Raspunsul e fie
    - `OK`
    - `ERROR motiv`
- `BET room_name credite`
  - Raspunsul e fie
    - `OK`
    - `ERROR motiv`

Server -&gt; Client:

- `GAME STARTED room_name total_credite cartea1 cartea2 cartea3 cartea4 cartea5 cartea6`      
  - `carte1/2/3/4/5/6` sunt in formatul `numarINITIALA`, de exemplu `13G` pentru cartea cu numarul 13 si culoarea Galbena       
  - Nu asteapta un raspuns din partea clientului
- `GAME_WON room_name credite_castigate`
- `GAME_LOST room_name credite_pierdute`

Fiecare camera create folosind `CREATE_ROOM` are asociat un numar minim the credite ce pot fi pariate in runda `2` a jocului.

Imediat ce sunt cel putin 2 jucatori intr-o camera, serverul va genera cartile corespunzatoare fiecarui jucator si va trimite fiecarui jucator informatii despre joc
folosind mesajul `GAME STARTED ...`. Fiecare joc va dura 30 de secunde, sau pana cand toti participantii au trimis mesajul `BET ...` pentru aceasta camera.
Daca un jucator nu trimite un mesaj `BET` valid pana la terminarea celor 30 de secunde, se presupune ca trimite numarul minim de credit (parametrul `min_bet` folosit la creeea camerei).

Imediat ce se termina runda de pariuri, serverul va trimite fiecarui jucator rezultatul jocului.
