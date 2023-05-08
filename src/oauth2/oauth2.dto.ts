import { z } from "nestjs-zod/z";
import { createZodDto } from "nestjs-zod";

const OAuth2LoginSchema = z.object({
  client_id: z.string().uuid(),
  redirect_uri: z.string().url(),
});

export class OAuth2LoginDto extends createZodDto(OAuth2LoginSchema) {}
