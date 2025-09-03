#!/bin/bash

echo "========================================"
echo "   BMS 3 - Démarrage du Projet"
echo "========================================"
echo

echo "[1/4] Installation des dépendances principales..."
npm install

echo
echo "[2/4] Installation des dépendances backend..."
cd backend
npm install
cd ..

echo
echo "[3/4] Installation des dépendances frontend..."
cd frontend
npm install
cd ..

echo
echo "[4/4] Démarrage du projet..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:3000"
echo
echo "Appuyez sur Ctrl+C pour arrêter"
echo

npm run dev 