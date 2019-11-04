import { ApolloServer } from 'apollo-server'
import { Person } from '../../database/models/Person'
import { context } from '../context'
import { typeDefs } from '../typeDefs'

// Case 2: Dataloaders
const resolvers = {
    Query: {
        person: async (_, { id }, context) => {
            return context.loaders.persons.load(id)
        },
    },
    Person: {
        friends: async (p: Person, _, context) => {
            const friendIds = await context.loaders.friendIdsForPerson.load(p.id)
            return context.loaders.persons.loadMany(friendIds)
        },
    },
}

export const case2 = new ApolloServer({
    typeDefs,
    resolvers,
    context,
})
