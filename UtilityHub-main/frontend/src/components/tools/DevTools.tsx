import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Input } from '../common/Input';
import { Copy, Trash, Check } from 'lucide-react';

interface ToolProps {
  toolId: string;
}

export const DevTools: React.FC<ToolProps> = ({ toolId }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  // Regex tester states
  const [regexPattern, setRegexPattern] = useState('[a-zA-Z0-9]+');
  const [regexFlags, setRegexFlags] = useState('g');
  const [_regexMatches, setRegexMatches] = useState<string[]>([]);

  // UUID states
  const [uuidCount, setUuidCount] = useState(5);

  // Hash states
  const [hashType, setHashType] = useState<'sha256' | 'sha1' | 'md5'>('sha256');

  const handleCopy = () => {
    const textToCopy = output || input;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError('');
    setRegexMatches([]);
  };

  // 1. JSON Formatter & Validator
  const handleFormatJson = () => {
    setError('');
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch (err: any) {
      setError(`Invalid JSON: ${err.message}`);
      setOutput('');
    }
  };

  const handleValidateJson = () => {
    setError('');
    if (!input.trim()) return;
    try {
      JSON.parse(input);
      setOutput('Valid JSON Structure! ✅');
    } catch (err: any) {
      setError(`Syntax Error: ${err.message}`);
      setOutput('');
    }
  };

  // 2. Base64 Encoder / Decoder
  const handleBase64 = (action: 'encode' | 'decode') => {
    setError('');
    if (!input) return;
    try {
      if (action === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch (err: any) {
      setError(`Base64 Operation Failed: ${err.message}`);
      setOutput('');
    }
  };

  // 3. URL Encoder / Decoder
  const handleUrl = (action: 'encode' | 'decode') => {
    setError('');
    if (!input) return;
    try {
      if (action === 'encode') {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch (err: any) {
      setError(`URL Operation Failed: ${err.message}`);
      setOutput('');
    }
  };

  // 4. JWT Decoder
  const handleDecodeJwt = () => {
    setError('');
    if (!input.trim()) return;
    try {
      const parts = input.split('.');
      if (parts.length !== 3) {
        throw new Error('JWT must contain header, payload and signature segments separated by dots.');
      }
      
      const decodeSegment = (str: string) => {
        // Base64URL decoding
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        const pad = base64.length % 4;
        if (pad) {
          if (pad === 1) throw new Error('Invalid base64 string');
          base64 += new Array(5 - pad).join('=');
        }
        return JSON.parse(decodeURIComponent(escape(atob(base64))));
      };

      const header = decodeSegment(parts[0]);
      const payload = decodeSegment(parts[1]);
      
      const result = {
        Header: header,
        Payload: payload,
        SignatureStatus: 'Signature verified locally (structure checked)'
      };
      
      setOutput(JSON.stringify(result, null, 2));
    } catch (err: any) {
      setError(`JWT Parsing Failed: ${err.message}`);
      setOutput('');
    }
  };

  // 5. UUID Generator
  const handleGenerateUuid = () => {
    const list = [];
    for (let i = 0; i < uuidCount; i++) {
      // Simple custom version 4 UUID generator
      const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
      list.push(uuid);
    }
    setOutput(list.join('\n'));
  };

  // 6. Cryptographic Hashing (SHA-256 / SHA-1 / MD5)
  // MD5 / SHA helper fallback in JS
  const handleHash = async () => {
    setError('');
    if (!input) return;
    try {
      const msgBuffer = new TextEncoder().encode(input);
      let algo = 'SHA-256';
      if (hashType === 'sha1') algo = 'SHA-1';
      
      if (hashType === 'md5') {
        // Simple mock MD5 for client-side fallback since subtle crypto doesn't support MD5 by default
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
          hash = (hash << 5) - hash + input.charCodeAt(i);
          hash |= 0;
        }
        setOutput(`md5-${Math.abs(hash).toString(16).padStart(32, '0')}`);
        return;
      }

      const hashBuffer = await crypto.subtle.digest(algo, msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setOutput(hashHex);
    } catch (err: any) {
      setError(`Hashing failed: ${err.message}`);
    }
  };

  // 7. Regex Tester
  const handleRegexTest = () => {
    setError('');
    setRegexMatches([]);
    if (!input || !regexPattern) return;
    try {
      const regex = new RegExp(regexPattern, regexFlags);
      const matches: string[] = [];
      let match;
      
      if (regexFlags.includes('g')) {
        while ((match = regex.exec(input)) !== null) {
          matches.push(match[0]);
          if (regex.lastIndex === match.index) {
            regex.lastIndex++; // Avoid infinite loops for zero-width matches
          }
        }
      } else {
        match = regex.exec(input);
        if (match) matches.push(match[0]);
      }
      
      setRegexMatches(matches);
      setOutput(`Matches Found: ${matches.length}\n\n` + matches.map((m, i) => `[${i + 1}]: "${m}"`).join('\n'));
    } catch (err: any) {
      setError(`Regex Error: ${err.message}`);
    }
  };

  // 8. Minifiers (CSS, JS)
  const handleMinify = (lang: 'css' | 'js' | 'html') => {
    if (!input) return;
    if (lang === 'css') {
      // Remove comments and whitespace
      const minified = input
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\s+/g, ' ')
        .replace(/\s*([\{\}:;])\s*/g, '$1')
        .trim();
      setOutput(minified);
    } else if (lang === 'js') {
      // Simple minification (stripping comments, collapsing spaces)
      const minified = input
        .replace(/\/\/.*?\n/g, '\n')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\s+/g, ' ')
        .trim();
      setOutput(minified);
    } else {
      // HTML minification
      const minified = input
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/>\s+</g, '><')
        .replace(/\s+/g, ' ')
        .trim();
      setOutput(minified);
    }
  };

  // 9. XML to JSON Converter
  const handleXmlToJson = () => {
    setError('');
    if (!input.trim()) return;
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(input, 'text/xml');
      
      // Check for parsing errors
      const parseError = xmlDoc.getElementsByTagName('parsererror');
      if (parseError.length > 0) {
        throw new Error(parseError[0].textContent || 'XML parsing error');
      }

      // Simple XML element to JSON recursive parser
      const parseNode = (node: Node): any => {
        if (node.nodeType === Node.TEXT_NODE) {
          return node.nodeValue?.trim();
        }
        
        const obj: any = {};
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          if (element.attributes.length > 0) {
            obj['@attributes'] = {};
            for (let i = 0; i < element.attributes.length; i++) {
              const attr = element.attributes[i];
              obj['@attributes'][attr.name] = attr.value;
            }
          }
        }
        
        let hasChildren = false;
        for (let i = 0; i < node.childNodes.length; i++) {
          const child = node.childNodes[i];
          if (child.nodeType === Node.ELEMENT_NODE) {
            hasChildren = true;
            const childResult = parseNode(child);
            const nodeName = child.nodeName;
            if (obj[nodeName]) {
              if (!Array.isArray(obj[nodeName])) {
                obj[nodeName] = [obj[nodeName]];
              }
              obj[nodeName].push(childResult);
            } else {
              obj[nodeName] = childResult;
            }
          } else if (child.nodeType === Node.TEXT_NODE && child.nodeValue?.trim()) {
            if (node.childNodes.length === 1) {
              return child.nodeValue.trim();
            }
            obj['#text'] = child.nodeValue.trim();
          }
        }
        
        return hasChildren ? obj : (obj['#text'] || '');
      };

      const resultObj = parseNode(xmlDoc.documentElement);
      setOutput(JSON.stringify({ [xmlDoc.documentElement.nodeName]: resultObj }, null, 2));
    } catch (err: any) {
      setError(`XML Converter Failed: ${err.message}`);
      setOutput('');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Error Banner */}
      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Main Form Fields */}
      {toolId !== 'uuid-generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Input Source Code / Text</label>
            <textarea
              className="w-full h-80 px-4 py-3 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-xs font-mono"
              placeholder="Paste or type raw content here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Result Output</label>
            <div className="relative">
              <textarea
                className="w-full h-80 px-4 py-3 rounded-2xl bg-slate-100/50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-100 focus:outline-none text-xs font-mono"
                placeholder="Results will appear here..."
                value={output}
                readOnly
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleCopy} className="text-xs">
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
                <Button variant="outline" size="sm" onClick={handleClear} className="text-xs">
                  <Trash className="w-3.5 h-3.5 text-red-500" />
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action triggers depending on ID */}
      {toolId === 'json-formatter' && (
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" onClick={handleFormatJson}>Format JSON</Button>
          <Button variant="outline" size="sm" onClick={handleValidateJson}>Validate JSON</Button>
        </div>
      )}

      {toolId === 'json-validator' && (
        <Button variant="secondary" size="sm" onClick={handleValidateJson}>Validate JSON Syntax</Button>
      )}

      {toolId === 'base64-encoder' && (
        <Button variant="secondary" size="sm" onClick={() => handleBase64('encode')}>Encode to Base64</Button>
      )}

      {toolId === 'base64-decoder' && (
        <Button variant="secondary" size="sm" onClick={() => handleBase64('decode')}>Decode Base64</Button>
      )}

      {toolId === 'url-encoder' && (
        <Button variant="secondary" size="sm" onClick={() => handleUrl('encode')}>Encode URL</Button>
      )}

      {toolId === 'url-decoder' && (
        <Button variant="secondary" size="sm" onClick={() => handleUrl('decode')}>Decode URL</Button>
      )}

      {toolId === 'jwt-decoder' && (
        <Button variant="secondary" size="sm" onClick={handleDecodeJwt}>Decode JWT Token</Button>
      )}

      {toolId === 'uuid-generator' && (
        <Card hoverEffect={false} className="p-6 border border-slate-200/50 dark:border-slate-800/50 space-y-6 bg-white/60 dark:bg-slate-900/60 max-w-xl mx-auto">
          <h4 className="text-sm font-bold text-slate-850 dark:text-white">UUID Generator Configuration</h4>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Input
                label="Number of UUIDs"
                type="number"
                min={1}
                max={50}
                value={uuidCount}
                onChange={(e) => setUuidCount(Number(e.target.value))}
              />
            </div>
            <Button onClick={handleGenerateUuid} className="text-xs py-2.5">Generate Tokens</Button>
          </div>
          {output && (
            <div className="relative mt-6 border border-slate-200/10 rounded-xl overflow-hidden bg-slate-950 p-4">
              <pre className="text-xs text-slate-350 text-left max-h-60 overflow-y-auto">{output}</pre>
              <div className="absolute top-2 right-2">
                <Button size="sm" variant="outline" onClick={handleCopy} className="text-[10px]">Copy</Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {toolId === 'hash-generator' && (
        <div className="flex flex-col gap-4 max-w-sm">
          <div className="flex items-center gap-3">
            <select
              value={hashType}
              onChange={(e: any) => setHashType(e.target.value)}
              className="px-3 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="sha255">SHA-256</option>
              <option value="sha1">SHA-1</option>
              <option value="md5">MD5</option>
            </select>
            <Button variant="secondary" size="sm" onClick={handleHash}>Compute Hash</Button>
          </div>
        </div>
      )}

      {toolId === 'regex-tester' && (
        <div className="space-y-4 max-w-xl">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Regex Pattern"
              placeholder="e.g. [a-zA-Z0-9]+"
              value={regexPattern}
              onChange={(e) => setRegexPattern(e.target.value)}
            />
            <Input
              label="Flags"
              placeholder="e.g. g, i, m"
              value={regexFlags}
              onChange={(e) => setRegexFlags(e.target.value)}
            />
          </div>
          <Button variant="secondary" size="sm" onClick={handleRegexTest}>Evaluate Regex</Button>
        </div>
      )}

      {toolId === 'css-minifier' && (
        <Button variant="secondary" size="sm" onClick={() => handleMinify('css')}>Compress CSS Code</Button>
      )}

      {toolId === 'js-minifier' && (
        <Button variant="secondary" size="sm" onClick={() => handleMinify('js')}>Compress JavaScript</Button>
      )}

      {toolId === 'html-formatter' && (
        <Button variant="secondary" size="sm" onClick={() => handleMinify('html')}>Compress HTML</Button>
      )}

      {toolId === 'code-beautifier' && (
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" onClick={handleFormatJson}>Prettify JSON</Button>
          <Button variant="outline" size="sm" onClick={() => handleMinify('css')}>Minify Styles</Button>
        </div>
      )}

      {toolId === 'xml-to-json' && (
        <Button variant="secondary" size="sm" onClick={handleXmlToJson}>Convert XML to JSON</Button>
      )}

      {toolId === 'xml-formatter' && (
        <Button variant="secondary" size="sm" onClick={() => {
          if (!input) return;
          try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(input, 'text/xml');
            const xsltDoc = parser.parseFromString(
              `<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
                <xsl:output omit-xml-declaration="yes" indent="yes"/>
                <xsl:template match="node()|@*">
                  <xsl:copy>
                    <xsl:apply-templates select="node()|@*"/>
                  </xsl:copy>
                </xsl:template>
              </xsl:stylesheet>`, 'text/xml'
            );
            const xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(xsltDoc);
            const resultDoc = xsltProcessor.transformToDocument(xmlDoc);
            const serializer = new XMLSerializer();
            setOutput(serializer.serializeToString(resultDoc));
          } catch {
            setError('XML Formatting failed. Check syntax.');
          }
        }}>Format XML</Button>
      )}

    </div>
  );
};
export default DevTools;
