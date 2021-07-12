import { define } from 'typeorm-seeding';
import { Reporter } from '../entities';
import { finance } from 'faker';

define(Reporter, () => {
  const reporter = new Reporter();
  reporter.lineId = finance.bitcoinAddress();
  return reporter;
});
