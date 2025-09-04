import { Test, TestingModule } from '@nestjs/testing';
import { NotebooksService } from './notebooks.service';
import { Repository } from 'typeorm';
import { Notebook } from './entities/notebook.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateNotebookDto } from './dto/create-notebook.dto';

describe('NotebooksService', () => {
  let service: NotebooksService;      // NotebooksService es una clase
  let repositorio: Repository<Notebook> // tengo que mockear la bd en el repositorio

  const mockNotebook: Notebook = {
    id: 1,
    title: 'Test Notebook',
    content: 'Contenido',
  };

  const mockRepositorio = {
    find: jest.fn().mockResolvedValue([mockNotebook]),
    create: jest.fn().mockReturnValue(mockNotebook),
    save: jest.fn().mockResolvedValue(mockNotebook),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({    // creamos el módulo virtual
      providers: [NotebooksService,
        {
          provide: getRepositoryToken(Notebook),
          useValue: mockRepositorio,    // mokeo el repositorio
        },
      ],
    }).compile();

    service = module.get<NotebooksService>(NotebooksService); // instanciamos el módulo
    repositorio = module.get<Repository<Notebook>>(getRepositoryToken(Notebook));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll debe devolver un listado de notebooks', async () => {
    const resultado = await service.findAll();
    // llama al método findAll() del NotebooksService. Como en el test tenemos mockeado el repositorio (repositorio.find), este devuelve un array con un mockNotebook. Entonces, result es [mockNotebook].    
    
    expect(resultado).toEqual([mockNotebook]);
    // verifica que el resultado de service.findAll() sea exactamente un array con ese mockNotebook. Esto asegura que el service devuelve lo que se espera desde el repositorio mockeado.

    expect(repositorio.find).toHaveBeenCalled();
    // verifica que el método find del repositorio (repositorio.find) realmente fue invocado. Esto comprueba que el service.findAll() no devuelve datos “a mano”, sino que depende del repositorio.
  });

  it('Debe crear y guardar una Notebook', async () => {
    const dto: CreateNotebookDto = {title: 'Nueva', content: 'Contenido'};
    const resultado = await service.create(dto);  // DTO es un objeto que representa los datos que el usuario envía para crear algo en la base de datos.
    //create -> crea una nueva entidad en memoria (sin guardarla aún)
    //save -> guarda la entidad en la base de datos

    expect(repositorio.create).toHaveBeenCalledWith(dto);     // verifica que repositorio.create fue llamado exactamente con el DTO que pasamos
    expect(repositorio.save).toHaveBeenCalledWith(mockNotebook); // verifica que repositorio.save fue llamado con mockNotebook. Normalmente mockNotebook es un objeto simulado que representa cómo debería lucir el notebook ya creado.

    expect(resultado).toEqual(mockNotebook);  // comprueba que el resultado que devolvió service.create() es igual al objeto esperado (mockNotebook).
  });

});

