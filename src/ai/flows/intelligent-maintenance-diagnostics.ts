'use server';
/**
 * @fileOverview A Genkit flow for analyzing pre-trip checklist results to provide diagnostic insights and maintenance recommendations.
 *
 * - intelligentMaintenanceDiagnostics - A function that initiates the diagnostic process.
 * - IntelligentMaintenanceDiagnosticsInput - The input type for the intelligentMaintenanceDiagnostics function.
 * - IntelligentMaintenanceDiagnosticsOutput - The return type for the intelligentMaintenanceDiagnostics function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const IntelligentMaintenanceDiagnosticsInputSchema = z.object({
  checklistLog: z
    .string()
    .describe(
      'A detailed log from the pre-trip checklist, including driver observations and status of various items (e.g., "Pneus OK", "Vazamentos: problema, óleo no motor").'
    ),
  photoDataUris: z
    .array(z.string())
    .optional()
    .describe(
      "An optional array of photos, as data URIs that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'. These photos document identified problems."
    ),
});
export type IntelligentMaintenanceDiagnosticsInput = z.infer<
  typeof IntelligentMaintenanceDiagnosticsInputSchema
>;

const IntelligentMaintenanceDiagnosticsOutputSchema = z.object({
  diagnosticInsights: z
    .string()
    .describe(
      'A concise summary of identified potential issues and their likely causes based on the checklist log and photos.'
    ),
  maintenanceRecommendations: z
    .string()
    .describe(
      'Actionable and predictive maintenance recommendations to address the identified issues and prevent future problems.'
    ),
  severity: z
    .enum(['low', 'medium', 'high', 'critical'])
    .describe(
      "The urgency level of the detected issues, indicating how soon maintenance is required. ('low', 'medium', 'high', 'critical')"
    ),
});
export type IntelligentMaintenanceDiagnosticsOutput = z.infer<
  typeof IntelligentMaintenanceDiagnosticsOutputSchema
>;

export async function intelligentMaintenanceDiagnostics(
  input: IntelligentMaintenanceDiagnosticsInput
): Promise<IntelligentMaintenanceDiagnosticsOutput> {
  return intelligentMaintenanceDiagnosticsFlow(input);
}

const diagnosticPrompt = ai.definePrompt({
  name: 'intelligentMaintenanceDiagnosticPrompt',
  input: { schema: IntelligentMaintenanceDiagnosticsInputSchema },
  output: { schema: IntelligentMaintenanceDiagnosticsOutputSchema },
  prompt: `You are an expert fleet maintenance diagnostic system. Your task is to analyze pre-trip checklist results, including driver observations and any accompanying photos, to provide concise diagnostic insights and predictive maintenance recommendations for a truck. Based on your analysis, assign a severity level to the identified issues.

Pre-trip Checklist Log:
{{{checklistLog}}}

{{#if photoDataUris}}
Photos documenting identified problems:
{{#each photoDataUris}}
  {{media url=this}}
{{/each}}
{{/if}}

Consider all provided information to generate:
1.  **diagnosticInsights**: A clear and concise summary of potential issues and their likely causes. This should be based directly on the checklist log and analysis of any provided images.
2.  **maintenanceRecommendations**: Specific, actionable, and predictive steps for maintenance. These recommendations should aim to address current problems and prevent future issues.
3.  **severity**: An urgency level for the maintenance, choosing from 'low', 'medium', 'high', or 'critical'.

Provide your response in JSON format.`,
});

const intelligentMaintenanceDiagnosticsFlow = ai.defineFlow(
  {
    name: 'intelligentMaintenanceDiagnosticsFlow',
    inputSchema: IntelligentMaintenanceDiagnosticsInputSchema,
    outputSchema: IntelligentMaintenanceDiagnosticsOutputSchema,
  },
  async (input) => {
    const { output } = await diagnosticPrompt(input);
    if (!output) {
      throw new Error('Failed to generate diagnostic insights and recommendations.');
    }
    return output;
  }
);
