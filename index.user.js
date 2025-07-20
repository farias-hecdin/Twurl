// ==UserScript==
// @name         Twurl
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Añade un botón en x.com para convertir URLs a nitter.net o a un dominio personalizado.
// @author       farias-hecdin
// @include      *://x.com/*
// @include      *://nitter.net/*
// @include      *://twitter.com/*
// @grant        GM_addStyle
// @grant        window.open
// ==/UserScript==

(() => {
  'use strict';

  GM_addStyle(`
  #modal{display:none}
  .btn-close{background:#657786}
  .btn-close:hover{background:#8899a6}
  .btn-convert{background:#1DA1F2}
  .btn-convert:hover{background:#1a8cd8}
  #main-btn{position:fixed;bottom:20px;right:20px;z-index:9998;background:#1DA1F2;color:#fff;border:none;border-radius:25px;padding:10px 20px;font-size:16px;font-weight:bold;cursor:pointer;box-shadow:0 4px 8px rgba(0,0,0,.2);transition:.3s}
  #main-btn:hover{background:#0c85d0}
  #content h3{margin:0 0 5px;padding:0;font-size:20px;text-align:center}
  #content{background:#15202B;color:#E7E9EA;padding:25px;border-radius:12px;width:90%;max-width:500px;box-shadow:0 5px 15px rgba(0,0,0,.5);display:flex;flex-direction:column;gap:15px;font-family:sans-serif}
  #overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.75);display:flex;justify-content:center;align-items:center;z-index:9999}
  label{cursor:pointer;display:flex;align-items:center;gap:5px}
  #options{display:flex;gap:20px;margin-bottom:-5px}
  #result a{color:#1DA1F2;text-decoration:none;font-size:16px;font-family:monospace;cursor:pointer}
  #result a:hover{text-decoration:underline}
  #result{margin-top:5px;padding:15px;background:#000;border:1px solid #38444d;border-radius:6px;min-height:25px;text-align:center;word-break:break-all}
  .action{color:#fff;border:none;border-radius:20px;padding:10px;font-size:16px;cursor:pointer;font-weight:bold;transition:.3s}
  .input{width:100%;padding:10px;border-radius:6px;border:1px solid #38444d;background:#000;color:#E7E9EA;font-size:16px;box-sizing:border-box}
`);

  const $ = s => document.querySelector(s);
  const openModal = () => {
    if ($('#overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.innerHTML = `
      <div id="content">
        <h3>Convertir URL de X/Twitter</h3>
        <div id="options">
          <select id="select">
            <option value="nitter.net">Nitter</option>
            <option value="nitter.privacyredirect.com">Nitter 2</option>
            <option value="nuku.trabun.org">Nitter 3</option>
            <option value="custom">Dominio personalizado</option>
          </select>
        </div>
        <div id="custom" class="input" style="display:none">
          <input id="custom-input" class="input" placeholder="Ej: nitter.it">
        </div>
        <input id="url-input" class="input" placeholder="Pega aquí una URL de X/Twitter">
        <button id="convert" class="action btn-convert">Cambiar</button>
        <div id="result"></div>
        <button id="close" class="action btn-close">Cerrar</button>
      </div>`;
    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    $('#select').onchange = e => $('#custom').style.display = (e.target.value === 'custom') ? 'block' : 'none';
    $('#close').onclick = close;
    overlay.onclick = e => e.target === overlay && close();

    $('#convert').onclick = () => {
      const url = $('#url-input').value.trim();
      const result = $('#result');
      result.innerHTML = '';
      if (!url) return result.textContent = 'URL no válida.';
      const domain = ($('#select').value === 'custom') ? $('#custom-input').value.trim() || 'nitter.net' : $('#select').value;
      const newUrl = url.replace(/https?:\/\/(x\.com|twitter\.com|nitter\.net)/, `https://${domain}`);
      const a = document.createElement('a');
      a.href = a.textContent = newUrl;
      a.onclick = e => (e.preventDefault(), window.open(newUrl, '_blank', 'noopener'));
      result.appendChild(a);
    };
  };

  const btn = document.createElement('button');
  btn.id = 'main-btn';
  btn.textContent = 'Abrir en Nitter';
  btn.onclick = openModal;
  document.body.appendChild(btn);
})();
