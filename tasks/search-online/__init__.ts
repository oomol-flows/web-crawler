import type { Context } from "@oomol/types/oocana";

//#region generated meta
type Inputs = {
  url: string | null;
  text: string | null;
};
type Outputs = {
  content: string;
};
//#endregion

export default async function(
  params: Inputs,
  context: Context<Inputs, Outputs>
): Promise<Outputs> {
  // 验证至少有一个参数存在
  if (!params.url && !params.text) {
    throw new Error("必须提供 url 或 text 参数中的至少一个");
  }

  // 获取 API key - 在OOMOL环境中通过context获取
  const apiKey = context.OOMOL_LLM_ENV.apiKey;

  const apiUrl = "https://console.oomol.com/api/tasks/jina/reader";
  
  // 验证是否为有效链接
  function validateUrl(url: string): string {
    if (!url) {
      throw new Error("URL不能为空");
    }
    
    // 补全协议前缀（如果没有）
    let fullUrl = url;
    if (!url.match(/^https?:\/\//i)) {
      fullUrl = `https://${url}`;
    }
    
    // 验证是否为有效URL格式
    try {
      new URL(fullUrl);
      return fullUrl;
    } catch (error) {
      throw new Error(`无效的链接格式: ${url}`);
    }
  }

  // 构建请求体
  const requestBody: any = {};
  if (params.url) {
    requestBody.url = validateUrl(params.url);
  }
  if (params.text) {
    requestBody.text = params.text;
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`API 调用失败: ${response.status} ${response.statusText}`);
    }

    const content = await response.text();
    
    return { content };
  } catch (error) {
    throw new Error(`请求失败: ${error.message}`);
  }
}