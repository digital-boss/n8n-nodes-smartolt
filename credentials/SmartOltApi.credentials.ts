import {
	ICredentialType, INodeProperties,
	NodePropertyTypes,
} from 'n8n-workflow';

export class SmartOltApi implements ICredentialType {
	name = 'smartOltApi';
	displayName = 'Smart OLT API';
	documentationUrl = 'smartOlt';
	properties = [
		{
			displayName: 'URL',
			name: 'url',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string' as NodePropertyTypes,
			default: '',
		},
	];
}