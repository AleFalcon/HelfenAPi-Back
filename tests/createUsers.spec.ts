import request from 'supertest';
import userRepository from '../app/services/users';
import app from '../app';

describe('/users POST', () => {
    const requestBody = { userType: 1, name: "u3" , lastName: "u3", dateOfBirth: "1994-10-25", dniNumber: "12312331", 
      localAddress: "Liniers", mail: "alex11@alex.com", phoneNumber: "1111112221", password: "123456789" };
    beforeEach(() => userRepository.createMany([
      { userType: 1, name: "u1" , lastName: "u1",dateOfBirth: "1994-10-25", dniNumber: "12312332", 
      localAddress: "Liniers", mail: "alex@alex.com", phoneNumber: "1111112222", password: "123456789" }
    ]));
    
    it('Success create an user', (done: jest.DoneCallback) => {
      request(app)
        .post('/users')
        .send(requestBody)
        .expect(201)
        .then((res: request.Response) => {
        expect(res.body.user.userType).toBe(requestBody.userType);
        expect(res.body.user.name).toBe(requestBody.name);
        expect(res.body.user.lastName).toBe(requestBody.lastName);
        expect(res.body.user.dateOfBirth).toBe(requestBody.dateOfBirth);
        expect(res.body.user.dniNumber).toBe(requestBody.dniNumber);
        expect(res.body.user.localAddress).toBe(requestBody.localAddress);
        expect(res.body.user.mail).toBe(requestBody.mail);
        expect(res.body.user.phoneNumber).toBe(requestBody.phoneNumber);
        expect(res.body.user).toHaveProperty('password');
        expect(res.body.user).toHaveProperty('id');
        const user = userRepository.findUser({ dniNumber: '12312331' });
        expect(user).not.toBeNull();
          done();
        });
    });

    it('fails creating an existing user by validations', (done: jest.DoneCallback) => {
      requestBody.mail = 'alex@alex.com';
      request(app)
        .post('/users')
        .send(requestBody)
        .expect(406)
        .then( (res: request.Response) => {
            expect(res.body.message).toBe('406 Not Acceptable. Mail already exists');
          done();
        });

      requestBody.mail = 'alex1@alex.com';
      requestBody.dniNumber = '12312332';
      request(app)
        .post('/users')
        .send(requestBody)
        .expect(406)
        .then( (res: request.Response) => {
            expect(res.body.message).toBe('406 Not Acceptable. Dni number already exists');
          done();
        });
        
      requestBody.mail = 'alex1@alex.com';
      requestBody.dniNumber = '12312331';
      requestBody.phoneNumber = '1111112221';
      request(app)
        .post('/users')
        .send(requestBody)
        .expect(500)
        .then( (res: request.Response) => {
            expect(res.body.message).toBe('406 Not Acceptable. Phone number already exists');
          done();
        });
    });

    it('fails creating an existing user by missing parameters', (done: jest.DoneCallback) => {
      let newRequestBody = { };

      request(app)
      .post('/users')
      .send(newRequestBody)
      .expect(400)
      .then( (res: request.Response) => {
          expect(res.body.message).toBe('400 Not Acceptable. All fields are required. Missing fields: userType, name, lastName, dateOfBirth, dniNumber, localAddress, mail, phoneNumber, password');
        done();
      });

      newRequestBody = { userType: 1 };
      request(app)
      .post('/users')
      .send(newRequestBody)
      .expect(400)
      .then( (res: request.Response) => {
          expect(res.body.message).toBe('400 Not Acceptable. All fields are required. Missing fields: name, lastName, dateOfBirth, dniNumber, localAddress, mail, phoneNumber, password');
        done();
      });

      newRequestBody = { name: "u2" };
      request(app)
      .post('/users')
      .send(newRequestBody)
      .expect(400)
      .then( (res: request.Response) => {
          expect(res.body.message).toBe('400 Not Acceptable. All fields are required. Missing fields: lastName, dateOfBirth, dniNumber, localAddress, mail, phoneNumber, password');
        done();
      });

      newRequestBody = { lastName: "u2" };
      request(app)
      .post('/users')
      .send(newRequestBody)
      .expect(400)
      .then( (res: request.Response) => {
          expect(res.body.message).toBe('400 Not Acceptable. All fields are required. Missing fields: dateOfBirth, dniNumber, localAddress, mail, phoneNumber, password');
        done();
      });

      newRequestBody = { dateOfBirth: "1994-10-25" };
      request(app)
      .post('/users')
      .send(newRequestBody)
      .expect(400)
      .then( (res: request.Response) => {
          expect(res.body.message).toBe('400 Not Acceptable. All fields are required. Missing fields: dniNumber, localAddress, mail, phoneNumber, password');
        done();
      });

      newRequestBody = { dniNumber: "12312333" };
      request(app)
      .post('/users')
      .send(newRequestBody)
      .expect(400)
      .then( (res: request.Response) => {
          expect(res.body.message).toBe('400 Not Acceptable. All fields are required. Missing fields: localAddress, mail, phoneNumber, password');
        done();
      });

      newRequestBody = { localAddress: "Liniers" };
      request(app)
      .post('/users')
      .send(newRequestBody)
      .expect(400)
      .then( (res: request.Response) => {
          expect(res.body.message).toBe('400 Not Acceptable. All fields are required. Missing fields: mail, phoneNumber, password');
        done();
      });

      newRequestBody = { mail: "alex12@alex.com" };
      request(app)
      .post('/users')
      .send(newRequestBody)
      .expect(400)
      .then( (res: request.Response) => {
          expect(res.body.message).toBe('400 Not Acceptable. All fields are required. Missing fields: phoneNumber, password');
        done();
      });

      newRequestBody = { phoneNumber: "1111112221" };
      request(app)
      .post('/users')
      .send(newRequestBody)
      .expect(400)
      .then( (res: request.Response) => {
          expect(res.body.message).toBe('400 Not Acceptable. All fields are required. Missing fields: password');
        done();
      });
    });
  });
