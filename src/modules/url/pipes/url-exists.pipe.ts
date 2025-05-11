import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { UrlService } from '../url.service';

@Injectable()
export class UrlExistsPipe implements PipeTransform {
  constructor(private readonly urlService: UrlService) {}

  async transform(uid: any) {
    // check in the database if the url exists
    const redirectUrl = await this.urlService.findOne(uid);
    // if it does not exist, then throw a 404 not found error
    if (!redirectUrl) {
      throw new NotFoundException('Url non trouvé');
    }
    return redirectUrl;
  }
}
