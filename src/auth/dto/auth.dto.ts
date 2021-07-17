import { Field, InputType } from '@nestjs/graphql';

export class RequestTokenDto {
  code: string;
}

export class LineAccessToken {
  idToken: string;
  expireIn: number;
}

export class LineAccessTokenRequestResponse {
  expires_in: number;
  id_token: string;
}

@InputType()
export class LoginWithUsernameDto {
  @Field()
  username: string;

  @Field()
  password: string;
}
