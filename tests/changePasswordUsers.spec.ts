import request from 'supertest';
import userRepository from '../app/services/familiarUsers';
import app from '../app';

describe('/changePassword PUT', () => {
    const user = { userType: 1, name: "u1" , lastName: "u1",dateOfBirth: "1994-10-25", dniNumber: "12312332", 
      localAddress: "Liniers", mail: "alex@alex.com", phoneNumber: "1111112222", password: "123456789" }
    beforeEach(() => userRepository.createMany([user]));
    
    const requestBody = { dniNumber: "12312332", password: "123456789", newPassword:"11111111", newPasswordConfirmation:"11111111" };
    
    it('Success change password an user', (done: jest.DoneCallback) => {
      request(app)
        .put('/changePassword')
        .send(requestBody)
        .expect(200)
        .then((res: request.Response) => {
          expect(res.body.user.userType).toBe(user.userType);
          expect(res.body.user.name).toBe(user.name);
          expect(res.body.user.lastName).toBe(user.lastName);
          expect(res.body.user.dateOfBirth).toBe(user.dateOfBirth);
          expect(res.body.user.dniNumber).toBe(user.dniNumber);
          expect(res.body.user.localAddress).toBe(user.localAddress);
          expect(res.body.user.mail).toBe(user.mail);
          expect(res.body.user.phoneNumber).toBe(user.phoneNumber);
          expect(res.body.user).toHaveProperty('password');
          expect(res.body.user).toHaveProperty('id');
          done();
        });
    });

    it('Fails changes password an user by params valitadtion', (done: jest.DoneCallback) => {
      const newRequestBody = { password: "123456789", newPassword:"11111111", newPasswordConfirmation:"11111111" };
      request(app)
      .put('/changePassword')
      .send(newRequestBody)
      .expect(400)
      .then( (res: request.Response) => {
          expect(res.body.message).toBe('400 Bad Request Error. Dni number is required.');
        done();
      });

      requestBody.dniNumber = "12312331";
      request(app)
      .put('/changePassword')
      .send(requestBody)
      .expect(404)
      .then( (res: request.Response) => {
          expect(res.body.message).toBe('404 Not Found Error. User not found');
        done();
      });
      
      requestBody.dniNumber = "12312332";
      requestBody.password = "11111111";
      request(app)
      .put('/changePassword')
      .send(requestBody)
      .expect(406)
      .then( (res: request.Response) => {
          expect(res.body.message).toBe('406 Not Acceptable. Password is mischmasch');
        done();
      });

      requestBody.password = "123456789";
      requestBody.newPasswordConfirmation = "11111112";
      request(app)
      .put('/changePassword')
      .send(requestBody)
      .expect(406)
      .then( (res: request.Response) => {
          expect(res.body.message).toBe('406 Not Acceptable. The new password is mischmasch with the confirmation password');
        done();
      });
    });
});