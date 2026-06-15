const newman = require('newman');
const path = require('path');

// Liste ordonnée de tes collections
const collections = [
    'collections/users_collection.json',
    'collections/posts_collection.json',
    'collections/put_collection.json',
    'collections/patch_collection.json',
    'collections/delete_collection.json'
];

console.log("Démarrage de la suite de tests globale...");

// Fonction récursive pour exécuter les collections l'une après l'autre
function runCollection(index) {
    if (index >= collections.length) {
        console.log("Tous les tests sont terminés ! Rapport généré dans reports/global-report.html");
        return;
    }

    console.log(`Exécution de : ${collections[index]}`);

    newman.run({
        collection: require(path.join(__dirname, collections[index])),
        environment: require(path.join(__dirname, 'environment.json')),
        reporters: ['cli', 'htmlextra'],
        reporter: {
            htmlextra: {
                export: 'reports/global-report.html',
                // Cette option permet d'ajouter les résultats à la suite dans le même fichier
                updateSavedReport: true, 
                title: 'Rapport Global de l\'API (Full CRUD)'
            }
        }
    }, function (err, summary) {
        if (err) { 
            console.error(`Erreur critique sur ${collections[index]}:`, err); 
        }
        
        // Même si un test échoue (summary.run.failures), on passe à la suite !
        runCollection(index + 1);
    });
}

// Lancement de la première collection
runCollection(0);