import * as bcrypt from 'bcryptjs';
import * as yup from 'yup';

import { User } from '../../entity/User';
import {ResolveMap} from "../../types/graphql";
import {formatYupError} from '../../utils/formatYupError';
import { duplicateEmail, wrongEmailLength, wrongEmailFormat, wongPasswordLength } from './errorMessages';
import { createConfirmEmailLink } from '../../utils/createConfirmedEmailLink';

const schema = yup.object().shape({
    email: yup
    .string()
    .min(3, wrongEmailLength)
    .max(255)
    .email(wrongEmailFormat), 
    password: yup
    .string()
    .min(3, wongPasswordLength)
    .max(255)
})

export const resolvers: ResolveMap = {
    Query: {
    bye:() => "Bye !"
},
    Mutation: {
        register: async (_, args: GQL.IRegisterOnMutationArguments, { redis, url }) => {
            try {
                await schema.validate(args, { abortEarly: false })
            } catch (err) {
                return formatYupError(err)
            }

            const { email, password } = args;

            const userAlreadyExists = await User.findOne({
                where: { email }, 
                select: ["id"]
            });

            if (userAlreadyExists) {
                return [
                    {
                        path: "email", 
                        message: duplicateEmail
                    }
                ]
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = User.create({email, password: hashedPassword});
            
            await user.save();
            await createConfirmEmailLink(url, user.id, redis);
            return null;
        }
    }
}; 