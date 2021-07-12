import { define } from 'typeorm-seeding';
import { Profile } from '../entities';
import { finance } from 'faker';

define(Profile, () => {
  const profile = new Profile();
  profile.lineId = finance.bitcoinAddress();
  return profile;
});
