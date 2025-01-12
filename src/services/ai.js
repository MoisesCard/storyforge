import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

export const generateSuggestion = async (prompt) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a helpful writing assistant that provides creative suggestions and feedback."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating suggestion:', error);
    throw error;
  }
};

export const generateCharacter = async (parameters) => {
  const prompt = `Create a character with the following parameters:
    Genre: ${parameters.genre}
    Role: ${parameters.role}
    Additional details: ${parameters.details}`;

  return generateSuggestion(prompt);
};

export const generatePlotIdea = async (genre, theme) => {
  const prompt = `Generate a unique plot idea for a ${genre} story with the theme of ${theme}`;
  return generateSuggestion(prompt);
}; 