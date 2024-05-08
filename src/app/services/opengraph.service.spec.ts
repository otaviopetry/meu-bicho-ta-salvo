import { Meta } from '@angular/platform-browser';
import { OpengraphService } from "./opengraph.service";
import { IOpenGraphTag } from '../interfaces/opengraph-tag.interface';

describe('OpengraphService', () => {
  let service: OpengraphService;
  let meta: Meta;

  beforeEach(() => {
    meta = new Meta(document);
    service = new OpengraphService(meta);
  });

  it('should set meta tags', () => {
    const tags: IOpenGraphTag[] = [
      { property: 'og:title', content: 'Title' },
      { property: 'og:description', content: 'Description' },
    ];

    const spy = spyOn(meta, 'addTag');

    service.setTags(tags);

    expect(spy.calls.count()).toEqual(2);
    expect(spy.calls.argsFor(0)).toEqual([{ property: 'og:title', content: 'Title' }]);
    expect(spy.calls.argsFor(1)).toEqual([{ property: 'og:description', content: 'Description' }]);
  });

});
