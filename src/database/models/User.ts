import { Column, HasOne, Model, Table } from 'sequelize-typescript'
import { Person } from './Person'
import { HasOneSetAssociationMixin, HasOneGetAssociationMixin } from 'sequelize/types'

@Table
export class User extends Model<User> {
    @Column
    username: string

    @Column
    password: string

    @HasOne(() => Person)
    person: Person

    setPerson: HasOneSetAssociationMixin<Person, number>
    getPerson: HasOneGetAssociationMixin<Person>
}
