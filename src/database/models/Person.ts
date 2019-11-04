import { BelongsToMany, Column, Model, Table, ForeignKey } from 'sequelize-typescript'
import { BelongsToManyAddAssociationMixin, BelongsToManyGetAssociationsMixin } from 'sequelize/types'
import { Friendship } from './Friendship'
import { User } from './User'

@Table
export class Person extends Model<Person> {
    @Column
    name: string

    @Column
    phonenumber: number

    @BelongsToMany(() => Person, () => Friendship, 'personId', 'friendId')
    friends: Person[]

    @ForeignKey(() => User)
    @Column
    userId: number

    addFriend: BelongsToManyAddAssociationMixin<Person, number>
    getFriends: BelongsToManyGetAssociationsMixin<Person>
}
