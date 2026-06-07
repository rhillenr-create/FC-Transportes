'use server';
/**
 * @fileOverview Um fluxo Genkit para analisar resultados de checklist pré-viagem para fornecer insights diagnósticos e recomendações de manutenção.
 *
 * - intelligentMaintenanceDiagnostics - Uma função que inicia o processo de diagnóstico.
 * - IntelligentMaintenanceDiagnosticsInput - O tipo de entrada para a função intelligentMaintenanceDiagnostics.
 * - IntelligentMaintenanceDiagnosticsOutput - O tipo de retorno para a função intelligentMaintenanceDiagnostics.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const IntelligentMaintenanceDiagnosticsInputSchema = z.object({
  checklistLog: z
    .string()
    .describe(
      'Um log detalhado do checklist pré-viagem, incluindo observações do motorista e status de vários itens (ex: "Pneus OK", "Vazamentos: problema, óleo no motor").'
    ),
  photoDataUris: z
    .array(z.string())
    .optional()
    .describe(
      "Um array opcional de fotos, como URIs de dados em Base64. Estas fotos documentam problemas identificados."
    ),
});
export type IntelligentMaintenanceDiagnosticsInput = z.infer<
  typeof IntelligentMaintenanceDiagnosticsInputSchema
>;

const IntelligentMaintenanceDiagnosticsOutputSchema = z.object({
  diagnosticInsights: z
    .string()
    .describe(
      'Um resumo conciso em PORTUGUÊS dos problemas identificados e suas prováveis causas com base no log e nas fotos.'
    ),
  maintenanceRecommendations: z
    .string()
    .describe(
      'Recomendações de manutenção acionáveis e preditivas em PORTUGUÊS para resolver os problemas identificados.'
    ),
  severity: z
    .enum(['low', 'medium', 'high', 'critical'])
    .describe(
      "O nível de urgência dos problemas detectados ('low', 'medium', 'high', 'critical')"
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
  prompt: `Você é um sistema especializado em diagnóstico de manutenção de frotas de caminhões. Sua tarefa é analisar os resultados do checklist pré-viagem, incluindo as observações do motorista e quaisquer fotos enviadas, para fornecer insights diagnósticos concisos e recomendações de manutenção preditiva. 

IMPORTANTE: Toda a sua resposta nos campos de texto deve ser em PORTUGUÊS (Brasil).

Log do Checklist Pré-Viagem:
{{{checklistLog}}}

{{#if photoDataUris}}
Fotos documentando os problemas identificados:
{{#each photoDataUris}}
  {{media url=this}}
{{/each}}
{{/if}}

Considere todas as informações fornecidas para gerar:
1.  **diagnosticInsights**: Um resumo claro e conciso em PORTUGUÊS dos problemas potenciais e suas causas prováveis.
2.  **maintenanceRecommendations**: Passos específicos, acionáveis e preditivos para a manutenção em PORTUGUÊS.
3.  **severity**: Um nível de urgência, escolhendo entre 'low' (baixo), 'medium' (médio), 'high' (alto) ou 'critical' (crítico).

Forneça sua resposta no formato JSON conforme o esquema de saída.`,
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
      throw new Error('Falha ao gerar insights e recomendações de manutenção.');
    }
    return output;
  }
);
