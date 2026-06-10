import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';
import OpenAI from 'openai';

// Initialize AI clients lazily to avoid build errors
let hf: HfInference | null = null;
let openai: OpenAI | null = null;

function getHfClient() {
  if (!hf && process.env.HUGGINGFACE_API_KEY) {
    hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
  }
  return hf;
}

function getOpenAIClient() {
  if (!openai && process.env.OPENAI_API_KEY) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

// POST endpoint to process PDF and generate notes
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const useOpenAI = formData.get('useOpenAI') === 'true';

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Extract text from PDF using pdf-parse
    const pdfParse = require('pdf-parse');
    const pdfData = await pdfParse(buffer);
    const extractedText = pdfData.text;

    console.log('PDF extracted:', {
      pages: pdfData.numpages,
      textLength: extractedText.length,
      fileName: file.name,
    });

    // Generate comprehensive notes using LLM
    let generatedNotes: string;

    if (useOpenAI && process.env.OPENAI_API_KEY) {
      // Use OpenAI GPT-4 for high-quality notes
      generatedNotes = await generateNotesWithOpenAI(extractedText, file.name);
    } else if (process.env.HUGGINGFACE_API_KEY) {
      // Use HuggingFace (free alternative)
      generatedNotes = await generateNotesWithHuggingFace(extractedText, file.name);
    } else {
      // Fallback to enhanced template-based generation
      generatedNotes = generateNotesFromTemplate(extractedText, file.name);
    }

    // Generate flashcards
    const flashcards = await generateFlashcards(extractedText, useOpenAI);

    // Generate quiz questions
    const quizQuestions = await generateQuizQuestions(extractedText, useOpenAI);

    return NextResponse.json({
      success: true,
      data: {
        extractedText: extractedText.substring(0, 1000), // First 1000 chars for preview
        notes: generatedNotes,
        flashcards,
        quizQuestions,
        metadata: {
          pages: pdfData.numpages,
          wordCount: generatedNotes.split(/\s+/).length,
          extractedLength: extractedText.length,
        },
      },
    });
  } catch (error) {
    console.error('PDF processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process PDF', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Generate notes using OpenAI GPT-4
async function generateNotesWithOpenAI(text: string, fileName: string): Promise<string> {
  const client = getOpenAIClient();
  if (!client) {
    throw new Error('OpenAI client not available');
  }

  const prompt = `You are an expert educational content creator. Generate comprehensive, detailed study notes from the following PDF content.

PDF Title: ${fileName}
Content: ${text.substring(0, 8000)} // Limit to avoid token limits

Create detailed notes with:
1. Clear chapter/section headings
2. Key concepts with explanations
3. Important definitions
4. Examples and applications
5. Historical context where relevant
6. Formulas and algorithms with step-by-step explanations
7. Study tips and exam preparation advice

Format the notes in a clear, structured manner with proper headings, bullet points, and emphasis on important terms.
Aim for 3000-5000 words of comprehensive content.`;

  const completion = await client.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are an expert educational content creator specializing in creating comprehensive study notes.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 4000,
  });

  return completion.choices[0].message.content || 'Failed to generate notes';
}

// Generate notes using HuggingFace (free alternative)
async function generateNotesWithHuggingFace(text: string, fileName: string): Promise<string> {
  try {
    const client = getHfClient();
    if (!client) {
      return generateNotesFromTemplate(text, fileName);
    }

    const prompt = `Generate comprehensive study notes from this educational content:

Title: ${fileName}
Content: ${text.substring(0, 2000)}

Create detailed notes with clear sections, key concepts, definitions, and examples. Make it comprehensive and educational.`;

    const response = await client.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.2',
      inputs: prompt,
      parameters: {
        max_new_tokens: 2000,
        temperature: 0.7,
        top_p: 0.95,
        return_full_text: false,
      },
    });

    return response.generated_text;
  } catch (error) {
    console.error('HuggingFace generation error:', error);
    // Fallback to template
    return generateNotesFromTemplate(text, fileName);
  }
}

// Fallback: Enhanced template-based generation
function generateNotesFromTemplate(text: string, fileName: string): string {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  // Extract key information
  const headings = lines.filter(line => 
    line.length < 100 && 
    (line.match(/^[A-Z\s]+$/) || line.match(/^\d+\./) || line.match(/^Chapter/i))
  );
  
  const definitions = lines.filter(line => 
    line.toLowerCase().includes('definition') || 
    line.toLowerCase().includes('is defined as') ||
    line.includes(':')
  );

  return `📚 COMPREHENSIVE STUDY NOTES — ${fileName.replace(/\.pdf$/i, '').toUpperCase()}
Generated: ${today}
${'-'.repeat(80)}

EXTRACTED CONTENT SUMMARY
═══════════════════════════════════════════════════════════════════════════════

This document contains ${lines.length} lines of educational content covering various topics.
Below is a structured breakdown of the key concepts and information.

${'-'.repeat(80)}

KEY SECTIONS AND HEADINGS
═══════════════════════════════════════════════════════════════════════════════

${headings.slice(0, 20).map((h, i) => `${i + 1}. ${h.trim()}`).join('\n')}

${'-'.repeat(80)}

IMPORTANT DEFINITIONS AND CONCEPTS
═══════════════════════════════════════════════════════════════════════════════

${definitions.slice(0, 15).map((d, i) => `▶ ${d.trim()}`).join('\n\n')}

${'-'.repeat(80)}

DETAILED CONTENT
═══════════════════════════════════════════════════════════════════════════════

${text.substring(0, 5000)}

${'-'.repeat(80)}

📌 STUDY RECOMMENDATIONS

1. **Active Reading**: Take notes while reviewing this material
2. **Concept Mapping**: Create visual connections between topics
3. **Practice Problems**: Apply concepts to real-world scenarios
4. **Spaced Repetition**: Review material at increasing intervals
5. **Teach Others**: Explain concepts to reinforce understanding

${'-'.repeat(80)}

Total Words: ${text.split(/\s+/).length}
Estimated Reading Time: ${Math.ceil(text.split(/\s+/).length / 200)} minutes
`;
}

// Generate flashcards from content
async function generateFlashcards(text: string, useOpenAI: boolean): Promise<any[]> {
  if (useOpenAI && process.env.OPENAI_API_KEY) {
    try {
      const client = getOpenAIClient();
      if (!client) {
        throw new Error('OpenAI client not available');
      }

      const completion = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Generate 10 flashcards from the given content. Return as JSON array with {front, back} format.',
          },
          {
            role: 'user',
            content: `Create flashcards from: ${text.substring(0, 2000)}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const content = completion.choices[0].message.content || '[]';
      return JSON.parse(content);
    } catch (error) {
      console.error('Flashcard generation error:', error);
    }
  }

  // Fallback: Extract key terms
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 20);
  return sentences.slice(0, 10).map((sentence, i) => ({
    front: `Question ${i + 1}`,
    back: sentence.trim(),
    mastered: false,
  }));
}

// Generate quiz questions from content
async function generateQuizQuestions(text: string, useOpenAI: boolean): Promise<any[]> {
  if (useOpenAI && process.env.OPENAI_API_KEY) {
    try {
      const client = getOpenAIClient();
      if (!client) {
        throw new Error('OpenAI client not available');
      }

      const completion = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Generate 5 multiple choice questions from the content. Return as JSON array with {question, options: string[], correctAnswer: number, explanation} format.',
          },
          {
            role: 'user',
            content: `Create quiz questions from: ${text.substring(0, 2000)}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });

      const content = completion.choices[0].message.content || '[]';
      return JSON.parse(content);
    } catch (error) {
      console.error('Quiz generation error:', error);
    }
  }

  // Fallback: Generate basic questions
  return [
    {
      question: 'What is the main topic of this document?',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 0,
      explanation: 'Based on the content analysis.',
    },
  ];
}

// Made with Bob
