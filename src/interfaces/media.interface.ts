export type Media = {
  type: string;
  id: string;
  url: string;
  mimeType: string | null;
  bytes: string | null;
  width: number | null;
  height: number | null;
  metadata: object | null;
} | null;
