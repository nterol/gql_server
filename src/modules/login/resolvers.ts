import * as bcrypt from 'bcryptjs';

import { ResolveMap } from '../../types/graphql';
import { User } from '../../entity/User';
import { invalidLoginMessage, pleaseConfirm } from './errorMessages';

export const resolvers: ResolveMap = {
    Query: {
        coucou: () => 'coucou',
    },
    Mutation: {
        login: async (
            _,
            { email, password }: GQL.ILoginOnMutationArguments,
        ) => {
            const user = await User.findOne({ where: { email } });

            if (!user) return invalidLoginMessage;

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) return invalidLoginMessage;

            if (!user.confirmed)
                return [{ path: 'email', message: pleaseConfirm }];

            return null;
        },
    },
};
