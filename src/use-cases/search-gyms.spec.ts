import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { SearchGymsUseCase } from './search-gyms'

let GymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
    beforeEach(async () => {
        GymsRepository = new InMemoryGymsRepository()
        sut = new SearchGymsUseCase(GymsRepository)
    })

    it('should be able to search for gyms', async () => {
        await GymsRepository.create({
            title: 'Javascript Gym',
            description: null,
            phone: null,
            latitude: -22.7791623,
            longitude: -43.3760058,
        })

        await GymsRepository.create({
            title: 'Typescript Gym',
            description: null,
            phone: null,
            latitude: -22.7791623,
            longitude: -43.3760058,
        })

        const { gyms } = await sut.execute({
            query: 'Javascript',
            page: 1,
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Javascript Gym'}),
        ])
    })

    it('should be able to fetch paginated gyms search', async () => {
        for (let i = 1; i <= 22; i++) {
            await GymsRepository.create({
                title: `Javascript Gym ${i}`,
                description: null,
                phone: null,
                latitude: -22.7791623,
                longitude: -43.3760058,
            })
        }

        const { gyms } = await sut.execute({
            query: 'Javascript',
            page: 2
        })

        expect(gyms).toHaveLength(2)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Javascript Gym 21'}),
            expect.objectContaining({ title: 'Javascript Gym 22'})
        ])
    })
})