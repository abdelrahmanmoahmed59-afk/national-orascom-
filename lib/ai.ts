import { getProviderConfig } from "@/config/ai-providers"

export type AiRequestOptions = {
    max_tokens?: number
    temperature?: number
    [key: string]: any
}

export type AiClient = {
    name: string
    config: any
    apiKey: string
    generate: (prompt: string, opts?: AiRequestOptions) => Promise<any>
}

/**
 * Returns an AI client instance for the named provider, or null if provider is disabled.
 * Throws if provider is enabled but missing required config (like API key).
 */
export function getAiClient(name: string): AiClient | null {
    const cfg = getProviderConfig(name)
    if (!cfg || !cfg.enabled) return null

    const apiKey = cfg.apiKeyEnv ? (process.env[cfg.apiKeyEnv] as string | undefined) : undefined
    if (!apiKey) {
        throw new Error(`AI provider "${name}" is enabled but missing API key. Set env var ${cfg.apiKeyEnv}`)
    }

    // Minimal Claude (Anthropic) wrapper using the REST endpoints.
    if (name === "claude-haiku") {
        const base = (process.env.CLAUDE_API_BASE as string) || "https://api.anthropic.com"
        const model = cfg.version ? `claude-${cfg.version}` : "claude-2"

        return {
            name,
            config: cfg,
            apiKey,
            generate: async (prompt: string, opts: AiRequestOptions = {}) => {
                const body: any = {
                    model,
                    prompt,
                    max_tokens: opts.max_tokens ?? 512,
                    temperature: opts.temperature ?? 0.7,
                    // pass-through any other options
                    ...opts,
                }

                const res = await fetch(`${base}/v1/complete`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        // Many Anthropic endpoints expect 'x-api-key' header
                        "x-api-key": apiKey,
                    },
                    body: JSON.stringify(body),
                })

                if (!res.ok) {
                    const text = await res.text()
                    throw new Error(`Claude request failed: ${res.status} ${res.statusText} - ${text}`)
                }

                // Return JSON response as-is; adapt parsing as needed for model responses
                return res.json()
            },
        }
    }

    // Unknown provider: return null (or throw)
    return null
}

/** Convenience: generate text from provider name */
export async function generateFromProvider(name: string, prompt: string, opts?: AiRequestOptions) {
    const client = getAiClient(name)
    if (!client) throw new Error(`AI provider ${name} is not enabled or not configured`)
    return client.generate(prompt, opts)
}
