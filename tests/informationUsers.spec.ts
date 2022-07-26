// import request from 'supertest';
// import userRepository from '../app/services/familiarUsers';
// import app from '../app';

// describe('/users/dniNumber GET', () => {
//     const informationResponse = { userType: 1, name: "u1" , lastName: "u1",dateOfBirth: "1994-10-25", dniNumber: "12312332", 
//       localAddress: "Liniers", mail: "alex@alex.com", phoneNumber: "1111112222", password: "123456789" }
//     beforeEach(() => userRepository.createMany([informationResponse]));
    
//     it('Success get information an user', (done: jest.DoneCallback) => {
//       request(app)
//         .get('/users/12312332')
//         .send()
//         .expect(200)
//         .then((res: request.Response) => {
//         expect(res.body.userType).toBe(informationResponse.userType);
//         expect(res.body.name).toBe(informationResponse.name);
//         expect(res.body.lastName).toBe(informationResponse.lastName);
//         expect(res.body.dateOfBirth).toBe("1994-10-25T00:00:00.000Z");
//         expect(res.body.dniNumber).toBe(informationResponse.dniNumber);
//         expect(res.body.localAddress).toBe(informationResponse.localAddress);
//         expect(res.body.mail).toBe(informationResponse.mail);
//         expect(res.body.phoneNumber).toBe(informationResponse.phoneNumber);
//         expect(res.body).toHaveProperty('password');
//         expect(res.body).toHaveProperty('id');
//         done();
//         });
//     });

//     it('User not found', (done: jest.DoneCallback) => {
//         request(app)
//           .get('/users/12312331')
//           .send()
//           .expect(404)
//           .then((res: request.Response) => {
//             expect(res.body.message).toBe("404 Not Found Error. User not found");
//           done();
//           });
//       });
// });