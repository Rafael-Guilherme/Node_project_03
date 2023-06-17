import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let GymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Search Gyms Use Case', () => {
    beforeEach(async () => {
        GymsRepository = new InMemoryGymsRepository()
        sut = new FetchNearbyGymsUseCase(GymsRepository)
    })

    it('should be able to fetch nearby gyms', async () => {
        await GymsRepository.create({
            title: 'Near Gym',
            description: null,
            phone: null,
            latitude: -22.7791623,
            longitude: -43.3760058,
        })

        await GymsRepository.create({
            title: 'Far Gym',
            description: null,
            phone: null,
            latitude: -27.7791623,
            longitude: -49.3760058,
        })

        const { gyms } = await sut.execute({
            userLatitude: -22.7791623,
            userLongitude: -43.3760058,
        })

        expect(gyms).toHaveLength(1)
        expect(gyms).toEqual([
            expect.objectContaining({ title: 'Near Gym'}),
        ])
    })
})