import { define } from 'typeorm-seeding';
import { Patient } from '@entity';
import { name, date, datatype, phone } from 'faker';
import { formatISO, subYears } from 'date-fns';

define(Patient, () => {
  const patient = new Patient();
  patient.firstName = name.firstName();
  patient.lastName = name.lastName();
  patient.birthDate = formatISO(date.past(70, subYears(new Date(), 10)), { representation: 'date' });
  patient.identification = datatype.uuid();
  patient.tel = phone.phoneNumber();
  patient.sex = name.gender();
  return patient;
});
