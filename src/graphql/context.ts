import { Person } from '../database/models/Person'
import { createAssociationDataLoader, createModelDataLoader } from './dataloaders'
import { resetQueryIndex } from '../database/sequelize'
import { User } from '../database/models/User'

export const context = async () => {
    resetQueryIndex()

    return {
        user: await User.findOne({ where: { id: 1 } }),
        loaders: {
            users: createModelDataLoader(User),
            userIdForPerson: createAssociationDataLoader(Person, 'user'),
            persons: createModelDataLoader(Person),
            friendIdsForPerson: createAssociationDataLoader(Person, 'friends'),
        },
    }
}
