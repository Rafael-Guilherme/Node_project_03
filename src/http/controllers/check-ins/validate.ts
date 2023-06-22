import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from "zod"
import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case'

export async function validate(request: FastifyRequest, reply:FastifyReply) {
    const validateCheckInParamsSchema = z.object({
        checkInId: z.string().uuid()
    })
  
    const { checkInId } = validateCheckInParamsSchema.parse(request.params)

    const validateCheckInUseCase = makevalidateCheckInUseCase()

    await validateCheckInUseCase.execute({
        gymId,
        userId: request.user.sub,
        userLatitude: latitude,
        userLongitude: longitude,
    })
  
    return reply.status(201).send()
  }