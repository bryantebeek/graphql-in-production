import { ApolloServer } from 'apollo-server'
import { RedisCache } from 'apollo-server-cache-redis'
import { context } from '../context'
import { typeDefs } from '../typeDefs'
import { Person } from '../../database/models/Person'

// Case 4: Persisted Queries
const resolvers = {
    Query: {
        person: async (_, { id }) => {
            return id
        },
        people: async () => {
            const people = await Person.findAll({ attributes: ['id'] })
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
        friends: (personId: number, _, context) => {
            return context.loaders.friendIdsForPerson.load(personId)
        },
    },
}

export const case4 = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    persistedQueries: {
        cache: new RedisCache(),
    },
    cacheControl: { defaultMaxAge: 5 },
})
