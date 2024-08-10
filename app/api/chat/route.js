// /app/api/chat/route.js

export async function POST(req) {
    const { message } = await req.json();
    const openAiApiKey = process.env.OPENAI_API_KEY;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${openAiApiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: message }],
            }),
        });

        const data = await response.json();
        
        console.log('OpenAI API Response:', data);

        const responseMessage = data.choices?.[0]?.message?.content || 'Sorry, I didn’t understand that.';
        return new Response(JSON.stringify({ message: responseMessage }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('GPT error:', error);
        return new Response(JSON.stringify({ message: "Error connecting to GPT." }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
