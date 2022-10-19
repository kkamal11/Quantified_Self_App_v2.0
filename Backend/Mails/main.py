import os
import sendgrid
import base64
from sendgrid.helpers.mail import Mail, Email, To, Content, HtmlContent, Attachment,FileContent, FileName, FileType, Disposition, ContentId
from bs4 import BeautifulSoup
#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


def send_email(receiver_email,subject,message,attachment_files=[],file_type='PDF'):
    from_email = Email("kishorkamalkml@gmail.com")  # my verified sender
    to_email = To(receiver_email)  #recipient address
    subject = subject
    try:
        if file_type == 'PDF':
            fileType = 'application/pdf'
            fileName = 'Report.pdf'
        elif file_type == 'CSV':
            fileType = 'application/csv'
            fileName = 'Report.csv'
        else:
            raise Exception('file type invalid')
        html_content = HtmlContent(message)
        soup = BeautifulSoup(message,features="html5lib")
        plain_text = soup.get_text()
        plain_text_content = Content("text/plain", plain_text)
        mail = Mail(from_email, to_email, subject, plain_text_content, html_content)
        if len(attachment_files) > 0:
            for file in attachment_files:
                with open(file, 'rb') as f:
                    data = f.read()
                encoded = base64.b64encode(data).decode()
                attachment = Attachment()
                attachment.file_content = FileContent(encoded)
                attachment.file_type = FileType(fileType)
                attachment.file_name = FileName(fileName)
                attachment.disposition = Disposition('attachment')
                attachment.content_id = ContentId('Example Content ID')
                mail.attachment = attachment
                
        sendgrid_client = sendgrid.SendGridAPIClient(api_key='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')
        # Get a JSON-ready representation of the Mail object
        mail_json = mail.get()
        # Send an HTTP POST request to /mail/send
        response = sendgrid_client.client.mail.send.post(request_body=mail_json)
        return response.status_code
    except Exception as e:
        print(e)
