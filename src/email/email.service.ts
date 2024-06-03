import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

@Injectable()
export class EmailService {
  private sesClient: SESClient;

  constructor(private configService: ConfigService) {
    this.sesClient = new SESClient({
      region: this.configService.get<string>('aws.region'),
      credentials: {
        accessKeyId: this.configService.get<string>('aws.accessKeyId'),
        secretAccessKey: this.configService.get<string>('aws.secretAccessKey'),
      },
    });
  }

  async sendEmail(to: string, subject: string, body: string) {
    const params = {
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Text: { Data: body },
        },
        Subject: { Data: subject },
      },
      Source: 'your-verified-email@example.com', // Use um endereço de email verificado no SES
    };

    try {
      const command = new SendEmailCommand(params);
      const response = await this.sesClient.send(command);
      console.log('Email enviado com sucesso:', response);
    } catch (error) {
      console.error('Erro ao enviar o email:', error);
    }
  }
}
