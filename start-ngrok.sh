#!/bin/bash

echo "========================================"
echo "   BMS 3 - Démarrage avec ngrok"
echo "========================================"
echo

echo "[1/3] Vérification de ngrok..."
if ! command -v ngrok &> /dev/null; then
    echo "❌ ngrok n'est pas installé"
    echo "Veuillez installer ngrok depuis https://ngrok.com/"
    exit 1
fi

echo "[2/3] Démarrage du projet BMS..."
npm run dev:backend &
BACKEND_PID=$!

# Attendre que le backend démarre
sleep 3

echo "[3/3] Démarrage de ngrok..."
echo
echo "URLs ngrok générées :"
echo "Frontend: https://[votre-url].ngrok.io"
echo "Backend:  https://[votre-url].ngrok.io:5000"
echo
echo "Appuyez sur Ctrl+C pour arrêter"
echo

ngrok http 3000 --config ngrok.yml

# Nettoyer les processus
kill $BACKEND_PID 2>/dev/null
