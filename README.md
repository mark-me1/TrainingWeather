# TrainingWeather 🚴🏃‍♂️

**TrainingWeather** ist ein spezialisiertes, hochpräzises 24-Stunden-Wetter-Dashboard, das speziell für die Planung von Outdoor-Trainingseinheiten (wie Triathlon, Radfahren und Laufen) optimiert wurde. Es liefert exakte Vorhersagen auf Stundenbasis, um das optimale Zeitfenster für das nächste Training zu finden.

## 🛠️ Tech Stack & Hosting

- **Frontend:** Entwickelt mit **React** und **Vite** für maximale Performance und schnelle Ladezeiten.
- **Hosting & CI/CD:** Gehostet auf **GitHub Pages**. Die Bereitstellung erfolgt vollautomatisch über eine **GitHub Actions** CI/CD-Pipeline bei jedem Push in den Main-Branch.

## 📡 Datenquelle

- **Wetterdaten:** Nutzt die kostenlose und leistungsstarke **Open-Meteo API**.
- **Wettermodell:** Setzt spezifisch auf das hochauflösende **"ICON-D2"** Modell des Deutschen Wetterdienstes (DWD), um extrem präzise, lokale Vorhersagen für Mitteleuropa zu gewährleisten.
- **Geocoding:** Verwendet die Open-Meteo Geocoding API für die nahtlose und schnelle Ortssuche.

## ✨ Kernfunktionen

- **24-Stunden-Vorhersage:** Detaillierte Anzeige von Temperatur, Niederschlag, Windgeschwindigkeit und Windrichtung (inklusive dynamisch rotierender Windpfeile).
- **Smarte Ortssuche:** Integrierte Suchfunktion für beliebige Städte. Standardmäßig ist die App auf **Bad Zwischenahn** vorkonfiguriert.
- **Trainingsbedingungen (Farbliche Hervorhebung):** 
  - *Optimal* (Grün): Kein Niederschlag und Wind unter 20 km/h.
  - *Warnung* (Rot): Niederschlag über 1 mm oder Wind über 40 km/h.
- **Responsives UI-Design:**
  - *Desktop:* Kompakte, dichte Grid-Ansicht (36 Stunden auf einem Bildschirm ohne horizontales Scrollen).
  - *Mobile:* Touch-optimierte, vertikal scrollbare Listenansicht für perfekte Lesbarkeit im Freien.
- **Tagesgrenzen:** Automatische Gruppierung der Vorhersagedaten nach Datum mit visuellen Trennlinien (z. B. "Heute", "Morgen") beim Überschreiten von Mitternacht.
- **Datentransparenz (Custom Heuristic):** Ein spezieller, deterministischer Algorithmus berechnet clientseitig den exakten Initialisierungszeitpunkt des DWD ICON-D2 Modells sowie die erwartete Zeit für das nächste Update. Diese Daten werden transparent im Footer angezeigt, ohne dass fehleranfällige Metadaten-APIs aufgerufen werden müssen.

---

*Entwickelt für Athleten, die ihr Training nicht dem Zufall überlassen wollen.*
