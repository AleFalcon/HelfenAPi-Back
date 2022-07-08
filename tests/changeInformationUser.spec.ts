// import request from 'supertest';
// import userRepository from '../app/services/users';
// import app from '../app';

// describe('/users PUT', () => {
//     const requestBody = { userType: 2, name: "u3", lastName: "u3", dateOfBirth: "1994-10-25", dniNumber: "11111111", localAddress: "calle falsa 123",
//     postalCode: "1234", province: "Springfield", mail: "alex1@alex.com", phoneNumber: "1111112221", password: "123456789", price: 200};
//     beforeEach(() =>{
//         userRepository.createAndSave({
//             userType: 2, name: "u3", lastName: "u3", dateOfBirth: "1994-10-25", dniNumber: "11111111", localAddress: "calle falsa 123", postalCode: "1234",
//             province: "Springfield", mail: "alex1@alex.com", phoneNumber: "1111112221", password: "123456789", price: 200});
//         userRepository.createAndSave({
//             userType: 1, name: "u2", lastName: "u2", dateOfBirth: "1994-10-25", dniNumber: "11111111", localAddress: "calle falsa 123", postalCode: "1234",
//             province: "Springfield", mail: "alex1@alex.com", phoneNumber: "1111112221", password: "123456789"})
//             }
//         );
    
//     it('Success modify an user', (done: jest.DoneCallback) => {
//       request(app)
//         .post('/users')
//         .send(requestBody)
//         .expect(200)
//         .then((res: request.Response) => {
//             expect(res.body.user.userType).toBe(1);
//             expect(res.body.user.name).toBe(requestBody.name);
//             expect(res.body.user.lastName).toBe(requestBody.lastName);
//             expect(res.body.user.dateOfBirth).toBe(requestBody.dateOfBirth);
//             expect(res.body.user.dniNumber).toBe(requestBody.dniNumber);
//             expect(res.body.user.localAddress).toBe(requestBody.localAddress);
//             expect(res.body.user.mail).toBe(requestBody.mail);
//             expect(res.body.user.phoneNumber).toBe(requestBody.phoneNumber);
//             expect(res.body.user).toHaveProperty('password');
//             expect(res.body.user).toHaveProperty('id');
//           done();
//         });
        
//     });

//     it('Fails modify information an existing user', (done: jest.DoneCallback) => {
//         const newRequestBody = { password: "123456789", newPassword:"11111111", newPasswordConfirmation:"11111111" };
//         request(app)
//         .put('/changePassword')
//         .send(newRequestBody)
//         .expect(400)
//         .then( (res: request.Response) => {
//             expect(res.body.message).toBe('400 Bad Request Error. Dni number is required.');
//           done();
//         });

//         requestBody.dniNumber = "12312331";
//         request(app)
//         .put('/changePassword')
//         .send(requestBody)
//         .expect(404)
//         .then( (res: request.Response) => {
//             expect(res.body.message).toBe('404 Not Found Error. User not found');
//           done();
//         });
//     });
//   });
