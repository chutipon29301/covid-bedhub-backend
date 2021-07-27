import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Hospital, Patient, Ticket, Vaccine } from '@entity';
import { TicketService } from './ticket.service';
import { DataArgs, GqlUserToken, IdArgs, NullableQuery, Roles } from '@decorator';
import {
  AcceptTicketDto,
  CreateTicketDto,
  EditAppointmentDto,
  EditSymptomDto,
  RequestTicketQueryDto,
  TicketPaginationDto,
} from './dto/ticket.dto';
import { JwtPayload } from '../jwt-auth/dto/jwt-auth.dto';

@Resolver(() => Ticket)
export class TicketResolver {
  constructor(private readonly service: TicketService) {}

  @Roles('reporter')
  @NullableQuery(() => Ticket)
  myTicket(@GqlUserToken() userToken: JwtPayload, @IdArgs() id: number): Promise<Ticket> {
    return this.service.findReporterTicket(userToken.id, id);
  }

  @Roles('queue_manager')
  @Query(() => TicketPaginationDto)
  async requestedTicket(
    @GqlUserToken() userToken: JwtPayload,
    @DataArgs({ nullable: true, defaultValue: { take: 15, skip: 0 } }) data: RequestTicketQueryDto,
  ): Promise<TicketPaginationDto> {
    const [tickets, count] = await this.service.listRequestTicket(userToken.id, data.take, data.skip, data.riskLevel);
    return { tickets, count };
  }

  // @Roles('queue_manager')
  // @Query(() => TicketPaginationDto)
  // async acceptedTicket(
  //   @GqlUserToken() userToken: JwtPayload
  // ): Promise<TicketPaginationDto> {
  // }

  @Roles('staff', 'queue_manager')
  @Query(() => Ticket)
  ticketByNationalId(@GqlUserToken() userToken: JwtPayload, @Args('nid') nid: string): Promise<Ticket> {
    return this.service.findTicketByNationalId(userToken.id, nid);
  }

  @Roles('reporter')
  @Mutation(() => Ticket)
  createTicket(@DataArgs() data: CreateTicketDto): Promise<Ticket> {
    return this.service.create(data);
  }

  @Roles('reporter')
  @Mutation(() => Ticket)
  editSymptom(
    @IdArgs() id: number,
    @GqlUserToken() user: JwtPayload,
    @DataArgs() data: EditSymptomDto,
  ): Promise<Ticket> {
    return this.service.updateSymptom(id, user.id, data);
  }

  @Roles('reporter')
  @Mutation(() => Ticket)
  cancelTicket(@GqlUserToken() userToken: JwtPayload, @IdArgs() id: number): Promise<Ticket> {
    return this.service.reporterCancelTicket(id, userToken.id);
  }

  @Roles('queue_manager')
  @Mutation(() => Ticket)
  acceptTicket(@GqlUserToken() userToken: JwtPayload, data: AcceptTicketDto): Promise<Ticket> {
    return this.service.acceptTicket(userToken.id, data);
  }

  @Roles('queue_manager')
  @Mutation(() => Ticket)
  editAppointment(@GqlUserToken() userToken: JwtPayload, data: EditAppointmentDto): Promise<Ticket> {
    return this.service.acceptTicket(userToken.id, data);
  }

  @Roles('queue_manager')
  @Mutation(() => Ticket)
  cancelAppointment(@IdArgs() id: number, @GqlUserToken() userToken: JwtPayload): Promise<Ticket> {
    return this.service.cancelAppointment(id, userToken.id);
  }

  @Roles('reporter', 'queue_manager')
  @ResolveField(() => Patient)
  patient(@Parent() ticket: Ticket): Promise<Patient> {
    return this.service.findPatient.load(ticket.patientId);
  }

  @Roles('reporter')
  @ResolveField(() => Hospital, { nullable: true })
  hospital(@Parent() ticket: Ticket): Promise<Hospital> {
    if (!ticket.hospitalId) {
      return null;
    }
    return this.service.findHospital.load(ticket.hospitalId);
  }

  @Roles('reporter')
  @ResolveField(() => [Vaccine])
  vaccines(@Parent() ticket: Ticket): Promise<Vaccine[]> {
    return this.service.findVaccines.load(ticket.id);
  }
}
