import { formatISO } from 'date-fns';
import { define } from 'typeorm-seeding';
import { Ticket, TicketStatus } from '../entities';
import { date, hacker, random, datatype, address } from 'faker';

define(Ticket, () => {
  const ticket = new Ticket();
  ticket.examReceiveDate = formatISO(date.past(1), { representation: 'date' });
  ticket.examDate = formatISO(date.past(1, ticket.examReceiveDate), { representation: 'date' });
  ticket.symptom = hacker.phrase();
  ticket.status = random.arrayElement<TicketStatus>(Object.keys(TicketStatus) as TicketStatus[]);
  ticket.appointedDate = formatISO(date.future(1), { representation: 'date' });
  ticket.riskLevel = datatype.number(3) + 1;
  ticket.location = {
    type: 'Point',
    coordinates: [
      +address.latitude(14.027042515728189, 13.601417374036716, 16),
      +address.longitude(100.71115049015863, 100.37588622565592, 16),
    ],
  };
  return ticket;
});
