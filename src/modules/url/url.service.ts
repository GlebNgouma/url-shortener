import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from 'src/database/database.service';
import { UidService } from 'src/services/uid/uid.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';

@Injectable()
export class UrlService {
  private host: string;

  constructor(
    private readonly uidService: UidService,
    private readonly databaseService: DatabaseService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    this.host = this.configService.getOrThrow<string>('host');
  }

  async create(createUrlDto: CreateUrlDto) {
    const randomId = this.uidService.generateUid(5);
    const url = await this.databaseService.url.create({
      data: {
        ...createUrlDto,
        url: `${this.host}/${randomId}`,
      },
    });
    return url;
  }

  findAll() {
    return `This action returns all url`;
  }

  async findOne(uid: string) {
    return await this.databaseService.url.findUnique({
      where: { url: `${this.host}/${uid}` },
    });
  }

  update(uid: string, updateUrlDto: UpdateUrlDto) {
    return `This action updates a #${uid} url`;
  }

  remove(uid: string) {
    return `This action removes a #${uid} url`;
  }
}
