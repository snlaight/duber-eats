import { Inject, Injectable } from '@nestjs/common';
import got from 'got';
import * as FormData from 'form-data';

import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { MailModuleOptions, EmailVariables } from './mail.interfaces';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}

    async sendEmail(
        subject: string,
        template: string,
        emailVariables: EmailVariables[]
        ): Promise<boolean> {
        const form = new FormData();
        form.append('from', `Santiago at Uber Eats <mailgun@${this.options.domain}>`);
        form.append('to', `${this.options.fromEmail}`);
        form.append('subject', subject);
        form.append('template', template);
        emailVariables.forEach(emailVar => form.append(`v:${emailVar.key}`, emailVar.value));

        try {
           await got.post(`https://api.mailgun.net/v3/${this.options.domain}/messages`,
           {
                headers: {
                    'Authorization': `Basic ${Buffer.from(`api:${this.options.apiKey}`).toString('base64')}`
                },
                body: form
            }
            );
            return true;
        } catch (error) {
            return false;
        }
    }

    sendVerificationEmail(email: string, code: string) {
        this.sendEmail('Verify Your Email', 'verify-email', [
            {key: 'code', value: code},
            {key: 'username', value: email}
        ])
    }
}
