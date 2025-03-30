# Story Telling RAG

A creative writing assistant that combines character analysis with AI-powered story generation. Built with [Next.js](https://nextjs.org/) and powered by OpenAI's GPT models.

## Features

- **Character Analysis**: Upload and analyze text files to extract detailed character information
- **Interactive Chat Interface**: Seamless chat experience for story generation and character analysis
- **AI Story Generation**: Create new stories based on analyzed characters using GPT-4
- **Character Table**: Clean, formatted display of character information including:
  - Character names and roles
  - Physical descriptions
  - Personality traits
  - Relationships
  - Background information
- **Story Management**: Generate, save, and view multiple stories with character integration

## Getting Started

1. Install the dependencies:

```bash
npm install
```

2. Set up your environment variables:
Create a `.env` file in the root directory with:

```
OPENAI_API_KEY=your_openai_api_key
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to start using the application.

## How to Use

1. **Upload Text**: Start by uploading a text file containing your story or character descriptions
2. **Character Analysis**: The system will automatically analyze and extract character information
3. **View Characters**: Check the character table to see the extracted information
4. **Generate Stories**: Use the chat interface to create new stories based on the analyzed characters
5. **Save Stories**: Save your generated stories for future reference

## Technical Stack

- **Frontend**: Next.js with TypeScript
- **UI Components**: Tailwind CSS and Shadcn UI
- **AI Integration**: OpenAI GPT-4 API
- **State Management**: React Context API

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
