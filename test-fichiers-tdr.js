const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';

async function testFichiersTDR() {
  console.log('🧪 Test de l\'API des fichiers TDR\n');

  try {
    // 1. Test de connexion
    console.log('1️⃣ Test de connexion...');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    if (healthResponse.ok) {
      console.log('✅ Serveur connecté');
    } else {
      console.log('❌ Serveur non connecté');
      return;
    }

    // 2. Test de login pour obtenir un token
    console.log('\n2️⃣ Test de login...');
    const loginResponse = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'superadmin@bms.com',
        password: 'admin1234'
      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      authToken = loginData.token;
      console.log('✅ Login réussi, token obtenu');
    } else {
      console.log('❌ Login échoué');
      const errorData = await loginResponse.json();
      console.log('Erreur:', errorData);
      return;
    }

    // 3. Test de récupération des statistiques des fichiers TDR
    console.log('\n3️⃣ Test des statistiques des fichiers TDR...');
    const statsResponse = await fetch(`${BASE_URL}/fichiers-tdr/statistiques`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('✅ Statistiques récupérées:', statsData);
    } else {
      console.log('❌ Erreur lors de la récupération des statistiques');
      const errorData = await statsResponse.json();
      console.log('Erreur:', errorData);
    }

    // 4. Test de récupération des fichiers TDR d'une offre (avec un ID fictif)
    console.log('\n4️⃣ Test de récupération des fichiers TDR d\'une offre...');
    const offreId = 1; // ID fictif pour le test
    const fichiersResponse = await fetch(`${BASE_URL}/fichiers-tdr/offre/${offreId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (fichiersResponse.ok) {
      const fichiersData = await fichiersResponse.json();
      console.log('✅ Fichiers TDR récupérés:', fichiersData);
    } else {
      console.log('❌ Erreur lors de la récupération des fichiers TDR');
      const errorData = await fichiersResponse.json();
      console.log('Erreur:', errorData);
    }

    // 5. Test de création d'un fichier TDR de test
    console.log('\n5️⃣ Test de création d\'un fichier TDR...');
    
    // Créer un fichier PDF de test (contenu minimal)
    const testPdfContent = Buffer.from('%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n72 720 Td\n(Test PDF) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000111 00000 n \n0000000204 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n297\n%%EOF\n');
    
    const formData = new FormData();
    formData.append('fichier', new Blob([testPdfContent], { type: 'application/pdf' }), 'test.pdf');
    formData.append('description', 'Fichier de test pour l\'API');
    formData.append('version', '1.0');

    const uploadResponse = await fetch(`${BASE_URL}/fichiers-tdr/upload/${offreId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: formData
    });

    if (uploadResponse.ok) {
      const uploadData = await uploadResponse.json();
      console.log('✅ Fichier TDR créé:', uploadData);
      
      // 6. Test de téléchargement du fichier créé
      const fichierId = uploadData.fichier.id;
      console.log('\n6️⃣ Test de téléchargement du fichier TDR...');
      
      const downloadResponse = await fetch(`${BASE_URL}/fichiers-tdr/download/${fichierId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (downloadResponse.ok) {
        console.log('✅ Fichier TDR téléchargé avec succès');
        const contentLength = downloadResponse.headers.get('content-length');
        console.log(`📁 Taille du fichier: ${contentLength} bytes`);
      } else {
        console.log('❌ Erreur lors du téléchargement');
        const errorData = await downloadResponse.json();
        console.log('Erreur:', errorData);
      }

      // 7. Test de suppression du fichier de test
      console.log('\n7️⃣ Test de suppression du fichier TDR...');
      const deleteResponse = await fetch(`${BASE_URL}/fichiers-tdr/${fichierId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (deleteResponse.ok) {
        const deleteData = await deleteResponse.json();
        console.log('✅ Fichier TDR supprimé:', deleteData);
      } else {
        console.log('❌ Erreur lors de la suppression');
        const errorData = await deleteResponse.json();
        console.log('Erreur:', errorData);
      }
    } else {
      console.log('❌ Erreur lors de la création du fichier TDR');
      const errorData = await uploadResponse.json();
      console.log('Erreur:', errorData);
    }

    console.log('\n🎉 Tests terminés avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  }
}

// Fonction utilitaire pour créer un FormData compatible avec Node.js
class FormData {
  constructor() {
    this.boundary = '----WebKitFormBoundary' + Math.random().toString(16).substr(2);
    this.data = [];
  }

  append(key, value, filename) {
    this.data.push(`--${this.boundary}`);
    if (filename) {
      this.data.push(`Content-Disposition: form-data; name="${key}"; filename="${filename}"`);
      this.data.push(`Content-Type: ${value.type || 'application/octet-stream'}`);
    } else {
      this.data.push(`Content-Disposition: form-data; name="${key}"`);
    }
    this.data.push('');
    this.data.push(value);
    this.data.push('');
  }

  getBuffer() {
    this.data.push(`--${this.boundary}--`);
    return Buffer.concat(this.data.map(item => 
      typeof item === 'string' ? Buffer.from(item + '\r\n') : item
    ));
  }

  getHeaders() {
    return {
      'Content-Type': `multipart/form-data; boundary=${this.boundary}`,
      'Content-Length': this.getBuffer().length
    };
  }
}

// Fonction utilitaire pour créer un Blob compatible avec Node.js
class Blob {
  constructor(content, options = {}) {
    this.content = content;
    this.type = options.type || 'application/octet-stream';
    this.size = content.length;
  }
}

testFichiersTDR().catch(console.error);
