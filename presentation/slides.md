---
title: 'Reveal the Pain'
subtitle: Web Programming Lab
author: Patrick Bucher
---

# Projektidee

- Möglichen Ursachen für ein Beschwerden auf die Spur kommen.
- «Wie korrelieren meine Beschwerden mit meinen Verhaltensweisen?»
- Journal: Beschwerden und Verhaltensweisen als Tag erfassen.
- Bericht: Korrelationen für einen bestimmten Tag automatisch berechnen.
- Correlation $\neq$ Causation: Anstoss zur Ursachenforschung.

# Journal

- **Montag**: Ausschlafen, Gewichtheben, Büroarbeit, Gartenarbeit, Rückenschmerzen
- **Dienstag**: Büroarbeit, Alkoholkonsum, Einkaufen, Rückenschmerzen
- **Mittwoch**: Büroarbeit, Müdigkeit, Einkaufen, Rückenschmerzen
- **Donnerstag**: Ausschlafen, Gartenarbeit, Alkoholkonsum, Rückenschmerzen
- **Freitag**: Büroarbeit, Müdigkeit, Einkaufen
- **Samstag**: Ausschlafen, Spaziergang, Putzen, Gartenarbeit, Rückenschmerzen
- **Sonntag**: Ausschlafen, Alkoholkonsum, Spaziergang, Velotour

# Korrelation

Beispiel: Korrelation aus Rückenschmerzen und Büroarbeit

|                       | keine Büroarbeit    | Büroarbeit              |
|-----------------------|---------------------|-------------------------|
| keine Rückenschmerzen | $n_{00}=1$ (So)     | $n_{01}=1$ (Fr)         |
| Rückenschmerzen       | $n_{10}=2$ (Do, Sa) | $n_{11}=3$ (Mo, Di, Mi) |

# Phi-Koeffizient

$$ \phi = \frac{n_{11}n_{00} - n_{10}n_{01}}{\sqrt{(n_{10}+n_{11})(n_{00}+n_{01})(n_{01}+n_{11})(n_{00}+n_{10})}} $$

$$ -1 \leq \phi \leq 1 $$

# Live-Demo

[http://localhost:8080](http://localhost:8080)

# Architektur

- Frontend: Single Page Application
	- Vanilla JS
- Backend: RESTful API
	- Node.js
	- Express
	- JWT, Bcrypt
- Datenhaltung: Key-Value Store
	- Redis

# Datenstruktur: Redis Set

- Key: `[Benutzername]:[Datum]`
- Value: `[Tag1, Tag2, Tag3, ..., TagN]`

Beispiel:

- `toni:2019-10-04 = [Work, Walk, TV, Insomnia]`
