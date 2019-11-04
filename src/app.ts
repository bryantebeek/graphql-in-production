import { showQueryLogs, resetQueryIndex, getQueryIndex } from './database/sequelize'
import { case1 } from './graphql/cases/1'
import { case2 } from './graphql/cases/2'
import { case3 } from './graphql/cases/3'
import { case5 } from './graphql/cases/5'
import { ApolloServer } from 'apollo-server'

export const run = async () => {
    // showQueryLogs()

    // case1.listen()
    // case2.listen()
    // case3.listen()
    case5.listen()

    await benchmark(
        [
            // Simple finds using Sequelize
            case1,
            // Using dataloaders with Query / Relation dataloading
            case2,
            // Using dataloaders with Field dataloading
            case3,
        ],
        `
            query {
                person(id: 1) {
                    friends {
                        friends {
                            friends {
                                id
                            }
                        }
                    }
                }
            }
        `
    )
}

const benchmark = async (cases: ApolloServer[], query: string) => {
    for (const [index, c] of Object.entries(cases)) {
        resetQueryIndex()

        await c.executeOperation({
            query,
        })

        console.log(`Case ${parseInt(index, 10) + 1} has done ${getQueryIndex()} queries`)
    }
}
