import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UidService } from '../../services/uid/uid.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { GetUrlsDto } from './dto/get-urls.dto';
import { DatabaseService } from '../../database/database.service';

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

  async findAll({ filter, limit = 20, page = 1 }: GetUrlsDto) {
    //filtering/searching
    const whereClause = filter
      ? {
          OR: [
            { title: { contains: filter } },
            { description: { contains: filter } },
            { redirect: { contains: filter } },
          ],
        }
      : {};
    const urls = await this.databaseService.url.findMany({
      where: whereClause,
      take: limit,
      skip: (page - 1) * limit,
    });

    const totalCount = await this.databaseService.url.count();
    const totalPages = Math.ceil(totalCount / limit);

    let baseUrl = `${this.host}/url?limit=${limit}`;
    if (filter) {
      baseUrl += `&filter=${encodeURIComponent(filter)}`;
    }

    const nextPage = page < totalPages ? `${baseUrl}&page=${page + 1}` : null;
    const previousPage = page > 1 ? `${baseUrl}&page=${page - 1}` : null;
    const meta = {
      totalCount, // how to many items in total
      currentPage: page,
      perPage: limit, // how to many items per page
      totalPages, // total pages
      nextPage,
      previousPage,
    };

    return {
      data: urls,
      meta,
    };
  }

  async findOne(uid: string) {
    return await this.databaseService.url.findUnique({
      where: { url: `${this.host}/${uid}` },
    });
  }

  async update(id: number, updateUrlDto: UpdateUrlDto) {
    return await this.databaseService.url.update({
      where: { id },
      data: updateUrlDto,
    });
  }

  async remove(id: number) {
    return await this.databaseService.url.delete({ where: { id } });
  }
}
