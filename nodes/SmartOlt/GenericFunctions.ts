import {
	OptionsWithUri,
} from 'request';

import {
	IExecuteFunctions,
	IExecuteSingleFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
} from 'n8n-core';

import {
	IDataObject,
	NodeApiError,
	NodeOperationError,
} from 'n8n-workflow';

export async function smartOltApiRequest(this: IHookFunctions | IExecuteFunctions | IExecuteSingleFunctions | ILoadOptionsFunctions,
	method: string, resource: string, body: IDataObject = {}, qs: IDataObject = {}, uri?: string, encoding?: null | undefined): Promise<any> { // tslint:disable-line:no-any

	try {
		// Get credentials the user provided for this node
		const credentials = await this.getCredentials('smartOltApi') as IDataObject;

		if (credentials === undefined) {
			throw new NodeOperationError(this.getNode(), 'No credentials got returned!');
		}

		// Make http request according to <https://api.smartolt.com/>
		const options: OptionsWithUri = {
			method,
			headers: {
				'X-Token': credentials.apiKey,
			},
			qs,
			form: body, // Send data as 'Content-Type': 'application/x-www-form-urlencoded',
			uri: uri || `${credentials.url}${resource}`,
			json: true,
		};

		if (Object.keys(options.qs).length === 0) {
			delete options.qs;
		}
		// @ts-ignore
		if (Object.keys(options.form).length === 0) {
			delete options.form;
		}

		if (encoding === null) {
			options.encoding = null;
		}

		return this.helpers.request!(options);

	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}

/**
 * Simplifies the output
 *
 * @export
 * @param IDataObject responseData
 * @returns IDataObject
 */
export function simplify(responseData: IDataObject): IDataObject {
	if (Object.keys(responseData.response as IDataObject).length === 0) {
		// if responseData.response is empty
		return {
			success: true,
			message: 'No records got returned.',
		};
	} else {
		return responseData.response as IDataObject;
	}

}