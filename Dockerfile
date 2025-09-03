# Dockerfile pour le backend BMS
FROM node:18-alpine

# Créer le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY backend/package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY backend/ ./

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Changer les permissions
RUN chown -R nodejs:nodejs /app
USER nodejs

# Exposer le port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Commande de démarrage
CMD ["npm", "start"]
