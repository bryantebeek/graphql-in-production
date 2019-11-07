import { ApolloServer } from 'apollo-server'
import { Person } from '../../database/models/Person'
import { context } from '../context'
import { typeDefs } from '../typeDefs'
import { getQueryIndex } from '../../database/sequelize'

// Case 1: N+1 problem
const resolvers = {
    Query: {
        person: async (_, { id }) => {
            return Person.findOne({ where: { id } })
        },
        people: async (_, { limit = 2, offset = 0 }) => {
            return await Person.findAll({ limit: Math.min(limit, 3), offset })
        },
    },
    Person: {
        friends: async (person: Person) => {
            return person.getFriends()
        },
    },
}

export const case1 = new ApolloServer({
    typeDefs,
    resolvers,
    context,
})
