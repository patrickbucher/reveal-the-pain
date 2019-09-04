---
title: 'Projektidee: «Reveal the Pain»'
author: 'Patrick Bucher'
subtitle: 'Web Programming Lab'
---

Ein körperliches Leiden, z.B. Kopfschmerzen, kann viele Ursachen haben.
Mithilfe von Self-Tracking einer Vielzahl möglicher Einflussgrössen können die
Rohdaten zur Ursachenforschung erhoben werden. Mithilfe eines Phi-Koeffizienten
kann anhand dieser Rohdaten die Korrelation zwischen Einflussgrössen und
Krankheitssymptom berechnet werden. Damit können für ein Krankheitssymptom
möglicherweise förderliche Einflüsse sondiert werden.

Die «Reveal the Pain»-Web-Applikation hilft einerseits beim täglichen
Self-Tracking und führt andererseits die Berechnung der
Korrelationskoeffizienten automatisch durch. Um etwa den Ursachen für
Kopfschmerzen auf den Grund zu gehen könnten folgende Einflussgrössen getrackt
werden: Alkoholkonsum, Bewegung, Stress, Wetterumschwung, Koffein, Rauchen,
Lärm, usw.

Die Idee für diese Anwendung stammt aus dem Buch «Eloquent JavaScript», wo die
Phi-Korrelation zwischen Pizzakonsum und der nächtlichen Verwandlung in ein
Eichhörnchen untersucht wird (Marjin Haverbeke: _Eloquent JavaScript. A Modern
Introduction to Programming. Third Edition._ Kapitel 4, Seite 66: _The
Lycanothrope's Log_).

# Umsetzung und Technologien

Die Applikation wird von mir als Einzelarbeit umgesetzt.

- **Frontend**: Self-Tracking (tägliches Erfassen verschiedener Tags),
  Auswertung (Korrelation zwischen Ziel-Tag mit jeweils anderen Tags berechnen
  und auflisten)
    - Vanilla JS, Web Components, Jest, npm 
- **Backend**: RESTful API zum Abspeichern der Datums-Tag-Kombinationen und
  Berechnung der Phi-Koeffizienten
    - Go oder Node.js (noch offen)
- **Datenhaltung**: Redundante Speicherung der Tags pro Datum und Daten pro
  Tag
    - Redis Key-Value Store
- **Deployment**: Die Applikation soll lokal für einen Benutzer lauffähig sein
  und beinhaltet keinen Mechanismus zur Authentifizierung.
    - Docker, Docker Compose
