import { define } from 'typeorm-seeding';
import { Officer } from '@entity';
import { internet } from 'faker';

define(Officer, () => {
  const officer = new Officer();
  officer.username = internet.userName();
  officer.password = 'password';
  return officer;
});
