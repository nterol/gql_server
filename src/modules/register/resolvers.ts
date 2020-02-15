import * as bcrypt from 'bcryptjs';
import * as yup from 'yup';
import { v4 } from 'uuid';

import { User } from '../../entity/User';
import { ResolveMap } from '../../types/graphql';
import { formatYupError } from '../../utils/formatYupError';
import {
    duplicateEmail,
    wrongEmailLength,
    wrongEmailFormat,
    wongPasswordLength,
} from './errorMessages';
import { createConfirmEmailLink } from '../../utils/createConfirmedEmailLink';
import { sendEmail } from '../../utils/sendEmail';

const schema = yup.object().shape({
    email: yup
        .string()
        .min(3, wrongEmailLength)
        .max(255)
        .email(wrongEmailFormat),
    password: yup
        .string()
        .min(3, wongPasswordLength)
        .max(255),
});

export const resolvers: ResolveMap = {
    Query: {
        bye: () => 'Bye !',
    },
    Mutation: {
        register: async (
            _,
            args: GQL.IRegisterOnMutationArguments,
            { redis, url },
        ) => {
            try {
                await schema.validate(args, { abortEarly: false });
            } catch (err) {
                return formatYupError(err);
            }

            const { email, password } = args;

            const userAlreadyExists = await User.findOne({
                where: { email },
                select: ['id'],
            });

            if (userAlreadyExists) {
                return [
                    {
                        path: 'email',
                        message: duplicateEmail,
                    },
                ];
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = User.create({
                id: v4(),
                email,
                password: hashedPassword,
            });

            await user.save();

            if (process.env.NODE_ENV !== 'test') {
                const link = await createConfirmEmailLink(url, user.id, redis);
                await sendEmail(email, link);
            }

            return null;
        },
    },
};
