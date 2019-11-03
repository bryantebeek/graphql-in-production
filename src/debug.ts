import debug from 'debug'

export const d = (message: string) => {
    return debug('app')(message)
}
