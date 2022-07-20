import request from 'supertest';
import userRepository from '../app/services/users';
import app from '../app';

describe('/users POST', () => {
    const requestBodyCarer = { userType: 2, name: "u3", lastName: "u3", dateOfBirth: "1994-10-25", dniNumber: "11111111", localAddress: "calle falsa 123",
    postalCode: "1234", province: "Springfield", mail: "alex1@alex.com", phoneNumber: "1111112221", password: "123456789", price: 200};
    const requestBodyFamiliar = { userType: 1, name: "u2", lastName: "u2", dateOfBirth: "1994-10-25", dniNumber: "11111112", localAddress: "calle falsa 123",
    postalCode: "1234", province: "Springfield", mail: "alex@alex.com", phoneNumber: "1111112222", password: "123456789"};
    beforeEach(() =>{
        userRepository.createAndSave({
            userType: 2, name: "u3", lastName: "u3", dateOfBirth: "1994-10-25", dniNumber: "11111111", localAddress: "calle falsa 123", postalCode: "1234",
            province: "Springfield", mail: "alex1@alex.com", phoneNumber: "1111112221", password: "123456789", price: 200});
        userRepository.createAndSave({
            userType: 1, name: "u2", lastName: "u2", dateOfBirth: "1994-10-25", dniNumber: "11111111", localAddress: "calle falsa 123", postalCode: "1234",
            province: "Springfield", mail: "alex1@alex.com", phoneNumber: "1111112221", password: "123456789"})
            }
        );
    
    it('Success create an user', (done: jest.DoneCallback) => {
      request(app)
        .post('/users')
        .send(requestBodyFamiliar)
        .expect(201)
        .then((res: request.Response) => {
            expect(res.body.user.name).toBe(requestBodyFamiliar.name);
            expect(res.body.user.lastName).toBe(requestBodyFamiliar.lastName);
            expect(res.body.user.dateOfBirth).toBe(requestBodyFamiliar.dateOfBirth);
            expect(res.body.user.dniNumber).toBe(requestBodyFamiliar.dniNumber);
            expect(res.body.user.localAddress).toBe(requestBodyFamiliar.localAddress);
            expect(res.body.user.mail).toBe(requestBodyFamiliar.mail);
            expect(res.body.user.otherMail).toBe(null);
            expect(res.body.user.phoneNumber).toBe(requestBodyFamiliar.phoneNumber);
            expect(res.body.user.postalCode).toBe(requestBodyFamiliar.postalCode);
            expect(res.body.user.province).toBe(requestBodyFamiliar.province);
            expect(res.body.user.apartment).toBe(null);
            expect(res.body.user.floor).toBe(null);
            expect(res.body.user).toHaveProperty('password');
            expect(res.body.user).toHaveProperty('id');
            const user = userRepository.findUser(Number.parseInt(requestBodyFamiliar.userType.toString()), { dniNumber: '11111112' })
            expect(user).not.toBeNull();
            done();
        });

        request(app)
        .post('/users')
        .send(requestBodyCarer)
        .expect(201)
        .then((res: request.Response) => {
            expect(res.body.user.name).toBe(requestBodyCarer.name);
            expect(res.body.user.lastName).toBe(requestBodyCarer.lastName);
            expect(res.body.user.dateOfBirth).toBe(requestBodyCarer.dateOfBirth);
            expect(res.body.user.dniNumber).toBe(requestBodyCarer.dniNumber);
            expect(res.body.user.localAddress).toBe(requestBodyCarer.localAddress);
            expect(res.body.user.mail).toBe(requestBodyCarer.mail);
            expect(res.body.user.otherMail).toBe(null);
            expect(res.body.user.phoneNumber).toBe(requestBodyCarer.phoneNumber);
            expect(res.body.user.postalCode).toBe(requestBodyCarer.postalCode);
            expect(res.body.user.province).toBe(requestBodyCarer.province);
            expect(res.body.user.apartment).toBe(null);
            expect(res.body.user.floor).toBe(null);
            expect(res.body.user).toHaveProperty('password');
            expect(res.body.user).toHaveProperty('id');
            const user = userRepository.findUser(Number.parseInt(requestBodyCarer.userType.toString()), { dniNumber: '11111112' })
            expect(user).not.toBeNull();
            done();
        });
    });

    it('fails creating an existing user by validations', (done: jest.DoneCallback) => {
        requestBodyFamiliar.mail = 'alex@alex.com';
      request(app)
        .post('/users')
        .send(requestBodyFamiliar)
        .expect(406)
        .then( (res: request.Response) => {
            expect(res.body.message).toBe('406 Not Acceptable. Mail already exists');
          done();
        });

        requestBodyFamiliar.mail = 'alex1@alex.com';
        requestBodyFamiliar.dniNumber = '12312332';
      request(app)
        .post('/users')
        .send(requestBodyFamiliar)
        .expect(406)
        .then( (res: request.Response) => {
            expect(res.body.message).toBe('406 Not Acceptable. Dni number already exists');
          done();
        });
        
        requestBodyFamiliar.mail = 'alex1@alex.com';
        requestBodyFamiliar.dniNumber = '12312331';
        requestBodyFamiliar.phoneNumber = '1111112221';
      request(app)
        .post('/users')
        .send(requestBodyFamiliar)
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
