import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';

@Injectable()
export class UidService {
  generateUid(lenght?: number) {
    return nanoid(lenght);
  }
}
