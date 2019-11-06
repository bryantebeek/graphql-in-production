import DataLoader from 'dataloader'
import { Model, ModelCtor } from 'sequelize-typescript'

export function createModelDataLoader<T extends Model<any, any>>(model: ModelCtor<T>): DataLoader<number, T> {
    return new DataLoader(async (ids: number[]) => {
        const models = await model.findAll<T>({ where: { id: ids } })

        return ids.map(id => models.find(m => m.id === id))
    })
}

export function createAssociationDataLoader<T extends Model<any, any>>(
    model: ModelCtor<T>,
    association: string
): DataLoader<number, T> {
    return new DataLoader(async (ids: number[]) => {
        const models = await model.findAll({
            where: { id: ids },
            include: [{ association }],
        })

        return ids.map(id => {
            const model = models.find(p => p.id.toString() === id.toString())

            if (!model[association]) return null

            return Array.isArray(model[association]) ? model[association].map(m => m.id) : model[association].id
        })
    })
}
