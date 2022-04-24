# 🏕 Projet YelpCamp

Voici le projet YelpCamp, qui à pour but à l'utilisateur de pouvoir implanter des lieux de campings ainsi de commenter celle-ci.
Le site est disponible [ici](https://guarded-wildwood-12191.herokuapp.com/)

## 🛠 Quels sont les outils et langages utilisées ?

Sur ce projet j'ai utilisé :

- [Javascript](https://www.javascript.com/)
- [Bootstrap](https://getbootstrap.com/)
- [Node.JS](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/try/download/community)
- [Express.JS](https://expressjs.com/fr/)
- [Multer](https://github.com/expressjs/multer)
- [Passport](https://www.passportjs.org/)
- [EJS](https://ejs.co/)
- [JOI](https://joi.dev/api/?v=17.6.0)
- [MAPBOX](https://www.mapbox.com/)
- [CLOUDINARY](https://cloudinary.com/)

## 🤔 Les pré-requis pour utiliser le code source ?

Vous aurez avant-tout besoin d'installer :

- [MongoDB](https://www.mongodb.com/try/download/community) installer le logiciel
- [Node.JS la version LTS](https://nodejs.org/en/download/) installer le logiciel
- [Git Bash](https://git-scm.com/downloads) installer le logiciel
- [MAPBOX](https://www.mapbox.com/) créer un compte
- [CLOUDINARY](https://cloudinary.com/) créer un compte

## Comment installer les modules ?

Après avoir installé les logiciels requis, ouvrez le dossier avec votre éditeur de commande (CLI) favoris.
Puis faite clic-droit dans le dossier et cliquez sur `git bash here`, pour ecrire `npm install` qui installera les dépendances requis pour l'application.

### L'Environnement Variables

Pour exécuter ce projet, vous devrez également ajouter les variables d'environnement suivantes à votre fichier en le créant la racine du projet `.env`

| Paramètre | Description                |
| :-------- | :------------------------- |
| `CLOUDINARY_CLOUD_NAME` | **Requis** la clé API |
| `CLOUDINARY_KEY` | **Requis** la clé API |
| `CLOUDINARY_SECRET` | **Requis** la clé API |
| `MAPBOX_TOKEN` | **Requis** la clé API |

Et dans le fichier dans la syntaxe suivante : ``` CLOUDINARY_CLOUD_NAME=0123456 ```

## Comment lancer le projet

Dans le CLI à la racine du dossier écrivez `npm start`

## Bonus ! Générer des données pour le projet 

J'ai également laissé un dossier qui s'appelle seeds qui regroupe nom et ville aléatoire anglophone si vous le souhaiter.
Pour générer les données dans la BDD du projet il faut impérativement installer `MongoDB`.

Dès que cette condition est réunie, avec votre CLI (Invite de commande) vous vous mettez à la racine du projet puis vous faites : 
`cd seeds` à ce moment vous vous retrouvez dans le dossier seeds puis vous écrivez toujours dans le CLI `node index.js`.



Enjoy ! 🤩
