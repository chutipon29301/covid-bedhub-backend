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
  hospital.location = {
    type: 'Point',
    coordinates: [
      +address.latitude(14.027042515728189, 13.601417374036716, 16),
      +address.longitude(100.71115049015863, 100.37588622565592, 16),
    ],
  };
  return hospital;
});