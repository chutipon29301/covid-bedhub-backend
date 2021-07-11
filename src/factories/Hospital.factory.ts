import { define } from 'typeorm-seeding';
import { Hospital } from '../entities';
import { company, address, phone } from 'faker';

define(Hospital, () => {
  const hospital = new Hospital();
  hospital.name = company.companyName();
  hospital.subDistrict = address.streetAddress();
  hospital.district = address.streetName();
  hospital.province = address.cityName();
  hospital.zipCode = address.zipCode();
  hospital.tel = phone.phoneNumber();
  return hospital;
});
