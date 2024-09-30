import request from 'supertest';
import mongoose from 'mongoose';
import { config } from '../src/config/config';
import { app } from '../src/server';
import User from '../src/models/User.model';
import Team from '../src/models/Team.model';
import Fixture from '../src/models/Fixture.model';
import { Express } from 'express';

// Add this function at the top of the file, outside the describe block
async function makeAuthenticatedAgent(
  app: Express,
  email: string,
  password: string,
) {
  const agent = request.agent(app);
  await agent.post('/api/v1/auth/login').send({ email, password });
  return agent;
}

describe('Fixtures E2E Tests', () => {
  let adminAgent: request.SuperAgentTest;
  let userAgent: request.SuperAgentTest;
  let teamIds: string[] = [];
  let fixtureIds: string[] = [];

  beforeAll(async () => {
    await mongoose.connect(config.mongo.url, {
      retryWrites: true,
      w: 'majority',
      dbName: config.mongo.dbNameTest,
    });

    // Register admin user
    await request(app).post('/api/v1/auth/register/admins').send({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
    });

    // Register regular user
    await request(app).post('/api/v1/auth/register/users').send({
      name: 'Regular User',
      email: 'user@example.com',
      password: 'password123',
    });

    // Create authenticated agents
    //@ts-ignore
    adminAgent = (await makeAuthenticatedAgent(
      app,
      'admin@example.com',
      'password123',
    ));
    //@ts-ignore
    userAgent = (await makeAuthenticatedAgent(
      app,
      'user@example.com',
      'password123',
    ));
  });

  afterAll(async () => {
    await User.deleteMany({});
    await Team.deleteMany({});
    await Fixture.deleteMany({});
    await mongoose.connection.close();
  });

  it('should create 5 teams', async () => {
    const teamNames = [
      'Team A',
      'Team B',
      'Team C',
      'Team D',
      'Team E',
    ];

    for (const name of teamNames) {
      const response = await adminAgent
        .post('/api/v1/teams')
        .send({ name, city: `City of ${name}` });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Team created successfully');
      teamIds.push(response.body.data._id);
    }
    expect(teamIds.length).toBe(5);
  });

  it('should create fixtures', async () => {
    let baseDate = 1759179224000; //
    for (let i = 0; i < teamIds.length - 1; i++) {
      for (let j = i + 1; j < teamIds.length; j++) {
        const response = await adminAgent
          .post('/api/v1/fixtures')
          .send({
            homeTeam: teamIds[i],
            awayTeam: teamIds[j],
            date: (baseDate += 1000).toString(),
            uniqueLink: `fixture-${teamIds[i]}-${teamIds[j]}-${baseDate}-${Math.random().toString(36).substring(7)}`,
          });

        // console.log(response.body);
        expect(response.status).toBe(201);
        expect(response.body.message).toBe(
          'Fixture created successfully',
        );
        fixtureIds.push(response.body.data._id);
      }
    }
  });

  it('should get all fixtures as admin', async () => {
    const response = await adminAgent.get('/api/v1/fixtures');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      'Fixtures fetched successfully',
    );
    expect(response.body.data.fixtures.length).toBe(10);
    expect(response.body.data.pagination.totalRecords).toBe(10);
    expect(response.body.data.pagination.totalPages).toBe(1);
    expect(response.body.data.pagination.currentPage).toBe(1);
    expect(response.body.data.pagination.nextPage).toBe(null);
    expect(response.body.data.pagination.previousPage).toBe(null);
    expect(response.body.data.pagination.limit).toBe(10);
    expect(response.body.data.pagination.skip).toBe(0);
  });

  it('should get a specific fixture as admin', async () => {
    const response = await adminAgent.get(
      `/api/v1/fixtures/${fixtureIds[0]}`,
    );

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      'Fixture fetched successfully',
    );
  });

  it('should update a fixture as admin', async () => {
    const response = await adminAgent
      .patch(`/api/v1/fixtures/${fixtureIds[0]}`)
      .send({
        status: 'completed',
        homeResult: '2',
        awayResult: '1',
      });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      'Fixture updated successfully',
    );
  });

  it('should remove 2 fixtures as admin', async () => {
    for (let i = 0; i < 2; i++) {
      const response = await adminAgent.delete(
        `/api/v1/fixtures/${fixtureIds[i]}`,
      );
      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        'Fixture deleted successfully',
      );
    }
  });

it('should logout admin', async () => {
  const response = await adminAgent.post('/api/v1/auth/logout');
  expect(response.status).toBe(200);
  expect(response.body.message).toBe('Logout successful');
});
  
  
  
it('should get all fixtures as user', async () => {
 
  const response = await userAgent.get('/api/v1/fixtures');

  expect(response.status).toBe(200);
  expect(response.body.message).toBe('Fixtures fetched successfully');

});
  
  it('should get a specific fixture as user', async () => {
  const response = await userAgent.get(`/api/v1/fixtures/${fixtureIds[2]}`);

  expect(response.status).toBe(200);
  expect(response.body.message).toBe('Fixture fetched successfully');
  });
  
  it('should fail to update a fixture as user', async () => {
    const response = await userAgent
      .patch(`/api/v1/fixtures/${fixtureIds[2]}`)
      .send({
        status: 'completed',
        homeResult: '3',
        awayResult: '2',
      });

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Unauthorized!');
  });

  it('should fail to remove a fixture as user', async () => {
    const response = await userAgent.delete(
      `/api/v1/fixtures/${fixtureIds[2]}`,
    );

    expect(response.status).toBe(403);
    expect(response.body.message).toBe('Unauthorized!');
  });

it('should logout user', async () => {
  const response = await userAgent.post('/api/v1/auth/logout');
  expect(response.status).toBe(200);
  expect(response.body.message).toBe('Logout successful');
});

it('should fail to get fixture after logout', async () => {
  const response = await request(app).get(`/api/v1/fixtures/${fixtureIds[2]}`);
  expect(response.status).toBe(401);
});
it('should fail to get fixtures after logout', async () => {
  const response = await request(app).get(`/api/v1/fixtures`);
  expect(response.status).toBe(401);
});
  
  
});
