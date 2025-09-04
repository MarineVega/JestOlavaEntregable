import { Test, TestingModule } from '@nestjs/testing';
import { NotebooksController } from './notebooks.controller';
import { NotebooksService } from './notebooks.service';
import { Notebook } from './entities/notebook.entity';
import { CreateNotebookDto } from './dto/create-notebook.dto';    // para pruebas unitarias

/*    Prueba Unitaria */
describe('NotebooksController', () => {
  let controller: NotebooksController;
  let service: NotebooksService;      // mokear el service para probar el controlador

  const mockNotebook: Notebook = {
    id: 1,
    title: 'Test Notebook',
    content: 'Contenido',
  };

  const mockService ={
    findAll: jest.fn().mockResolvedValue([mockNotebook]),
    create: jest.fn().mockResolvedValue(mockNotebook),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotebooksController],
      providers: [
        {
          provide: NotebooksService,    // incorporo del servicio para poder usarlo desde el controlador
          useValue: mockService,        // mock del service
        },
      ],
    }).compile();

    controller = module.get<NotebooksController>(NotebooksController);
    service = module.get<NotebooksService>(NotebooksService);   // creo un objeto para el servicio
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Devolver las notebooks correctas (usando spyOn)', async () => {
    const result: Notebook[] = [
      { id: 1, title: 'Test Notebook', content: 'Contenido' }
    ];

    // crea un spyOn (espía) sobre el método "findAll" del servicio, se le indica que, cuando sea llamado, devuelva "result"
    jest.spyOn(service, 'findAll').mockResolvedValue(result);

    // llama al método del controlador "findAll", se espera que retorne exactamente lo mismo que el mock
    expect(await controller.findAll()).toBe(result);
  });

  it('Debe crear y guardar una Notebook', async () => {
    const dto: CreateNotebookDto = {title: 'Nueva', content: 'Contenido'};
    expect(await controller.create(dto)).toEqual(mockNotebook);
    expect(service.create).toHaveBeenCalledWith(dto);
  });
  
});

/* Prueba de integración */
/*
describe('NotebooksController (Integración)', () => {
  let controller: NotebooksController;
  let service: NotebooksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotebooksController],
      providers: [NotebooksService],
    }).compile();

    controller = module.get<NotebooksController>(NotebooksController);
    service = module.get<NotebooksService>(NotebooksService);
  });

  it('Devolver las notebooks usando el servicio real', async () => {
    const notebooks: Notebook[] = await controller.findAll();
    expect(Array.isArray(notebooks)).toBe(true);
    expect(notebooks.length).toBeGreaterThanOrEqual(0);
  });

  it('Crear una notebook usando el servicio real', async () => {
    const newNotebook = await controller.create({ title: 'Nueva', content: 'Contenido' });
    expect(newNotebook).toHaveProperty('id');
    expect(newNotebook.title).toBe('Nueva');
  });
});
*/




