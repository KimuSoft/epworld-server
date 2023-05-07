import { z } from "zod";
import { createZodDto } from "nestjs-zod";

const UsersParamSchema = z.object({
  id: z.string(),
});
export class UsersParamDto extends createZodDto(UsersParamSchema) {}

// POST api/users/:id
const CreateUserSchema = z.object({
  username: z.string(),
  avatar: z.string(),
});
export class CreateUserDto extends createZodDto(CreateUserSchema) {}

// PATCH api/users/:id
const UpdateUserSchema = z.object({
  username: z.string().nullable(),
  avatar: z.string().nullable(),
});
export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
