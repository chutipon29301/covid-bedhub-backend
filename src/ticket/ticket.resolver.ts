import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Ticket, TicketStatus } from '@entity';
import { TicketService } from './ticket.service';
import { DataArgs, GqlUserToken, IdArgs, NullableQuery, Roles } from '@decorator';
import { CreateTicketDto, EditTicketDto } from './dto/ticket.dto';
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

  @Roles('reporter')
  @Mutation(() => Ticket)
  createTicket(@DataArgs() data: CreateTicketDto): Promise<Ticket> {
    return this.service.create(data);
  }

  @Roles('reporter')
  @Mutation(() => Ticket)
  editTicket(@IdArgs() id: number, @DataArgs() data: EditTicketDto): Promise<Ticket> {
    return this.service.updateTicket({ id }, data);
  }

  @Roles('queue_manager', 'reporter')
  @Mutation(() => Ticket)
  updateTicket(
    @GqlUserToken() user: JwtPayload,
    @IdArgs() id: number,
    @Args('status', { type: () => TicketStatus }) status: TicketStatus,
  ): Promise<Ticket> {
    return null;
    // if (user.accountType === 'queue_manager') {
    //   if ([TicketStatus.HOSPITAL_CANCEL, TicketStatus.MATCH].includes(status)) {
    //     return this.service.updateOne({ id }, { status });
    //   } else {
    //     throw new BadRequestException('Queue manager cannot perform this action.');
    //   }
    // } else if (user.accountType === 'reporter') {
    //   if ([TicketStatus., TicketStatus.MATCH].includes(status)) {
    //     return this.service.updateOne({ id }, { status });
    //   } else {
    //     throw new BadRequestException('Reporter cannot perform this action.');
    //   }
    // }
  }
  // @Roles('queue_manager', 'reporter')
  // @Query(() => Ticket)
  // checkTicket(@GqlUserToken() user: JwtPayload,@Args('i', { type: () => TicketStatus })
}
