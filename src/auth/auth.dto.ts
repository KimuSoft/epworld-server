import { z } from "zod";
import { createZodDto } from "nestjs-zod";

const LoginDiscordBotSchema = z.object({
  id: z.string(),
  username: z.string(),
  avatar: z.string().url(),
});

export class LoginDiscordBotDto extends createZodDto(LoginDiscordBotSchema) {}
