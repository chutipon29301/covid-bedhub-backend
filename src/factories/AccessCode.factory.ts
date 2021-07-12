import { define } from 'typeorm-seeding';
import { AccessCode } from '../entities';
import { nanoid } from 'nanoid';

define(AccessCode, () => {
  const accessCode = new AccessCode();
  accessCode.accessCode = nanoid(6);
  return accessCode;
});
