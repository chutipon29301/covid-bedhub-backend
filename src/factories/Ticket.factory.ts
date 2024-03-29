import { formatISO } from 'date-fns';
import { define } from 'typeorm-seeding';
import { Symptom, Ticket, TicketStatus } from '@entity';
import { date, lorem, random, datatype, address } from 'faker';

define(Ticket, () => {
  const ticket = new Ticket();
  ticket.examReceiveDate = formatISO(date.past(1), { representation: 'date' });
  ticket.examLocation = address.cityName();
  ticket.examDate = formatISO(date.past(1, ticket.examReceiveDate), { representation: 'date' });
  ticket.symptoms = [random.arrayElement<Symptom>(Object.keys(Symptom) as Symptom[])];
  ticket.status = random.arrayElement<TicketStatus>(Object.keys(TicketStatus) as TicketStatus[]);
  ticket.appointedDate = formatISO(date.future(1), { representation: 'date' });
  ticket.notes = lorem.sentence();
  ticket.riskLevel = datatype.number(3) + 1;
  ticket.location = {
    x: +address.latitude(14.027042515728189, 13.601417374036716, 16),
    y: +address.longitude(100.71115049015863, 100.37588622565592, 16),
  };
  return ticket;
});
