import { CallbackHandlerMethods, Callbacks } from 'langchain/callbacks';
type GetMemberType<T, K extends keyof T> = T[K];

export namespace CallbackUtils {

    export function getHandleLLMNewToken(handle: GetMemberType<CallbackHandlerMethods, 'handleLLMNewToken'>): Callbacks {
        return [{ handleLLMNewToken: handle }];
    }

}
