const newman = require('newman');
const path = require('path');
const fs = require('fs');

// 1. Liste de tes 5 collections
const files = [
    'collections/users_collection.json',
    'collections/posts_collection.json',
    'collections/put_collection.json',
    'collections/patch_collection.json',
    'collections/delete_collection.json'
];

console.log("🚀 Fusion des collections en mémoire...");

// 2. Structure d'une collection Postman "Maîtresse" virtuelle
let masterCollection = {
    info: {
        name: "Suite de Tests API Globale (Full CRUD)",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: [] // On va injecter tes collections ici sous forme de dossiers
};

// 3. On charge chaque fichier et on l'intègre comme un sous-dossier
files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // On crée un dossier au nom de la collection pour que le rapport soit bien organisé
        masterCollection.item.push({
            name: content.info.name,
            item: content.item
        });
    } else {
        console.error(`⚠️ Fichier introuvable : ${file}`);
    }
});

// 4. On crée le dossier reports s'il n'existe pas
if (!fs.existsSync('reports')) {
    fs.mkdirSync('reports');
}

console.log("🏃 Lancement du Run Newman Global...");

// 5. Un SEUL run Newman pour TOUT le projet
// 5. Un SEUL run Newman pour TOUT le projet avec détails complets
newman.run({
    collection: masterCollection,
    environment: require(path.join(__dirname, 'environment.json')),
    reporters: ['cli', 'htmlextra'],
    reporter: {
        htmlextra: {
            export: 'reports/global-report.html',
            title: 'Rapport d\'API Global - Intégration Continue',
            titleSize: 4,
            showEnvironmentData: true,
            browserTitle: "Rapport de Tests Global",
            
            // CONFIGURATION POUR AVOIR TOUS LES DÉTAILS D'ASSERTIONS :
            showOnlyFails: false,            // Ne pas afficher QUE les échecs
            hideSuccessfulRequests: false,   // NE PAS cacher les requêtes réussies
            omitHeaders: false,              // Afficher les en-têtes (headers)
            showMarkdownLinks: true,
            timezone: "Europe/Paris"
        }
    }
}, function (err, summary) {
    if (err) { 
        console.error("❌ Erreur critique lors du run :", err); 
        process.exit(1);
    }
    console.log("🏁 Tous les tests sont terminés !");
    console.log("📊 Ouvrez 'reports/global-report.html' : tout le détail est visible !");
});