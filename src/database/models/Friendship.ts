import { Model, Table, ForeignKey, Column } from 'sequelize-typescript'
import { Person } from './Person'

@Table
export class Friendship extends Model<Friendship> {
    @ForeignKey(() => Person)
    @Column
    personId: number

    @ForeignKey(() => Person)
    @Column
    friendId: number
}
