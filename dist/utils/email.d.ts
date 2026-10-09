interface MailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}
export declare function sendEmail(options: MailOptions): Promise<void>;
export declare function contactNotificationHtml(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    phone?: string;
    projectType?: string;
}): string;
export {};
//# sourceMappingURL=email.d.ts.map