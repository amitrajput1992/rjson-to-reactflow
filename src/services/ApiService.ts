import { projectRJSON } from '../types/rjson';

interface ApiResponse {
  data: projectRJSON;
}

export class ApiService {
  private static API_URL = 'https://api.gmetri.com/sdk/project/getJSON';

  static async fetchProjectJson(token: string, projUuid: string): Promise<projectRJSON> {
    const response = await fetch(this.API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ projUuid })
    });

    if (!response.ok) { 
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as ApiResponse;
    return data.data;
  }
}
