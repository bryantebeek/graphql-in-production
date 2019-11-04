import { ApolloServer } from 'apollo-server'
import { context } from '../context'
import { typeDefs } from '../typeDefs'

// Case 3: Dataloaders, the smarter way (field based)
const resolvers = {
    Query: {
        person: async (_, { id }) => {
            return id
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

export const case3 = new ApolloServer({
    typeDefs,
    resolvers,
    context,
})
