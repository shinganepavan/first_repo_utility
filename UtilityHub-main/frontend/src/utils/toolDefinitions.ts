export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: 'text' | 'dev' | 'image' | 'pdf' | 'calc' | 'ai' | 'prod';
  icon: string;
  isPopular?: boolean;
  isFeatured?: boolean;
}

export interface CategoryDefinition {
  id: 'text' | 'dev' | 'image' | 'pdf' | 'calc' | 'ai' | 'prod';
  name: string;
  description: string;
  color: string; // Tailwind class
  icon: string;
}

export const CATEGORIES: CategoryDefinition[] = [
  {
    id: 'text',
    name: 'Text Tools',
    description: 'Format, manipulate, and analyze textual data instantly.',
    color: 'from-sky-400 to-blue-600',
    icon: 'AlignLeft'
  },
  {
    id: 'dev',
    name: 'Developer Tools',
    description: 'Format code, encode/decode data, parse JWTs, and generate credentials.',
    color: 'from-indigo-400 to-violet-600',
    icon: 'Code'
  },
  {
    id: 'image',
    name: 'Image Tools',
    description: 'Compress, resize, convert, scan, and generate images/QR codes.',
    color: 'from-purple-400 to-fuchsia-600',
    icon: 'Image'
  },
  {
    id: 'pdf',
    name: 'PDF Tools',
    description: 'Merge, split, lock, unlock, and compress PDF documents in-browser.',
    color: 'from-rose-400 to-red-600',
    icon: 'FileText'
  },
  {
    id: 'calc',
    name: 'Calculator Tools',
    description: 'Perform scientific operations, age calculations, EMI schedules, and unit conversions.',
    color: 'from-emerald-400 to-teal-600',
    icon: 'Calculator'
  },
  {
    id: 'ai',
    name: 'AI Writing & Coding',
    description: 'Draft resumes, generate emails, debug code, and check grammar using intelligent assistance.',
    color: 'from-amber-400 to-orange-600',
    icon: 'Sparkles'
  },
  {
    id: 'prod',
    name: 'Productivity Tools',
    description: 'Manage tasks, track pomodoros, write secure notes, and generate passwords.',
    color: 'from-pink-400 to-rose-600',
    icon: 'Clock'
  }
];

export const TOOLS: ToolDefinition[] = [
  // --- TEXT TOOLS ---
  { id: 'word-counter', name: 'Word Counter', description: 'Count characters, words, sentences, and read-time of text.', category: 'text', icon: 'Hash', isPopular: true },
  { id: 'character-counter', name: 'Character Counter', description: 'Check lengths, density, and limits of characters.', category: 'text', icon: 'Type' },
  { id: 'text-formatter', name: 'Text Formatter', description: 'Clean, trim, and adjust styling of messy text.', category: 'text', icon: 'AlignJustify' },
  { id: 'remove-spaces', name: 'Remove Extra Spaces', description: 'Trim whitespace, remove duplicate linebreaks, and compress text.', category: 'text', icon: 'FileSpreadsheet' },
  { id: 'case-converter', name: 'Case Converter', description: 'Convert text to UPPER, lower, Sentence, Title, or camelCase.', category: 'text', icon: 'CaseSensitive', isPopular: true },
  { id: 'reverse-text', name: 'Reverse Text', description: 'Flip paragraphs, lines, words, or individual characters backwards.', category: 'text', icon: 'RefreshCw' },
  { id: 'duplicate-remover', name: 'Duplicate Line Remover', description: 'Scan text lines to remove duplicate records.', category: 'text', icon: 'Filter' },
  { id: 'random-text-gen', name: 'Random Text Generator', description: 'Create randomized strings, letters, and custom tokens.', category: 'text', icon: 'Dices' },
  { id: 'lorem-ipsum', name: 'Lorem Ipsum Generator', description: 'Generate placeholder text paragraphs, sentences, or lists.', category: 'text', icon: 'FileText' },
  { id: 'readability-checker', name: 'Readability Checker', description: 'Calculate Flesch-Kincaid ease scores and text grade levels.', category: 'text', icon: 'BookOpen' },

  // --- DEVELOPER TOOLS ---
  { id: 'json-formatter', name: 'JSON Formatter', description: 'Beautify, indent, and format JSON structures.', category: 'dev', icon: 'Braces', isPopular: true, isFeatured: true },
  { id: 'json-validator', name: 'JSON Validator', description: 'Validate JSON files and locate precise syntax errors.', category: 'dev', icon: 'FileCheck' },
  { id: 'xml-formatter', name: 'XML Formatter', description: 'Format and prettify XML documents.', category: 'dev', icon: 'FileCode' },
  { id: 'xml-to-json', name: 'XML to JSON Converter', description: 'Parse XML content and transform it directly into clean JSON.', category: 'dev', icon: 'ArrowLeftRight' },
  { id: 'base64-encoder', name: 'Base64 Encoder', description: 'Encode files or text strings into Base64 format.', category: 'dev', icon: 'Binary' },
  { id: 'base64-decoder', name: 'Base64 Decoder', description: 'Decode Base64 payloads back to text or download as raw files.', category: 'dev', icon: 'Unlock' },
  { id: 'url-encoder', name: 'URL Encoder', description: 'Safely escape characters for URL query strings.', category: 'dev', icon: 'Link2' },
  { id: 'url-decoder', name: 'URL Decoder', description: 'Unescape URL parameters back into human-readable text.', category: 'dev', icon: 'Link' },
  { id: 'regex-tester', name: 'Regex Tester', description: 'Test javascript regular expressions with highlight indicators.', category: 'dev', icon: 'Code2' },
  { id: 'html-formatter', name: 'HTML Formatter', description: 'Clean, structure, and format HTML code.', category: 'dev', icon: 'Tags' },
  { id: 'css-minifier', name: 'CSS Minifier', description: 'Remove comments and whitespaces to compress CSS styles.', category: 'dev', icon: 'Scissors' },
  { id: 'js-minifier', name: 'JS Minifier', description: 'Compress JavaScript source code to minimize transfer sizes.', category: 'dev', icon: 'Zap' },
  { id: 'code-beautifier', name: 'Code Beautifier', description: 'Prettify multiple languages (JS, CSS, HTML, JSON).', category: 'dev', icon: 'Eye' },
  { id: 'jwt-decoder', name: 'JWT Decoder', description: 'Decode headers, payloads, and signatures of JWT tokens.', category: 'dev', icon: 'ShieldAlert', isPopular: true },
  { id: 'uuid-generator', name: 'UUID Generator', description: 'Create version 4 cryptographically secure UUID tokens.', category: 'dev', icon: 'Key' },
  { id: 'hash-generator', name: 'Hash Generator', description: 'Compute MD5, SHA-1, SHA-256, and SHA-512 hashes.', category: 'dev', icon: 'Fingerprint', isPopular: true },

  // --- IMAGE TOOLS ---
  { id: 'image-compressor', name: 'Image Compressor', description: 'Reduce image sizes with slider quality controls.', category: 'image', icon: 'Sliders', isPopular: true, isFeatured: true },
  { id: 'image-resizer', name: 'Image Resizer', description: 'Resize height and width in pixels or percentages.', category: 'image', icon: 'Maximize2' },
  { id: 'image-cropper', name: 'Image Cropper', description: 'Crop images to standard aspects or customized boundaries.', category: 'image', icon: 'Crop' },
  { id: 'image-converter', name: 'Image Converter', description: 'Convert images between PNG, JPEG, WEBP, and GIF.', category: 'image', icon: 'Repeat' },
  { id: 'bg-remover', name: 'Background Remover', description: 'Simulate or apply automated transparency filters.', category: 'image', icon: 'Eraser' },
  { id: 'image-to-pdf', name: 'Image to PDF', description: 'Wrap multiple pictures into a single printable PDF document.', category: 'image', icon: 'FileImage' },
  { id: 'qr-scanner', name: 'QR Code Scanner', description: 'Scan QR codes using camera streams or local image files.', category: 'image', icon: 'Scan', isPopular: true },
  { id: 'qr-generator', name: 'QR Code Generator', description: 'Instantly generate QR codes with custom styling.', category: 'image', icon: 'QrCode', isPopular: true },

  // --- PDF TOOLS ---
  { id: 'pdf-merge', name: 'Merge PDF', description: 'Combine multiple PDF files into one clean document.', category: 'pdf', icon: 'Combine', isPopular: true },
  { id: 'pdf-split', name: 'Split PDF', description: 'Separate pages from a PDF file into standalone documents.', category: 'pdf', icon: 'Split' },
  { id: 'pdf-compress', name: 'Compress PDF', description: 'Lower PDF resolution and file sizes for attachment optimization.', category: 'pdf', icon: 'Minimize' },
  { id: 'pdf-rotate', name: 'Rotate PDF', description: 'Rotate PDF pages orientation by 90, 180, or 270 degrees.', category: 'pdf', icon: 'RotateCw' },
  { id: 'pdf-unlock', name: 'Unlock PDF', description: 'Remove owner passwords and permissions from PDF forms.', category: 'pdf', icon: 'Unlock' },
  { id: 'pdf-protect', name: 'Protect PDF', description: 'Encrypt and secure PDF documents with custom passwords.', category: 'pdf', icon: 'Lock' },
  { id: 'pdf-to-word', name: 'PDF to Word', description: 'Extract text contents of a PDF into a readable document structure.', category: 'pdf', icon: 'FileSpreadsheet' },
  { id: 'word-to-pdf', name: 'Word to PDF', description: 'Format and convert document pages directly into PDF format.', category: 'pdf', icon: 'FileUp' },

  // --- CALCULATOR TOOLS ---
  { id: 'sci-calculator', name: 'Scientific Calculator', description: 'Compute algebraic, trigonometric, and memory functions.', category: 'calc', icon: 'Percent', isPopular: true },
  { id: 'bmi-calc', name: 'BMI Calculator', description: 'Calculate body mass indices and weight ranges.', category: 'calc', icon: 'Heart' },
  { id: 'age-calc', name: 'Age Calculator', description: 'Find total years, months, weeks, and days since birth.', category: 'calc', icon: 'CalendarDays', isPopular: true },
  { id: 'percent-calc', name: 'Percentage Calculator', description: 'Calculate rates, differences, shares, and fractional changes.', category: 'calc', icon: 'Percent' },
  { id: 'emi-calc', name: 'EMI Calculator', description: 'Calculate monthly loan amortizations, interest rates, and structures.', category: 'calc', icon: 'Wallet', isPopular: true },
  { id: 'gst-calc', name: 'GST/Tax Calculator', description: 'Calculate net, gross, and absolute tax additions/subtractions.', category: 'calc', icon: 'Receipt' },
  { id: 'loan-calc', name: 'Loan Calculator', description: 'Compare loan proposals and evaluate lifetime borrowing interests.', category: 'calc', icon: 'TrendingUp' },
  { id: 'unit-converter', name: 'Unit Converter', description: 'Convert measurements: length, weight, temperature, and speed.', category: 'calc', icon: 'Scale', isPopular: true, isFeatured: true },

  // --- AI TOOLS ---
  { id: 'ai-resume', name: 'AI Resume Builder', description: 'Draft structured professional resumes tailored to key domains.', category: 'ai', icon: 'Sparkles', isPopular: true, isFeatured: true },
  { id: 'ai-cover-letter', name: 'AI Cover Letter Generator', description: 'Compose customized introduction letters targeting job profiles.', category: 'ai', icon: 'MailQuestion' },
  { id: 'ai-email', name: 'AI Email Writer', description: 'Generate formal, informal, or professional email drafts.', category: 'ai', icon: 'Mail' },
  { id: 'ai-grammar', name: 'AI Grammar Checker', description: 'Analyze text to identify and fix spelling, style, and syntax errors.', category: 'ai', icon: 'SpellCheck', isPopular: true },
  { id: 'ai-linkedin', name: 'AI LinkedIn Post Generator', description: 'Write engaging professional posts with relevant hashtags.', category: 'ai', icon: 'Linkedin' },
  { id: 'ai-caption', name: 'AI Caption Generator', description: 'Generate catchy captions for social media platforms.', category: 'ai', icon: 'Instagram' },
  { id: 'ai-blog', name: 'AI Blog Writer', description: 'Compose outlines and detailed blog post structures.', category: 'ai', icon: 'PenTool' },
  { id: 'ai-explainer', name: 'AI Code Explainer', description: 'Explain confusing code lines in clear natural language.', category: 'ai', icon: 'MessageSquareCode', isPopular: true, isFeatured: true },

  // --- PRODUCTIVITY TOOLS ---
  { id: 'pomodoro', name: 'Pomodoro Timer', description: 'Improve focus with standard 25/5 minute session cycles.', category: 'prod', icon: 'Timer', isPopular: true },
  { id: 'todo-list', name: 'To-Do List', description: 'Create, rank, and track items on a dynamic task checklist.', category: 'prod', icon: 'ListTodo', isPopular: true },
  { id: 'notes', name: 'Notes Repository', description: 'Draft, search, and export formatted personal rich notes.', category: 'prod', icon: 'StickyNote', isPopular: true, isFeatured: true },
  { id: 'calendar', name: 'Productivity Calendar', description: 'Organize schedule events, milestones, and daily calendars.', category: 'prod', icon: 'Calendar' },
  { id: 'password-gen', name: 'Password Generator', description: 'Generate secure, randomized custom-length credentials.', category: 'prod', icon: 'Shield', isPopular: true },
  { id: 'password-strength', name: 'Password Rater', description: 'Evaluate password entropy, patterns, and safety levels.', category: 'prod', icon: 'ShieldCheck' },
  { id: 'stopwatch', name: 'Stopwatch', description: 'Record precise lap timers down to milliseconds.', category: 'prod', icon: 'Hourglass' },
  { id: 'countdown', name: 'Countdown Timer', description: 'Configure alarm countdown alerts for custom sessions.', category: 'prod', icon: 'AlarmClock' }
];

export const getToolById = (id: string): ToolDefinition | undefined => {
  return TOOLS.find(t => t.id === id);
};

export const getToolsByCategory = (category: string): ToolDefinition[] => {
  return TOOLS.filter(t => t.category === category);
};

export const searchTools = (query: string): ToolDefinition[] => {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return TOOLS.filter(
    t => t.name.toLowerCase().includes(q) || 
         t.description.toLowerCase().includes(q) || 
         t.category.toLowerCase().includes(q)
  );
};
