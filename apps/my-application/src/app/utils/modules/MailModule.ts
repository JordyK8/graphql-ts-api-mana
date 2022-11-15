import config from "../../config/mail";
import nodemailer from "nodemailer";
import * as fs from "fs";
import ejs from "ejs";
import path from "path";
import lodash from "lodash";
import DateModule from "./DateModule";
import { logging as logger } from "@my-foods2/logging";
export interface SendMailFields { to: string | string[], subject: string, view?: string, data: object, files?: any }

export class MailModule {
    private transporter: nodemailer.Transporter;

    constructor(mailer = '') {
        // Configure mail settings
        mailer = mailer ? mailer : config.default;
        this.transporter = nodemailer.createTransport(config.mailers[mailer]);
    }

    /**
     *
     * @param to
     * @param subject
     * @param view
     * @param data
     * @param files
     */
    public send(sendmailFields: SendMailFields) {
        const { to, subject, view = 'template', data, files = [] } = sendmailFields;
        const templatePath = config.template.path + view + '.' + config.template.extension;
        const html = this.getMailTemplate(templatePath, data);
        const attachments = files.length ? this.getAttachments(files) : undefined;
        // Send mail
        return new Promise((resolve, reject) => {
            this.transporter.sendMail({
                from: `${config.from.name} <${config.from.address}>`,
                to,
                subject,
                text: "",
                html,
                attachments
            }).then(() => resolve(true))
            .catch(e => reject(e));
        })
    }

    /**
     * Read ejs file and convert to html
     *
     * @param view
     * @param data
     * @return {string}
     */
    protected getMailTemplate(view: string, data: object) {
        const file = fs.readFileSync(path.join(process.cwd(), view), 'ascii');
        return ejs.render(file, data);
    }

    /**
     *
     * @param attachment
     * @return {attachment}
     */
    protected getAttachment(attachment: any) {
        return [{
            filename: attachment.name,
            content: attachment.data,
            encoding: attachment.encoding
        }];
    }

    /**
     *
     * @param files
     * @return {attachment | attachments}
     */
    protected getAttachments(files: any) {
        files = files[Object.keys(files)[0]];
        // Check if one or more attachments
        if (!lodash.isArray(files)) {
            return this.getAttachment(files);
        }
        const attachments: { filename: string; content: any; encoding: any; }[] = [];
        files.forEach((attachment: { name: string; data: any; encoding: any; }) => {
            attachments.push({
                filename: attachment.name,
                content: attachment.data,
                encoding: attachment.encoding
            });
        });
        return attachments;
    }
}

const mailModule = new MailModule();
export default mailModule;
