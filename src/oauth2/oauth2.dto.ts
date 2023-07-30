import { z } from "nestjs-zod/z"
import { createZodDto } from "nestjs-zod"

const OAuth2LoginSchema = z.object({
  client_id: z.string().uuid(),
  redirect_uri: z.string().url(),
})

export class OAuth2LoginDto extends createZodDto(OAuth2LoginSchema) {}

const OAuth2AccessTokenSchema = z.object({
  code: z.string(),
  client_secret: z.string(),
})

export class OAuth2AccessTokenDto extends createZodDto(
  OAuth2AccessTokenSchema
) {}

const OAuth2ClientCreateSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  redirect_uris: z.array(z.string().url()).optional(),
})

export class OAuth2ClientCreateDto extends createZodDto(
  OAuth2ClientCreateSchema
) {}

const OAuth2ClientIdParamSchema = z.object({
  id: z.string().uuid(),
})

export class OAuth2ClientIdParamDto extends createZodDto(
  OAuth2ClientIdParamSchema
) {}
