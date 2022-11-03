import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SmartOltApi implements ICredentialType {
	name = 'smartOltApi';
	displayName = 'Smart OLT API';
	documentationUrl = 'smartOlt';
	properties: INodeProperties[] = [
		{
			displayName: 'URL',
			name: 'url',
			type: 'string',
			default: '',
			description: 'Example: https://{{subdomain}}.smartolt.com/api',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
		},
		{
			displayName: 'Testing Mode',
			name: 'testingMode',
			type: 'boolean',
			default: false,
			description: 'Return the request options without sending it. Used by developers to debug issues with the node.',
		},
	];
}
