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
