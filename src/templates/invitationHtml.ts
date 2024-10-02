const getInvitationHTMlTemplate = (userId:string,userName: string, token: string) => {
    const BASE_URL = process.env.BASE_URL;
    return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Welcome to Second Shorts admin</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
          }
    
          p {
            margin-bottom: 15px;
          }
    
          ol {
            margin-bottom: 15px;
            padding-left: 20px;
          }
    
          a {
            color: #007bff;
            text-decoration: none;
          }
    
          a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <p>Dear ${userName},</p>
    
        <p>
          Welcome to Launch Pilot!
        </p>
    
        <a href="${BASE_URL}/verify/${userId}/${token}">Click here to verify</a>
    
        <p><strong>Instructions:</strong></p>
       
    
     
      </body>
    </html>`;
  };
  
  export default getInvitationHTMlTemplate;
  