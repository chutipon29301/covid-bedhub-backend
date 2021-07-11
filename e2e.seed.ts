import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { AccessCode, Hospital, Officer, OfficerRole, UserType } from './src/entities';

export default class E2EApplicationSeeder implements Seeder {
  async run(factory: Factory, connection: Connection) {
    const hospitals = await factory(Hospital)().createMany(10);
    const codeGeneratorOfficer: Officer[] = [];
    const queueManagerOfficer: Officer[] = [];
    const staffOfficer: Officer[] = [];

    for (const hospital of hospitals) {
      const hospitalId = hospital.id;
      await factory(AccessCode)().create({ hospitalId, userType: UserType.QUEUE_MANAGER });
      await factory(AccessCode)().create({ hospitalId, userType: UserType.STAFF });
      codeGeneratorOfficer.push(await factory(Officer)().create({ role: OfficerRole.CODE_GENERATOR, hospitalId }));
      queueManagerOfficer.push(
        ...(await factory(Officer)().createMany(5, { role: OfficerRole.QUEUE_MANAGER, hospitalId })),
      );
      staffOfficer.push(...(await factory(Officer)().createMany(20, { role: OfficerRole.STAFF, hospitalId })));
    }
  }
}
