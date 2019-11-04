import { ApolloServer } from 'apollo-server'
import depthLimit from 'graphql-depth-limit'
import { createComplexityLimitRule } from 'graphql-validation-complexity'
import { context } from '../context'
import { typeDefs } from '../typeDefs'
import { Person } from '../../database/models/Person'

// Case 5: Protecting GraphQL Queries
const resolvers = {
    Query: {
        person: async (_, { id }) => {
            return id
        },
        people: async (_, { limit = 2, offset = 0 }) => {
            const people = await Person.findAll()
            // const people = await Person.findAll({ limit: Math.min(limit, 3), offset }) // Step 5: Enforcing pagination
            return people.map(person => person.id).flat()
        },
    },
    Person: {
        id: async (personId: number) => {
            return personId
        },
        name: async (personId: number, _, context) => {
            const { name } = await context.loaders.persons.load(personId)
            return name
        },
        friends: async (personId: number, _, context) => {
            return await context.loaders.friendIdsForPerson.load(personId)
        },
    },
}

export const case5 = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    validationRules: [
        // depthLimit(3), // Step 1: Query depth protection
        // createComplexityLimitRule(20), // Step 2: Query complexity protection
    ],
    // introspection: false, // Step 3: Disabling the introspection query
    // formatError: error => { // Step 4: Masking errors in production
    //     console.log(error)

    //     const isProduction = true

    //     if (isProduction) {
    //         return new Error('Something went wrong!')
    //     }
    // },
})
