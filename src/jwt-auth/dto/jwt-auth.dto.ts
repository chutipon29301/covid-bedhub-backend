export type AccountType = 'reporter' | 'staff' | 'queue_manager' | 'code_generator';

export interface JwtPayload {
  id: number;
  accountType: AccountType;
  hasProfile?: boolean;
}

export interface JwtTokenInfo {
  token: string;
  expireDate: Date;
}
