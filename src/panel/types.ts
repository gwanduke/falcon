export type FormatType = "msw" | "json";

export interface RequestInfo {
  checked: boolean;
  id: number;
  method: string;
  url: string;
  status: number;
  contentSize: number;
  contentMimeType: string;
  contentType: string;
  body: string;
  headers: any[];
}
