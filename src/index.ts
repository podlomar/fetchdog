interface PayloadReponse<TPayload> {
  result: 'payload';
  response: Response;
  payload: TPayload;
}

interface ErrorResponse<TError> {
  result: 'error';
  error: 'network' | TError;
}

type FetchdogResponse<TPayload, TError> = PayloadReponse<TPayload> | ErrorResponse<TError>;

interface PayloadReceiver<TPayload> {
  throwNetworkError: boolean;
  (response: Response): Promise<TPayload>;
};

export const r = {
  none: async (): Promise<void> => undefined,
  json: async (response: Response): Promise<any> => response.json(),
} as const;

export class Fetchdog<TPayload, TError> {
  readonly #url: string;
  readonly #payloadReceiver: PayloadReceiver<TPayload>;
  
  public constructor(url: string, payloadReceiver: PayloadReceiver<TPayload>) {
    this.#url = url;
    this.#payloadReceiver = payloadReceiver;
  }

  public receive<TNewPayload>(payloadReceiver: PayloadReceiver<TNewPayload>): Fetchdog<TNewPayload> {
    return new Fetchdog(this.#url, payloadReceiver);
  }

  public async fetch(): Promise<FetchdogResponse<TPayload, TError>> {
    try {
      const response = await fetch(this.#url);
      const payload = await this.#payloadReceiver(response);
      return { result: 'payload', response, payload };
    } catch (error) {
      if (error instanceof TypeError) {
        return { result: 'error', error: 'network' };
      }
      console.error('error', error);
      return { result: 'failed' };
    }
  }
};

export const fetchdog = (url?: string) => {
  const defaultUrl = url ?? (
    typeof window === 'undefined' ? '' : window.location.href
  );
  
  return new Fetchdog(defaultUrl, r.none);
}
