import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';


import { AppModule } from '../src/app.module';
import { User } from '../src/users/entities/user.entity';
import { Verification } from 'src/users/entities/verification.entity';

jest.mock('got', ()=> {
  return {
    post: jest.fn(),
  }
});

const GRAPHQL_ENDPOINT = '/graphql';

const testUser = {
  email: 'san@ti.com',
  password: '12345'
};

describe('UserModule (e2e)', () => {
  let app: INestApplication;
  let usersRepository: Repository<User>;
  let verificationRepository: Repository<Verification>;
  let jwtToken: string;

  const baseTest = () => request(app.getHttpServer()).post(GRAPHQL_ENDPOINT);
  const publicTest = (query: string) => baseTest().send({ query });
  const privateTest = (query: string) => baseTest().set('X-JWT', jwtToken).send({ query });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    verificationRepository = module.get<Repository<Verification>>(getRepositoryToken(Verification));
    await app.init();
  });

  afterAll(async () => {
    const dataSource = new DataSource({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'snlaight',
      password: '12345',
      database: 'nuber-eats-test',
      });
      const connection = await dataSource.initialize();
      await connection.dropDatabase();
      await connection.destroy();
    app.close();
  });

  describe('createAccount', () => {


    it('should create account', () => {
      return publicTest(`
      mutation {
        createAccount(input: {
          email:"${testUser.email}",
          password:"${testUser.password}",
          role:Owner
        }) {
          ok
          error
        }
      }
      `)
      .expect(200)
      .expect(res => {
        expect(res.body.data.createAccount.ok).toBe(true);
        expect(res.body.data.createAccount.error).toBe(null);
      })
    });

    it('should fail if account already exists', () => {
      return publicTest(`
      mutation {
          createAccount(input: {
            email:"${testUser.email}",
            password:"${testUser.password}",
            role:Owner
          }) {
            ok
            error
          }
        }
      `)
        .expect(200)
        .expect(res => {
          expect(res.body.data.createAccount.ok).toBe(false);
          expect(res.body.data.createAccount.error).toBe(
            'There is a user with that email already',
          );
        });
    });
  });


  describe('login', () => {
    it('should login with correct credentials', () => {
        return publicTest(`
        mutation {
          login(input:{
            email:"${testUser.email}",
            password:"${testUser.password}",
          }) {
            ok
            error
            token
          }
        }
      `)
        .expect(200)
        .expect(res => {
         const { ok, error, token } = res.body.data.login;
          expect(ok).toBe(true);
          expect(error).toBe(null);
          expect(token).toEqual(expect.any(String));
          jwtToken = token;
        });
    });


    it('should not be able to login with wrong credentials', () => {
      return publicTest(`
          mutation {
            login(input:{
              email:"${testUser.email}",
              password:"xxx",
            }) {
              ok
              error
            }
          }
        `)
        .expect(200)
        .expect(res => {
         const { ok, error } = res.body.data.login;
          expect(ok).toBe(false);
          expect(error).toBe('Wrong password');
        });
    });
  });


  describe('userProfile', () => {
    let userId: number;
    beforeAll(async () => {
      const [user] = await usersRepository.find();
      userId = user.id;
    });

    it('should see a user profile', () => {
      return privateTest(`
      {
        userProfile(userId:${userId}){
          ok
          error
          user {
            id
          }
        }
      }
    `)
      .expect(200)
      .expect(res => {
        const { ok, error, user } = res.body.data.userProfile;
        expect(ok).toBe(true);
        expect(error).toBe(null);
        expect(user.id).toBe(userId);
      })
    });

    it('should not find a profile', () => {
      return privateTest(`
          {
            userProfile(userId:666){
              ok
              error
              user {
                id
              }
            }
          }
        `)
      .expect(200)
      .expect( res => {
        const { ok, error, user } = res.body.data.userProfile;
        expect(ok).toBe(false);
        expect(error).toBe('User not found');
        expect(user).toBe(null);
      })
    });
  });


  describe('me' , () => {


    it('should find my profile', () => {
      return privateTest(`
      {
        me {
          email
        }
      }
    `)
      .expect(200)
      .expect(res => {
        const { email } = res.body.data.me;
        expect(email).toBe(testUser.email);
      })
    });

    it('should not allow logged out user', () => {
      return publicTest(`
      {
        me {
          email
        }
      }
    `)
      .expect(200)
      .expect(res => {
        const { errors } = res.body;
        const [error] = errors;
        expect(error.message).toBe('Forbidden resource');
      })
    });
  });

  describe('editProfile', () => {
    const NEW_EMAIL = 'san@tinew.com';


    it('should change email', () => {
      return privateTest(`
      mutation {
        editProfile(input:{
          email: "${NEW_EMAIL}"
        }) {
          ok
          error
        }
      }
  `)
      .expect(200)
      .expect( res => {
        const { ok, error } = res.body.data.editProfile;
        expect(ok).toBe(true);
        expect(error).toBe(null);
      })
    });

    it('should have new email', () => {
      return privateTest(`
          {
            me {
              email
            }
          }
        `)
      .expect(200)
      .expect( res => {
        const { email } = res.body.data.me;
        expect(email).toBe(NEW_EMAIL);
      })
    });
  });

  describe('verifyEmail', () => {
    let verificationCode: string;

    beforeAll(async () => {
      const [verification] = await verificationRepository.find();
      verificationCode = verification.code;
    });

    it('should verify email' , () => {
      return publicTest(`
      mutation {
        verifyEmail(input:{
          code:"${verificationCode}"
        }){
          ok
          error
        }
      }
    `)
      .expect(200)
      .expect(res => {
        const { ok, error } = res.body.data.verifyEmail;
        expect(ok).toBe(true);
        expect(error).toBe(null);
      })
    });

    it('should fail on verification code not found' , () => {
      return publicTest(`
          mutation {
            verifyEmail(input:{
              code:"xxxxx"
            }){
              ok
              error
            }
          }
        `)
      .expect(200)
      .expect(res => {
        const { ok, error } = res.body.data.verifyEmail;
        expect(ok).toBe(false);
        expect(error).toBe('Verification not found.');
      })
    });

  });
});
