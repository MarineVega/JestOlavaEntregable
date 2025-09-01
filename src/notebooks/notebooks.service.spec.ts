/*import { Test, TestingModule } from '@nestjs/testing';
import { NotebooksService } from './notebooks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notebook } from './entities/notebook.entity';

describe('NotebooksService', () => {
  let service: NotebooksService;
  let repo: Repository</Notebook>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotebooksService],
    }).compile();

    service = module.get<NotebooksService>(NotebooksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
*/
import { Test, TestingModule } from '@nestjs/testing';
import { NotebooksService } from './notebooks.service';
import { getRepositoryToken } from '@nestjs/typeorm';     // Mockeo el repo
import { Notebook } from './entities/notebook.entity';
import { Repository } from 'typeorm';

describe('NotebooksService', () => {
  let service: NotebooksService;
  let repo: Repository<Notebook>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotebooksService,
        {
          provide: getRepositoryToken(Notebook),      // Inyecto el mock en los providers
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NotebooksService>(NotebooksService);
    repo = module.get<Repository<Notebook>>(getRepositoryToken(Notebook));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all notebooks', async () => {
    const notebooks = [{ id: 1, title: 'Test notebook' }] as Notebook[];
    jest.spyOn(repo, 'find').mockResolvedValueOnce(notebooks);      // Hice un test para findAll()

    expect(await service.findAll()).toEqual(notebooks);
  });
});
