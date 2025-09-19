import type { Context } from "@oomol/types/oocana";

//#region generated meta
type Inputs = {
  url: string;
};
type Outputs = {
  content: string;
};
//#endregion

export default async function(
  params: Inputs,
  context: Context<Inputs, Outputs>
): Promise<Outputs> {

  // Get API key from OOMOL environment through context
  const apiKey = context.OOMOL_LLM_ENV.apiKey;

  const apiUrl = "https://console.oomol.com/api/tasks/jina/reader";
  
  // Validate if the URL is valid
  function validateUrl(url: string): string {
    if (!url) {
      throw new Error("URL cannot be empty");
    }
    
    // Complete the protocol prefix (if not present)
    let fullUrl = url;
    if (!url.match(/^https?:\/\//i)) {
      fullUrl = `https://${url}`;
    }
    
    // Validate if the URL format is valid
    try {
      new URL(fullUrl);
      return fullUrl;
    } catch (error) {
      throw new Error(`Invalid URL format: ${url}`);
    }
  }

  // Build request body
  const requestBody: any = {};
  requestBody.url = validateUrl(params.url);

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
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    const jsonResponse = await response.json();

    return { content: jsonResponse.data };
  } catch (error) {
    throw new Error(`Request failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}