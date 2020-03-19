import * as yup from 'yup';
import * as bcrypt from 'bcryptjs';

import { ResolverMap } from '../../types/graphql';
import { User } from '../../entity/User';
import { lockUserAccount } from '../../utils/lockUserAccount';
import { createForgotPasswordLink } from '../../utils/createForgotPasswordLink';
import { forgotPasswordPrefix } from '../../utils/constants';
import { registerPasswordValidation } from '../../utils/centralSchema';
import { formatYupError } from '../../utils/formatYupError';
import { expiredLink } from './errorMessage';

const schema = yup.object().shape({
    newPassword: registerPasswordValidation,
});

export const resolvers: ResolverMap = {
    Query: {
        foo: () => 'bar',
    },
    Mutation: {
        sendForgotPasswordEmail: async (
            _,
            { email }: GQL.ISendForgotPasswordEmailOnMutationArguments,
            { redis },
        ) => {
            const user = await User.findOne({ where: { email } });

            if (!user)
                return [
                    { path: 'email', message: 'password could not be changed' },
                ];

            await lockUserAccount(user.id, redis);

            // @ todo  add front end url
            const url = await createForgotPasswordLink('', user.id, redis);
            console.log('Send forgot password', url);
            // @ send email with url
            return true;
        },
        changePassword: async (
            _,
            { newPassword, key }: GQL.IChangePasswordOnMutationArguments,
            { redis },
        ) => {
            const userId = await redis.get(`${forgotPasswordPrefix}${key}`);
            await redis.del(`${forgotPasswordPrefix}${key}`);

            if (!userId)
                return [
                    {
                        path: 'key',
                        message: expiredLink,
                    },
                ];

            try {
                await schema.validate({ newPassword }, { abortEarly: false });
            } catch (err) {
                return formatYupError(err);
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const userUpdatePromise = User.update(
                { id: userId },
                { accountLocked: false, password: hashedPassword },
            );

            const deleteRedisKey = redis.del(`${forgotPasswordPrefix}${key}`);

            await Promise.all([userUpdatePromise, deleteRedisKey]);

            return null;
        },
    },
};
