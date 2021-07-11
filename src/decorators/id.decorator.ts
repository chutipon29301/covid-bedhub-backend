import { Param, ParseIntPipe } from '@nestjs/common';

export const IdParam = () => Param('id', ParseIntPipe);
