export const context = {
    loaders: {},
}

export const resolvers = {
    Query: {
        person: async (_, { id }) => {
            return Person.findOne({ where: { id } })
        },
        people: async () => {
            return Person.findAll()
        },
    },
    Person: {
        friends: async (person: Person) => {
            return person.getFriends()
        },
    },
}
