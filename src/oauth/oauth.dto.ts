import { z } from "nestjs-zod/z";
import { createZodDto } from "nestjs-zod";

const OAuthLoginSchema = z.object({
  client_id: z.string().uuid(),
  redirect_uri: z.string().url(),
});

export class OAuthLoginDto extends createZodDto(OAuthLoginSchema) {}
