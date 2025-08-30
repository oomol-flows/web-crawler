import type { Context } from "@oomol/types/oocana";

//#region generated meta
type Inputs = {
  text: string;
};
type Outputs = {
  content: string;
};
//#endregion

export default async function (
  params: Inputs,
  context: Context<Inputs, Outputs>
): Promise<Outputs> {

  // Get API key - through context in OOMOL environment
  const apiKey = context.OOMOL_LLM_ENV.apiKey;

  const apiUrl = "https://console.oomol.com/api/tasks/jina/reader";


  // Build request body
  const requestBody: any = {};
  requestBody.text = params.text;

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

    const content = await response.text();

    return { content };
  } catch (error) {
    throw new Error(`Request failed: ${error.message}`);
  }
}