// ==UserScript==
// @name         Convertidor a Nitter Avanzado
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Añade un botón en x.com para convertir URLs a nitter.net o a un dominio personalizado.
// @author       farias-hecdin
// @match        *://x.com/*
// @grant        GM_addStyle
// @grant        window.open
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #nitter-main-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9998;
            background-color: #1DA1F2;
            color: white;
            border: none;
            border-radius: 25px;
            padding: 10px 20px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            transition: background-color 0.3s;
        }
        #nitter-main-button:hover {
            background-color: #0c85d0;
        }
        #nitter-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.75);
            display: flex; justify-content: center; align-items: center;
            z-index: 9999;
        }
        #nitter-modal-content {
            background-color: #15202B; color: #E7E9EA;
            padding: 25px; border-radius: 12px;
            width: 90%; max-width: 500px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.5);
            display: flex; flex-direction: column; gap: 15px;
            font-family: sans-serif;
        }
        #nitter-modal-content h3 { margin: 0 0 5px 0; padding: 0; font-size: 20px; text-align: center; }
        .nitter-input {
            width: 100%; padding: 10px; border-radius: 6px;
            border: 1px solid #38444d; background-color: #000;
            color: #E7E9EA; font-size: 16px; box-sizing: border-box;
        }
        #nitter-options-container { display: flex; gap: 20px; margin-bottom: -5px; }
        #nitter-options-container label { cursor: pointer; display: flex; align-items: center; gap: 5px; }
        #custom-domain-container { display: none; }
        .nitter-action-button {
            color: white; border: none; border-radius: 20px;
            padding: 10px; font-size: 16px; cursor: pointer;
            font-weight: bold; transition: background-color 0.3s;
        }
        #nitter-convert-button { background-color: #1DA1F2; }
        #nitter-convert-button:hover { background-color: #1a8cd8; }
        #nitter-result-area {
            margin-top: 5px; padding: 15px; background-color: #000;
            border: 1px solid #38444d; border-radius: 6px;
            min-height: 25px; text-align: center; word-break: break-all;
        }
        #nitter-result-area a {
            color: #1DA1F2; text-decoration: none; font-size: 16px;
            font-family: monospace; cursor: pointer;
        }
        #nitter-result-area a:hover { text-decoration: underline; }
        #nitter-close-button { background-color: #657786; }
        #nitter-close-button:hover { background-color: #8899a6; }
    `);

    function createModal() {
        if (document.getElementById('nitter-modal-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'nitter-modal-overlay';

        const modalContent = document.createElement('div');
        modalContent.id = 'nitter-modal-content';

        modalContent.innerHTML = `
            <h3>Convertir URL de X.com</h3>
            <div id="nitter-options-container">
                <label><input type="radio" name="nitter_option" value="default" checked> nitter.net</label>
                <label><input type="radio" name="nitter_option" value="custom"> Dominio personalizado</label>
            </div>
            <div id="custom-domain-container">
                <input type="text" id="nitter-custom-domain-input" class="nitter-input" placeholder="Ej: nitter.it, nitter.privacydev.net">
            </div>
            <input type="text" id="nitter-url-input" class="nitter-input" placeholder="Pega aquí una URL de x.com">
            <button id="nitter-convert-button" class="nitter-action-button">Cambiar</button>
            <div id="nitter-result-area"></div>
            <button id="nitter-close-button" class="nitter-action-button">Cerrar</button>
        `;

        overlay.appendChild(modalContent);
        document.body.appendChild(overlay);

        const closeModal = () => overlay.remove();
        const customDomainContainer = document.getElementById('custom-domain-container');

        document.querySelectorAll('input[name="nitter_option"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                customDomainContainer.style.display = (e.target.value === 'custom') ? 'block' : 'none';
            });
        });

        document.getElementById('nitter-close-button').addEventListener('click', closeModal);
        overlay.addEventListener('click', e => {
            if (e.target === overlay) closeModal();
        });

        document.getElementById('nitter-convert-button').addEventListener('click', () => {
            const originalUrl = document.getElementById('nitter-url-input').value.trim();
            const resultArea = document.getElementById('nitter-result-area');
            resultArea.innerHTML = '';

            if (!originalUrl || !originalUrl.includes('x.com')) {
                resultArea.textContent = 'URL no válida o no es de x.com.';
                return;
            }

            const selectedOption = document.querySelector('input[name="nitter_option"]:checked').value;
            let targetDomain = 'nitter.net';

            if (selectedOption === 'custom') {
                const customDomain = document.getElementById('nitter-custom-domain-input').value.trim();
                if (customDomain) {
                    targetDomain = customDomain;
                }
            }

            const nitterUrl = originalUrl.replace(/https?:\/\/x\.com/, `https://${targetDomain}`);
            const resultLink = document.createElement('a');
            resultLink.textContent = nitterUrl;

            resultLink.addEventListener('click', e => {
                e.preventDefault();
                window.open(nitterUrl, '_blank', 'noopener,noreferrer');
            });

            resultArea.appendChild(resultLink);
        });
    }

    const mainButton = document.createElement('button');
    mainButton.id = 'nitter-main-button';
    mainButton.textContent = 'Pasar a Nitter';
    mainButton.addEventListener('click', createModal);

    document.body.appendChild(mainButton);
})();

