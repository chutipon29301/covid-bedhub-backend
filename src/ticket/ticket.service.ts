import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vaccine } from 'src/entities/Vaccine.entity';
import { Repository } from 'typeorm';
import { Ticket } from '../entities/Ticket.entity';
import { CrudService } from '../libs/crud.service';
import { CreateTicketDto } from './dto/create-ticket.dto';

//   FEVER = 'ไข้ หรือวัดอุณหภูมิได้ตั้งแต่ 37.5 องศาขึ้นไป', // 1
//   COUGH = 'ไอ มีน้ำมูก เจ็บคอ', // 1
//   SMELLESS_RASH = 'ไม่ได้กลิ่น ลิ้นไม่รับรส ตาแดง ผื่น', // 1
//   DIARRHEA = 'ถ่ายเหลวมากกว่า 3 ครั้งต่อวัน', //2
//   TIRED_HEADACHE = 'อ่อนเพลีย หน้ามืด วิงเวียนศีรษะ', //2
//   DIFFICULT_BREATHING = 'หายใจเร็ว, หายใจลำบาก หรือเหนื่อย', //2
//   ANGINA = 'แน่นหน้าอกเล็กน้อย', //2
//   EXHAUSTED = 'หอบเหนื่อย พูดไม่เป็นประโยคขณะสนทนา', //3
//   CHEST_PAIN = 'แน่นหน้าอกตลอดเวลา หายใจแล้วเจ็บหน้าอก', //3
//   UNCONCIOUS = 'เรียกไม่รู้สึกตัว หรือตอบสนองช้า', //3

@Injectable()
export class TicketService extends CrudService<Ticket> {
  constructor(
    @InjectRepository(Vaccine) vaccineRepo: Repository<Vaccine>,
    @InjectRepository(Ticket) repo: Repository<Ticket>,
  ) {
    super(repo);
  }
  public async createOne(body: CreateTicketDto): Promise<Ticket> {
    // body.
    return;
  }
}
