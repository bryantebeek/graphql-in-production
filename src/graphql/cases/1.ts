import { ApolloServer } from 'apollo-server'
import { Person } from '../../database/models/Person'
import { context } from '../context'
import { typeDefs } from '../typeDefs'

const resolvers = {
    Query: {
        person: async (_, { id }) => {
            return Person.findOne({ where: { id } })
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
