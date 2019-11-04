import 'reflect-metadata'
import { run } from './app'
import { seed } from './database/seed'
import { sequelize } from './database/sequelize'

;(async () => {
    await sequelize.sync({ force: true })

    await seed()

    await run()
})()
