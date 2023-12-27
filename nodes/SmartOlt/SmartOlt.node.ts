import {
	IExecuteFunctions,
} from 'n8n-core';

import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import {
	oltFields,
	oltOperations,
	onuFields,
	onuOperations
} from './descriptions';

import {
	getObject,
	simplify,
	smartOltApiRequest,
} from './GenericFunctions';

import { version } from '../version';

export class SmartOlt implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'SmartOLT',
		name: 'smartOlt',
		icon: 'file:smartOlt.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: `Consume SmartOLT API (v${version})`,
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
		const testingMode = (await this.getCredentials('smartOltApi') as IDataObject).testingMode as boolean;

		for (let i = 0; i < items.length; i++) {
			try {
				switch (resource) {
					case 'olt':
						switch (operation) {
							case 'getAll':
								// Get OLTs list <https://api.smartolt.com/#26e5dc8a-971e-4f0d-ae67-cb34ac2025ca>

								responseData = await smartOltApiRequest.call(this, 'GET', '/system/get_olts');

								responseData = simplify(responseData);
								break;
						}
						break;
					case 'onu':
						switch (operation) {
							case 'getAllUnconfigured': {
								// Get all unconfigured ONUs <https://api.smartolt.com/#c2f59ef3-5732-4247-8422-7df69f7e32c1>

								const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
								Object.assign(qs, additionalFields);

								responseData = await smartOltApiRequest.call(this, 'GET', '/onu/unconfigured_onus', {}, qs);

								responseData = simplify(responseData);
								break;
							}

							case 'getUnconfiguredByOltUniqueId': {
								// Get unconfigured ONUs by OLT unique ID <https://api.smartolt.com/#97c6e560-a827-4362-846f-e914c4736a77>

								const oltId = this.getNodeParameter('oltId', i) as number;
								const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
								Object.assign(qs, additionalFields);

								responseData = await smartOltApiRequest.call(this, 'GET', `/onu/unconfigured_onus_for_olt/${oltId}`, {}, qs);

								responseData = simplify(responseData);
								break;
							}

							case 'getAllOnusSignals': {
								// Get all ONUs signals <https://api.smartolt.com/#43e3094c-0db5-46ea-821e-1ae9c4038006>

								const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
								Object.assign(qs, additionalFields);

								responseData = await smartOltApiRequest.call(this, 'GET', `/onu/get_onus_signals`, {}, qs);

								responseData = simplify(responseData);
								break;
							}

							case 'getAllOnusDetails': {
								// Get all ONUs details <https://api.smartolt.com/#4e11cd01-2e4b-4f83-807d-963c4e7434af>

								const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
								Object.assign(qs, additionalFields);

								responseData = await smartOltApiRequest.call(this, 'GET', `/onu/get_all_onus_details`, {}, qs);

								responseData = simplify(responseData, 'onus');
								break;
							}

							case 'getOnuStatusByOnuUniqueExternalId': {
								// Get ONU status by ONU unique external ID <https://api.smartolt.com/#8b411df2-20c4-4249-9897-695d06b4b0ab>

								const onuExternalId = this.getNodeParameter('onuExternalId', i) as string;

								responseData = await smartOltApiRequest.call(this, 'GET', `/onu/get_onu_status/${onuExternalId}`);

								responseData = simplify(responseData);
								break;
							}

							case 'getOnuAdministrativeStatusByOnuUniqueExternalId': {
								// Get ONU administrative status by ONU unique external ID <https://api.smartolt.com/#310c143b-3240-4842-9843-ad052aa88461>

								const onuExternalId = this.getNodeParameter('onuExternalId', i) as string;

								responseData = await smartOltApiRequest.call(this, 'GET', `/onu/get_onu_administrative_status/${onuExternalId}`);

								responseData = simplify(responseData);
								break;
							}

							case 'getOnuFullStatusInfoByOnuUniqueExternalID': {
								// Get ONU full status info by ONU unique external ID <https://api.smartolt.com/#d3d19dbd-a232-4e08-93bc-a17500cf4b01>

								const onuExternalId = this.getNodeParameter('onuExternalId', i) as string;

								responseData = await smartOltApiRequest.call(this, 'GET', `/onu/get_onu_full_status_info/${onuExternalId}`);

								if (!testingMode) {
									const convertTextToJson = this.getNodeParameter('convertTextToJson', i) as boolean;

									if (convertTextToJson) {
										let text = responseData.full_status_info;

										try {
											const dateTimeRegex = new RegExp(/\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}/); // get the second part of 20/06/2021 09:33:57+03:00
											const match = dateTimeRegex.exec(text);
											// @ts-ignore
											const dateTimeIndex = match.index; // get the starting index
											// @ts-ignore
											const length = match[0].length;

											text = text.substring(0, dateTimeIndex) +
												text.substring(dateTimeIndex, dateTimeIndex + length).replace(/:/g, '.') + // replace with dots
												text.substring(dateTimeIndex + length);
										} catch (e) {
											// don't throw error if regex doesn't match
										}

										// tslint:disable-next-line:no-any
										const json: any = {};
										const responseRows = text.trim().split('\n');
										let title = ''; // title of the section/table
										let labels: string[] = [] as string[];
										let labelsFlag = true; // weather it is a row of labels
										let n = 0; // n-th label
										let index = -1; // index of "History" array

										for (let i = 1; i < responseRows.length; i++) {
											if (responseRows[i].includes(':')) {
												// the row is a property

												const property = responseRows[i].split(':');
												const lastLinePropertyName = property[0].trim();
												const lastLinePropertyValue = property[1].trim();

												if (lastLinePropertyValue !== '') {
													// the value of the property is empty

													// add "History" property to json
													if (lastLinePropertyName === 'Index') {
														// set history index with the last defined title

														index++;
														if (json[title] === undefined) {
															json[title] = [];
														}
														if (json[title][index] === undefined) {
															json[title][index] = {};
															json[title][index][lastLinePropertyName] = lastLinePropertyValue;
														}

													} else if (lastLinePropertyName === 'DownTime' || lastLinePropertyName === 'UpTime' || lastLinePropertyName === 'DownCause') {
														// set the History[index] value with the last defined index

														json[title][index][lastLinePropertyName] = lastLinePropertyValue;

													} else {
														json[lastLinePropertyName] = lastLinePropertyValue;
													}

													// // remove "History" property from json
													// if (lastLinePropertyName === 'Index'
													// 	|| lastLinePropertyName === 'DownTime'
													// 	|| lastLinePropertyName === 'UpTime'
													// 	|| lastLinePropertyName === 'DownCause'
													// 	|| lastLinePropertyName === 'Name'
													// ) {
													// 	// do nothing
													// } else {
													// 	json[lastLinePropertyName] = lastLinePropertyValue;
													// }

												} else {
													// the value of the property is not empty

													labelsFlag = true;
													title = lastLinePropertyName;
													delete responseRows[i];
												}
											} else {
												// the row is part of a table

												let row;
												if (labelsFlag) {
													// the row contains labels

													row = responseRows[i]
														.replace('Port type', 'PortType')
														.replace('MAC TYPE', 'MACTYPE')
														.replace('VLAN ID', 'VLANID')
														.split(' /').join('/') // replace all ' /' with '/'
														.trim()
														.split(/\s+/); // split by one or multiple whitespaces

													labels = row as string[];
													n = 0;
													labelsFlag = false;

												} else {
													// the row contains data

													row = responseRows[i];

													if (title === 'Online MACs on this ONU') {
														row = row
															.split(' /').join('/') // replace all ' /' with '/'
															.replace(' - ', ' '); // remove the dash in the data
													}

													row = row
														.trim()
														.split(/\s+/); // split by one or multiple whitespaces

													if (json[title] === undefined) {
														json[title] = [];
													}
													json[title][n] = getObject(labels, row as string[]);
													n++;
												}
											}
										}
										responseData = json;
									}
								}
								break;
							}

							case 'getOnuTrafficGraphByOnuUniqueExternalId': {
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

								if (!testingMode) {
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
								break;
							}

							case 'getOnuSpeedProfilesByOnuUniqueExternalId': {
								// Get ONU speed profiles by ONU unique external ID <https://api.smartolt.com/#310c143b-3240-4842-9843-ad052aa88461>

								const onuExternalId = this.getNodeParameter('onuExternalId', i) as string;

								responseData = await smartOltApiRequest.call(this, 'GET', `/onu/get_onu_speed_profiles/${onuExternalId}`);

								responseData = simplify(responseData);
								break;
							}

							case 'authorize': {
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
								break;
							}

							case 'setOnuMgmtIPModeToDhcpByOnuUniqueExternalId': {
								// Set ONU Mgmt IP mode to DHCP by ONU unique external ID <https://api.smartolt.com/#1a24a4f8-64cf-4da6-af66-112d0e4c3a8e>

								const onuExternalId = this.getNodeParameter('onuExternalId', i) as string;
								body.vlan = this.getNodeParameter('vlan', i) as number;
								const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
								Object.assign(body, additionalFields);

								responseData = await smartOltApiRequest.call(this, 'POST', `/onu/set_onu_mgmt_ip_dhcp/${onuExternalId}`, body);
								break;
							}

							case 'enableOnuTr069ByOnuUniqueExternalId': {
								// Enable ONU TR069 by ONU unique external ID <https://api.smartolt.com/#d4dcce06-fff4-4d0e-a9f3-b38fb6ee6bbd>

								const onuExternalId = this.getNodeParameter('onuExternalId', i) as string;
								body.tr069_profile = this.getNodeParameter('tr069_profile', i) as string;

								responseData = await smartOltApiRequest.call(this, 'POST', `/onu/enable_tr069/${onuExternalId}`, body);
								break;
							}

							case 'setOnuWanModeToDhcpByOnuUniqueExternalId': {
								// Set ONU WAN mode to DHCP by ONU unique external ID <https://api.smartolt.com/#11682489-4b03-4d4f-9773-1d04a51845ff>

								const onuExternalId = this.getNodeParameter('onuExternalId', i) as string;
								const body = this.getNodeParameter('additionalFields', i) as IDataObject;

								responseData = await smartOltApiRequest.call(this, 'POST', `/onu/set_onu_wan_mode_dhcp/${onuExternalId}`, body);
								break;
							}

							case 'setOnuWanModeToPppoeByOnuUniqueExternalId': {
								// Set ONU WAN mode to PPPoE by ONU unique external ID <https://api.smartolt.com/#95a4bdb5-9ecc-4a25-816a-acbd483616e2>

								const onuExternalId = this.getNodeParameter('onuExternalId', i) as string;
								body.username = this.getNodeParameter('username', i) as string;
								body.password = this.getNodeParameter('password', i) as string;
								const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
								Object.assign(body, additionalFields);

								responseData = await smartOltApiRequest.call(this, 'POST', `/onu/set_onu_wan_mode_pppoe/${onuExternalId}`, body);
								break;
							}

							case 'updateOnuSpeedProfilesByOnuUniqueExternalId': {
								// Update ONU speed profiles by ONU unique external ID <https://api.smartolt.com/#6b753440-3567-8644-bfed-045dbfe3f248>

								const onuExternalId = this.getNodeParameter('onuExternalId', i) as string;
								const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
								Object.assign(body, additionalFields);

								responseData = await smartOltApiRequest.call(this, 'POST', `/onu/update_onu_speed_profiles/${onuExternalId}`, body);
								break;
							}

							case 'setOnuEthernetPortModeToTransparentByOnuUniqueExternalId': {
								// Set ONU ethernet port mode to Transparent by ONU unique external ID <https://api.smartolt.com/#be835312-92e4-4a89-b751-0fab05f542d4>

								const onuExternalId = this.getNodeParameter('onuExternalId', i) as string;
								body.ethernet_port = this.getNodeParameter('ethernet_port', i) as string;
								const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
								Object.assign(body, additionalFields);

								responseData = await smartOltApiRequest.call(this, 'POST', `/onu/set_ethernet_port_transparent/${onuExternalId}`, body);
								break;
							}

							case 'setOnuWiFiPortModeToLanByOnuUniqueExternalId': {
								// Set ONU WiFi port mode to LAN by ONU unique external ID <https://api.smartolt.com/#a41dbe8e-fc8c-478d-ad1b-adbe5ff6a34a>

								const onuExternalId = this.getNodeParameter('onuExternalId', i) as string;
								body.wifi_port = this.getNodeParameter('wifi_port', i) as string;
								const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
								Object.assign(body, additionalFields);

								responseData = await smartOltApiRequest.call(this, 'POST', `/onu/set_wifi_port_lan/${onuExternalId}`, body);
								break;
							}

							case 'setOnuWifiPortModeToAccessByOnuUniqueExternalId': {
								// Set ONU WiFi port mode to Access by ONU unique external ID <https://api.smartolt.com/#9f00d7b7-f403-4f78-93de-85f0e051a45e>

								const onuExternalId = this.getNodeParameter('onuExternalId', i) as string;
								body.wifi_port = this.getNodeParameter('wifi_port', i) as string;
								body.vlan = this.getNodeParameter('vlan', i) as number;
								const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
								Object.assign(body, additionalFields);

								responseData = await smartOltApiRequest.call(this, 'POST', `/onu/set_wifi_port_access/${onuExternalId}`, body);
								break;
							}

							case 'shutdownOnuWifiPortByOnuUniqueExernalId': {
								// Shutdown ONU WiFi port by ONU unique external ID <https://api.smartolt.com/#6eb0837b-29a4-4d14-bf73-aa22390f0bda>

								const onuExternalId = this.getNodeParameter('onuExternalId', i) as string;
								body.wifi_port = this.getNodeParameter('wifi_port', i) as string;

								responseData = await smartOltApiRequest.call(this, 'POST', `/onu/shutdown_wifi_port/${onuExternalId}`, body);
								break;
							}

							case 'rebootOnuByOnuUniqueExternalId': {
								// Reboot ONU by ONU unique external ID <https://api.smartolt.com/#4f35a16a-59a1-43a8-b7be-987bf616a988>

								const onuExternalId = this.getNodeParameter('onuExternalId', i) as string;

								responseData = await smartOltApiRequest.call(this, 'POST', `/onu/reboot/${onuExternalId}`);

								responseData = simplify(responseData);
								break;
							}

							case 'resyncOnuConfigByOnuUniqueExternalId': {
								// Resync ONU config by ONU unique external ID <https://api.smartolt.com/#49ed152e-7ff3-41d7-9304-bc5369b46074>

								const onuExternalId = this.getNodeParameter('onuExternalId', i) as string;

								responseData = await smartOltApiRequest.call(this, 'POST', `/onu/resync_config/${onuExternalId}`);

								responseData = simplify(responseData);
								break;
							}

							case 'disableOnuForASpecifiedOnuUniqueExternalId': {
								// Disable ONU for a specified ONU unique external ID <https://api.smartolt.com/#22e14a03-1c8c-4335-8439-41ef87b0bc41>

								const onuExternalId = this.getNodeParameter('onuExternalId', i) as string;

								responseData = await smartOltApiRequest.call(this, 'POST', `/onu/disable/${onuExternalId}`);

								responseData = simplify(responseData);
								break;
							}

							case 'disableOnuVoipPortByOnuUniqueExternalId': {
								// Disable ONU VoIP port for a specified ONU unique external ID <https://api.smartolt.com/#c0a7ec36-9a60-4401-b242-086396a4cd47>

								const onuExternalId = this.getNodeParameter('onuExternalId', i) as string;
								body.voip_port = this.getNodeParameter('voip_port', i) as string;

								responseData = await smartOltApiRequest.call(this, 'POST', `/onu/disable_onu_voip_port/${onuExternalId}`, body);

								responseData = simplify(responseData);
								break;
							}

							case 'enableOnuByOnuUniqueExternalId': {
								// Enable ONU by ONU unique external ID <https://api.smartolt.com/#393d530b-5d69-4d25-9a2b-130282097b23>

								const onuExternalId = this.getNodeParameter('onuExternalId', i) as string;

								responseData = await smartOltApiRequest.call(this, 'POST', `/onu/enable/${onuExternalId}`);

								responseData = simplify(responseData);
								break;
							}

							case 'setOnuVoipModeEnabledByOnuUniqueExternalId': {
								// Set ONU VoIP mode to Enabled by ONU unique external ID <https://api.smartolt.com/#2131a2e6-8961-4a43-b15b-1c5e61571f26>

								const onuExternalId = this.getNodeParameter('onuExternalId', i) as string;
								body.voip_attach_to = this.getNodeParameter('voip_attach_to', i) as string;

								responseData = await smartOltApiRequest.call(this, 'POST', `/onu/set_onu_voip_enabled/${onuExternalId}`, body);

								responseData = simplify(responseData);
								break;
							}

							case 'enableOnuVoipPortByOnuUniqueExternalId': {
								// Enable ONU VoIP port for a specified ONU unique external ID <https://api.smartolt.com/#91a93ac6-9f5f-4069-842f-f492f76e9422>

								const onuExternalId = this.getNodeParameter('onuExternalId', i) as string;
								body.voip_port = this.getNodeParameter('voip_port', i) as string;
								body.phone_number = this.getNodeParameter('phone_number', i) as string;
								body.password = this.getNodeParameter('password', i) as string;

								const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
								Object.assign(body, additionalFields);

								responseData = await smartOltApiRequest.call(this, 'POST', `/onu/enable_onu_voip_port/${onuExternalId}`, body);

								responseData = simplify(responseData);
								break;
							}

							case 'deleteOnuByOnuUniqueExternalId': {
								// Delete ONU by ONU unique external ID <https://api.smartolt.com/#9f87942e-caa7-4711-85af-420be2bebaff>

								const onuExternalId = this.getNodeParameter('onuExternalId', i) as string;

								responseData = await smartOltApiRequest.call(this, 'POST', `/onu/delete/${onuExternalId}`);

								responseData = simplify(responseData);
								break;
							}

							default: {
								throw new Error('Operation not supported');
							}
						}
						break;
				}
				if (Array.isArray(responseData)) {
					returnData.push.apply(returnData, responseData as IDataObject[]);
				} else if (responseData !== undefined) {
					returnData.push(responseData as IDataObject);
				}
			} catch (error: any) {
				if (this.continueOnFail()) {
					// Return the actual reason as error
					if (operation === 'getOnuTrafficGraphByOnuUniqueExternalId' && !testingMode) {
						items[i].json = { error: error.message };
					} else {
						returnData.push({ error: error.message });
					}
					continue;
				}
				throw error;
			}
		}

		if (operation === 'getOnuTrafficGraphByOnuUniqueExternalId' && !testingMode) {
			// For binary files the files get attached to the existing items
			return this.prepareOutputData(items);
		} else {
			// For all other ones does the output get replaced
			return [this.helpers.returnJsonArray(returnData)];
		}
	}
}
