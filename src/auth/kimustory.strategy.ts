import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import * as OAuth2Strategy from "passport-oauth2";
import axios from "axios";

const server = "https://account.kimustory.dev";

interface KimustoryProfile {
  id: number;
  social_id: string;
  username: string;
  avatar: string;
  created_at: string;
  updated_at: string;
}

@Injectable()
export class KimustoryStrategy extends PassportStrategy(
  OAuth2Strategy,
  "kimustory"
) {
  constructor(private authService: AuthService) {
    super({
      authorizationURL: server + "/api/oauth2/authorize",
      tokenURL: server + "/api/oauth2/token",
      clientID: process.env.KIMUSTORY_CLIENT_ID,
      clientSecret: process.env.KIMUSTORY_CLIENT_SECRET,
      callbackURL: process.env.KIMUSTORY_CALLBACK_URL,
      scope: "identify",
    });
  }

  async userProfile(token: string, done) {
    const res = await axios.get(server + "/api/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    done(null, res.data);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: KimustoryProfile
  ) {
    console.log("까꿍꿍");
    console.log(profile);
    return this.authService.validateUser(
      "kimustory",
      profile.id.toString(),
      profile.username,
      profile.avatar
    );
  }
}
