import { z } from "nestjs-zod/z";
import { createZodDto } from "nestjs-zod";

const ItemsParamSchema = z.object({
  id: z.string().uuid(),
});
export class ItemsParamDto extends createZodDto(ItemsParamSchema) {}
