import { z } from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod"

const PlacesParamSchema = z.object({
  id: z.string(),
})
export class PlacesParamDto extends createZodDto(PlacesParamSchema) {}

// POST api/places/:id
const CreatePlaceSchema = z.object({
  id: z.string().nullable(),
  name: z.string(),
  ownerId: z.string(),
  description: z.string(),
})
export class CreatePlaceDto extends createZodDto(CreatePlaceSchema) {}

// PATCH api/places/:id
const UpdatePlaceSchema = z.object({
  name: z.string().nullable(),
  description: z.string().nullable(),
})
export class UpdatePlaceDto extends createZodDto(UpdatePlaceSchema) {}

// POST api/places/:id/buy
const BuyPlaceSchema = z.object({
  userId: z.string().nullable(),
  amount: z.number().positive(),
})
export class BuyPlaceDto extends createZodDto(BuyPlaceSchema) {}

// DELETE api/places/:id/facilities/:facilityId
const DestroyFacilityParamSchema = PlacesParamSchema.extend({
  facilityId: z.string().uuid(),
})
export class DestroyFacilityParamDto extends createZodDto(
  DestroyFacilityParamSchema
) {}
