import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Ticket } from '@entity';
import { TicketService } from './ticket.service';
import { DataArgs, GqlUserToken, IdArgs, NullableQuery, Roles, UserToken } from '@decorator';
import { AcceptTicketDto, CreateTicketDto, EditSymptomDto } from './dto/ticket.dto';
import { JwtPayload } from '../jwt-auth/dto/jwt-auth.dto';

@Resolver(() => Ticket)
export class TicketResolver {
  constructor(private readonly service: TicketService) {}

  @Roles('super_admin')
  @Query(() => [Ticket])
  tickets(): Promise<Ticket[]> {
    return this.service.findMany();
  }

  @Roles('super_admin')
  @NullableQuery(() => Ticket)
  ticket(@IdArgs() id: number): Promise<Ticket> {
    return this.service.findOne(id);
  }

  @Roles('queue_manager')
  @Query(() => [Ticket])
  requestedTicket(@GqlUserToken() userToken: JwtPayload): Promise<Ticket[]> {
    return this.service.listRequestTicket(userToken.id);
  }

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
  editSymptom(@IdArgs() id: number, @UserToken() user: JwtPayload, @DataArgs() data: EditSymptomDto): Promise<Ticket> {
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
  cancelAppointment(@IdArgs() id: number, @GqlUserToken() userToken: JwtPayload): Promise<Ticket> {
    return this.service.cancelAppointment(id, userToken.id);
  }
}
