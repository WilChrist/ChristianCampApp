# ChristianCampApp

An Application For managing data in Christian (Biblical) Camp.
The goal is being able to register attendant to Christian event like biblical camp according to their city, local church and role; but also their evaluations of the event at his end. We want the application to serve also for the analitycs and tresury.

## Getting Started


These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

This is a M.E.A.N stack GraphQL Application. So you need Javascript knwoledges and environment to run and tweak it.

Assuming you already know what [M.E.A.N[](http://mean.io/) stack mean (hahaha) and [GraphQL](https://graphql.org/) is, you have to install :

* [Git](https://git-scm.com/)
* [Node](https://nodejs.org/en/)
* [MongoDB](https://www.mongodb.com/)

after you have installed all this, [create](https://docs.mongodb.com/manual/tutorial/create-users/) a mongoDB admin with a password; you will need it later.

### Installing

This app is divided in two part a client (Front-End) and a Server (Back-End). The client is a simple Angular (6) App and the Server is a GraphQL API.

In order to get a development env running, you have to :

* clone this repos: 

```
git clone https://github.com/WilChrist/ChristianCampApp.git
```

* Install [nodemon](https://nodemon.io/) globaly

```
npm install -g nodemon
```

* Update the Node Dev env config file `server/nodemon.js` according to your data

```Json
{
    "env": {
        "MONGO_USER": "yourMongoDBUser",
        "MONGO_PASSWORD": "yourMongoDBPassword",
        "MONGO_DEFAULT_DATABASE": "yourMongoDBDatabaseName",
        "NODE_ENV":"development"
    }
}
```
* launch the Server :

```
cd server
nodemon
```

* You should be able (thanks to graphiql) to browse the GraphQL API by going to [http://localhost:3000/graphql](http://localhost:3000/graphql)

For the client, you need to go in client sub-folder and just launch it
```
cd ../client
ng serve
```

## Deployment

For deploying the app into production environment, you just have to update the `nodemon.json` config file

## Built With

* [Express Js](https://expressjs.com/) - The web application framework used
* [NPM](https://maven.apache.org/) - Dependency Management

## Contributing

Please just email me at [willynzesseu@gmail.com](mailto:willynzesseu@gmail.com)

## Versioning

We use [Git](https://git-scm.com/) for versioning.

## Authors

* **Willy Nzesseu and Francis Djiomejoung** - *Initial work* 

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project. (Soon Available)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Great thanks to [Maximilian Schwarzmüller](https://www.udemy.com/user/maximilian-schwarzmuller/) for all his great ressources on JavaScript Technologies. I learn a lot from him and really like his way of teaching.
* Glory to Jesus for the Inspiration and the strengh He give us behind all these things the Glory of God, the Father.
