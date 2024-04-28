import TencentCloudSDKHttpException from 'tencentcloud-sdk-nodejs/tencentcloud/common/exception/tencent_cloud_sdk_exception';
import { APIError, ChatMessageError, ContentFilterError, ContentLengthError } from '../errors';
import { localize } from 'vscode-nls-i18n';
import { CloudError } from '../api/cloud/cloud-protocol';

interface RawError {
    code: string;
    type: string;
    message: string;
}

export namespace ErrorUtils {
    export function parseModelServiceError(error: Error): Error {
        if (error instanceof ChatMessageError) {
            return error;
        }
        const doHandleError = (err: RawError) => {
            switch (err.code || err.type) {
                case 'context_length_exceeded': {
                    err.message = localize('error.code.contextLengthExceeded');
                    break;
                }
                case 'insufficient_quota': {
                    err.message = localize('error.code.insufficientQuota');
                    break;
                }
                case 'invalid_api_key': {
                    err.message = localize('error.code.invalidApiKey');
                    break;
                }
                case 'invalid_organization': {
                    err.message = localize('error.code.invalidOrganization');
                    break;
                }
                default: {
                    console.error(err);
                    err.message = localize('error.code.unknown');
                }
            }
            return new APIError(err.message, err.code, err.type);
        };
        if ('statusCode' in error) {
            try {
                const { error: err } = JSON.parse(error.message.substring(error.message.indexOf('{')));
                return doHandleError(err);
            } catch (error2) {
                // noop
            }
        } else if ('error' in error) {
            return doHandleError(error.error as RawError);
        }
        return doHandleError(error as unknown as RawError);
    }

    export function isAbortedError(error: unknown): boolean {
        return error instanceof Error && (
            error.message.startsWith('The user aborted a request.') ||
            error.message.startsWith('Cancel') ||
            error.message.startsWith('AbortError') ||
            ('code' in error && error.code === 'ECONNABORTED')
        );
    }

    export function parseCloudError(error: Error): Error {
        if (error instanceof TencentCloudSDKHttpException && error.getRequestId().length) {
            let message = error.getMessage();
            switch (error.code) {
                case 'InternalError': {
                    message = localize('error.code.unknown');
                    break;
                }
            }
            const cloudError = new CloudError(message, error.requestId, error.code);

            return cloudError;
        }
        return error;
    }

    export function throwFinishReasonErrorIfNeed(finishReason: string): void {
        switch (finishReason) {
            case 'content_filter': {
                throw new ContentFilterError(localize('error.contentFilter'), false, true);
            }
            case 'length': {
                throw new ContentLengthError(localize('error.code.contextLengthExceeded'), false, false);
            }
        }
    }
}
