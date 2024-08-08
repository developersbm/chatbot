import AWS from 'aws-sdk';

AWS.config.update({
    region: 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const lexruntime = new AWS.LexRuntimeV2();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const lastMessage = req.body.pop();

        const params = {
            botId: '4PGGJNIPTQ',
            botAliasId: 'chatalias',
            localeId: 'en_US',
            sessionId: `Date.now().toString()`,
            text: lastMessage.content,
        };

        try {
            const lexResponse = await lexruntime.recognizeText(params).promise();

            // Lex V2
            const responseMessage = lexResponse.messages && lexResponse.messages.length > 0
                ? lexResponse.messages[0].content
                : 'Sorry, I didn’t understand that.';

            res.status(200).json({ message: responseMessage });
        } catch (error) {
            console.error('Lex error:', error);
            res.status(500).json({ message: "Error connecting to Lex." });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}