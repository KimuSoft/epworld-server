import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UsersService } from "./users.service";

@Controller("api/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get("me")
  getMe(@Request() req) {
    return req.user;
  }

  @Get(":id")
  async getUser(@Param("id") id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException("User not found");

    return this.usersService.getJSON(user);
  }
}
