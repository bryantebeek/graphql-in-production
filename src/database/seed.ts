import { Person } from './models/Person'

export const seed = async () => {
    const bryan = new Person({ name: 'Bryan' })
    const peter = new Person({ name: 'Peter' })
    const leon = new Person({ name: 'Leon' })
    const jesse = new Person({ name: 'Jesse' })
    const bibi = new Person({ name: 'Bibi' })

    await bryan.save()
    await peter.save()
    await leon.save()
    await jesse.save()
    await bibi.save()

    await bryan.addFriend(peter)
    await peter.addFriend(bryan)
    await bryan.addFriend(leon)
    await leon.addFriend(peter)
}
