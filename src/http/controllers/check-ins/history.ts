import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from "zod"
import { makeFetchUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-in-history-use-case'

export async function history(request: FastifyRequest, reply:FastifyReply) {
    const checkInHistoryQuerySchema = z.object({
      q: z.string(),
      page: z.coerce.number().min(1).default(1),
    })
  
    const { page } = checkInHistoryQuerySchema.parse(request.query)

    const checkInHistoryUseCase = makeFetchUserCheckInsHistoryUseCase()

    const { checkIns} = await checkInHistoryUseCase.execute({
        userId: request.user.sub,
        page
    })
  
    return reply.status(201).send({
        checkIns
    })
  }