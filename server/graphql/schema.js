const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        numberOfParticipation: Int!
        actualYearOfStudy: Int!
        isInLastYearOfStudy: Boolean
        hasTotalyPayed: Boolean
        amountPayed:Float
        city: City!
        church: Church!
        
        createdAt: String!
        updatedAt: String!
    }
    type Role {
        _id: ID!
        name: String!
        description: String!
        users: [User!]
        
        createdAt: String!
        updatedAt: String!
    }
    type City {
        _id: ID!
        name: String!
        description: String!
        churches: [Church!]
        users: [User!]
        
        createdAt: String!
        updatedAt: String!
    }
    type Church {
        _id: ID!
        name: String!
        description: String!
        city: City!
        users: [User!]
        
        createdAt: String!
        updatedAt: String!
    }

    type AuthData {
        token: String!
        userId: String!
    }

    type UserData {
        users: [User!]!
        totalUsers: Int!
    }

    type RoleData {
        roles: [Role!]!
        totalRoles: Int!
    }

    type CityData {
        cities: [City!]!
        totalCities: Int!
    }

    type ChurchData {
        Churches: [Church!]!
        totalChurches: Int!
    }

    input UserInputData {
        firstName: String!
        lastName: String!
        birthDate: String
        email: String!
        password: String!

        numberOfParticipation: Int!
        actualYearOfStudy: Int!
        isInLastYearOfStudy: Boolean
        hasTotalyPayed: Boolean
        amountPayed: Float
        role: String
        city: String
        church: String
    }

    input RoleInputData {
        name: String!
        description: String
    }
    input ChurchInputData {
        name: String!
        description: String
        city: String!
    }
    input CityInputData {
        name: String!
        description: String
    }

    type RootQuery {
        login(email: String!, password: String!): AuthData!
        users(page: Int): UserData!
        cities(page: Int): CityData!
        churches(page: Int): ChurchData!
        role(id: ID!): Role!
        church(id: ID!): Church!
        city(id: ID!): City!
        user: User!
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
        createRole(roleInput: RoleInputData): Role!
        createChurch(churchInput: ChurchInputData): Church!
        createCity(cityInput: CityInputData): City!

        updateUser(id: ID!, userInput: UserInputData): User!
        updateRole(id: ID!, roleInput: RoleInputData): Role!
        updateCity(id: ID!, cityInput: CityInputData): City!
        updateChurch(id: ID!, churchInput: ChurchInputData): Church!

        deleteUser(id: ID!): Boolean
        deleteRole(id: ID!): Boolean
        deleteCity(id: ID!): Boolean
        deleteChurch(id: ID!): Boolean
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
