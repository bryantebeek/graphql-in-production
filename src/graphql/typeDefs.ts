import { gql } from 'apollo-server'

export const typeDefs = gql`
    type User {
        id: Int
        username: String
        bsn: String
        person: Person
    }

    type Person {
        id: Int
        name: String
        friends(limit: Int, offset: Int): [Person]
        user: User
    }

    type Query {
        authenticatedUser: User
        person(id: Int!): Person
        people(limit: Int, offset: Int): [Person]
    }
`
