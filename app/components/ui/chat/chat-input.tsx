"use client";

import { useFile } from "@llamaindex/chat-ui";
import { DocumentInfo, ImagePreview } from "@llamaindex/chat-ui/widgets";
import { LlamaCloudSelector } from "./custom/llama-cloud-selector";
import { useClientConfig } from "./hooks/use-config";
import { useState, useEffect } from "react";
import { useChatUI } from "@llamaindex/chat-ui";

type Character = {
  name: string;
  description: string;
  personality: string;
}

type CharacterAnalysis = {
  characters: Character[];
}

export default function CustomChatInput() {
  const { backend } = useClientConfig();
  const [isLoading, setIsLoading] = useState(false);
  const [characterAnalysis, setCharacterAnalysis] = useState<CharacterAnalysis | null>(null);
  const {
    imageUrl,
    setImageUrl,
    uploadFile,
    files,
    removeDoc,
    reset,
    getAnnotations,
  } = useFile({ uploadAPI: `${backend}/api/chat/upload` });

  const { append, messages, isLoading: isChatLoading } = useChatUI();

  // Effect to watch for new assistant messages
  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        console.log('Raw assistant message:', lastMessage);
        console.log('Message content:', lastMessage.content);
        
        // Try to find and parse the table content
        const tableContent = extractTableContent(lastMessage.content);
        if (tableContent) {
          try {
            const analysis = parseTableContent(tableContent);
            setCharacterAnalysis(analysis);
          } catch (error) {
            console.error('Failed to parse table content:', error);
          }
        } else {
          console.log('No table content found in message');
        }
      }
    }
  }, [messages]);

  /**
   * Extracts table content from the message
   */
  const extractTableContent = (content: string): string | null => {
    // Split into lines and clean them
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    console.log('All lines:', lines);

    // Find the first line that looks like a table header
    const headerIndex = lines.findIndex(line => 
      line.includes('|') && 
      (line.toLowerCase().includes('name') || 
       line.toLowerCase().includes('description') || 
       line.toLowerCase().includes('personality'))
    );

    if (headerIndex === -1) {
      console.log('No header line found');
      return null;
    }

    // Get all lines from the header until we hit a line without a pipe
    const tableLines = [];
    for (let i = headerIndex; i < lines.length; i++) {
      if (lines[i].includes('|')) {
        tableLines.push(lines[i]);
      } else {
        break;
      }
    }

    console.log('Found table lines:', tableLines);
    return tableLines.length > 0 ? tableLines.join('\n') : null;
  };

  /**
   * Parses table content into structured character data
   */
  const parseTableContent = (content: string): CharacterAnalysis => {
    const lines = content.split('\n');
    console.log('Parsing lines:', lines);

    // Get the header cells
    const headers = lines[0].split('|').map(cell => cell.trim()).filter(cell => cell);
    console.log('Headers:', headers);

    // Skip the separator row (line with dashes) and parse the data rows
    const characters = lines.slice(2).map(row => {
      const cells = row.split('|').map(cell => cell.trim()).filter(cell => cell);
      console.log('Row cells:', cells);
      
      if (cells.length !== 3) {
        console.log('Invalid row format:', cells);
        return null;
      }
      
      return {
        name: cells[0],
        description: cells[1],
        personality: cells[2]
      };
    }).filter((char): char is Character => char !== null);

    console.log('Parsed characters:', characters);
    return { characters };
  };

  /**
   * Handles file uploads. Overwrite to hook into the file upload behavior.
   * @param file The file to upload
   */
  const handleUploadFile = async (file: File) => {
    // There's already an image uploaded, only allow one image at a time
    if (imageUrl) {
      alert("You can only upload one image at a time.");
      return;
    }

    try {
      setIsLoading(true);
      console.log('Starting file upload:', file.name);
      
      // Upload the file using the original method
      const uploadedFile = await uploadFile(file);
      console.log('Upload response:', uploadedFile);

      if (!uploadedFile) {
        throw new Error('File upload failed. No response received.');
      }

      // Log the file upload success
      console.log('File uploaded successfully:', file.name);
      console.log('Uploaded file details:', uploadedFile);

      // Get the file annotations to ensure the file is properly processed
      const annotations = getAnnotations();
      console.log('File annotations:', annotations);

      // Reset the character analysis when a new file is uploaded
      setCharacterAnalysis(null);

    } catch (error: any) {
      // Show error message if upload fails
      console.error('File upload error:', error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles character extraction from the uploaded file
   */
  const handleExtractCharacters = async () => {
    if (files.length === 0) {
      alert('Please upload a file first.');
      return;
    }

    try {
      setIsLoading(true);
      const file = files[0]; // Get the first uploaded file

      // Send a message to the chat about the file upload
      await append({
        role: 'user',
        content: `Please analyze the content of the uploaded file "${file.name}" and extract all characters. For each character, provide their name, description, and personality traits. Format the response as a markdown table with columns: Name, Description, Personality. IMPORTANT: Only output the table, nothing else. Do not include any follow-up questions, additional text, or suggestions.`
      });

      // Wait for the chat to finish loading
      while (isChatLoading) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

    } catch (error: any) {
      console.error('Character extraction error:', error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="shadow-xl rounded-xl p-4">
        <div className="flex items-center gap-2 w-full">
          <span className="text-gray-600">Upload File:</span>
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUploadFile(file);
            }}
            className="flex-1"
            accept=".txt,.pdf,.doc,.docx"
            disabled={isLoading || isChatLoading}
          />
          <LlamaCloudSelector />
          <button
            onClick={handleExtractCharacters}
            disabled={isLoading || isChatLoading || files.length === 0}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading || isChatLoading ? 'Processing...' : 'Extract characters'}
          </button>
        </div>
        {/* File previews section */}
        {files.length > 0 && (
          <div className="flex gap-4 w-full overflow-auto py-2">
            {files.map((file) => (
              <DocumentInfo
                key={file.id}
                document={{ url: file.url, sources: [] }}
                className="mb-2 mt-2"
                onRemove={() => {
                  removeDoc(file);
                  setCharacterAnalysis(null);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Character Analysis Display */}
      {characterAnalysis && (
        <div className="shadow-xl rounded-xl p-4 bg-white">
          <h2 className="text-xl font-bold mb-4">Character Analysis</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Personality</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {characterAnalysis.characters.map((character, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{character.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{character.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{character.personality}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
