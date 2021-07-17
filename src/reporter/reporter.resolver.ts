import { Parent, ResolveField, Resolver, Query } from '@nestjs/graphql';
import { Patient, Reporter, Ticket } from '@entity';
import { GqlUserToken, Roles } from '@decorator';
import { ReporterService } from './reporter.service';
import { JwtPayload } from '../jwt-auth/dto/jwt-auth.dto';

@Resolver(() => Reporter)
export class ReporterResolver {
  constructor(private readonly service: ReporterService) {}

  @Roles('reporter')
  @Query(() => Reporter)
  me(@GqlUserToken() userToken: JwtPayload): Promise<Reporter> {
    return this.service.findOne(userToken.id);
  }

  @Roles('reporter')
  @ResolveField(() => [Patient])
  patients(@Parent() reporter: Reporter): Promise<Patient[]> {
    return this.service.findPatients(reporter.id);
  }

  @Roles('reporter')
  @ResolveField(() => [Ticket])
  tickets(@Parent() reporter: Reporter): Promise<Ticket[]> {
    return this.service.findTickets(reporter.id);
  }
}
