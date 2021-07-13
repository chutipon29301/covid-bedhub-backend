import { define } from 'typeorm-seeding';
import { AccessCode } from '@entity';
import { nanoid } from 'nanoid';

define(AccessCode, () => {
  const accessCode = new AccessCode();
  accessCode.accessCode = nanoid(6);
  return accessCode;
});
