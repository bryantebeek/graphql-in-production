import 'reflect-metadata'
import { BelongsToMany, Column, ForeignKey, Model, Sequelize, Table, ModelType, ModelCtor } from 'sequelize-typescript'
import { BelongsToManyAddAssociationMixin, BelongsToManyGetAssociationsMixin } from 'sequelize/types'
import { d } from './debug'
import DataLoader from 'dataloader'
import { ApolloServer, gql } from 'apollo-server'

const sequelize = new Sequelize({
    database: 'postgres',
    dialect: 'postgres',
    username: 'postgres',
    password: 'secret',
    logging: true,
})

@Table
class Person extends Model<Person> {
    @Column
    name: string

    @BelongsToMany(() => Person, () => Friendship, 'personId', 'friendId')
    friends: Person[]

    @BelongsToMany(() => Person, () => Friendship, 'friendId', 'personId')
    friendOf: Person[]

    addFriend: BelongsToManyAddAssociationMixin<Person, number>
    getFriends: BelongsToManyGetAssociationsMixin<Person>
}

@Table
class Friendship extends Model<Friendship> {
    @ForeignKey(() => Person)
    @Column
    personId: number

    @ForeignKey(() => Person)
    @Column
    friendId: number
}

sequelize.addModels([Person, Friendship])

const typeDefs = gql`
    type Person {
        id: String
        name: String
        friends: [Person]
    }

    type Query {
        person(id: String): Person
    }
`

// Case 1: Simple finds
// const context = () => {
//     d('======= GraphQL Request =======')
//     return {}
// }
// const resolvers = {
//     Query: {
//         person: async (_, { id }) => {
//             return Person.findOne({ where: { id } })
//         },
//     },
//     Person: {
//         friends: async (person: Person) => {
//             return person.getFriends()
//         },
//     },
// }

// Case 2: Dataloaders
// function createModelDataloader<T extends Model<any, any>>(model: ModelCtor<T>): DataLoader<number, T> {
//     return new DataLoader(async (ids: number[]) => {
//         const models = await model.findAll<T>({ where: { id: ids } })

//         return ids.map(id => models.find(m => m.id.toString() === id.toString()))
//     })
// }

// const context = () => {
//     d('======= GraphQL Request =======')

//     return {
//         loaders: {
//             persons: createModelDataloader(Person),
//             friendIdsForPerson: new DataLoader<number, number[]>(async (ids: number[]) => {
//                 const persons = await Person.findAll({
//                     where: { id: ids },
//                     include: [{ association: 'friends' }],
//                 })

//                 return ids.map(id => {
//                     const person = persons.find(p => p.id.toString() === id.toString())
//                     return person.friends.map(f => f.id)
//                 })
//             }),
//         },
//     }
// }

// const resolvers = {
//     Query: {
//         person: async (_, { id }, context) => {
//             return context.loaders.persons.load(parseInt(id, 10))
//         },
//     },
//     Person: {
//         friends: async (p: Person, _, context) => {
//             const friendIds = await context.loaders.friendIdsForPerson.load(p.id)
//             return context.loaders.persons.loadMany(friendIds)
//         },
//     },
// }

// Case 3: Dataloaders, the smarter way (field based)
function createModelDataloader<T extends Model<any, any>>(model: ModelCtor<T>): DataLoader<number, T> {
    return new DataLoader(async (ids: number[]) => {
        const models = await model.findAll<T>({ where: { id: ids } })

        return ids.map(id => models.find(m => m.id === id))
    })
}

const context = () => {
    d('======= GraphQL Request =======')

    return {
        loaders: {
            persons: createModelDataloader(Person),
            friendIdsForPerson: new DataLoader<number, number[]>(async (ids: number[]) => {
                const persons = await Person.findAll({
                    where: { id: ids },
                    include: [{ association: 'friends' }],
                })

                return ids.map(id => {
                    const person = persons.find(p => p.id === id)
                    return person.friends.map(f => f.id)
                })
            }),
        },
    }
}

const resolvers = {
    Query: {
        person: async (_, { id }) => {
            return parseInt(id, 10)
        },
    },
    Person: {
        id: async (personId: string) => {
            return parseInt(personId, 10)
        },
        name: async (personId: string, _, context) => {
            const { name } = await context.loaders.persons.load(parseInt(personId, 10))
            return name
        },
        friends: async (personId: string, _, context) => {
            return await context.loaders.friendIdsForPerson.load(parseInt(personId, 10))
        },
    },
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
})
;(async () => {
    await sequelize.sync({ force: true })

    const bryan = new Person({
        name: 'Bryan',
    })

    const peter = new Person({
        name: 'Peter',
    })

    const leon = new Person({
        name: 'Leon',
    })

    await bryan.save()
    await peter.save()
    await leon.save()

    await bryan.addFriend(peter)
    await peter.addFriend(bryan)
    await bryan.addFriend(leon)
    await leon.addFriend(peter)

    server.listen().then(({ url }) => d(`Server is running on ${url}`))

    d('')
    d('=======================================')
    d('=             Useful logs             =')
    d('=======================================')
    d('')
})()
