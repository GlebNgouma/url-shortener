import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { UrlExistsPipe } from './url-exists.pipe';
import { UrlService } from '../url.service';
import { Url } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('UrlExistsPipe', () => {
  let urlService: DeepMocked<UrlService>;
  let urlExistsPipe: UrlExistsPipe;

  beforeEach(() => {
    urlService = createMock<UrlService>();
    urlExistsPipe = new UrlExistsPipe(urlService);
  });

  it('should be defined', () => {
    expect(urlExistsPipe).toBeDefined();
  });

  it(`devrait renvoyer l'objet url s'il est trouvé`, async () => {
    const url: Url = {
      id: 1,
      redirect: 'https://airbnb.com',
      url: 'localhost:3000/random-uid',
      title: 'Airbnb',
      description: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    urlService.findOne.mockResolvedValueOnce(url);
    const result = await urlExistsPipe.transform('random-uid');
    expect(result).toEqual(url);
  });

  it(`devrait renvoyer une exception quand l' url n'est trouvé`, async () => {
    urlService.findOne.mockResolvedValueOnce(null);
    const result = () => urlExistsPipe.transform('random-uid');
    expect(result).rejects.toThrow(NotFoundException);
  });
});
