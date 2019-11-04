import { Person } from '../database/models/Person'
import { createAssociationDataLoader, createModelDataLoader } from './dataloaders'
import { resetQueryIndex } from '../database/sequelize'
import { d } from '../debug'

export const context = () => {
    resetQueryIndex()

    return {
        loaders: {
            persons: createModelDataLoader(Person),
            friendIdsForPerson: createAssociationDataLoader(Person, 'friends'),
        },
    }
}
