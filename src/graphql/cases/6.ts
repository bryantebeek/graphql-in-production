import { ApolloServer } from 'apollo-server'
import { Person } from '../../database/models/Person'
import { context } from '../context'
import { typeDefs } from '../typeDefs'

// Case 6: Graph traversal
const resolvers = {
    Query: {
        authenticatedUser: (__, _, context) => {
            return context.user.id
        },
        person: async (_, { id }) => {
            return id
        },
        people: async (_, { limit = 2, offset = 0 }) => {
            const people = await Person.findAll()

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
            return await context.loaders.friendIdsForPerson.load(personId)
        },
        user: async (personId: number, _, context) => {
            return await context.loaders.userIdForPerson.load(personId)
        },
    },
    User: {
        id: async (userId: number) => {
            return userId
        },
        username: async (userId: number, _, context) => {
            const { username } = await context.loaders.users.load(userId)
            return username
        },
        bsn: async (userId: number, _, context) => {
            // Case 6: Graph Traversal
            // if (context.user.id !== userId) return

            const { bsn } = await context.loaders.users.load(userId)
            return bsn
        },
        person: async (userId: number, _, context) => {
            const { personId } = await context.loaders.users.load(userId)
            return personId
        },
    },
}

export const case6 = new ApolloServer({
    typeDefs,
    resolvers,
    context,
})
