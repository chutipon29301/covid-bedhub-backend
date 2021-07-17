import { define } from 'typeorm-seeding';
import { Officer } from '@entity';
import { internet, name } from 'faker';

define(Officer, () => {
  const officer = new Officer();
  officer.username = internet.userName();
  officer.password = 'password';
  officer.firstName = name.firstName();
  officer.lastName = name.lastName();
  return officer;
});
