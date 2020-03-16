import * as bcrypt from 'bcryptjs';

import { ResolverMap } from '../../types/graphql';
import { User } from '../../entity/User';
import { invalidLoginMessage, pleaseConfirm } from './errorMessages';

export const resolvers: ResolverMap = {
    Query: {
        coucou: () => 'coucou',
    },
    Mutation: {
        login: async (
            _,
            { email, password }: GQL.ILoginOnMutationArguments,
            { session },
        ) => {
            const user = await User.findOne({ where: { email } });

            if (!user) return invalidLoginMessage;

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) return invalidLoginMessage;

            if (!user.confirmed)
                return [{ path: 'email', message: pleaseConfirm }];

            // login successfull
            session.userId = user.id;

            return null;
        },
    },
};
