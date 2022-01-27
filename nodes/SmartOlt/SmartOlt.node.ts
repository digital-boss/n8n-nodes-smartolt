import {
	IExecuteFunctions,
} from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

import {
	oltFields,
	oltOperations,
	onuFields,
	onuOperations
} from './descriptions';

import {
	simplify,
	smartOltApiRequest,
} from './GenericFunctions';

export class SmartOlt implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'SmartOLT',
		name: 'smartOlt',
		icon: 'file:smartOlt.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume SmartOLT API (v0.1.6)', // todo: increase with every version
		defaults: {
				name: 'SmartOlt',
				color: '#018FFB',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'smartOltApi',
				required: true,
				// testedBy: 'testSmartOltApiAuth',
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				options: [
					{
						name: 'OLT',
						value: 'olt',
					},
					{
						name: 'ONU',
						value: 'onu',
					},
				],
				default: 'olt',
				required: true,
			},
			...oltOperations,
			...oltFields,
			...onuOperations,
			...onuFields,
		],
	};

	// DON'T USE GET ALL ENDPOINTS. YOU CAN ONLY GET ALL 3 TIMES PER HOUR
	//
	// methods = {
	// 	loadOptions: {
	// 		// Get all the OLT IDs to display them to user so that he can
	// 		// select them easily
	// 		async getOltIds(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	// 			const returnData: INodePropertyOptions[] = [];
	//
	// 			const oltIds = await smartOltApiRequest.call(this, 'GET', '/system/get_olts');
	//
	// 			for (const id of oltIds) {
	// 				returnData.push({
	// 					name: id,
	// 					value: id,
	// 				});
	// 			}
	//
	// 			returnData.sort((a, b) => {
	// 				if (a.name < b.name) { return -1; }
	// 				if (a.name > b.name) { return 1; }
	// 				return 0;
	// 			});
	//
	// 			return returnData;
	// 		},
	// 	},
	//
	// 	credentialTest: {
	// 		async testSmartOltApiAuth(this: ICredentialTestFunctions, credential: ICredentialsDecrypted): Promise<NodeCredentialTestResult> {
	//
	// 			const options: OptionsWithUri = {
	// 				method: 'GET',
	// 				headers: {
	// 					'X-Token': credential.data!.apiKey,
	// 				},
	// 				qs: {
	//
	// 				},
	// 				uri: `${credential.data!.url}/system/get_olts`,
	// 				json: true,
	// 			};
	//
	// 			try {
	// 				const response = await this.helpers.request(options);
	//
	// 				if (response.status === false) {
	// 					return {
	// 						status: 'Error',
	// 						message: `${response.error}`,
	// 					};
	// 				}
	// 			} catch (err) {
	// 				return {
	// 					status: 'Error',
	// 					message: `${err.message}`,
	// 				};
	// 			}
	//
	// 			return {
	// 				status: 'OK',
	// 				message: 'Connection successful!',
	// 			};
	// 		},
	// 	},
	// };

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		let responseData;
		const returnData: IDataObject[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		const body: IDataObject = {};
		const qs: IDataObject = {};

		for (let i = 0; i < items.length; i++) {
			try {
				if (resource === 'olt') {
					if (operation === 'getAll') {
						// Get OLTs list <https://api.smartolt.com/#26e5dc8a-971e-4f0d-ae67-cb34ac2025ca>

						responseData = await smartOltApiRequest.call(this, 'GET', '/system/get_olts');

						if (responseData.status === false) {
							throw new NodeOperationError(this.getNode(), responseData.error);
						} else {
							responseData = simplify(responseData);
						}
					}

				} else if (resource === 'onu') {
					if (operation === 'getAllUnconfigured') {
						// Get all unconfigured ONUs <https://api.smartolt.com/#c2f59ef3-5732-4247-8422-7df69f7e32c1>

						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						Object.assign(qs, additionalFields);

						responseData = await smartOltApiRequest.call(this, 'GET', '/onu/unconfigured_onus', {}, qs);

						if (responseData.status === false) {
							throw new NodeOperationError(this.getNode(), responseData.error);
						} else {
							responseData = simplify(responseData);
						}

					} else if (operation === 'getUnconfiguredByOltUniqueId') {
						// Get unconfigured ONUs by OLT unique ID <https://api.smartolt.com/#97c6e560-a827-4362-846f-e914c4736a77>

						const oltId = this.getNodeParameter('oltId', i) as number;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						Object.assign(qs, additionalFields);

						responseData = await smartOltApiRequest.call(this, 'GET', `/onu/unconfigured_onus_for_olt/${oltId}`, {}, qs);

						if (responseData.status === false) {
							throw new NodeOperationError(this.getNode(), responseData.error);
						} else {
							responseData = simplify(responseData);
						}

					} else if (operation === 'authorize') {
						// Authorize ONU <https://api.smartolt.com/#28dc6cf8-7a91-4729-aebb-8757f87e2fd3>

						body.olt_id = this.getNodeParameter('olt_id', i) as number;
						body.pon_type = this.getNodeParameter('pon_type', i) as string;
						body.sn = this.getNodeParameter('sn', i) as string;
						body.onu_type = this.getNodeParameter('onu_type', i) as string;
						body.onu_mode = this.getNodeParameter('onu_mode', i) as string;
						body.vlan = this.getNodeParameter('vlan', i) as number;
						body.zone = this.getNodeParameter('zone', i) as string;
						body.name = this.getNodeParameter('name', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						Object.assign(body, additionalFields);

						responseData = await smartOltApiRequest.call(this, 'POST', `/onu/authorize_onu`, body);

						if (responseData.status === false) {
							throw new NodeOperationError(this.getNode(), responseData.error);
						}

					} else if (operation === 'updateOnuSpeedProfilesByOnuUniqueExternalId') {
						// Update ONU speed profiles by ONU unique external ID <https://api.smartolt.com/#6b753440-3567-8644-bfed-045dbfe3f248>

						const onuExternalId = this.getNodeParameter('onuExternalId', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						Object.assign(body, additionalFields);

						responseData = await smartOltApiRequest.call(this, 'POST', `/onu/update_onu_speed_profiles/${onuExternalId}`, body);

						if (responseData.status === false) {
							throw new NodeOperationError(this.getNode(), responseData.error);
						}

					} else if (operation === 'getOnuFullStatusInfoByOnuUniqueExternalID') {
						// Get ONU full status info by ONU unique external ID <https://api.smartolt.com/#d3d19dbd-a232-4e08-93bc-a17500cf4b01>

						const onuExternalId = this.getNodeParameter('onuExternalId', i) as string;

						responseData = await smartOltApiRequest.call(this, 'GET', `/onu/get_onu_full_status_info/${onuExternalId}`);

						if (responseData.status === false) {
							throw new NodeOperationError(this.getNode(), responseData.error);
						}

						const convertTextToJson = this.getNodeParameter('convertTextToJson', i) as boolean;

						if (convertTextToJson) {
							const text = responseData.full_status_info;
							const json: IDataObject = {};
							json.tables = [] as IDataObject[];
							json.tablesData = [] as IDataObject[];
							const responseLines = text.trim().split('\n');
							let j = 0;
							for (let i = 1; i < responseLines.length; i++) {
								if(responseLines[i].includes(':')) {
									const property = responseLines[i].split(':');
									json[property[0].trim()] = property[1].trim();
								} else {
									responseLines[i] = responseLines[i]
										.replace('Port type', 'PortType')
										.replace('MAC TYPE', 'MAC_TYPE');
									(json['tablesData'] as IDataObject[])[j] = responseLines[i].trim().split(/\s+/);
									j++;
								}
							}

							// @ts-ignore
							if ((json['tablesData'] as IDataObject).length > 0) {
								// @ts-ignore
								let labels = json['tablesData'][0] as string[]; // get the labels from the first line of the table
								let br = 0; // br for the number of tables
								for (let i = 1; i < (json['tablesData'] as IDataObject[]).length; i++) {
									// @ts-ignore
									if (json['tablesData'][i].length === labels.length) {
										// Add the label properties with the row values
										// @ts-ignore
										json['tables'][br] = [];
										for (let j = 0; j < labels.length; j++) {
											// @ts-ignore
											json['tables'][br][labels[j]] = json['tablesData'][i][j];
										}
									} else {
										// Next table with new labels
										// @ts-ignore
										labels = json['tablesData'][i];
										br++;
									}
								}
							}
							delete json.tablesData;

							responseData = json;
						}

					} else if (operation === 'setOnuEthernetPortModeToTransparentByOnuUniqueExternalId') {
						// Set ONU ethernet port mode to Transparent by ONU unique external ID <https://api.smartolt.com/#be835312-92e4-4a89-b751-0fab05f542d4>

						const onuExternalId = this.getNodeParameter('onuExternalId', i) as string;
						body.ethernet_port = this.getNodeParameter('ethernet_port', i) as string;
						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						Object.assign(body, additionalFields);

						responseData = await smartOltApiRequest.call(this, 'POST', `/onu/set_ethernet_port_transparent/${onuExternalId}`, body);

						if (responseData.status === false) {
							throw new NodeOperationError(this.getNode(), responseData.error);
						}

					} else if (operation === 'getAllOnusDetails') {
						// Get all ONUs details <https://api.smartolt.com/#4e11cd01-2e4b-4f83-807d-963c4e7434af>

						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						Object.assign(qs, additionalFields);

						responseData = await smartOltApiRequest.call(this, 'GET', `/onu/get_all_onus_details`, {}, qs);

						if (responseData.status === false) {
							throw new NodeOperationError(this.getNode(), responseData.error);
						} else {
							responseData = simplify(responseData, 'onus');
						}

					} else if (operation === 'getAllOnusSignals') {
						// Get all ONUs signals <https://api.smartolt.com/#43e3094c-0db5-46ea-821e-1ae9c4038006>

						const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
						Object.assign(qs, additionalFields);

						responseData = await smartOltApiRequest.call(this, 'GET', `/onu/get_onus_signals`);

						if (responseData.status === false) {
							throw new NodeOperationError(this.getNode(), responseData.error);
						} else {
							responseData = simplify(responseData);
						}

					} else if (operation === 'getOnuTrafficGraphByOnuUniqueExternalId') {
						// Get ONU traffic graph by ONU unique external ID <https://api.smartolt.com/#8342f9ca-d6e2-4938-b5a0-8be0531d75a9>

						const onuExternalId = this.getNodeParameter('onuExternalId', i) as string;
						const graphType = this.getNodeParameter('graphType', i) as string;

						const endpoint = `/onu/get_onu_traffic_graph/${onuExternalId}/${graphType}`;

						// Return the data as a buffer
						const encoding = null;

						responseData = await smartOltApiRequest.call(this,
							'GET',
							endpoint,
							{},
							{},
							undefined,
							encoding,
						);

						const newItem: INodeExecutionData = {
							json: items[i].json,
							binary: {},
						};

						if (items[i].binary !== undefined) {
							// Create a shallow copy of the binary data so that the old
							// data references which do not get changed still stay behind
							// but the incoming data does not get changed.
							Object.assign(newItem.binary, items[i].binary);
						}

						items[i] = newItem;

						const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;

						items[i].binary![binaryPropertyName] = await this.helpers.prepareBinaryData(responseData, endpoint);

					}
				}

				if (Array.isArray(responseData)) {
					returnData.push.apply(returnData, responseData as IDataObject[]);
				} else if (responseData !== undefined) {
					returnData.push(responseData as IDataObject);
				}
			}  catch (error) {
				if (this.continueOnFail()) {
					// Return the actual reason as error
					if (operation === 'getOnuTrafficGraphByOnuUniqueExternalId') {
						items[i].json = { error: error.message };
					} else {
						returnData.push({ error: error.message });
					}
					continue;
				}
				throw error;
			}
		}

		if (operation === 'getOnuTrafficGraphByOnuUniqueExternalId') {
			// For binary files the files get attached to the existing items
			return this.prepareOutputData(items);
		} else {
			// For all other ones does the output get replaced
			return [this.helpers.returnJsonArray(returnData)];
		}
	}
}