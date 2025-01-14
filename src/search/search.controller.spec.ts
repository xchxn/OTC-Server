import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

describe('SearchController', () => {
  let controller: SearchController;
  let searchService: SearchService;

  const mockSearchService = {
    oneToOneSearch: jest.fn(),
    manyToMany: jest.fn(),
    autoMatching: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: SearchService,
          useValue: mockSearchService,
        },
      ],
    }).compile();

    controller = module.get<SearchController>(SearchController);
    searchService = module.get<SearchService>(SearchService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('searchObjekt', () => {
    it('should call oneToOneSearch with the provided request', async () => {
      const request = { key: 'value' };
      const expectedResult = { result: 'success' };
      mockSearchService.oneToOneSearch.mockResolvedValue(expectedResult);

      const result = await controller.searchObjekt(request);

      expect(mockSearchService.oneToOneSearch).toHaveBeenCalledWith(request);
      expect(result).toBe(expectedResult);
    });
  });

  describe('manyToMany', () => {
    it('should call manyToMany with the provided request', async () => {
      const request = { items: ['item1', 'item2'] };
      const expectedResult = { matches: ['match1', 'match2'] };
      mockSearchService.manyToMany.mockResolvedValue(expectedResult);

      const result = await controller.manyToMany(request);

      expect(mockSearchService.manyToMany).toHaveBeenCalledWith(request);
      expect(result).toBe(expectedResult);
    });
  });

  describe('searchPosting', () => {
    it('should call autoMatching with the provided request', async () => {
      const request = { query: 'test' };
      const expectedResult = { matches: ['post1', 'post2'] };
      mockSearchService.autoMatching.mockResolvedValue(expectedResult);

      const result = await controller.searchPosting(request);

      expect(mockSearchService.autoMatching).toHaveBeenCalledWith(request);
      expect(result).toBe(expectedResult);
    });
  });
});