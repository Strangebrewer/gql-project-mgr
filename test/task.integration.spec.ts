import { Test, TestingModule } from '@nestjs/testing';
import { MongoDBContainer, StartedMongoDBContainer } from '@testcontainers/mongodb';
import { Db, MongoClient } from 'mongodb';
import { TASK_COLLECTION } from '../src/common/factory/task.factory';
import { TaskRepository } from '../src/app/task/task.repository';
import { TaskService } from '../src/app/task/task.service';
import { IdGeneratorService } from '../src/shared/libs/id-generator/id-generator.service';
import { TaskStatus } from '../src/app/task/models/task.model';

describe('Task (integration)', () => {
  let container: StartedMongoDBContainer;
  let client: MongoClient;
  let db: Db;
  let module: TestingModule;
  let service: TaskService;

  beforeAll(async () => {
    container = await new MongoDBContainer('mongo:6').start();
    client = await MongoClient.connect(container.getConnectionString(), { directConnection: true });
    db = client.db('test');

    module = await Test.createTestingModule({
      providers: [
        { provide: TASK_COLLECTION, useValue: db.collection('tasks') },
        TaskRepository,
        TaskService,
        IdGeneratorService,
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  }, 60000);

  afterAll(async () => {
    await module.close();
    await client.close();
    await container.stop();
  });

  afterEach(async () => {
    await db.collection('tasks').deleteMany({});
  });

  it('creates and retrieves a task', async () => {
    const userId = 'user-1';
    const created = await service.create(
      {
        projectId: 'PRJ-abc',
        name: 'Design the schema',
        description: 'Plan out the MongoDB collections',
        status: TaskStatus.IN_PROGRESS,
        dueDate: '2026-06-01',
      },
      userId,
    );

    expect(created.id).toMatch(/^TSK-/);
    expect(created.projectId).toBe('PRJ-abc');
    expect(created.name).toBe('Design the schema');
    expect(created.description).toBe('Plan out the MongoDB collections');
    expect(created.status).toBe(TaskStatus.IN_PROGRESS);
    expect(created.dueDate).toBe('2026-06-01');
    expect(created.userId).toBe(userId);

    const found = await service.findById(created.id);
    expect(found).toEqual(created);
  });

  it('creates a task with only required fields', async () => {
    const created = await service.create({ projectId: 'PRJ-abc', name: 'Minimal task' }, 'user-1');

    expect(created.id).toMatch(/^TSK-/);
    expect(created.name).toBe('Minimal task');
    expect(created.description).toBeUndefined();
    expect(created.status).toBeUndefined();
    expect(created.dueDate).toBeUndefined();
  });

  it('finds all tasks for a project', async () => {
    await service.create({ projectId: 'PRJ-1', name: 'Task A' }, 'user-1');
    await service.create({ projectId: 'PRJ-1', name: 'Task B' }, 'user-1');
    await service.create({ projectId: 'PRJ-2', name: 'Task C' }, 'user-1');

    const results = await service.findByProject('PRJ-1');
    expect(results).toHaveLength(2);
  });

  it('updates a task', async () => {
    const created = await service.create({ projectId: 'PRJ-abc', name: 'Original' }, 'user-1');

    const updated = await service.update(created.id, {
      name: 'Updated',
      status: TaskStatus.DONE,
    });

    expect(updated.name).toBe('Updated');
    expect(updated.status).toBe(TaskStatus.DONE);
    expect(updated.projectId).toBe('PRJ-abc');
  });

  it('deletes a task', async () => {
    const created = await service.create({ projectId: 'PRJ-abc', name: 'To Delete' }, 'user-1');
    const result = await service.delete(created.id);
    expect(result.deletedCount).toBe(1);
  });

  it('throws when task not found', async () => {
    await expect(service.findById('nonexistent')).rejects.toThrow('Task not found');
  });
});
