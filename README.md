# Story Telling RAG

A character analysis tool built with [LlamaIndex](https://www.llamaindex.ai/) and [Next.js](https://nextjs.org/), bootstrapped with [`create-llama`](https://github.com/run-llama/LlamaIndexTS/tree/main/packages/create-llama).

## Features

- Upload and analyze text files
- Extract character information
- Display character analysis in a clean, formatted table
- Hidden chat interface for seamless user experience

## Getting Started

First, install the dependencies:

```bash
npm install
```

Second, generate the embeddings of the documents in the `./data` directory:

```bash
npm run generate
```

Third, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Using Docker

1. Build an image for the Next.js app:

```bash
docker build -t <your_app_image_name> .
```

2. Generate embeddings:

Parse the data and generate the vector embeddings if the `./data` folder exists - otherwise, skip this step:

```bash
docker run \
  --rm \
  -v $(pwd)/.env:/app/.env \
  -v $(pwd)/config:/app/config \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/cache:/app/cache \
  <your_app_image_name> \
  npm run generate
```

3. Start the app:

```bash
docker run \
  --rm \
  -v $(pwd)/.env:/app/.env \
  -v $(pwd)/config:/app/config \
  -v $(pwd)/cache:/app/cache \
  -p 3000:3000 \
  <your_app_image_name>
```

## Learn More

To learn more about LlamaIndex, take a look at the following resources:

- [LlamaIndex Documentation](https://docs.llamaindex.ai) - learn about LlamaIndex (Python features).
- [LlamaIndexTS Documentation](https://ts.llamaindex.ai) - learn about LlamaIndex (Typescript features).

You can check out [the LlamaIndexTS GitHub repository](https://github.com/run-llama/LlamaIndexTS) - your feedback and contributions are welcome!
