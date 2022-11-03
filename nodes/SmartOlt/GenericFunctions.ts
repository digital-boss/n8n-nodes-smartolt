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

		if (credentials.testingMode) {
			delete options.json;
			return options;
		} else {
			const response = await this.helpers.request!(options);
			if (typeof encoding === undefined && response.status === false) {
				throw new NodeOperationError(this.getNode(), response.error);
			}
			return response;
		}
	} catch (error) {
		throw new NodeApiError(this.getNode(), error);
	}
}

/**
 * Simplifies the output
 * @param responseData
 * @param property
 */
export function simplify(responseData: IDataObject, property = 'response'): IDataObject {
	if (responseData[property] && Object.keys(responseData[property] as IDataObject).length !== 0) {
		// if responseData[property] is not empty
		return responseData[property] as IDataObject;
	} else {
		return responseData;
	}

}

/**
 * Creates an object from arrays of labels and values
 * @param labels
 * @param data
 */
export function getObject(labels: string[], data: string[]): IDataObject {
	const jsonData: IDataObject = {};
	if(data) {
		for (let i = 0; i < labels.length; i++) {
			jsonData[labels[i]] = data[i];
		}
	}
	return jsonData;
}
