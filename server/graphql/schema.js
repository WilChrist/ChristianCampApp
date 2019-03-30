const { buildSchema } = require('graphql');

module.exports = buildSchema(`
# ******************************* Core Data Shema *************************************
    """ User of the application, can be a participant or a staff member (with subrole) """
    type User {
        """ The Id of the User """
        _id: ID!

        """Constraint: must have at least 3 characters """
        firstName: String!
        lastName: String!
        email: String!
        sexe: String!
        birthDate: String

        """ Url of the picture of the user """
        imageUrl: String

        """ Required Only for staff members """
        password: String

        """ How many times does this user attends to this camp ? """
        numberOfParticipation: Int!
        actualYearOfStudy: Int!

        """ Does this user is in is last year of study ? """
        isInLastYearOfStudy: Boolean

        """ Does this user totally paid his participation fees ? """
        hasTotalyPayed: Boolean

        """ How much of his participation fees does this user already paid ? """
        amountPayed:Float

        """ Role the User has. By default it's Participant. it will be different only if the user is a staff member """
        role: Role!

        """ City the User belongs to """
        city: City!

        """ local church the user belongs to """
        church: Church!
        
        createdAt: String!
        updatedAt: String!
    }

    """ Role a user can have. """
    type Role {
        _id: ID!
        name: String!
        description: String!

        """ users playing this role """
        users: [User!]
        
        createdAt: String!
        updatedAt: String!
    }

    """ City in the where user can come from or local church can be. """
    type City {
        _id: ID!
        name: String!
        description: String!

        """ churches int this location """
        churches: [Church!]

        """ users int this location """
        users: [User!]
        
        createdAt: String!
        updatedAt: String!
    }

    """ local church users can come from """
    type Church {
        _id: ID!
        name: String!
        description: String!

        """ name contactenated with the city name for differenting churches of the same familly """
        fullName: String!

        """ city where this church is located """
        city: City!

        """ users belonging to this local church """
        users: [User!]
        
        createdAt: String!
        updatedAt: String!
    }
    # ******************************* Output Data Shema *************************************
    
    """ Data that will be send to the user once he is authenticated """
    type AuthData {

        """ token to store in the front end for the next queries """
        token: String!
        userId: String!
    }

    """ all users of the app + numbers of these users for pagination """
    type UserData {
        users: [User!]!
        totalUsers: Int!
    }

    """ all roles of the app + numbers of these users for pagination """
    type RoleData {
        roles: [Role!]!
        totalRoles: Int!
    }

    """ all cities of the app + numbers of these users for pagination """
    type CityData {
        cities: [City!]!
        totalCities: Int!
    }

    """ all churches of the app + numbers of these users for pagination """
    type ChurchData {
        Churches: [Church!]!
        totalChurches: Int!
    }

    # ******************************* Input Data Shema *************************************
    input UserInputData {

        """ Must have at least 3 character """
        firstName: String!

        """ Must have at least 3 character """
        lastName: String!
        birthDate: String
        email: String!

        """ Must be F or M """
        sexe: String!
        password: String
        imageUrl: String

        numberOfParticipation: Int!
        actualYearOfStudy: Int!
        isInLastYearOfStudy: Boolean
        hasTotalyPayed: Boolean
        amountPayed: Float

        """ _id of the role the User has """
        role: String

        """ _id of the city the User belongs to """
        city: String!

        """ _id of the local church the User belongs to """
        church: String
    }

    input RoleInputData {

        """ Must have at least 3 character """
        name: String!
        description: String
    }
    input ChurchInputData {

        """ Must have at least 3 character """
        name: String!
        description: String

        """ _id of the city the Church belongs to """
        city: String!
    }
    input CityInputData {

        """ Must have at least 3 character """
        name: String!
        description: String
    }

# ******************************* ROOT Data Shema *************************************
    type RootQuery {

        """ get a city by his _id """
        city(id: ID!): City!

        """ get a church by his _id """
        church(id: ID!): Church!

        """ get a role by his _id """
        role(id: ID!): Role!

        """ for authenticating user """
        login(email: String!, password: String!): AuthData!

        """ get a user by his _id """
        user(id:ID!): User!

        """ get all users of the app with pagination, just don't set page number if you don't want to use pagination """
        users(page: Int): UserData!

        """ get all cities of the app with pagination, just don't set page number if you don't want to use pagination """
        cities(page: Int): CityData!

        """ get all churches of the app with pagination, just don't set page number if you don't want to use pagination """
        churches(page: Int): ChurchData!
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

        # deleteUser(id: ID!): Boolean
        # deleteRole(id: ID!): Boolean
        # deleteCity(id: ID!): Boolean
        # deleteChurch(id: ID!): Boolean
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
