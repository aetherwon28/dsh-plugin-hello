/**
 * dsh-plugin-hello — the smallest useful DeepSeek Harness plugin.
 *
 * It registers exactly one model-facing tool, `hello_world`, and does nothing
 * else. Keep it as a starting point: copy the file, rename the tool, replace
 * `execute`, and mount the package in a dsh profile (see README.md).
 *
 * Deliberate constraints, so the package works straight from a clone:
 * - no runtime imports (no build step, no dependency on the host's resolution);
 * - the tool is described with raw JSON Schema instead of `defineTool`, which
 *   would otherwise be the idiomatic choice for type inference.
 *
 * @module dsh-plugin-hello
 */

/** Cordis plugin name, shown in profile diagnostics. */
export const name = 'plugin-hello'

/** Services this plugin reads from the host context. */
export const inject = ['tools']

/**
 * Register the `hello_world` tool.
 * @param {import('@deepseek-ai/cordis').Context} ctx - host context carrying the tool registry.
 * @returns {void}
 */
export function apply(ctx) {
  ctx.tools.register({
    name: 'hello_world',
    description:
      'Say hello. Use this to confirm that the dsh-plugin-hello template plugin is installed and mounted.',
    parameters: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          description: 'Who or what to greet. Defaults to "world".',
        },
      },
      additionalProperties: false,
    },
    output: {
      schema: {
        type: 'object',
        properties: {
          greeting: { type: 'string' },
          plugin: { type: 'string' },
        },
        required: ['greeting', 'plugin'],
        additionalProperties: false,
      },
      /**
       * Model-facing rendering of the canonical value.
       * @param {unknown} _args - validated arguments.
       * @param {{ greeting: string, plugin: string }} value - canonical value.
       * @returns {Array<{ type: 'text', text: string }>} content blocks.
       */
      render(_args, value) {
        return [{ type: 'text', text: value.greeting }]
      },
    },
    /**
     * @param {{ message?: string }} args - validated arguments.
     * @returns {Promise<{ greeting: string, plugin: string }>} canonical value.
     */
    async execute(args) {
      const who = (args?.message ?? '').trim() || 'world'
      return {
        greeting: `Hello, ${who}! — dsh-plugin-hello is live.`,
        plugin: 'dsh-plugin-hello@0.1.0',
      }
    },
  })
}
