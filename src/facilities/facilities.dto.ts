import { z } from "nestjs-zod/z";
import { createZodDto } from "nestjs-zod";

// `:id`에 대한 Zod 스키마
const FacilitiesParamSchema = z.object({
  id: z.string().uuid(),
});
export class FacilitiesParamDto extends createZodDto(FacilitiesParamSchema) {}

const FaciltySchema = z.object({});
