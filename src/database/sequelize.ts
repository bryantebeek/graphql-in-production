import { Sequelize } from 'sequelize-typescript'
import { Friendship } from './models/Friendship'
import { Person } from './models/Person'
import colors from 'colors'
import { User } from './models/User'

let logQueries = false
let queryIndex = 0

export const showQueryLogs = () => {
    logQueries = true
}

export const resetQueryIndex = () => {
    queryIndex = 0
}

export const getQueryIndex = () => {
    return queryIndex
}

export const sequelize = new Sequelize({
    database: 'postgres',
    dialect: 'postgres',
    username: 'postgres',
    password: 'secret',
    models: [User, Person, Friendship],
    logging: query => {
        queryIndex++

        if (!logQueries) return

        query = query.replace('SELECT', colors.cyan('SELECT'))
        query = query.replace('FROM', colors.cyan('FROM'))

        console.log(colors.green(`Query ${queryIndex}:`))
        console.log(colors.gray(query))
    },
})
