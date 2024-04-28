import { Model, ModelOptions, ModelService } from '../model/model-protocol';
import { ContainerUtil } from '@malagu/core';

export namespace ModelUtils {

    export async function getModel(options?: ModelOptions): Promise<Model> {
        const modelService = ContainerUtil.get<ModelService>(ModelService);
        let model = options?.modelName;
        if (!model && options?.metadata?.inlineCompletion) {
            model = await modelService.getInlineCompletionModel();
        }
        if (!model) {
            model = await modelService.getModel();
        }
        return model;
    }

    export function getInlineCompletionModel(): Promise<Model> {
        return getModel({ metadata: getInlineCompletionFlag() });
    }

    export function getInlineCompletionFlag(): { inlineCompletion: true } {
        return {
            inlineCompletion: true
        };
    }
}
