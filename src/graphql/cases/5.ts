import express from 'express'
import helmet from 'helmet'
import { ApolloServer, ApolloError } from 'apollo-server-express'
import rateLimit from 'express-rate-limit'
import depthLimit from 'graphql-depth-limit'
import { createComplexityLimitRule } from 'graphql-validation-complexity'
import { context } from '../context'
import { typeDefs } from '../typeDefs'
import { Person } from '../../database/models/Person'
import { Sequelize } from 'sequelize-typescript'
import { sequelize } from '../../database/sequelize'
import { take } from 'lodash'

// Case 5: Protecting GraphQL Queries
const resolvers = {
    Query: {
        person: async (_, { id }) => {
            return id
        },
        people: async (_, { limit = 2, offset = 0 }) => {
            // const people = await Person.findAll()

            // Step 4: Masking errors
            const people = await sequelize.query<Person>('SELECT * FROM Person', { model: Person })

            // Step 5: Enforcing pagination
            // const people = await Person.findAll({ limit: Math.min(limit, 3), offset })

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
        friends: async (personId: number, { limit = 10, offset = 0 }, context) => {
            // Step 5: Enforcing pagination
            const ids = await context.loaders.friendIdsForPerson.load(personId)
            return ids.slice(offset, offset + Math.min(limit, 10))

            // return context.loaders.friendIdsForPerson.load(personId)
        },
    },
}

const app = express()

const apollo = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    validationRules: [
        // Step 1: Query depth protection
        // depthLimit(3),
        // Step 2: Query complexity protection
        // Object = 10, field = 1
        // createComplexityLimitRule(20),
    ],
    // introspection: false, // Step 3: Disabling the introspection query

    // Step 4: Masking errors in production
    // debug: false,
    formatError: error => {
        // e.g. log to Sentry
        console.log(error)

        const isProduction = () => true // process.env.NODE_ENV === 'production'

        if (isProduction()) {
            // This is blacklisting
            if (error.extensions.exception.name === 'SequelizeDatabaseError') {
                return new Error('Something went wrong!')
            }

            // This is whitelisting
            if (error.extensions.exception.name === 'InputValidationError') {
                return error
            }

            return new Error('Something went wrong!')
        }
    },
})

// Step 6: Rate limiting
app.use(
    // can use redis, memcached, mongo, etc.
    // default is in-memory
    rateLimit({
        windowMs: 5 * 1000, // 5 seconds
        max: 2, // max 2 request
    })
)

// Step 7 (extra): Helmet
// https://helmetjs.github.io/
// app.use(helmet())

apollo.applyMiddleware({ app })

export const case5 = app
