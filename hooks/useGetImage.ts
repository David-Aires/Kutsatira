import { buildUrl } from "next-basics";

export function apiRequest(
    method: string,
    url: string,
    body,
    headers?: object,
  ): Promise<{ ok: boolean; status: number; data?: any; error?: any }> {
    return fetch(url, {
      method,
      cache: 'no-cache',
      headers: {
        Accept: 'image/png',
        'Content-Type': 'image/png',
        ...headers,
      },
      body,
    }).then(res => {
      if (res.ok) {
        return res.blob().then(data => ({ ok: res.ok, status: res.status, data }));
        return;
      }
  
      return res.text().then(text => ({ ok: res.ok, status: res.status, error: text }));
    });
  }
  
  export function getImage(url: string, params?: object, headers?: object) {
    return apiRequest('get', buildUrl(url, params), undefined, headers);
  }