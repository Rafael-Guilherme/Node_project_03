import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error'
import { ResourceNotFoundError } from './errors/resources-not-found-error'
import { ValidateCheckInUseCase } from './validate-check-in'

let checkInRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('Validate Check-in Use Case', () => {
    beforeEach(async () => {
        checkInRepository = new InMemoryCheckInsRepository()
        sut = new ValidateCheckInUseCase(checkInRepository)

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it('should be able to validate the check-in', async () => {
        const createdCheckIn = await checkInRepository.create({
            gym_id: 'gym-01',
            user_id: 'user_01'
        })

        const { checkIn } = await sut.execute({
            checkInId: createdCheckIn.id
        })

        expect(checkIn.validated_at).toEqual(expect.any(Date))
        expect(checkInRepository.items[0].validated_at).toEqual(expect.any(Date))
    })

    it('should not be able to validate as inexistent the check-in', async () => {
        await expect(() => 
            sut.execute({
                checkInId: 'inexistent-check-in-id'
            })
        ).rejects.toBeInstanceOf(ResourceNotFoundError)
    })

    it('should not be able to validate the check-in after 20 minutes of its creation', async () =>  {
        vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

        const createdCheckIn = await checkInRepository.create({
            gym_id: 'gym-01',
            user_id: 'user_01'
        })

        const twentyOneMinutesInMs = 1000 * 60 * 21

        vi.advanceTimersByTime(twentyOneMinutesInMs)

        await expect(() => 
            sut.execute({
                checkInId: createdCheckIn.id
            })
        ).rejects.toBeInstanceOf(LateCheckInValidationError)
    })
})