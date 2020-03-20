import * as SparkPost from 'sparkpost';
import { registerEmailHTML } from './confirmationMailTemplate';

const client = new SparkPost(process.env.SPARKPOST_API_KEY || 'fakeapikey');

export const sendEmail = async (
    recipient: string,
    url: string,
): Promise<any> => {
    try {
        const response = await client.transmissions.send({
            options: {
                sandbox: true,
            },
            content: {
                from: 'testing@sparkpostbox.com',
                subject: 'Verify Email address from Grimoire',
                html: registerEmailHTML(url),
            },
            recipients: [{ address: recipient }],
        });

        console.log('RESPONSE FROM EMAIL SERVICE', response);
    } catch (e) {
        console.log('MAIL ERROR', e);
    }
};
