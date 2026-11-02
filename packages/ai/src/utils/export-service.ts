// 导出格式类型
export type ExportFormat = "markdown" | "txt" | "html" | "docx" | "pdf"

// 导出选项
export interface ExportOptions {
  title?: string
  author?: string
  date?: Date
  includeMetadata?: boolean
}

/**
 * 将内容导出为指定格式
 * @param content 要导出的内容
 * @param format 导出格式
 * @param options 导出选项
 */
export async function exportContent(content: string, format: ExportFormat, options: ExportOptions = {}): Promise<Blob> {
  const { title = "未命名文档", author = "", date = new Date(), includeMetadata = true } = options

  // 根据格式处理内容
  switch (format) {
    case "markdown":
      return exportMarkdown(content, { title, author, date, includeMetadata })
    case "txt":
      return exportTxt(content, { title, author, date, includeMetadata })
    case "html":
      return exportHtml(content, { title, author, date, includeMetadata })
    case "docx":
      // 在实际应用中，这里会使用docx库来生成Word文档
      throw new Error("DOCX导出功能需要在服务器端实现")
    case "pdf":
      // 在实际应用中，这里会使用PDF生成库来生成PDF文件
      throw new Error("PDF导出功能需要在服务器端实现")
    default:
      throw new Error(`不支持的导出格式: ${format}`)
  }
}

/**
 * 导出为Markdown格式
 */
async function exportMarkdown(content: string, { title, author, date, includeMetadata }: ExportOptions): Promise<Blob> {
  let markdown = ""

  if (includeMetadata) {
    markdown += `---\n`
    markdown += `title: ${title}\n`
    if (author) markdown += `author: ${author}\n`
    markdown += `date: ${date.toISOString()}\n`
    markdown += `---\n\n`
  }

  markdown += content

  return new Blob([markdown], { type: "text/markdown" })
}

/**
 * 导出为纯文本格式
 */
async function exportTxt(content: string, { title, author, date, includeMetadata }: ExportOptions): Promise<Blob> {
  let text = ""

  if (includeMetadata) {
    text += `标题: ${title}\n`
    if (author) text += `作者: ${author}\n`
    text += `日期: ${date.toLocaleDateString()}\n\n`
    text += `${"=".repeat(30)}\n\n`
  }

  text += content

  return new Blob([text], { type: "text/plain" })
}

/**
 * 导出为HTML格式
 */
async function exportHtml(content: string, { title, author, date, includeMetadata }: ExportOptions): Promise<Blob> {
  // 简单的Markdown到HTML转换
  // 在实际应用中，应使用专门的Markdown解析库
  const htmlContent = content
    .replace(/# (.*?)$/gm, "<h1>$1</h1>")
    .replace(/## (.*?)$/gm, "<h2>$1</h2>")
    .replace(/### (.*?)$/gm, "<h3>$1</h3>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br>")

  const DOCTYPE = "<!DOCTYPE html>"
  const fontFamily = "Arial, sans-serif"
  const textColor = "#666"
  const borderColor = "#eee"
  const contentType = "text/html"

  const html = `${DOCTYPE}
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    body {
      font-family: ${fontFamily};
      line-height: 1.6;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .metadata {
      color: ${textColor};
      border-bottom: 1px solid ${borderColor};
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  ${
    includeMetadata
      ? `
  <div class="metadata">
    <h1>${title}</h1>
    ${author ? `<p>作者: ${author}</p>` : ""}
    <p>日期: ${date.toLocaleDateString()}</p>
  </div>
  `
      : ""
  }
  <div class="content">
    <p>${htmlContent}</p>
  </div>
</body>
</html>`

  return new Blob([html], { type: contentType })
}

/**
 * 下载文件
 * @param blob 文件Blob
 * @param filename 文件名
 */
export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
