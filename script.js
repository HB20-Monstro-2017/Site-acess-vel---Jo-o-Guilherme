// script.js - ajuste robusto para Aumentar / Diminuir fonte
document.addEventListener('DOMContentLoaded', () => {
  // listas de IDs que o script procura (compatibilidade com várias versões)
  const possibleInc = ['aumentar', 'aumentarFonte', 'aumentar-fonte', 'aumentar-fonte-btn', 'aumentarFont'];
  const possibleDec = ['diminuir', 'diminuirFonte', 'diminuir-fonte', 'diminuir-fonte-btn', 'diminuirFont'];
  const possibleReset = ['reset-fonte', 'resetFonte', 'reset-font'];

  const find = (arr) => arr.map(id => document.getElementById(id)).find(el => el !== null) || null;
  const btnInc = find(possibleInc);
  const btnDec = find(possibleDec);
  const btnReset = find(possibleReset);

  const root = document.documentElement; // aplica no :root para afetar rems
  const computedInit = parseFloat(getComputedStyle(root).fontSize) || 16;

  // tenta recuperar do localStorage, senão usa o tamanho computado
  let fontSize = Number(localStorage.getItem('siteFontSize')) || computedInit;

  const MIN = 10;   // px mínimo
  const MAX = 28;   // px máximo
  const STEP = 1;   // px por clique

  function applyFont() {
    root.style.fontSize = fontSize + 'px';
    try { localStorage.setItem('siteFontSize', String(fontSize)); } catch(e) { /* privado/com navegadores bloqueados */ }
  }

  // aplica inicial
  applyFont();

  // listeners (só anexa se o botão existe)
  if (btnInc) {
    btnInc.addEventListener('click', () => {
      fontSize = Math.min(MAX, +(fontSize + STEP).toFixed(2));
      applyFont();
    });
  }

  if (btnDec) {
    btnDec.addEventListener('click', () => {
      fontSize = Math.max(MIN, +(fontSize - STEP).toFixed(2));
      applyFont();
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      fontSize = computedInit;
      try { localStorage.removeItem('siteFontSize'); } catch(e) {}
      applyFont();
    });
  }

  // atalhos: Ctrl/Cmd + = (ou +) e Ctrl/Cmd + -
  document.addEventListener('keydown', (ev) => {
    const isMac = navigator.platform.toUpperCase().includes('MAC');
    const ctrl = isMac ? ev.metaKey : ev.ctrlKey;
    if (!ctrl) return;

    if (ev.key === '+' || ev.key === '=' ) {
      ev.preventDefault();
      if (btnInc) btnInc.click();
    } else if (ev.key === '-') {
      ev.preventDefault();
      if (btnDec) btnDec.click();
    } else if (ev.key.toLowerCase() === '0') { // Ctrl/Cmd+0 reseta
      ev.preventDefault();
      if (btnReset) btnReset.click();
    }
  });

  // aviso útil no console se não encontrou botões
  if (!btnInc && !btnDec) {
    console.warn('Nenhum botão de aumentar/diminuir fonte encontrado. IDs procurados:', possibleInc, possibleDec);
  }
});
