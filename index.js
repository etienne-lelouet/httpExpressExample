const express = require("express");
const bodyParser = require("body-parser"); //oublie pas de npm install tout ça

const app = express(); // ton serveur web

/* le fonctionnement d'express est izy : tes requtes http sont traitées par des fonctions (que tu écris toi) auxquelles 
express va automatiquement passer les objets req, res et la fonction next : req qui contient la requète http entrante, 
res qui contient le resultat que tu vas envoyer, et next on verra + tard 
tu définis les fonctions qui vont traiter les requètes (entrantes) de la manière suivante: 
  [nomDeLaVariableServeur (ici app)].methodeHTTP([endpoint de la requête (arg optionnel)], [fonction qui traite la requète])
*/

const getDataFromLaBDD = () => {
  return { zbeb : "zbeb" }
};

const getData = (req, res) => { //j'ai pas besoin de next dans cette fonction donc je le récupère pas
  try  {
    const data = getDataFromLaBDD();
    res.status(200).json(data); 
    //res.status : on donne à la réponse renvoyée au client le statut 200 / OK => https://www.restapitutorial.com/httpstatuscodes.html
    //.json(dataFormateeEnJson) => on renvoie dans le corps de la requète les données au format JSON
  } catch (e) {
    res.status(500).json({ error: "unableToGetData" }); 
    //500 => "internal server error"
    //tu peux ne pas mettre de guillemets sur les clefs des objects JSON : { zbeb: "zbebe" } === { "zbeb": "zbebe" }
    //2ème lifehack JSON : si tu veux mettre une variable dans un objet JSON et que la clef dans laquelle tu veux mettre la variable à le meme nom 
    //tu peux faire ça :
    const data = "zbeb";
    const JSONDATA = { data };
    // JSONDATA => { data: "data" }
  }
}

const postData = (req, res) => {
  // traite le post
  res.status(200);
}

app.use(bodyParser.json()); 
//Ici, on va faire passer toutes les requètes qui arrivent sur le serveur, quelle que soit leurs type dans la fonction bodyParser.json():
// .use => quelle que soit le type requète, et comme on ne dit pas sur quel endpoint on arrive, on traite toutes les requètes, quel que soit l'endpoint

app.use((req, res, next) => { // dans cette fonction, je dis que le header de toutes les réponse que je renvoie (res.header), aura les valeurs suivantes
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Content-Length, X-Requested-With");
	res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
	res.header("Access-Control-Allow-Credentials", true);
	if (req.method === "OPTIONS") { //osef de ça , c'est pas beau mais ça fait le taff
		res.status(200).send();
		return;
	}
	next(); // j'ai fait ce que je voulais dans cette fonction, je passe à la fonction suivante qui matche ma requète
});


app.get("/data", getData);
//si une requète de type "GET" (.get) arrive sur l'endpoint "/data", on execute la fonction getData (express lui passe tout seul req, res et next) 
app.post("/data", postData);
//si une requète de type "POST" (.post) arrive sur l'endpoint "/data", on execute la fonction postData (express lui passe tout seul req, res et next) 

const portToListen = 8000;

app.listen(portToListen, (() => {
  console.log(`app is listening on port ${portToListen}`);
}));
//oublie pas d'initialiser ta connexion à MongoDB et tout
