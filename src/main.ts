import "dotenv/config";

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { IoAdapter } from "@nestjs/platform-socket.io";

export class SocketIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    return super.createIOServer(port, options);
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useWebSocketAdapter(new SocketIoAdapter(app));
  await app.listen(3000);
}
bootstrap().then();
