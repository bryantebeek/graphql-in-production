import { BelongsTo, Column, Model, Table, ForeignKey } from 'sequelize-typescript'
import { HasOneGetAssociationMixin, HasOneSetAssociationMixin } from 'sequelize/types'
import { Person } from './Person'

@Table
export class User extends Model<User> {
    @Column
    username: string

    @Column
    bsn: string

    @BelongsTo(() => Person)
    person: Person

    @ForeignKey(() => Person)
    @Column
    personId: number

    setPerson: HasOneSetAssociationMixin<Person, number>
    getPerson: HasOneGetAssociationMixin<Person>
}
