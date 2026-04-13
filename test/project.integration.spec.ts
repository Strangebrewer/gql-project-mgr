import { Test, TestingModule } from '@nestjs/testing';
import { MongoDBContainer, StartedMongoDBContainer } from '@testcontainers/mongodb';
import { Db, MongoClient } from 'mongodb';
import { PROJECT_COLLECTION } from '../src/common/factory/project.factory';
import { ProjectRepository } from '../src/app/project/project.repository';
import { ProjectService } from '../src/app/project/project.service';
import { IdGeneratorService } from '../src/shared/libs/id-generator/id-generator.service';
import { ProjectStatus } from '../src/app/project/models/project.model';

describe('Project (integration)', () => {
  let container: StartedMongoDBContainer;
  let client: MongoClient;
  let db: Db;
  let module: TestingModule;
  let service: ProjectService;

  beforeAll(async () => {
    container = await new MongoDBContainer('mongo:6').start();
    client = await MongoClient.connect(container.getConnectionString(), { directConnection: true });
    db = client.db('test');

    module = await Test.createTestingModule({
      providers: [
        { provide: PROJECT_COLLECTION, useValue: db.collection('projects') },
        ProjectRepository,
        ProjectService,
        IdGeneratorService,
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
  }, 60000);

  afterAll(async () => {
    await module.close();
    await client.close();
    await container.stop();
  });

  afterEach(async () => {
    await db.collection('projects').deleteMany({});
  });

  it('creates and retrieves a project', async () => {
    const userId = 'user-1';
    const created = await service.create(
      {
        name: 'Build Portfolio Site',
        description: 'A full-stack portfolio project',
        status: ProjectStatus.IN_PROGRESS,
        dueDate: '2026-12-31',
      },
      userId,
    );

    expect(created.id).toMatch(/^PRJ-/);
    expect(created.name).toBe('Build Portfolio Site');
    expect(created.description).toBe('A full-stack portfolio project');
    expect(created.status).toBe(ProjectStatus.IN_PROGRESS);
    expect(created.dueDate).toBe('2026-12-31');
    expect(created.userId).toBe(userId);

    const found = await service.findById(created.id);
    expect(found).toEqual(created);
  });

  it('creates a project with only required fields', async () => {
    const created = await service.create({ name: 'Minimal Project' }, 'user-1');

    expect(created.id).toMatch(/^PRJ-/);
    expect(created.name).toBe('Minimal Project');
    expect(created.description).toBeUndefined();
    expect(created.status).toBeUndefined();
    expect(created.dueDate).toBeUndefined();
  });

  it('finds all projects for a user', async () => {
    await service.create({ name: 'Project A' }, 'user-1');
    await service.create({ name: 'Project B' }, 'user-1');
    await service.create({ name: 'Project C' }, 'user-2');

    const results = await service.find('user-1');
    expect(results).toHaveLength(2);
  });

  it('updates a project', async () => {
    const created = await service.create({ name: 'Original Name' }, 'user-1');

    const updated = await service.update(created.id, {
      name: 'Updated Name',
      status: ProjectStatus.COMPLETED,
    });

    expect(updated.name).toBe('Updated Name');
    expect(updated.status).toBe(ProjectStatus.COMPLETED);
    expect(updated.userId).toBe('user-1');
  });

  it('deletes a project', async () => {
    const created = await service.create({ name: 'To Delete' }, 'user-1');
    const result = await service.delete(created.id);
    expect(result.deletedCount).toBe(1);
  });

  it('throws when project not found', async () => {
    await expect(service.findById('nonexistent')).rejects.toThrow('Project not found');
  });
});
