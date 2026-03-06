export type AiProviderConfig = {
    enabled: boolean
    version?: string
    apiKeyEnv?: string
    description?: string
}

const aiProviders: Record<string, AiProviderConfig> = {
    "claude-haiku": {
        enabled: true,
        version: "4.5",
        apiKeyEnv: "CLAUDE_API_KEY",
        description: "Anthropic Claude Haiku 4.5 for conversational and creative tasks",
    },
}

export function isProviderEnabled(name: string) {
    return !!aiProviders[name]?.enabled
}

export function getProviderConfig(name: string): AiProviderConfig | undefined {
    return aiProviders[name]
}

export default aiProviders
