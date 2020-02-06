import { request } from 'graphql-request';
import { User } from '../../entity/User';
import { 
    duplicateEmail, 
    wrongEmailLength, 
    wrongEmailFormat, 
    wongPasswordLength 
} from './errorMessages';
import { createTypeormConn } from '../../utils/createTypeormConn';




const email = "bob@gmail.com";
const password = "bob";


const mutation = (e:string, p:string ) => `
    mutation {
        register(email: "${e}", password: "${p}") {
            path
            message
        }
    }
`;

describe("*** register test suite ***", () => {

    beforeAll(async () => {
        await createTypeormConn();
    })

    it("should register a user", async () => {

        const response = await request(process.env.TEST_HOST as string,
            mutation(email,password));
        expect(response).toEqual({register: null });
        
        const users = await User.find({ where: { email }});
        expect(users).toHaveLength(1);
        const [user] = users;
        expect(user.email).toEqual(email);
        expect(user.password).not.toEqual(password);
    });

   it("should not register duplicate email", async () => {
        const response2: any = await request(process.env.TEST_HOST as string, mutation(email, password));
        expect(response2.register).toHaveLength(1);
        expect(response2.register[0]).toEqual({
            path: "email",
            message: duplicateEmail
        });
    });

    it("should not register user on wrong email", async () => {

        const response3 : any = await request(process.env.TEST_HOST as string, mutation("b",password ))
        expect(response3.register).toHaveLength(2);
        expect(response3.register).toEqual([{
            path: "email", 
            message: wrongEmailLength 
        }, {
            path: "email", 
            message: wrongEmailFormat
        }]);
    });


    it ("should no register user on wrong password", async () => {
        const response4: any = await request(process.env.TEST_HOST as string, mutation(email, "b"));
        expect(response4.register).toHaveLength(1);
        expect(response4.register).toEqual([{
            path:"password",
            message: wongPasswordLength
        }])
    });

    it("should not register user on wrong email and password ", async () =>{
        const response4: any = await request(process.env.TEST_HOST as string, mutation("b", "b"));
        expect(response4.register).toHaveLength(3);
        expect(response4.register).toEqual([{
            path: "email", 
            message: wrongEmailLength 
        }, {
            path: "email", 
            message: wrongEmailFormat
        },{
            path:"password",
            message: wongPasswordLength
        }])
    });
});
