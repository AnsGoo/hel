//  parse html，inspred by https://zhuanlan.zhihu.com/p/338772106,
// fixed self close tag parse bug.
// fixed including comment parse bug.

const SPACE_REGEX = /\s/;
const TOKEN_REGEX = /[a-zA-Z0-9-]/;
const DOCTYPE_MARK = '<!DOCTYPE html>';
const COMMENT_START = '<!--';
const COMMENT_END = '-->';
const META_END = '</meta>';
const LINK_END = '</link>';

const MAY_SELF_CLOSE_TAGS = ['meta', 'link'];
const TAG_END_MAP = {
  meta: META_END,
  link: LINK_END,
};

export class HTMLParser {
  /** @type string */
  input: string = '';
  /** @type number */
  len: number = 0;
  /** @type number */
  cur: number = 0;
  /** @type (tag: string) => void */
  onTagOpen: (tag: string) => void = this.noop;
  /** @type (tag: string, node: { tag: string; attrs: Record<string, string>; children: any[] }) => void */
  onTagClose: (tag: string, node: { tag: string; attrs: Record<string, string>; children: any[] }) => void = this.noop;
  constructor() {
    this.input = '';
    this.len = 0;
    this.cur = 0;
    this.onTagOpen = this.noop;
    this.onTagClose = this.noop;
  }

  get eof(): boolean {
    return this.cur >= this.len;
  }

  peek(offset = 0): string | undefined {
    return this.input[this.cur + offset];
  }

  sub(len: number, start?: number | undefined): string {
    const startIdx = start || this.cur;
    return this.input.substring(startIdx, startIdx + len);
  }

  moveCur(num: number): void {
    this.cur += num;
  }

  consumeChar(c: string | undefined): string | undefined {
    const curChar = this.peek();
    if (curChar === c) {
      this.cur++;
    } else {
      throw new Error(`Unexpected character: '${curChar}' should be '${c}'`);
    }
    return curChar;
  }

  consumeSpace(): void {
    this.consumeWhile(SPACE_REGEX);
  }

  consumeWhile(regex: RegExp): string {
    const result = [];
    do {
      const curChar = this.peek();
      if (regex.test(curChar)) {
        result.push(curChar);
        this.cur++;
      } else {
        break;
      }
    } while (!this.eof);
    return result.join('');
  }

  noop(): void {}

  pureInput(input: string): string {
    let puredStr = input.trim();
    if (puredStr.startsWith(DOCTYPE_MARK)) {
      puredStr = puredStr.substring(DOCTYPE_MARK.length);
    }

    // 移除 <!-- --> 相关的注释
    const delComment = (str: string): string => {
      const commentStartIdx = str.indexOf(COMMENT_START);
      const commentEndIdx = str.indexOf(COMMENT_END);
      if (commentStartIdx >= 0 && commentEndIdx >= 0) {
        const strBeforeComment = str.substring(0, commentStartIdx);
        const strAfterComment = str.substring(commentEndIdx + COMMENT_END.length);
        return delComment(`${strBeforeComment}${strAfterComment}`);
      }
      return str;
    };

    puredStr = delComment(puredStr);
    return puredStr;
  }

  parse(input: string, options: { onTagOpen?: (tag: string) => void; onTagClose?: (tag: string, node: { tag: string; attrs: Record<string, string>; children: any[] }) => void } = {}): any[] {
    const inputStr = input || '';
    this.input = this.pureInput(inputStr);
    this.len = this.input.length;
    this.onTagOpen = options.onTagOpen || this.noop;
    this.onTagClose = options.onTagClose || this.noop;
    this.cur = 0;
    return this.parseNodes();
  }

  parseNodes(): any[] {
    const nodes = [];
    do {
      let node;
      if (this.peek() === '<') {
        if (this.peek(1) === '/') break;
        node = this.parseElement();
      } else {
        node = this.parseTextNode();
      }
      if (node === ' ') {
        // filter ' ' node
        continue;
      }
      nodes.push(node);
    } while (!this.eof);
    return nodes;
  }

  parseTextNode(): string {
    const text = this.consumeWhile(/[^<]/);
    return text.replace(/[\s\n]+/g, ' ');
  }

  parseElement(): { tag: string; attrs: Record<string, string>; children: any[] } {
    this.consumeChar('<');
    const tag = this.parseTag();
    this.onTagOpen(tag);
    this.consumeSpace();
    const attrs = this.parseAttrs();

    const curChar = this.peek();
    const curPrev1Char = this.peek(-1);
    const handleTagEnd = (children: any[], move = 0): { tag: string; attrs: Record<string, string>; children: any[] } => {
      //  const closeTag = this.parseTag();
      this.parseTag();
      this.consumeSpace();
      this.consumeChar('>');
      if (move) {
        this.moveCur(move);
      }
      const toReturn = {
        tag,
        attrs,
        children,
      };
      this.onTagClose(tag, toReturn);
      return toReturn;
    };

    if (`${curPrev1Char}${curChar}` === '/>') {
      // is self close tag
      return handleTagEnd([]);
    }

    if (MAY_SELF_CLOSE_TAGS.includes(tag) && curChar === '>') {
      // handle <meta> or <meta></meta>, <link> or <link></link>
      const endTag = TAG_END_MAP[tag];
      const endTagLen = endTag.length;
      const endFeature = this.sub(endTagLen, this.cur + 1);
      const move = endFeature === endTag ? endTagLen : 0;
      return handleTagEnd([], move);
    }

    this.consumeChar('>');
    const children = this.parseNodes();
    this.consumeChar('<');
    this.consumeChar('/');
    return handleTagEnd(children);
  }

  parseTag(): string {
    const tag = this.consumeWhile(TOKEN_REGEX);
    return tag;
  }

  parseAttrs(): Record<string, string> {
    const attrs: Record<string, string> = {};
    while (this.peek() !== '>') {
      const name = this.parseTag();
      if (!name) {
        this.consumeChar(this.peek());
        continue;
      }

      if (this.peek() === '=') {
        this.consumeChar('=');
        this.consumeChar('"');
        const value = this.consumeWhile(/[^"]/);
        this.consumeChar('"');
        attrs[name] = value;
      } else {
        attrs[name] = '';
      }
      this.consumeSpace();
    }
    return attrs;
  }
}

export function parseHtml(html: string, options: { onTagOpen?: (tag: string) => void; onTagClose?: (tag: string, node: { tag: string; attrs: Record<string, string>; children: any[] }) => void } = {}) {
  const parser = new HTMLParser();
  const result = parser.parse(html, options);
  return result;
}
