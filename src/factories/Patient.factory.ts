import { define } from 'typeorm-seeding';
import { Patient } from '../entities';
import { name, date, datatype, address, phone } from 'faker';
import { formatISO, subYears } from 'date-fns';

define(Patient, () => {
  const patient = new Patient();
  patient.firstName = name.firstName();
  patient.lastName = name.lastName();
  patient.birthDate = formatISO(date.past(70, subYears(new Date(), 10)), { representation: 'date' });
  patient.identification = datatype.uuid();
  patient.subDistrict = address.streetAddress();
  patient.district = address.streetName();
  patient.province = address.cityName();
  patient.zipCode = address.zipCode();
  patient.tel = phone.phoneNumber();
  patient.sex = name.gender();
  return patient;
});
