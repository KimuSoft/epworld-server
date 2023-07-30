import { z } from "nestjs-zod/z";
import { createZodDto } from "nestjs-zod";

const LoginByDiscordBotSchema = z.object({
  id: z.string(),
  username: z.string(),
  avatar: z.string().url(),
});

export class LoginByDiscordBotDto extends createZodDto(
  LoginByDiscordBotSchema
) {}
