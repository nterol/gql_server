import * as Redis from 'ioredis';
import nodeFetch from 'node-fetch';

import { createConfirmEmailLink } from "../createConfirmedEmailLink"
import { createTypeormConn } from "../createTypeormConn"
import { User } from "../../entity/User";


describe("*** create confirmation Emil link test suite ***", () => {
    
    let userId = "";
    let redis = new Redis();
    
    beforeAll(async  () => {
        await createTypeormConn();

       const user = await User.create({
           email: "test.link@test.com", 
           password: "justtest"}).save();
       
        userId = user.id;
    });


    it("should return ok", async () => {
       const url = await createConfirmEmailLink(
            process.env.TEST_HOST as string, 
            userId , 
            redis
        );

        const res = await nodeFetch(url);
        const text = await res.text();
        expect(text).toBe("OK");

        const user = await User.findOne({where: {id: userId}});
        
        if (user) {
            expect(user.confirmed).toBeTruthy();
        }

        const urlMap = url.split("/");
        const key = urlMap[urlMap.length -1];
        const value  = await redis.get(key);
        expect(value).toBeNull();
    });
})