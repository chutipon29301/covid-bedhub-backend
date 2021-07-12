import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { AccessCode, Hospital, Officer, OfficerRole, Patient, Reporter, Ticket, UserType } from './src/entities';

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

    const reporters = await factory(Reporter)().createMany(50);
    const patients: Patient[] = [];
    for (const reporter of reporters) {
      const generatePatient = await factory(Patient)().createMany(2, { reporterId: reporter.id });
      patients.push(...generatePatient);
      const reporterRepo = connection.getRepository(Reporter);
      await reporterRepo.update(
        {
          id: reporter.id,
        },
        {
          defaultPatientId: generatePatient[0].id,
        },
      );
    }

    const tickets: Ticket[] = [];
    for (const patient of patients) {
      tickets.push(await factory(Ticket)().create({ patientId: patient.id }));
    }
  }
}
