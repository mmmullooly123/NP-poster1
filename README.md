# Peptide-Mediated Reversible Nanoparticle Aggregation

An interactive web poster presenting computational and experimental research on how cationic dipeptides control gold nanoparticle (AuNP) aggregation — with applications in colorimetric biosensing.

**Live site:** https://mmmullooly123.github.io/NP-poster1/

---

## About

This project explores how cationic dipeptides (RR, RH, RK, HH, HK, HR, KK, KH, KR) modulate the reversible aggregation of gold nanoparticles, combining molecular dynamics simulation with experimental results. The poster was built as an interactive single-page web app for presentation at the ACS Spring Meeting 2025 in San Diego.

**Research by:** Margaret Mullooly, Robert Ramji, William Brown, Benjamin Lam, Jesse Jokerst, Tod Pascal, Kristina Closser

---

## Features

- **3D molecular viewer** — Rotate and inspect each dipeptide structure via NGL Viewer
- **Interactive aggregation demo** — Drag a concentration slider to watch nanoparticles cluster in real time
- **Lab bench** — Save and compare test tube states across different peptides
- **Simulation vs. experiment chart** — Side-by-side comparison of MD binding energies and experimental C₅₀ values
- **Workflow carousel** — Step-by-step breakdown of the MD system construction process
- **Molecular dynamics videos** — Live simulation footage for RR (aggregating) and GG (non-aggregating) peptides

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| HTML5 / CSS3 | Structure and styling |
| [TailwindCSS](https://tailwindcss.com/) | Utility-first layout |
| [Chart.js](https://www.chartjs.org/) | Simulation vs. experiment bar chart |
| [NGL Viewer](https://nglviewer.org/) | Interactive 3D molecular structures |
| [AOS](https://michaeloryl.github.io/animate.css/) | Scroll-triggered animations |
| [GLightbox](https://biati-digital.github.io/glightbox/) | Zoomable poster image |

---

## Project Structure

```
├── index.html      # Page structure and content
├── styles.css      # All custom CSS and animations
├── script.js       # All JavaScript (charts, carousel, demo, canvas)
└── assets/
    ├── *.mol2      # Dipeptide molecular structure files
    ├── *.png       # Figures and poster image
    └── *.mp4       # Simulation trajectory videos
```

---

## Running Locally

No build step required. Serve the directory with any static file server:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

> Note: the NGL Viewer requires files to be served over HTTP — opening `index.html` directly, as a `file://` URL will not load the molecular structures.
