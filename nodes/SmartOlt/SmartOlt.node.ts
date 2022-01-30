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
	getObject,
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
		description: 'Consume SmartOLT API (v0.2.4)', // todo: increase with every version
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

						// responseData = await smartOltApiRequest.call(this, 'GET', `/onu/get_onu_full_status_info/${onuExternalId}`);
						//
						// if (responseData.status === false) {
						// 	throw new NodeOperationError(this.getNode(), responseData.error);
						// }

						//todo
						responseData = {
							full_status_info: 'Copyright(C) Huawei Technologies Co., Ltd. 2002-2016. All rights reserved.\nLogin  Time : 2019-02-19 08:44:21+08:00\nLogout Time : 2019-02-19 08:44:23+08:00\nOptical status:\nModule type                            : GPON\nModule sub-type                        : CLASS B+\nRx optical power(dBm)                  : -23.37\nTx optical power(dBm)                  : 1.91\nTemperature(C)                         : 48\nOLT Rx ONT optical power(dBm)          : -28.54\nCATV Rx optical power(dBm)             : -\nONT-ID                  : 0\nControl flag            : active\nRun state               : online\nMatch state             : mismatch\nONT distance(m)         : 1945\nCPU occupation          : 1%\nManagement mode         : OMCI\nDescription             : ONU_Customer_name_zone_Zone_1_descr\nLast down cause         : dying-gasp\nLast up time            : 2019-02-15 07:50:06+08:00\nLast down time          : 2019-02-15 07:49:01+08:00\nLast dying gasp time    : 2019-02-15 07:49:01+08:00\nONT online duration     : 4 day(s), 0 hour(s), 54 minute(s), 24 second(s) \nInteroperability-mode   : ITU-T\nLine profile ID      : 1\nLine profile name    : SMARTOLT_FLEXIBLE_GPON\nMapping mode        :802.1p PRI\nService profile ID   : 34\nService profile name : HS8545M\nRing check switch                 : Enable\nRing port auto-shutdown           : Enable\nHistory:\nIndex               : 10\nUpTime              : 2019-02-15 07:50:02+08:00\nIndex               : 9\nUpTime              : 2019-02-15 07:46:20+08:00\nDownTime            : 2019-02-15 07:49:01+08:00\nDownCause           : PowerFail\nIndex               : 8\nUpTime              : 2019-02-14 17:55:00+08:00\nDownTime            : 2019-02-15 06:49:58+08:00\nDownCause           : PowerFail\nIndex               : 7\nUpTime              : 2019-02-14 01:24:53+08:00\nDownTime            : 2019-02-14 17:54:46+08:00\nDownCause           : ONT LOSi/LOBi alarm\nIndex               : 6\nUpTime              : 2019-02-10 22:20:26+08:00\nDownTime            : 2019-02-14 01:24:00+08:00\nDownCause           : PowerFail\nIndex               : 5\nUpTime              : 2019-02-07 09:44:07+08:00\nDownTime            : 2019-02-10 19:38:31+08:00\nDownCause           : PowerFail\nIndex               : 4\nUpTime              : 2019-02-02 02:36:32+08:00\nDownTime            : 2019-02-07 09:42:48+08:00\nDownCause           : PowerFail\nIndex               : 3\nUpTime              : 2019-02-01 21:50:01+08:00\nDownTime            : 2019-02-02 02:35:33+08:00\nDownCause           : PowerFail\nIndex               : 2\nUpTime              : 2019-01-27 16:48:24+08:00\nDownTime            : 2019-02-01 21:48:58+08:00\nDownCause           : PowerFail\nIndex               : 1\nUpTime              : 2019-01-26 22:16:42+08:00\nDownTime            : 2019-01-27 16:28:00+08:00\nDownCause           : PowerFail\nIndex                      : 1\nName                       : 1_INTERNET_R_VID_20\nService type               : Internet\nConnection type            : IP routed\nIPv4 Connection status     : Connected\nIPv4 access type           : PPPoE\nIPv4 address               : 10.13.1.178\nSubnet mask                : 255.255.255.255\nDefault gateway            : 192.168.38.1\nManage VLAN                : 20\nManage priority            : 0\nMAC address                : 0087-C6AA-082A\nIPv4 switch                : Enable\nIPv6 Connection status     : Invalid\nInterfaces status:\nONT-ID   ONT Port type Speed(Mbps)   Duplex   LinkState  RingStatus\n0         1         GE -             -        down       noloop    \n0         2         FE -             -        down       noloop    \n0         3         FE -             -        down       noloop    \n0         4         FE -             -        down       noloop    \nVoIP status:\nOnline MACs on this ONU:\nSRVPort  TYPE MAC            MAC TYPE F /S /P  ONTID VCI   VLAN ID\n4     -  gpon 0007-c49a-083a dynamic  0 /1 /2   0    1             20\n',
							// full_status_info: 'Copyright(C) Huawei Technologies Co., Ltd. 2002-2016. All rights reserved.\nLogin  Time : 2019-02-19 08:44:21+08:00\nLogout Time : 2019-02-19 08:44:23+08:00\nIndex : 4 \nIndex : 3 \nDownCause : ONT LOSi/LOBi alarm \nIndex : 2 \nDownCause : ONT LOSi/LOBi alarm \nIndex : 1 \nDownCause : ONT link-down ',
							// tslint:disable-next-line:no-any
						} as any;

						const convertTextToJson = this.getNodeParameter('convertTextToJson', i) as boolean;

						if (convertTextToJson) {
							const text = responseData.full_status_info;
							// tslint:disable-next-line:no-any
							const json: any = {};
							const responseRows = text.trim().split('\n');
							let title = ''; // title of the section/table
							let labels: string[] = [] as string[];
							let labelsFlag = true; // weather it is a row of labels
							let n = 0; // n-th label
							let index = -1; // index of "History" array

							for (let i = 1; i < responseRows.length; i++) {
								if(responseRows[i].includes(':')) {
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

										} else if (lastLinePropertyName === 'DownTime'|| lastLinePropertyName === 'UpTime' || lastLinePropertyName === 'DownCause') {
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