import { showQueryLogs, resetQueryIndex, getQueryIndex } from './database/sequelize'
import { case1 } from './graphql/cases/1'
import { case2 } from './graphql/cases/2'
import { case3 } from './graphql/cases/3'
import { case4 } from './graphql/cases/4'
import { case5 } from './graphql/cases/5'
import { case6 } from './graphql/cases/6'
import { ApolloServer } from 'apollo-server'
import { nonExecutableDefinitionMessage } from 'graphql/validation/rules/ExecutableDefinitions'

export const run = async () => {
    showQueryLogs()

    // Demo 1-3
    case1.listen()
    // case2.listen()
    // case3.listen()

    // Demo 4: Persisted queries
    // case4.listen()

    // Demo 5: Security
    // case5.listen(4000)

    // Demo 6: Graph Traversal
    // case6.listen(4000)

    await benchmark(
        [
            // case1,
            // case2,
            // case3,
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

        // - 1 to account for the loggedin user query
        console.log(`Case ${parseInt(index, 10) + 1} has done ${getQueryIndex() - 1} queries`)
    }
}
