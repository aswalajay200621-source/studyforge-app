# AI/LLM Integration Guide for StudyForge

## Overview
StudyForge now includes real AI-powered PDF extraction and notes generation using Large Language Models (LLMs). This enables automatic, intelligent content extraction and comprehensive study material creation.

## Features

### 1. **Real PDF Text Extraction**
- Uses `pdf-parse` library to extract text from PDF files
- Handles multi-page documents
- Preserves structure and formatting where possible

### 2. **AI-Powered Notes Generation**
Three tiers of AI integration:

#### Tier 1: OpenAI GPT-4 (Best Quality)
- **Model**: GPT-4 Turbo
- **Quality**: Highest - Professional-grade notes
- **Cost**: ~$0.01-0.03 per PDF
- **Speed**: 10-30 seconds
- **Output**: 3000-5000 words of comprehensive content

#### Tier 2: HuggingFace (Free Alternative)
- **Model**: Mistral-7B-Instruct
- **Quality**: Good - Solid educational content
- **Cost**: Free (with rate limits)
- **Speed**: 5-15 seconds
- **Output**: 2000-3000 words

#### Tier 3: Enhanced Template (Fallback)
- **Method**: Intelligent text analysis + templates
- **Quality**: Good - Structured extraction
- **Cost**: Free
- **Speed**: Instant
- **Output**: 2000-4000 words

### 3. **Automatic Flashcard Generation**
- AI extracts key concepts
- Creates question-answer pairs
- Identifies important definitions

### 4. **Quiz Question Generation**
- Multiple choice questions
- Includes explanations
- Difficulty-balanced

## Setup Instructions

### Step 1: Choose Your AI Provider

#### Option A: OpenAI (Recommended)

1. **Get API Key**:
   - Go to https://platform.openai.com/api-keys
   - Create account or sign in
   - Click "Create new secret key"
   - Copy the key (starts with `sk-`)

2. **Add to .env**:
```env
OPENAI_API_KEY="sk-your-actual-key-here"
```

3. **Pricing**:
   - GPT-4 Turbo: $0.01 per 1K input tokens, $0.03 per 1K output tokens
   - Average PDF: ~$0.02-0.05 per processing
   - First $5 free credit for new accounts

#### Option B: HuggingFace (Free)

1. **Get API Key**:
   - Go to https://huggingface.co/settings/tokens
   - Create account or sign in
   - Click "New token"
   - Select "Read" access
   - Copy the token (starts with `hf_`)

2. **Add to .env**:
```env
HUGGINGFACE_API_KEY="hf_your-actual-key-here"
```

3. **Limits**:
   - Free tier: 1000 requests/day
   - Rate limit: 10 requests/minute
   - No cost

#### Option C: No API Key (Fallback)

If you don't provide any API key, the system automatically uses the enhanced template-based generation. This still provides good quality notes but without AI enhancement.

### Step 2: Install Dependencies

Already installed:
```bash
npm install pdf-parse openai @huggingface/inference
```

### Step 3: Test the Integration

1. **Start the server**:
```bash
npm run dev
```

2. **Upload a PDF**:
   - Go to Upload page
   - Select "Textbook" mode
   - Upload your PDF
   - Watch the console for processing logs

3. **Check the output**:
   - View generated notes
   - Verify word count (should be 2000-5000 words)
   - Check flashcards and quiz questions

## API Endpoint

### POST /api/process-pdf

**Request**:
```typescript
FormData {
  file: File (PDF),
  useOpenAI: boolean (optional, default: false)
}
```

**Response**:
```typescript
{
  success: boolean,
  data: {
    extractedText: string,
    notes: string,
    flashcards: Array<{front: string, back: string, mastered: boolean}>,
    quizQuestions: Array<{
      question: string,
      options: string[],
      correctAnswer: number,
      explanation: string
    }>,
    metadata: {
      pages: number,
      wordCount: number,
      extractedLength: number
    }
  }
}
```

## Usage Example

### Frontend Integration

```typescript
async function uploadPDF(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('useOpenAI', 'true'); // or 'false' for HuggingFace

  const response = await fetch('/api/process-pdf', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();
  
  if (result.success) {
    console.log('Notes:', result.data.notes);
    console.log('Flashcards:', result.data.flashcards);
    console.log('Quiz:', result.data.quizQuestions);
  }
}
```

## AI Prompt Engineering

### Notes Generation Prompt

The system uses carefully crafted prompts to ensure high-quality output:

```
You are an expert educational content creator. Generate comprehensive, 
detailed study notes from the following PDF content.

Create detailed notes with:
1. Clear chapter/section headings
2. Key concepts with explanations
3. Important definitions
4. Examples and applications
5. Historical context where relevant
6. Formulas and algorithms with step-by-step explanations
7. Study tips and exam preparation advice

Format the notes in a clear, structured manner with proper headings, 
bullet points, and emphasis on important terms.
Aim for 3000-5000 words of comprehensive content.
```

### Flashcard Generation Prompt

```
Generate 10 flashcards from the given content. 
Return as JSON array with {front, back} format.
Focus on key concepts, definitions, and important facts.
```

### Quiz Generation Prompt

```
Generate 5 multiple choice questions from the content. 
Return as JSON array with {question, options: string[], 
correctAnswer: number, explanation} format.
Make questions challenging but fair.
```

## Performance Optimization

### 1. Text Chunking
For large PDFs (>10 pages), the system automatically chunks text:
```typescript
const maxChunkSize = 8000; // characters
const chunks = splitIntoChunks(extractedText, maxChunkSize);
```

### 2. Caching
Consider implementing caching for processed PDFs:
```typescript
// Check if PDF was already processed
const cacheKey = `pdf_${fileHash}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);
```

### 3. Rate Limiting
Implement rate limiting to avoid API quota issues:
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10 // limit each IP to 10 requests per windowMs
});
```

## Error Handling

The system includes comprehensive error handling:

```typescript
try {
  // Process PDF
} catch (error) {
  if (error.code === 'insufficient_quota') {
    // Fallback to HuggingFace or template
  } else if (error.code === 'rate_limit_exceeded') {
    // Wait and retry
  } else {
    // Use template fallback
  }
}
```

## Cost Management

### OpenAI Costs

**Typical Usage**:
- Small PDF (5 pages): ~$0.01
- Medium PDF (20 pages): ~$0.03
- Large PDF (50 pages): ~$0.08

**Monthly Estimates**:
- 100 PDFs/month: ~$3-5
- 500 PDFs/month: ~$15-25
- 1000 PDFs/month: ~$30-50

### Cost Optimization Tips

1. **Use GPT-3.5 for flashcards/quizzes** (cheaper)
2. **Cache processed PDFs** (avoid reprocessing)
3. **Implement user limits** (e.g., 10 PDFs/day)
4. **Use HuggingFace for non-critical content**
5. **Batch process multiple PDFs**

## Monitoring

### Track API Usage

```typescript
// Log API calls
console.log({
  timestamp: new Date(),
  model: 'gpt-4-turbo',
  tokens: {
    input: completion.usage.prompt_tokens,
    output: completion.usage.completion_tokens,
    total: completion.usage.total_tokens
  },
  cost: calculateCost(completion.usage)
});
```

### Monitor Quality

```typescript
// Track user feedback
await prisma.feedback.create({
  data: {
    pdfId: pdf.id,
    rating: userRating,
    notesQuality: 'good' | 'fair' | 'poor',
    aiProvider: 'openai' | 'huggingface' | 'template'
  }
});
```

## Troubleshooting

### Issue: "API key not found"
**Solution**: Check `.env` file has correct key format

### Issue: "Rate limit exceeded"
**Solution**: Wait or switch to HuggingFace

### Issue: "PDF parsing failed"
**Solution**: Ensure PDF is not encrypted or corrupted

### Issue: "Notes too short"
**Solution**: Increase `max_tokens` parameter or use GPT-4

### Issue: "Timeout error"
**Solution**: Reduce PDF size or implement chunking

## Security Best Practices

1. **Never expose API keys** in frontend code
2. **Validate file uploads** (size, type, content)
3. **Sanitize extracted text** before sending to AI
4. **Implement rate limiting** per user
5. **Log all API calls** for audit trail
6. **Use environment variables** for all secrets

## Future Enhancements

### Planned Features

1. **Multi-language support** - Detect and process PDFs in different languages
2. **Image extraction** - Extract and describe diagrams/charts
3. **Citation generation** - Automatically create bibliographies
4. **Concept mapping** - Generate visual concept maps
5. **Adaptive difficulty** - Adjust content complexity based on user level
6. **Voice notes** - Convert notes to audio summaries

### Advanced AI Features

1. **Fine-tuned models** - Train custom models on educational content
2. **RAG (Retrieval Augmented Generation)** - Use vector databases for context
3. **Multi-modal AI** - Process images, tables, and equations
4. **Personalization** - Adapt to individual learning styles

## Resources

- [OpenAI Documentation](https://platform.openai.com/docs)
- [HuggingFace Inference API](https://huggingface.co/docs/api-inference)
- [pdf-parse GitHub](https://github.com/modesty/pdf-parse)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)

## Support

For issues or questions:
- Check console logs for detailed error messages
- Verify API keys are correctly set
- Test with a small PDF first
- Review the API response for error details