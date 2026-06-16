export type JavaCompletion = {
  label: string;
  insert: string;
  detail?: string;
};

const KEYWORDS = [
  'abstract',
  'boolean',
  'break',
  'byte',
  'case',
  'catch',
  'char',
  'class',
  'continue',
  'default',
  'do',
  'double',
  'else',
  'enum',
  'extends',
  'final',
  'finally',
  'float',
  'for',
  'if',
  'implements',
  'import',
  'instanceof',
  'int',
  'interface',
  'long',
  'native',
  'new',
  'null',
  'package',
  'private',
  'protected',
  'public',
  'return',
  'short',
  'static',
  'strictfp',
  'super',
  'switch',
  'synchronized',
  'this',
  'throw',
  'throws',
  'transient',
  'true',
  'false',
  'try',
  'void',
  'volatile',
  'while',
] as const;

const TYPES = [
  'String',
  'System',
  'Object',
  'Integer',
  'Long',
  'Double',
  'Float',
  'Boolean',
  'Character',
  'Math',
  'Arrays',
  'List',
  'Map',
  'Set',
  'ArrayList',
  'HashMap',
  'HashSet',
] as const;

export const JAVA_COMPLETIONS: JavaCompletion[] = [
  ...KEYWORDS.map((label) => ({ label, insert: label })),
  ...TYPES.map((label) => ({ label, insert: label })),
  {
    label: 'sout',
    insert: 'System.out.println();',
    detail: '打印一行',
  },
  {
    label: 'psvm',
    insert: 'public static void main(String[] args) {\n    \n}',
    detail: 'main 方法',
  },
  {
    label: 'println',
    insert: 'System.out.println();',
    detail: '打印一行',
  },
];

const KEYWORD_RE = new RegExp(`\\b(${KEYWORDS.join('|')})\\b`, 'g');
const TYPE_RE = new RegExp(`\\b(${TYPES.join('|')})\\b`, 'g');

const COLOR = {
  string: '#ce9178',
  comment: '#6a9955',
  number: '#b5cea8',
  keyword: '#569cd6',
  type: '#4ec9b0',
} as const;

const colorSpan = (color: string, text: string) => `<span style="color:${color}">${text}</span>`;

function escapeHtml(text: string) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** ponytail: regex highlighter — covers common Java tokens, not a full parser */
export function highlightJava(code: string) {
  let html = escapeHtml(code);

  html = html.replace(/("(?:\\.|[^"\\])*")/g, (m) => colorSpan(COLOR.string, m));
  html = html.replace(/(\/\*[\s\S]*?\*\/)/g, (m) => colorSpan(COLOR.comment, m));
  html = html.replace(/(\/\/[^\n]*)/g, (m) => colorSpan(COLOR.comment, m));
  html = html.replace(/\b(\d+(?:\.\d+)?)\b/g, (m) => colorSpan(COLOR.number, m));
  html = html.replace(KEYWORD_RE, (m) => colorSpan(COLOR.keyword, m));
  html = html.replace(TYPE_RE, (m) => colorSpan(COLOR.type, m));

  return html;
}

export function wordBeforeCursor(code: string, cursor: number) {
  const head = code.slice(0, cursor);
  const match = head.match(/[\w$]*$/);
  return match?.[0] ?? '';
}

export function filterCompletions(prefix: string, limit = 8) {
  if (!prefix) return JAVA_COMPLETIONS.slice(0, limit);
  const lower = prefix.toLowerCase();
  return JAVA_COMPLETIONS.filter((item) => item.label.toLowerCase().startsWith(lower)).slice(0, limit);
}
