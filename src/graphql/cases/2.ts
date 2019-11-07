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
        people: async (_, { limit = 2, offset = 0 }, context) => {
            const people = await Person.findAll({ attributes: ['id'], limit: Math.min(limit, 3), offset })
            return context.loaders.persons.loadMany(people.map(p => p.id))
        },
    },
    Person: {
        friends: async (person: Person, _, context) => {
            const friendIds = await context.loaders.friendIdsForPerson.load(person.id)
            return context.loaders.persons.loadMany(friendIds)
        },
    },
}

export const case2 = new ApolloServer({
    typeDefs,
    resolvers,
    context,
})
