import { gql } from 'apollo-server'

export const typeDefs = gql`
    type User {
        id: Int
        username: String
        email: String
        person: Person
    }

    type Person {
        id: Int
        name: String
        friends(limit: Int, offset: Int): [Person]
    }

    type Query {
        person(id: Int!): Person
        people(limit: Int, offset: Int): [Person]
        takes5sec: Boolean
    }
`
