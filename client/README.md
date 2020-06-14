# Client

### Comenzi

Pentru a porni clientul, trebuie rulata comanda:
```
javac *.java && java Client localhost 3000
```
Comanda de mai sus se poate sparge in doua sub comenzi:
- compilare: `javac *.java`
- pornire client: `java Client localhost 3000`

### Rezolvare

Pentru rezolvare am folosit 3 clase de java, una care este reprezentata de Client si inca doua sub-clase care sunt instatiate de catre clasa Client pentru citirea/primirea mesajelor de la server si scrierea/trimiterea de mesaje catre server dupa cum urmeaza:

#### Client.java

Clasa Client primeste doua argumente din consola la pornire, primul reprezentand adresa IP unde se afla server-ul, si al doilea argument reprezentand portul acestuia.
Dupa care, clasa aceasta incearca sa deschida un socket catre server, si daca reuseste, atunci porneste un thread pentru citirea/primirea mesajelor de la server (instantiaza o noua clasa de tipul ReadThread), trimitand acestuia instanta curenta a clasei Client alaturi de socket-ul nou pornit, si un thread pentru scrierea/trimiterea de mesaje catre server (instantiaza o noua clasa de tipul WriteThread), trimitand acestuia instanta curenta a clasei Client alaturi de socket-ul nou pornit,

#### ReadThread.java

Clasa ReadThread primeste doua argumente, un Socket si un Client, si incearca sa deschida un nou stream pentru input (stream-ul prin care va primi mesajele de la server).
Dupa care, intr-un `while` (instantiat practic de apelul functiei `run` datorita faptului ca se creeaza un nou thread) va citit fiecare mesaj de la server (un mesaj se termina cu `\n`).

#### WriteThread.java

Clasa WriteThread primeste doua argumente, un Socket si un Client, si incearca sa deschida un nou stream pentru output (stream-ul prin care va trimite mesajele catre server).
Dupa care, intr-un `do while` (instantiat practic de apelul functiei `run` datorita faptului ca se creeaza un nou thread) va citit fiecare mesaj din consola utilizatorului/clientului si va trimite acest mesaj catre server.
