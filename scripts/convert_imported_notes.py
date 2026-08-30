from __future__ import annotations

import argparse
import re
from pathlib import Path

from bs4 import BeautifulSoup, NavigableString, Tag


ROOT = Path(__file__).resolve().parents[1]
NOTES_DIR = ROOT / "content" / "notes" / "zh"


def compact_text(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()


def paragraph_text(node: Tag) -> str:
    parts: list[str] = []
    for child in node.children:
        if isinstance(child, NavigableString):
            parts.append(re.sub(r"[ \t]+", " ", str(child)))
        else:
            parts.append(inline(child))
    lines = [compact_text(line) for line in "".join(parts).splitlines()]
    lines = [line for line in lines if line]
    if any(re.match(r"^(?:[-*+] |\d+\. )", line) for line in lines):
        return "\n".join(lines)
    return compact_text(" ".join(lines))


def inline(node: object) -> str:
    if isinstance(node, NavigableString):
        return re.sub(r"\s+", " ", str(node))
    if not isinstance(node, Tag):
        return ""

    name = node.name.lower()
    classes = set(node.get("class", []))
    if name in {"script", "style"}:
        return ""
    if name == "a" and "headerlink" in classes:
        return ""
    if name == "br":
        return "<br>"
    if name == "code":
        value = node.get_text("", strip=False).strip()
        fence = "``" if "`" in value else "`"
        return f"{fence}{value}{fence}"
    if name in {"strong", "b"}:
        return f"**{compact_text(''.join(inline(child) for child in node.children))}**"
    if name in {"em", "i"}:
        return f"*{compact_text(''.join(inline(child) for child in node.children))}*"
    if name == "a":
        label = compact_text("".join(inline(child) for child in node.children))
        href = node.get("href", "")
        return f"[{label}]({href})" if href else label
    if name == "img":
        return f"![{node.get('alt', '')}]({node.get('src', '')})"
    if name in {"sup", "sub"}:
        return compact_text(node.get_text(" ", strip=True))
    return "".join(inline(child) for child in node.children)


def code_language(code: str) -> str:
    sample = code.strip()
    lower = sample.lower()
    if re.search(r"(?m)^\s*(from\s+\S+\s+import|import\s+\S+|async\s+def|def\s+\w+|class\s+\w+)", sample):
        return "python"
    if re.search(r"(?im)^\s*(select|insert|update|delete|create\s+table|alter\s+table|with\s+\w+\s+as)\b", sample):
        return "sql"
    if "test-path" in lower or "copy-item" in lower or re.search(r"(?m)^\s*\$\w+\s*=", sample):
        return "powershell"
    if re.search(r"(?m)^\s*(docker|curl|export|pip|python|npm|uvicorn)\b", sample):
        return "bash"
    if re.match(r"^[\[{]", sample) and re.search(r'"[^"\n]+"\s*:', sample):
        return "json"
    if re.search(r"(?m)^\s*\[[\w.-]+\]\s*$", sample) and re.search(r"(?m)^\s*[\w.-]+\s*=", sample):
        return "toml"
    if re.search(r"(?m)^\s*[\w.-]+:\s+\S", sample) and not re.search(r"(?m)^\s*https?://", sample):
        return "yaml"
    if re.search(r"</?[a-zA-Z][^>]*>", sample):
        return "html"
    if re.search(r"(?m)^\s*(const|let|function|interface|type)\s+", sample):
        return "typescript"
    return "text"


def fenced(code: str, language: str) -> str:
    value = code.strip("\n")
    marker = "````" if "```" in value else "```"
    return f"{marker}{language}\n{value}\n{marker}"


def expand_inline_lists(markdown: str) -> str:
    output: list[str] = []
    in_fence = False
    for line in markdown.splitlines():
        if re.match(r"^`{3,4}", line):
            in_fence = not in_fence
            output.append(line)
            continue
        if in_fence or line.startswith("|"):
            output.append(line)
            continue

        bullet = re.match(r"^(.*?：)\s+-\s+(.+)$", line)
        if bullet:
            items = re.split(r"\s+-\s+", bullet.group(2))
            output.extend([bullet.group(1), "", *(f"- {item}" for item in items)])
            continue

        numbered = re.match(r"^(.*?：)\s+(1\.\s+.+)$", line)
        if numbered:
            items = re.split(r"\s+(?=\d+\.\s+)", numbered.group(2))
            output.extend([numbered.group(1), "", *items])
            continue

        output.append(line)
    return "\n".join(output)


def remove_course_guidance(markdown: str) -> str:
    output: list[str] = []
    lines = markdown.splitlines()
    in_fence = False
    skip_reading_notes = False
    index = 0

    while index < len(lines):
        line = lines[index]
        if re.match(r"^`{3,4}", line):
            in_fence = not in_fence
            output.append(line)
            index += 1
            continue
        if in_fence:
            output.append(line)
            index += 1
            continue

        if line == "## 技术要点":
            break
        if line == "读图重点：":
            skip_reading_notes = True
            index += 1
            continue
        if skip_reading_notes:
            if not line.strip() or re.match(r"^\d+\.\s+", line):
                index += 1
                continue
            skip_reading_notes = False

        if re.match(r"^## 第一部分：前置知识\s*[—-]\s*", line):
            line = re.sub(r"^## 第一部分：前置知识\s*[—-]\s*", "## 第一部分：", line)

        remove_patterns = (
            "Lecture",
            "**前置知识**",
            "**深入学习**",
            "**阅读建议**",
            "单独查看：打开可缩放时序图。",
            "本章的技术重点",
            "这张图就是本章节主线",
            "本部分主线是“线上问题如何沉淀",
        )
        if any(pattern in line for pattern in remove_patterns):
            index += 1
            continue

        replacements = (
            ("Milvus 索引机制与基本操作先讲底层概念和 PyMilvus 操作，Milvus 混合检索深度解析再把这些能力封装进业务检索。", "PyMilvus 用于展示底层概念与操作，MilvusHybridStore 将这些能力封装为业务检索接口。"),
            ("这部分回答“用户提问之后，LangChain 在哪里参与在线回答”。先看示例代码位置，再看组件作用。", "下面说明用户提问后 LangChain 参与在线回答的位置、代码落点与组件作用。"),
            ("这一部分是知识库多版本管理需要和第 16、17 章衔接的地方：文档入库与索引链路负责把资料写入新版本，RAG 回归验收与入库质量负责解释质量报告如何检查；知识库多版本管理负责解释为什么质量报告不通过时不能激活版本。", "文档入库与索引链路负责把资料写入新版本，质量评测负责生成检查报告；版本管理则保证质量报告不通过时无法激活版本。"),
            ("阅读意图分类与路由入口代码时，可以按下面这条时序打断点。它对应的是一次普通问答请求从入口进入，到最终产出 `IntentResult` 和 `RetrievalPlan` 的代码执行顺序。", "下图展示一次普通问答请求从入口进入，到最终产出 `IntentResult` 和 `RetrievalPlan` 的代码执行顺序。"),
            ("如果把第 05、06 章的闭环也合在一起看，完整质量链路其实是下面这条顺序：", "完整质量链路如下："),
            ("这章最适合按 `build_retrieval_plan()` 的真实执行顺序阅读。顺序不是“先看参数，再看规则”，而是先识别问题形态，再按固定层叠加补丁，最后产出不可变的 `RetrievalPlan`。", "`build_retrieval_plan()` 先识别问题形态，再按固定层叠加补丁，最后产出不可变的 `RetrievalPlan`。"),
            ("第 10/11 章生成答案时", "生成答案时"),
            ("第 09/10 章只有", "只有"),
            ("第 08/09/10 章拿到", "拿到"),
            ("后续章节生成", "生成模块生成"),
            ("下一章会接着这份计划，处理追问改写和查询变体。", "该计划随后用于追问改写和查询变体。"),
            ("本文对应章节", "对应模块"),
            ("后续 Pipeline 编排章节", "Pipeline 编排模块"),
            ("版本治理章节", "版本治理部分"),
            ("LangSmith 章节", "LangSmith 内容"),
            ("章节实践代码对齐", "示例代码一致性"),
            ("# 章节代码、内容和系统边界检查", "# 技术代码、内容和系统边界检查"),
            ("**没接触过 LangSmith 的读者完全可以跳过 5.8.3 之后的内容**，等企业协作出现信号再回来读。", "没有 LangSmith 也不影响本地质量闭环。"),
        )
        for old, new in replacements:
            line = line.replace(old, new)

        output.append(line)
        index += 1

    return "\n".join(output).rstrip() + "\n"


def render_list(node: Tag, depth: int = 0) -> str:
    ordered = node.name.lower() == "ol"
    lines: list[str] = []
    items = node.find_all("li", recursive=False)
    for index, item in enumerate(items, start=1):
        prefix = f"{index}. " if ordered else "- "
        inline_parts: list[str] = []
        nested_lists: list[Tag] = []
        block_parts: list[str] = []
        for child in item.children:
            if isinstance(child, Tag) and child.name.lower() in {"ul", "ol"}:
                nested_lists.append(child)
            elif isinstance(child, Tag) and child.name.lower() in {"pre", "div", "table", "blockquote"}:
                rendered = render_block(child)
                if rendered:
                    block_parts.append(rendered)
            else:
                inline_parts.append(inline(child))
        label = compact_text("".join(inline_parts))
        lines.append(f"{'  ' * depth}{prefix}{label}".rstrip())
        for nested in nested_lists:
            lines.append(render_list(nested, depth + 1))
        for part in block_parts:
            lines.extend(f"{'  ' * (depth + 1)}{line}" if line else "" for line in part.splitlines())
    return "\n".join(lines)


def table_cell(cell: Tag) -> str:
    parts: list[str] = []
    for child in cell.children:
        if isinstance(child, Tag) and child.name.lower() in {"ul", "ol"}:
            values = [compact_text(inline(item)) for item in child.find_all("li", recursive=False)]
            parts.append("；".join(value for value in values if value))
        elif isinstance(child, Tag) and child.name.lower() == "pre":
            parts.append(f"`{compact_text(child.get_text(' ', strip=True))}`")
        else:
            parts.append(inline(child))
    return compact_text("".join(parts)).replace("|", "\\|").replace("\n", "<br>")


def render_table(node: Tag) -> str:
    rows = node.find_all("tr")
    values = [[table_cell(cell) for cell in row.find_all(["th", "td"], recursive=False)] for row in rows]
    values = [row for row in values if row]
    if not values:
        return ""
    width = max(len(row) for row in values)
    values = [row + [""] * (width - len(row)) for row in values]
    has_header = bool(rows and rows[0].find("th"))
    if has_header:
        header, body = values[0], values[1:]
    else:
        header = [f"列 {index}" for index in range(1, width + 1)]
        body = values
    output = [
        "| " + " | ".join(header) + " |",
        "| " + " | ".join("---" for _ in range(width)) + " |",
    ]
    output.extend("| " + " | ".join(row) + " |" for row in body)
    return "\n".join(output)


def render_children(node: Tag) -> str:
    blocks = [render_block(child) for child in node.children]
    return "\n\n".join(block for block in blocks if block.strip())


def render_block(node: object) -> str:
    if isinstance(node, NavigableString):
        return compact_text(str(node))
    if not isinstance(node, Tag):
        return ""

    name = node.name.lower()
    classes = set(node.get("class", []))
    if name in {"script", "style"}:
        return ""
    if name in {"h2", "h3", "h4", "h5", "h6"}:
        level = int(name[1])
        return f"{'#' * level} {compact_text(inline(node))}"
    if name == "p":
        block_names = {"pre", "div", "table", "blockquote", "ul", "ol"}
        if any(isinstance(child, Tag) and child.name.lower() in block_names for child in node.children):
            blocks: list[str] = []
            inline_parts: list[str] = []
            for child in node.children:
                if isinstance(child, Tag) and child.name.lower() in block_names:
                    value = compact_text("".join(inline_parts))
                    if value:
                        blocks.append(value)
                    inline_parts = []
                    rendered = render_block(child)
                    if rendered:
                        blocks.append(rendered)
                else:
                    inline_parts.append(inline(child))
            value = compact_text("".join(inline_parts))
            if value:
                blocks.append(value)
            return "\n\n".join(blocks)
        return paragraph_text(node)
    if name in {"ul", "ol"}:
        return render_list(node)
    if name == "table":
        return render_table(node)
    if name == "hr":
        return "---"
    if name == "blockquote":
        content = render_children(node)
        return "\n".join(f"> {line}" if line else ">" for line in content.splitlines())
    if name == "figure":
        image = node.find("img")
        return inline(image) if image else render_children(node)
    if name == "pre":
        code = node.find("code")
        value = (code or node).get_text("", strip=False)
        return fenced(value, "mermaid" if "mermaid" in classes else code_language(value))
    if name == "div" and "highlight" in classes:
        code = node.select_one("td.code pre code") or node.select_one("pre code") or node.select_one("pre")
        value = code.get_text("", strip=False) if code else node.get_text("\n", strip=False)
        if "```" in value and re.search(r"(?m)^#{2,6}\s+", value):
            if value.count("```") % 2:
                value = value.rstrip() + "\n```\n"
            return value.strip()
        return fenced(value, code_language(value))
    if name == "div" and "admonition" in classes:
        content = render_children(node)
        return "\n".join(f"> {line}" if line else ">" for line in content.splitlines())
    if name == "img":
        return inline(node)
    if name in {"section", "article", "main", "div"}:
        return render_children(node)
    return compact_text(inline(node))


def convert_body(html: str) -> str:
    soup = BeautifulSoup(html, "html.parser")
    blocks = [render_block(child) for child in soup.contents]
    markdown = "\n\n".join(block for block in blocks if block.strip())
    return remove_course_guidance(expand_inline_lists(markdown)).strip() + "\n"


def split_frontmatter(source: str) -> tuple[str, str]:
    match = re.match(r"\A(---\r?\n.*?\r?\n---\r?\n)(.*)\Z", source, flags=re.S)
    if not match:
        raise ValueError("missing frontmatter")
    return match.group(1), match.group(2)


def imported_files() -> list[Path]:
    files: list[tuple[int, Path]] = []
    for path in NOTES_DIR.glob("*.md"):
        source = path.read_text(encoding="utf-8")
        order = re.search(r"(?m)^order:\s*(\d+)\s*$", source)
        if order and int(order.group(1)) >= 4:
            files.append((int(order.group(1)), path))
    return [path for _, path in sorted(files)]


def main() -> None:
    parser = argparse.ArgumentParser(description="Convert imported knowledge-base HTML bodies to Markdown.")
    parser.add_argument("--write", action="store_true", help="Replace article bodies in place.")
    args = parser.parse_args()

    converted = 0
    for path in imported_files():
        source = path.read_text(encoding="utf-8")
        frontmatter, body = split_frontmatter(source)
        if not re.search(r"<(?:h2|p|div|table|pre)\b", body):
            continue
        markdown = convert_body(body)
        converted += 1
        if args.write:
            path.write_text(frontmatter + markdown, encoding="utf-8", newline="\n")
        print(f"{path.name}: {len(body):,} HTML chars -> {len(markdown):,} Markdown chars")

    print(f"Converted {converted} imported articles{' in place' if args.write else ' (dry run)' }.")


if __name__ == "__main__":
    main()
