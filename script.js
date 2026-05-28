// Helper for brief drop effect in test tube
function triggerDrop(type) {
  const parent = document.getElementById('testTube');
  const drop = document.createElement('div');
  drop.className = 'drop' + (type === 'peg' ? ' peg' : '');
  drop.style.left = `${Math.random() * 60 + 10}px`;
  parent.appendChild(drop);
  setTimeout(() => drop.remove(), 1000);
}

// --- Chart data ---
const peptideLabels = ['RR', 'RH', 'RK', 'HH', 'HK', 'HR', 'KK', 'KH', 'KR'];
const c50Values = [0.34, 0.95, 0.19, 0.97, 0.14, 0.14, 0.16, 0.98, 0.16];
const inverseBinding = [0.0023, 0.0037, 0.0023, 0.0066, 0.0014, 0.0030, 0.0026, 0.0035, 0.0020];

const groupColors = [
  'rgba(239, 68, 68, 0.7)',
  'rgba(239, 68, 68, 0.7)',
  'rgba(239, 68, 68, 0.7)',
  'rgba(59, 130, 246, 0.7)',
  'rgba(59, 130, 246, 0.7)',
  'rgba(59, 130, 246, 0.7)',
  'rgba(34, 197, 94, 0.7)',
  'rgba(34, 197, 94, 0.7)',
  'rgba(34, 197, 94, 0.7)',
];
const groupColorsLight = [
  'rgba(239, 68, 68, 0.3)',
  'rgba(239, 68, 68, 0.3)',
  'rgba(239, 68, 68, 0.3)',
  'rgba(59, 130, 246, 0.3)',
  'rgba(59, 130, 246, 0.3)',
  'rgba(59, 130, 246, 0.3)',
  'rgba(34, 197, 94, 0.3)',
  'rgba(34, 197, 94, 0.3)',
  'rgba(34, 197, 94, 0.3)',
];

function getStripePattern(ctx) {
  const patternCanvas = document.createElement('canvas');
  patternCanvas.width = 10;
  patternCanvas.height = 10;
  const pctx = patternCanvas.getContext('2d');
  pctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
  pctx.lineWidth = 2;
  pctx.beginPath();
  pctx.moveTo(0, 10);
  pctx.lineTo(10, 0);
  pctx.stroke();
  return ctx.createPattern(patternCanvas, 'repeat');
}

// Full chart (desktop)
const comparisonCtx = document.getElementById('comparisonChart').getContext('2d');
const stripePattern = getStripePattern(comparisonCtx);
const comparisonChartInstance = new Chart(comparisonCtx, {
  type: 'bar',
  data: {
    labels: peptideLabels,
    datasets: [
      {
        label: 'Experimental C₅₀ (µM)',
        data: c50Values,
        backgroundColor: groupColors,
        yAxisID: 'y',
      },
      {
        label: 'Inverse Binding Energy (kcal/mol)⁻¹',
        data: inverseBinding,
        backgroundColor: groupColorsLight,
        borderColor: 'rgba(100, 100, 100, 0.9)',
        borderWidth: 1,
        borderDash: [4, 2],
        yAxisID: 'y1',
      }
    ]
  },
  options: {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: 'Comparison of Aggregation Sensitivity and Binding Energy'
      }
    },
    scales: {
      y: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'C₅₀ (µM)'
        },
        grid: {
          drawOnChartArea: false
        }
      },
      y1: {
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: 'Inverse Binding Energy'
        },
        grid: {
          drawOnChartArea: false
        }
      }
    }
  }
});

function makeGroupChart(ctx, groupIdxs, groupLabel, groupColors, groupColorsLight) {
  const pattern = getStripePattern(ctx);
  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: groupIdxs.map(i => peptideLabels[i]),
      datasets: [
        {
          label: 'Experimental C₅₀ (µM)',
          data: groupIdxs.map(i => c50Values[i]),
          backgroundColor: groupColors,
          yAxisID: 'y',
        },
        {
          label: 'Inverse Binding Energy (kcal/mol)⁻¹',
          data: groupIdxs.map(i => inverseBinding[i]),
          backgroundColor: groupColorsLight,
          borderColor: 'rgba(100, 100, 100, 0.9)',
          borderWidth: 1,
          borderDash: [4, 2],
          yAxisID: 'y1',
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      stacked: false,
      plugins: {
        title: {
          display: true,
          text: groupLabel
        }
      },
      scales: {
        y: {
          type: 'linear',
          position: 'left',
          title: {
            display: true,
            text: 'C₅₀ (µM)',
            font: { size: 12 },
            padding: { top: 10, bottom: 10, left: 12, right: 0 }
          },
          ticks: {
            font: { size: 10 }
          },
          grid: {
            drawOnChartArea: false
          }
        },
        y1: {
          type: 'linear',
          position: 'right',
          title: {
            display: true,
            text: 'Inverse Binding Energy',
            font: { size: 12 },
            padding: { top: 10, bottom: 10, left: 0, right: 12 }
          },
          min: 0,
          max: 0.007,
          ticks: {
            font: { size: 10 }
          },
          grid: {
            drawOnChartArea: false
          }
        }
      }
    }
  });
}

window.addEventListener('DOMContentLoaded', function() {
  const ctx1 = document.getElementById('comparisonChartGroup1').getContext('2d');
  const mobileChart1 = makeGroupChart(
    ctx1,
    [0, 1, 2],
    'RR, RH, RK: Aggregation and Binding',
    groupColors.slice(0, 3),
    groupColorsLight.slice(0, 3)
  );
  const ctx2 = document.getElementById('comparisonChartGroup2').getContext('2d');
  const mobileChart2 = makeGroupChart(
    ctx2,
    [3, 4, 5],
    'HH, HK, HR: Aggregation and Binding',
    groupColors.slice(3, 6),
    groupColorsLight.slice(3, 6)
  );
  const ctx3 = document.getElementById('comparisonChartGroup3').getContext('2d');
  const mobileChart3 = makeGroupChart(
    ctx3,
    [6, 7, 8],
    'KK, KH, KR: Aggregation and Binding',
    groupColors.slice(6, 9),
    groupColorsLight.slice(6, 9)
  );
  const mobileChartRefs = { 1: mobileChart1, 2: mobileChart2, 3: mobileChart3 };

  function showChartGroup(groupNum) {
    for (let i = 1; i <= 3; ++i) {
      const el = document.getElementById('chart-group-' + i);
      if (el) {
        if (i === groupNum) {
          el.classList.add('active');
          // Resize after the browser repaints so Chart.js can measure the now-visible container
          requestAnimationFrame(() => mobileChartRefs[i].resize());
        } else {
          el.classList.remove('active');
        }
      }
    }
  }
  showChartGroup(1);
  document.querySelectorAll('.group-toggle-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const group = parseInt(btn.getAttribute('data-group'), 10);
      showChartGroup(group);
    });
  });

  let touchStartX = 0;
  let currentGroup = 1;
  const chartGroups = [1, 2, 3];
  const groupContainerEls = chartGroups.map(i => document.getElementById('chart-group-' + i));
  groupContainerEls.forEach(groupEl => {
    if (groupEl) {
      groupEl.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].clientX;
      });
      groupEl.addEventListener('touchend', function(e) {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) {
          if (dx < 0 && currentGroup < 3) {
            currentGroup++;
            showChartGroup(currentGroup);
          } else if (dx > 0 && currentGroup > 1) {
            currentGroup--;
            showChartGroup(currentGroup);
          }
        }
      });
    }
  });
});

// --- AOS and GLightbox initialization ---
AOS.init();
const myLightbox = window.__myLightboxInstance || GLightbox({ selector: '.glightbox' });
window.__myLightboxInstance = myLightbox;

// --- Peptide data ---
const peptides = [
  { name: "RR", c50: 0.3383, c100: 0.6766, mol2: "assets/rr.mol2", fullName: "Arginine-Arginine" },
  { name: "RH", c50: 0.9537, c100: 1.9074, mol2: "assets/rh.mol2", fullName: "Arginine-Histidine" },
  { name: "RK", c50: 0.1890, c100: 0.3780, mol2: "assets/rk.mol2", fullName: "Arginine-Lysine" },
  { name: "HH", c50: 0.9731, c100: 1.9462, mol2: "assets/hh.mol2", fullName: "Histidine-Histidine" },
  { name: "HK", c50: 0.1406, c100: 0.2812, mol2: "assets/hk.mol2", fullName: "Histidine-Lysine" },
  { name: "HR", c50: 0.1388, c100: 0.2776, mol2: "assets/hr.mol2", fullName: "Histidine-Arginine" },
  { name: "KK", c50: 0.1577, c100: 0.3154, mol2: "assets/kk.mol2", fullName: "Lysine-Lysine" },
  { name: "KH", c50: 0.9774, c100: 1.9548, mol2: "assets/kh.mol2", fullName: "Lysine-Histidine" },
  { name: "KR", c50: 0.1598, c100: 0.3196, mol2: "assets/kr.mol2", fullName: "Lysine-Arginine" }
];

// --- Peptide carousel ---
let carouselPageIndex = 0;
let activeNGLStages = [];
const carouselTrack = document.getElementById("peptideCarouselTrack");

function getVisibleCount() {
  return window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3;
}

function renderPeptideCarousel() {
  if (!carouselTrack) return;

  // Dispose old NGL stages to free WebGL contexts
  activeNGLStages.forEach(s => { try { s.dispose(); } catch(e) {} });
  activeNGLStages = [];

  const visibleCount = getVisibleCount();
  // Clamp page index so it's never past the last valid page
  const maxPage = Math.max(0, Math.ceil(peptides.length / visibleCount) - 1);
  if (carouselPageIndex > maxPage) carouselPageIndex = maxPage;

  const start = carouselPageIndex * visibleCount;
  const visiblePeptides = peptides.slice(start, start + visibleCount);
  carouselTrack.innerHTML = "";
  visiblePeptides.forEach((pep, index) => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-xl p-4 text-center w-full transform transition-transform duration-300 hover:scale-105 hover:shadow-xl z-50";
    card.setAttribute('data-name', pep.name);
    card.innerHTML = `<h3 class="font-bold mb-1 text-lg">${pep.name}</h3><p class="text-xs text-gray-500 mb-2">${pep.fullName}</p>`;

    const moleculeDiv = document.createElement("div");
    moleculeDiv.id = `mol-${pep.name}`;
    moleculeDiv.className = "w-full h-40 md:h-48 mb-4 rounded border";
    card.appendChild(moleculeDiv);

    const label = document.createElement("p");
    label.className = "text-sm text-gray-500";
    label.textContent = `C₅₀: ${pep.c50.toFixed(2)} µM`;
    card.appendChild(label);

    const btn = document.createElement("button");
    btn.className = "mt-2 text-xs bg-purple-100 hover:bg-purple-200 rounded px-2 py-1";
    btn.textContent = "Select";
    btn.onclick = () => selectPeptide(pep.name);
    card.appendChild(btn);

    carouselTrack.appendChild(card);

    setTimeout(() => {
      const stage = new NGL.Stage(`mol-${pep.name}`, { backgroundColor: "white" });
      activeNGLStages.push(stage);
      stage.loadFile(pep.mol2).then(component => {
        component.addRepresentation("ball+stick", {
          multipleBond: true,
          colorScheme: "element"
        });
        stage.autoView();
        stage.setSpin(true);
        stage.zoom(2.5);
      });
    }, 0);
  });
}

function showNextPeptides() {
  const visibleCount = getVisibleCount();
  if ((carouselPageIndex + 1) * visibleCount < peptides.length) {
    carouselPageIndex++;
    renderPeptideCarousel();
  }
}

function showPreviousPeptides() {
  if (carouselPageIndex > 0) {
    carouselPageIndex--;
    renderPeptideCarousel();
  }
}

renderPeptideCarousel();

// Re-render carousel on resize so card count and NGL viewers stay correct
// Also resize the desktop comparison chart so it fills its container after resize
let carouselResizeTimer;
window.addEventListener("resize", () => {
  // Immediately tell existing NGL stages to remeasure their container
  activeNGLStages.forEach(s => { try { s.handleResize(); } catch(e) {} });
  // Debounce the full re-render (fixes card count and page clamping)
  clearTimeout(carouselResizeTimer);
  carouselResizeTimer = setTimeout(() => {
    renderPeptideCarousel();
    comparisonChartInstance.resize();
  }, 200);
});

// --- Diagnostics popup toggle ---
function togglePopup() {
  const popup = document.getElementById("diagnosticsPopup");
  popup.classList.toggle("hidden");
}

// --- Test tube and aggregation demo ---
const range = document.getElementById('peptideRange');
const label = document.getElementById('concentrationLabel');
const testTube = document.getElementById('testTube');
let peptideType = document.getElementById('peptideType');
if (!peptideType) {
  peptideType = document.createElement('input');
  peptideType.type = 'hidden';
  peptideType.id = 'peptideType';
  peptideType.value = 'RR';
  document.body.appendChild(peptideType);
}
const sliderLabel = document.getElementById('sliderLabel');

function getOrCreateNpEls() {
  let overlay = document.getElementById('npOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'npOverlay';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    document.getElementById('testTubeContainer').appendChild(overlay);
  }
  let npEls = Array.from(overlay.children);
  while (npEls.length < 10) {
    const d = document.createElement('div');
    d.style.position = 'absolute';
    d.style.width = '16px';
    d.style.height = '16px';
    d.style.borderRadius = '50%';
    d.style.zIndex = 10;
    d.style.boxShadow = '0 0 8px rgba(255, 255, 255, 0.8)';
    d.style.border = '1px solid rgba(255, 255, 255, 0.9)';
    overlay.appendChild(d);
    npEls.push(d);
  }
  return Array.from(overlay.children);
}

const frameData = {
  0: [
    { top: '10%', left: '10%', color: 'rgb(255,0,0)' },
    { top: '10%', left: '70%', color: 'rgb(255,0,0)' },
    { top: '70%', left: '10%', color: 'rgb(255,0,0)' },
    { top: '70%', left: '70%', color: 'rgb(255,0,0)' },
    { top: '40%', left: '25%', color: 'rgb(255,0,0)' },
    { top: '25%', left: '40%', color: 'rgb(255,0,0)' },
    { top: '55%', left: '60%', color: 'rgb(255,0,0)' },
    { top: '60%', left: '40%', color: 'rgb(255,0,0)' },
    { top: '30%', left: '60%', color: 'rgb(255,0,0)' },
    { top: '55%', left: '20%', color: 'rgb(255,0,0)' }
  ],
  1: [
    { top: '20%', left: '20%', color: 'rgb(240,0,30)' },
    { top: '20%', left: '60%', color: 'rgb(240,0,30)' },
    { top: '60%', left: '20%', color: 'rgb(240,0,30)' },
    { top: '60%', left: '60%', color: 'rgb(240,0,30)' },
    { top: '40%', left: '30%', color: 'rgb(255,0,0)' },
    { top: '30%', left: '40%', color: 'rgb(255,0,0)' },
    { top: '50%', left: '55%', color: 'rgb(255,0,0)' },
    { top: '55%', left: '40%', color: 'rgb(255,0,0)' },
    { top: '35%', left: '55%', color: 'rgb(255,0,0)' },
    { top: '50%', left: '30%', color: 'rgb(255,0,0)' }
  ],
  2: [
    { top: '30%', left: '30%', color: 'rgb(230,0,60)' },
    { top: '30%', left: '50%', color: 'rgb(230,0,60)' },
    { top: '50%', left: '30%', color: 'rgb(230,0,60)' },
    { top: '50%', left: '50%', color: 'rgb(230,0,60)' },
    { top: '40%', left: '35%', color: 'rgb(240,0,30)' },
    { top: '35%', left: '40%', color: 'rgb(240,0,30)' },
    { top: '45%', left: '50%', color: 'rgb(240,0,30)' },
    { top: '50%', left: '45%', color: 'rgb(240,0,30)' },
    { top: '38%', left: '50%', color: 'rgb(240,0,30)' },
    { top: '45%', left: '35%', color: 'rgb(240,0,30)' }
  ],
  3: [
    { top: '38%', left: '38%', color: 'rgb(200,0,100)' },
    { top: '39%', left: '41%', color: 'rgb(200,0,100)' },
    { top: '42%', left: '39%', color: 'rgb(200,0,100)' },
    { top: '41%', left: '42%', color: 'rgb(200,0,100)' },
    { top: '40%', left: '40%', color: 'rgb(230,0,60)' },
    { top: '39%', left: '40%', color: 'rgb(230,0,60)' },
    { top: '41%', left: '40%', color: 'rgb(230,0,60)' },
    { top: '40%', left: '39%', color: 'rgb(230,0,60)' },
    { top: '40%', left: '41%', color: 'rgb(230,0,60)' },
    { top: '40%', left: '40%', color: 'rgb(230,0,60)' }
  ],
  4: [
    { top: '40%', left: '40%', color: 'rgb(180,0,120)' },
    { top: '41%', left: '41%', color: 'rgb(180,0,120)' },
    { top: '42%', left: '42%', color: 'rgb(180,0,120)' },
    { top: '43%', left: '43%', color: 'rgb(180,0,120)' },
    { top: '41%', left: '39%', color: 'rgb(180,0,120)' },
    { top: '39%', left: '41%', color: 'rgb(180,0,120)' },
    { top: '39%', left: '39%', color: 'rgb(180,0,120)' },
    { top: '42%', left: '38%', color: 'rgb(180,0,120)' },
    { top: '38%', left: '42%', color: 'rgb(180,0,120)' },
    { top: '40%', left: '40%', color: 'rgb(180,0,120)' }
  ],
  5: [
    { top: '41%', left: '41%', color: 'rgb(160,0,150)' },
    { top: '42%', left: '42%', color: 'rgb(160,0,150)' },
    { top: '43%', left: '43%', color: 'rgb(160,0,150)' },
    { top: '44%', left: '44%', color: 'rgb(160,0,150)' },
    { top: '42%', left: '40%', color: 'rgb(160,0,150)' },
    { top: '40%', left: '42%', color: 'rgb(160,0,150)' },
    { top: '40%', left: '40%', color: 'rgb(160,0,150)' },
    { top: '43%', left: '39%', color: 'rgb(160,0,150)' },
    { top: '39%', left: '43%', color: 'rgb(160,0,150)' },
    { top: '41%', left: '41%', color: 'rgb(160,0,150)' }
  ],
  6: [
    { top: '42%', left: '42%', color: 'rgb(120,0,200)' },
    { top: '43%', left: '43%', color: 'rgb(120,0,200)' },
    { top: '44%', left: '44%', color: 'rgb(120,0,200)' },
    { top: '45%', left: '45%', color: 'rgb(120,0,200)' },
    { top: '43%', left: '41%', color: 'rgb(120,0,200)' },
    { top: '41%', left: '43%', color: 'rgb(120,0,200)' },
    { top: '41%', left: '41%', color: 'rgb(120,0,200)' },
    { top: '44%', left: '40%', color: 'rgb(120,0,200)' },
    { top: '40%', left: '44%', color: 'rgb(120,0,200)' },
    { top: '42%', left: '42%', color: 'rgb(120,0,200)' }
  ],
  7: [
    { top: '43%', left: '43%', color: 'rgb(90,0,220)' },
    { top: '44%', left: '44%', color: 'rgb(90,0,220)' },
    { top: '45%', left: '45%', color: 'rgb(90,0,220)' },
    { top: '46%', left: '46%', color: 'rgb(90,0,220)' },
    { top: '44%', left: '42%', color: 'rgb(90,0,220)' },
    { top: '42%', left: '44%', color: 'rgb(90,0,220)' },
    { top: '42%', left: '42%', color: 'rgb(90,0,220)' },
    { top: '45%', left: '41%', color: 'rgb(90,0,220)' },
    { top: '41%', left: '45%', color: 'rgb(90,0,220)' },
    { top: '43%', left: '43%', color: 'rgb(90,0,220)' }
  ],
  8: [
    { top: '44%', left: '44%', color: 'rgb(60,0,230)' },
    { top: '45%', left: '45%', color: 'rgb(60,0,230)' },
    { top: '46%', left: '46%', color: 'rgb(60,0,230)' },
    { top: '47%', left: '47%', color: 'rgb(60,0,230)' },
    { top: '45%', left: '43%', color: 'rgb(60,0,230)' },
    { top: '43%', left: '45%', color: 'rgb(60,0,230)' },
    { top: '43%', left: '43%', color: 'rgb(60,0,230)' },
    { top: '46%', left: '42%', color: 'rgb(60,0,230)' },
    { top: '42%', left: '46%', color: 'rgb(60,0,230)' },
    { top: '44%', left: '44%', color: 'rgb(60,0,230)' }
  ],
  9: [
    { top: '45%', left: '45%', color: 'rgb(0,0,255)' },
    { top: '46%', left: '46%', color: 'rgb(0,0,255)' },
    { top: '47%', left: '47%', color: 'rgb(0,0,255)' },
    { top: '48%', left: '48%', color: 'rgb(0,0,255)' },
    { top: '46%', left: '44%', color: 'rgb(0,0,255)' },
    { top: '44%', left: '46%', color: 'rgb(0,0,255)' },
    { top: '44%', left: '44%', color: 'rgb(0,0,255)' },
    { top: '47%', left: '43%', color: 'rgb(0,0,255)' },
    { top: '43%', left: '47%', color: 'rgb(0,0,255)' },
    { top: '45%', left: '45%', color: 'rgb(0,0,255)' }
  ]
};

updateFrame(0);

function updateFrame(sliderVal) {
  const type = peptideType.value;
  const peptide = peptides.find(p => p.name === type);
  const simulatedConc = parseFloat(sliderVal).toFixed(2);
  const fraction = simulatedConc / peptide.c100;
  label.textContent = simulatedConc;
  sliderLabel.textContent = `Peptide Concentration:`;
  const npEls = getOrCreateNpEls();
  if (type === "GG") {
    const color = frameData[0][0].color;
    testTube.style.backgroundColor = color;
    frameData[0].forEach((np, i) => {
      const el = npEls[i];
      el.style.top = np.top;
      el.style.left = np.left;
      el.style.backgroundColor = color;
      el.style.boxShadow = '0 0 8px rgba(255, 255, 255, 0.8)';
      el.style.border = '1px solid rgba(255, 255, 255, 0.9)';
      el.style.display = '';
    });
    triggerDrop('peptide');
    const aggNote = document.getElementById('c50Note');
    if (aggNote) aggNote.textContent = '';
    return;
  }
  const frameIndex = Math.min(9, Math.round((simulatedConc / 2) * 9));
  const frame = frameData[frameIndex];
  if (!frame) return;
  const clumpedCount = Math.round((simulatedConc / peptide.c100) * 10);
  npEls.forEach((el, i) => {
    if (i < clumpedCount) {
      const np = frame[i];
      el.style.top = np.top;
      el.style.left = np.left;
      el.style.backgroundColor = np.color;
    } else {
      const np = frameData[0][i];
      el.style.top = np.top;
      el.style.left = np.left;
      el.style.backgroundColor = frameData[0][i].color;
    }
    el.style.boxShadow = '0 0 8px rgba(255, 255, 255, 0.8)';
    el.style.border = '1px solid rgba(255, 255, 255, 0.9)';
    el.style.display = '';
  });
  triggerDrop('peptide');
  let aggNote = document.getElementById('c50Note');
  if (!aggNote) {
    aggNote = document.createElement('div');
    aggNote.id = 'c50Note';
    aggNote.className = 'text-sm text-purple-700 mt-2';
    range.parentNode.appendChild(aggNote);
  }
  if (simulatedConc >= peptide.c100) {
    testTube.style.backgroundColor = 'rgb(0,0,255)';
    aggNote.textContent = '🔵 You\'ve reached C₁₀₀ — 100% of NPs are aggregated!';
  } else if (simulatedConc >= peptide.c50) {
    testTube.style.backgroundColor = 'rgb(128,0,128)';
    aggNote.textContent = '🧪 You\'ve passed the experimental C₅₀ — 50% of NPs are aggregated!';
  } else {
    testTube.style.backgroundColor = frame[0].color;
    aggNote.textContent = '';
  }
}

range.addEventListener('input', () => {
  updateFrame(range.value);
});

function selectPeptide(type) {
  peptideType.value = type;
  range.value = 0;
  updateFrame(0);
  document.getElementById('gameStartContainer').classList.add('hidden');
  document.getElementById('testTubeSection').classList.remove('hidden');

  document.getElementById('selectedPeptideCard').classList.remove('hidden');
  const pep = peptides.find(p => p.name === type);
  document.getElementById('cardName').textContent = pep.name;
  document.getElementById('cardC50').textContent = `C₅₀: ${pep.c50.toFixed(2)} µM`;
  if (window._selectedMolViewStage) {
    window._selectedMolViewStage.dispose();
    window._selectedMolViewStage = null;
  }
  const canvas = document.getElementById('selectedMolView');
  const parent = canvas.parentNode;
  const nglDiv = document.createElement('div');
  nglDiv.id = 'selectedMolView';
  nglDiv.className = canvas.className;
  nglDiv.style.width = canvas.width ? canvas.width + 'px' : '100%';
  nglDiv.style.height = canvas.height ? canvas.height + 'px' : '128px';
  parent.replaceChild(nglDiv, canvas);
  const viewer = new NGL.Stage("selectedMolView", { backgroundColor: "white" });
  window._selectedMolViewStage = viewer;
  viewer.loadFile(pep.mol2).then(comp => {
    comp.addRepresentation("ball+stick", {
      multipleBond: true,
      colorScheme: "element"
    });
    viewer.autoView();
    viewer.setSpin(true);
  });
}

function saveCurrentTube() {
  const testTubeContainer = document.getElementById('testTubeContainer');
  const clone = testTubeContainer.cloneNode(true);
  clone.className += " w-16 h-32 border-2 border-gray-300";
  clone.style.transform = "scale(0.75)";

  const concentration = parseFloat(document.getElementById('concentrationLabel').textContent);
  const peptide = peptides.find(p => p.name === peptideType.value);
  const percentAggregated = Math.min(100, Math.round((concentration / peptide.c100) * 100));

  const labelDiv = document.createElement('div');
  labelDiv.className = "text-xs text-center mt-1 text-gray-700 leading-snug";
  labelDiv.innerHTML = `<strong>${peptideType.value}</strong><br>${concentration} µM<br>${percentAggregated}% NPs Aggregated`;

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '✖';
  deleteBtn.className = "absolute top-1 right-1 text-xs bg-red-200 hover:bg-red-300 text-red-800 px-1 rounded";
  let wrapper = document.createElement('div');
  wrapper.className = "relative flex flex-col items-center bg-white rounded-lg p-2 shadow border border-gray-300";
  deleteBtn.onclick = function() {
    wrapper.remove();
    if (document.getElementById('benchDisplay').children.length === 0) {
      document.getElementById('benchSection').classList.add('hidden');
    }
  };
  wrapper.appendChild(deleteBtn);
  wrapper.appendChild(clone);
  wrapper.appendChild(labelDiv);

  document.getElementById('benchDisplay').appendChild(wrapper);
  document.getElementById('benchSection').classList.remove('hidden');

  document.getElementById('testTubeSection').classList.add('hidden');
  document.getElementById('gameStartContainer').classList.remove('hidden');
}

function resetAggregation() {
  range.value = 0;
  updateFrame(0);
  triggerDrop('peg');
  testTube.classList.add('sparkle');
  setTimeout(() => testTube.classList.remove('sparkle'), 1000);
}

// --- Hero canvas particle animation ---
const canvas = document.getElementById("heroCanvas");
const ctx = canvas.getContext("2d");
let width, height;
let particles = [];

class NP {
  constructor(x, y) {
    this.homeX = x;
    this.homeY = y;
    this.x = x;
    this.y = y;
    this.radius = 4;
    this.color = "rgba(168, 85, 247, 0.7)";
  }

  update(mouse) {
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 100) {
      this.x += dx * 0.05;
      this.y += dy * 0.05;
    } else {
      this.x += (this.homeX - this.x) * 0.05;
      this.y += (this.homeY - this.y) * 0.05;
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < 100; i++) {
    let x = Math.random() * width;
    let y = Math.random() * height;
    particles.push(new NP(x, y));
  }
}

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  initParticles();
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const mouse = { x: -1000, y: -1000 };
window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

function animate() {
  ctx.clearRect(0, 0, width, height);
  particles.forEach((p) => {
    p.update(mouse);
    p.draw(ctx);
  });
  requestAnimationFrame(animate);
}

animate();

// --- Workflow carousel ---
const workflowSteps = [
  { img: "assets/step1.png", desc: "Start with a single AuNP (This one is ~4000 atoms)." },
  { img: "assets/step2.png", desc: "Add tri-sodium citrate to coat the surface. This protects the AuNP from unwanted self-aggregation." },
  { img: "assets/step3.png", desc: "Duplicate the nanoparticle for interaction study." },
  { img: "assets/step4.png", desc: "Introduce peptides for molecular dynamics simulation." }
];
let workflowIndex = 0;

function updateWorkflowStep() {
  const step = workflowSteps[workflowIndex];
  document.getElementById("workflowImage").src = step.img;
  document.getElementById("workflowDescription").textContent = step.desc;
}

function prevWorkflowStep() {
  workflowIndex = (workflowIndex - 1 + workflowSteps.length) % workflowSteps.length;
  updateWorkflowStep();
}

function nextWorkflowStep() {
  workflowIndex = (workflowIndex + 1) % workflowSteps.length;
  updateWorkflowStep();
}
