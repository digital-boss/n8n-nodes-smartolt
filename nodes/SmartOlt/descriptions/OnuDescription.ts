import {
	INodeProperties,
} from 'n8n-workflow';

export const onuOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
			},
		},
		options: [
			{
				name: 'Get All Unconfigured',
				value: 'getAllUnconfigured',
				description: 'Get a list of all unconfigured ONUs on all OLTs',
			},
			{
				name: 'Get Unconfigured By OLT Unique ID',
				value: 'getUnconfiguredByOltUniqueId',
				description: 'Gets a list of all unconfigured ONUs for a specified OLT unique ID',
			},
			{
				name: 'Get All ONUs Signals',
				value: 'getAllOnusSignals',
				description: 'Gets all the ONUs signals for a specified OLT ID, board, PON port or zone. If no OLT ID, board, PON port or zone is specified, then all the ONUs signals on all OLTs will be returned.',
			},
			{
				name: 'Get All ONUs Details',
				value: 'getAllOnusDetails',
				description: 'Gets all the ONUs details for a specified OLT ID, board, PON port or zone. If no OLT ID, board, PON port or zone is specified, then all the ONUs details on all OLTs will be returned.\n' +
					'The "Get all ONUs details" method is equivalent to an export of the entire database of ONU details and therefore it is not recommended to be used repeatedly, as the contained information does not change so often.\n' +
					'Maximum recommended calls for "Get all ONUs details": 3 per hour (calls are blocked after the limit is reached).',
			},
			{
				name: 'Get ONU status by ONU unique external ID',
				value: 'getOnuStatusByOnuUniqueExternalId',
			},
			{
				name: 'Get ONU administrative status by ONU unique external ID',
				value: 'getOnuAdministrativeStatusByOnuUniqueExternalId',
			},
			{
				name: 'Get ONU Full Status Info By ONU Unique External ID',
				value: 'getOnuFullStatusInfoByOnuUniqueExternalId',
			},
			{
				name: 'Get ONU Traffic Graph By ONU Unique External ID',
				value: 'getOnuTrafficGraphByOnuUniqueExternalId',
			},
			{
				name: 'Get ONU speed profiles by ONU unique external ID',
				value: 'getOnuSpeedProfilesByOnuUniqueExternalId',
			},
			{
				name: 'Authorize',
				value: 'authorize',
				description: 'Authorizes an ONU on the provided OLT. If board or port are left empty then the ONU is saved for later authorization.',
			},
			{
				name: 'Set ONU Mgmt IP mode to DHCP by ONU unique external ID',
				value: 'setOnuMgmtIPModeToDhcpByOnuUniqueExternalId',
			},
			{
				name: 'Enable ONU TR069 by ONU unique external ID',
				value: 'enableOnuTr069ByOnuUniqueExternalId',
			},
			{
				name: 'Set ONU WAN mode to DHCP by ONU unique external ID',
				value: 'setOnuWanModeToDhcpByOnuUniqueExternalId',
			},
			{
				name: 'Set ONU WAN mode to PPPoE by ONU unique external ID',
				value: 'setOnuWanModeToPppoeByOnuUniqueExternalId',
			},
			{
				name: 'Update ONU Speed Profiles By ONU Unique External ID',
				value: 'updateOnuSpeedProfilesByOnuUniqueExternalId',
				description: 'At least one speed profile name must be provided. The profile names must be the ones defined in SmartOLT Speed Profiles section.',
			},
			{
				name: 'Set ONU Ethernet Port Mode To Transparent By ONU Unique External ID',
				value: 'setOnuEthernetPortModeToTransparentByOnuUniqueExternalId',
			},
			{
				name: 'Set ONU WiFi port mode to LAN by ONU unique external ID',
				value: 'setOnuWiFiPortModeToLanByOnuUniqueExternalId',
			},
			{
				name: 'Set ONU WiFi port mode to Access by ONU unique external ID',
				value: 'setOnuWifiPortModeToAccessByOnuUniqueExternalId',
			},
			{
				name: 'Shutdown ONU WiFi port by ONU unique external ID',
				value: 'shutdownOnuWifiPortByOnuUniqueExernalId',
			},
			{
				name: 'Reboot ONU by ONU unique external ID',
				value: 'rebootOnuByOnuUniqueExternalId',
			},
			{
				name: 'Resync ONU config by ONU unique external ID',
				value: 'resyncOnuConfigByOnuUniqueExternalId',
			},
			{
				name: 'Disable ONU by ONU unique external ID',
				value: 'disableOnuForASpecifiedOnuUniqueExternalId',
			},
			{
				name: 'Enable ONU by ONU unique external ID',
				value: 'enableOnuByOnuUniqueExternalId',
			},
			{
				name: 'Delete ONU by ONU unique external ID',
				value: 'deleteOnuByOnuUniqueExternalId',
			},
		],
		default: 'getAllUnconfigured',
	},
];

export const onuFields: INodeProperties[] = [

	/*-------------------------------------------------------------------------- */
	/*                          onu:getAllUnconfigured                     		 */
	/* ------------------------------------------------------------------------- */

	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'getAllUnconfigured',
				],
			},
		},
		placeholder: 'Add Field',
		default: {},
		options: [
			{
				displayName: 'SN',
				name: 'sn',
				type: 'string',
				default: '',
				description: 'Search for a specific SN. Performed search is of type CONTAINS.',
			},
			{
				displayName: 'DN Onu Type',
				name: 'snonu_type',
				type: 'string',
				default: '',
				description: 'Search for a specific ONU type. Performed search is of type CONTAINS.',
			},
		],
	},

	/*-------------------------------------------------------------------------- */
	/*                 	 onu:getUnconfiguredByOltUniqueId        			 	 */
	/* ------------------------------------------------------------------------- */

	{
		displayName: 'OLT ID',
		name: 'oltId',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'getUnconfiguredByOltUniqueId',
				],
			},
		},
		default: 0,
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'getUnconfiguredByOltUniqueId',
				],
			},
		},
		placeholder: 'Add Field',
		default: {},
		options: [
			{
				displayName: 'SN',
				name: 'sn',
				type: 'string',
				default: '',
				description: 'Search for a specific SN. Performed search is of type CONTAINS.',
			},
			{
				displayName: 'DN Onu Type',
				name: 'snonu_type',
				type: 'string',
				default: '',
				description: 'Search for a specific ONU type. Performed search is of type CONTAINS.',
			},
		],
	},

	/*-------------------------------------------------------------------------- */
	/*   	 						onu:getAllOnusSignals  					   	 */
	/* ------------------------------------------------------------------------- */

	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'getAllOnusSignals',
				],
			},
		},
		placeholder: 'Add Field',
		default: {},
		options: [
			{
				displayName: 'OLT ID',
				name: 'olt_id',
				type: 'number',
				default: 0,
				description: 'The ID of the OLT for which to get the ONUs statuses. Leave empty if you want signals from all OLTs.',
			},
			{
				displayName: 'Board',
				name: 'board',
				type: 'number',
				default: 0,
				description: 'OLT board where the ONUs are placed. Leave it empty if you want signals from all boards on the provided OLT ID.',
			},
			{
				displayName: 'Port',
				name: 'port',
				type: 'number',
				default: 0,
				description: 'OLT PON port where ONUs are placed. Leave it empty if you want signals from all PON ports on the provided board.',
			},
			{
				displayName: 'Zone',
				name: 'zone',
				type: 'string',
				default: '',
				description: 'The zone where the ONUs are located. The Zone can contain only alphanumeric characters, spaces, underscore and the dash (-) character. Leave it empty if you want ONUs signals from all the zones.',
			},
		],
	},

	/*-------------------------------------------------------------------------- */
	/*   	 						onu:getAllOnusDetails  					   	 */
	/* ------------------------------------------------------------------------- */

	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'getAllOnusDetails',
				],
			},
		},
		placeholder: 'Add Field',
		default: {},
		options: [
			{
				displayName: 'OLT ID',
				name: 'olt_id',
				type: 'number',
				default: 0,
				description: 'The ID of the OLT for which to get the ONUs details. Leave empty if you want ONUs details from all OLTs.',
			},
			{
				displayName: 'Board',
				name: 'board',
				type: 'number',
				default: 0,
				description: 'OLT board where the ONUs are placed. Leave it empty if you want ONUs details from all boards on the provided OLT ID.',
			},
			{
				displayName: 'Port',
				name: 'port',
				type: 'number',
				default: 0,
				description: 'OLT PON port where ONUs are placed. Leave it empty if you want ONUs details from all PON ports on the provided board.',
			},
			{
				displayName: 'Zone',
				name: 'zone',
				type: 'string',
				default: '',
				description: 'The zone where the ONUs are located. The Zone can contain only alphanumeric characters, spaces, underscore and the dash (-) character. Leave it empty if you want ONUs details from all the zones.',
			},
		],
	},

	/*-------------------------------------------------------------------------- */
	/*     			onu:getOnuFullStatusInfoByOnuUniqueExternalId           	 */
	/* ------------------------------------------------------------------------- */

	{
		displayName: 'OLT External ID',
		name: 'onuExternalId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'getOnuFullStatusInfoByOnuUniqueExternalID',
				],
			},
		},
		default: '',
	},
	{
		displayName: 'Convert Text To JSON',
		name: 'convertTextToJson',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'getOnuFullStatusInfoByOnuUniqueExternalID',
				],
			},
		},
		default: false,
	},

	/*-------------------------------------------------------------------------- */
	/*   	 		onu:getOnuTrafficGraphByOnuUniqueExternalId  			   	 */
	/* ------------------------------------------------------------------------- */

	{
		displayName: 'ONU External ID',
		name: 'onuExternalId',
		required: true,
		type: 'string',
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'getOnuTrafficGraphByOnuUniqueExternalId',
				],
			},
		},
		default: '',
		description: 'ONU unique external ID. The ONU external ID can contain only alphanumeric characters.',
	},
	{
		displayName: 'Graph Type',
		name: 'graphType',
		required: true,
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'getOnuTrafficGraphByOnuUniqueExternalId',
				],
			},
		},
		default: 'hourly',
		description: 'ONU traffic graph type',
		options: [
			{
				name: 'hourly',
				value: 'hourly',
			},
			{
				name: 'daily',
				value: 'daily',
			},
			{
				name: 'weekly',
				value: 'weekly',
			},
			{
				name: 'monthly',
				value: 'monthly',
			},
			{
				name: 'yearly',
				value: 'yearly',
			},
		],
	},
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'getOnuTrafficGraphByOnuUniqueExternalId',
				],
			},
		},
		description: 'Name of the binary property to which to write the data of the read file',
	},

	/*-------------------------------------------------------------------------- */
	/*                                onu:authorize                            	 */
	/* ------------------------------------------------------------------------- */

	{
		displayName: 'OLT ID',
		name: 'olt_id',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'authorize',
				],
			},
		},
		default: '',
	},
	{
		displayName: 'Pon Type',
		name: 'pon_type',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'authorize',
				],
			},
		},
		default: 'gpon',
		description: 'ONU PON type',
		options: [
			{
				name: 'gpon',
				value: 'gpon',
			},
			{
				name: 'epon',
				value: 'epon',
			},
		],
	},
	{
		displayName: 'SN',
		name: 'sn',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'authorize',
				],
			},
		},
		default: '',
		description: 'ONU SN',
	},
	{
		displayName: 'ONU Type',
		name: 'onu_type',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'authorize',
				],
			},
		},
		default: '',
	},
	{
		displayName: 'ONU Mode',
		name: 'onu_mode',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'authorize',
				],
			},
		},
		default: 'Routing',
		options: [
			{
				name: 'Routing',
				value: 'Routing',
			},
			{
				name: 'Bridging',
				value: 'Bridging',
			},
		],
	},
	{
		displayName: 'VLAN',
		name: 'vlan',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'authorize',
				],
			},
		},
		default: 0,
		description: 'ONU VLAN-ID',
	},
	{
		displayName: 'Zone',
		name: 'zone',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'authorize',
				],
			},
		},
		default: '',
		description: 'The zone where the ONU is located. The Zone can contain only alphanumeric characters, spaces, underscore and the dash (-) character.',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'authorize',
				],
			},
		},
		default: '',
		description: 'Name. The Name can contain only alphanumeric characters, spaces and the following characters: @#$&()-`.+,/_.',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'authorize',
				],
			},
		},
		placeholder: 'Add Field',
		default: {},
		options: [
			{
				displayName: 'Board',
				name: 'board',
				type: 'number',
				default: 0,
				description: 'OLT board where the ONU is placed. Leave it empty if you don\'t know yet.',
			},
			{
				displayName: 'Port',
				name: 'port',
				type: 'number',
				default: 0,
				description: 'OLT PON port where ONU is placed. Leave it empty if you don\'t know yet.',
			},
			{
				displayName: 'Custom Profile',
				name: 'custom_profile',
				type: 'string',
				default: '',
				description: 'THIS IS NOT THE SPEED PROFILE (the default speed profiles will be used, if you wish to change them you will need to make a separate API call after authorization). The custom profile name should not contain whitespaces.',
			},
			{
				displayName: 'CVLAN',
				name: 'cvlan',
				type: 'number',
				default: 0,
				description: 'ONU CVLAN-ID',
			},
			{
				displayName: 'SVLAN',
				name: 'svlan',
				type: 'number',
				default: 0,
				description: 'ONU SVLAN-ID',
			},
			{
				displayName: 'Tag Transform Mode',
				name: 'tag_transform_mode',
				type: 'options',
				default: 'default',
				description: 'Tag-transform mode',
				options: [
					{
						name: 'default',
						value: 'default',
					},
					{
						name: 'translate',
						value: 'translate',
					},
					{
						name: 'translate-and-add',
						value: 'translate-and-add',
					},
				],
			},
			{
				displayName: 'Use "other-all" TLS VLAN',
				name: 'use_other_all_tls_vlan',
				type: 'options',
				default: 0,
				options: [
					{
						name: '0',
						value: 0,
					},
					{
						name: '1',
						value: 1,
					},
				],
			},
			{
				displayName: 'ODB',
				name: 'odb',
				type: 'string',
				default: '',
				description: 'ODB splitter. The ODB (Splitter) can contain only alphanumeric characters, spaces, underscore and the dash (-) character.',
			},
			{
				displayName: 'Address Or Comment',
				name: 'address_or_comment',
				type: 'string',
				default: '',
				description: 'Address or comment. The Address or Comment can contain only alphanumeric characters, spaces and the following characters: @#$&()-`.+,/_.',
			},
			{
				displayName: 'ONU External ID',
				name: 'onu_external_id',
				type: 'string',
				default: '',
				description: 'ONU unique external ID. The ONU external ID can contain only alphanumeric characters.',
			},
			{
				displayName: 'Upload Speed Profile Name',
				name: 'upload_speed_profile_name',
				type: 'string',
				default: '',
				description: 'Example: 50M',
			},
			{
				displayName: 'Download Speed Profile Name',
				name: 'download_speed_profile_name',
				type: 'string',
				default: '',
				description: 'Example: 100M',
			},
		],
	},

	/*-------------------------------------------------------------------------- */
	/*       		onu:setOnuMgmtIPModeToDhcpByOnuUniqueExternalId            	 */
	/* ------------------------------------------------------------------------- */

	{
		displayName: 'ONU External ID',
		name: 'onuExternalId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'setOnuMgmtIPModeToDhcpByOnuUniqueExternalId',
				],
			},
		},
		default: '',
	},
	{
		displayName: 'VLAN',
		name: 'vlan',
		type: 'number',
		required: true,
		default: 0,
		description: 'ONU Mgmt VLAN-ID',
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'setOnuMgmtIPModeToDhcpByOnuUniqueExternalId',
				],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'setOnuMgmtIPModeToDhcpByOnuUniqueExternalId',
				],
			},
		},
		placeholder: 'Add Field',
		default: {},
		options: [
			{
				displayName: 'CVLAN',
				name: 'cvlan',
				type: 'number',
				default: 0,
				description: 'ONU Mgmt CVLAN-ID',
			},
			{
				displayName: 'SVLAN',
				name: 'svlan',
				type: 'number',
				default: 0,
				description: 'ONU Mgmt SVLAN-ID',
			},
			{
				displayName: 'Tag Transform Mode',
				name: 'tag_transform_mode',
				type: 'options',
				default: '',
				description: 'Tag-transform mode',
				options: [
					{
						name: 'default',
						value: 'default',
					},
					{
						name: 'translate',
						value: 'translate',
					},
					{
						name: 'translate-and-add',
						value: 'translate-and-add',
					},
				],
			},
		],
	},

	/*-------------------------------------------------------------------------- */
	/*       		onu:enableOnuTr069ByOnuUniqueExternalId            	 */
	/* ------------------------------------------------------------------------- */

	{
		displayName: 'ONU External ID',
		name: 'onuExternalId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'enableOnuTr069ByOnuUniqueExternalId',
				],
			},
		},
		default: '',
	},
	{

		displayName: 'TR069 profile name',
		name: 'tr069_profile',
		type: 'string',
		required: true,
		default: '',
		description: 'tr069_profile',
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'enableOnuTr069ByOnuUniqueExternalId',
				],
			},
		},
	},

	/*-------------------------------------------------------------------------- */
	/*       		onu:setOnuWanModeToDhcpByOnuUniqueExternalId            	 */
	/* ------------------------------------------------------------------------- */

	{
		displayName: 'ONU External ID',
		name: 'onuExternalId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'setOnuWanModeToDhcpByOnuUniqueExternalId',
				],
			},
		},
		default: '',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'setOnuWanModeToDhcpByOnuUniqueExternalId',
				],
			},
		},
		placeholder: 'Add Field',
		default: {},
		options: [
			{
				displayName: 'Configuration method',
				name: 'configuration_method',
				type: 'options',
				default: '',
				description: 'Configuration method',
				options: [
					{
						name: 'OMCI',
						value: 'OMCI',
					},
					{
						name: 'TR069',
						value: 'TR069',
					},
				],
			},
			{
				displayName: 'IP protocol',
				name: 'ip_protocol',
				type: 'options',
				default: '',
				description: 'ipv4ipv6',
				options: [
					{
						name: 'ipv4',
						value: 'ipv4',
					},
					{
						name: 'ipv6',
						value: 'ipv6',
					},
				],
			},
			{
				displayName: 'IP Address Mode ',
				name: 'ipv6_address_mode',
				type: 'options',
				default: '',
				description: 'ipv6 Address Mode',
				options: [
					{
						name: 'DHCPv6',
						value: 'DHCPv6',
					},
					{
						name: 'Auto',
						value: 'Auto',
					},
					{
						name: 'Static',
						value: 'Static',
					},
					{
						name: 'None',
						value: 'None',
					},
				],
			},
			{
				displayName: 'IPv6 address',
				name: 'ipv6_address',
				type: 'string',
				default: '',
				description: '',
			},
			{
				displayName: 'IPv6 gateway',
				name: 'ipv6_gateway',
				type: 'string',
				default: '',
				description: 'IPv6 gateway',
			},
			{
				displayName: 'DHCPv6-PD',
				name: 'ipv6_prefix_delegation_mode',
				type: 'options',
				default: '',
				description: 'DHCPv6-PD',
				options: [
					{
						name: 'DHCPv6',
						value: 'DHCPv6',
					},
					{
						name: 'Static',
						value: 'Static',
					},
					{
						name: 'None',
						value: 'None',
					},
				],
			},
			{
				displayName: 'IPv6 prefix address',
				name: 'ipv6_prefix_address',
				type: 'string',
				default: '',
				description: 'IPv6 prefix address',
			},
		],
	},

	/*-------------------------------------------------------------------------- */
	/*       		onu:setOnuWanModeToPppoeByOnuUniqueExternalId            	 */
	/* ------------------------------------------------------------------------- */

	{
		displayName: 'ONU External ID',
		name: 'onuExternalId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'setOnuWanModeToPppoeByOnuUniqueExternalId',
				],
			},
		},
		default: '',
	},
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		default: '',
		required: true,
		description: 'PPPoE username. The username can contain only alphanumeric characters. A maximum of 64 characters is allowed',
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'setOnuWanModeToPppoeByOnuUniqueExternalId',
				],
			},
		},
	},
	{
		displayName: 'Password',
		name: 'password',
		type: 'string',
		default: '',
		required: true,
		description: 'PPPoE password. The password can contain only alphanumeric characters. A maximum of 64 characters is allowed',
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'setOnuWanModeToPppoeByOnuUniqueExternalId',
				],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'setOnuWanModeToPppoeByOnuUniqueExternalId',
				],
			},
		},
		placeholder: 'Add Field',
		default: {},
		options: [
			{
				displayName: 'Configuration method',
				name: 'configuration_method',
				type: 'options',
				default: '',
				description: 'Configuration method',
				options: [

					{
						name: 'OMCI',
						value: 'OMCI',
					},
					{
						name: 'TR069',
						value: 'TR069',
					},
				],
			},
			{
				displayName: 'IP Protocol',
				name: 'ip_protocol',
				type: 'options',
				default: '',
				description: 'ipv4ipv6',
				options: [
					{
						name: 'ipv4',
						value: 'ipv4',
					},
					{
						name: 'ipv6',
						value: 'ipv6',
					},
				],
			},
			{
				displayName: 'ipv6 Address Mode',
				name: 'ipv6_address_mode',
				type: 'options',
				default: '',
				description: 'IP Address Mode',
				options: [
					{
						name: 'DHCPv6',
						value: 'DHCPv6',
					},
					{
						name: 'Auto',
						value: 'Auto',
					},
					{
						name: 'Static',
						value: 'Static',
					},
					{
						name: 'None',
						value: 'None',
					},
				],
			},
			{
				displayName: 'IPv6 address',
				name: 'ipv6_address',
				type: 'string',
				default: '',
				description: 'IPv6 address',
			},
			{
				displayName: 'IPv6 gateway',
				name: 'ipv6_gateway',
				type: 'string',
				default: '',
				description: 'IPv6 gateway',
			},
			{
				displayName: 'DHCPv6-PD',
				name: 'ipv6_prefix_delegation_mode',
				type: 'options',
				default: '',
				description: 'DHCPv6-PD',
				options: [
					{
						name: 'DHCPv6',
						value: 'DHCPv6',
					},
					{
						name: 'Static',
						value: 'Static',
					},
					{
						name: 'None',
						value: 'None',
					},
				],
			},
			{
				displayName: 'IPv6 prefix address',
				name: 'ipv6_prefix_address',
				type: 'string',
				default: '',
				description: 'IPv6 prefix address',
			},
		],
	},

	/*-------------------------------------------------------------------------- */
	/*       		onu:updateOnuSpeedProfilesByOnuUniqueExternalId            	 */
	/* ------------------------------------------------------------------------- */

	{
		displayName: 'ONU External ID',
		name: 'onuExternalId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'updateOnuSpeedProfilesByOnuUniqueExternalId',
				],
			},
		},
		default: '',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'updateOnuSpeedProfilesByOnuUniqueExternalId',
				],
			},
		},
		placeholder: 'Add Field',
		default: {},
		options: [
			{
				displayName: 'Upload Speed Profile Name',
				name: 'upload_speed_profile_name',
				type: 'string',
				default: '',
				description: 'Example: 50M',
			},
			{
				displayName: 'Download Speed Profile Name',
				name: 'download_speed_profile_name',
				type: 'string',
				default: '',
				description: 'Example: 100M',
			},
		],
	},

	/*-------------------------------------------------------------------------- */
	/*   	 onu:setOnuEthernetPortModeToTransparentByOnuUniqueExternalId     	 */
	/* ------------------------------------------------------------------------- */

	{
		displayName: 'OLT External ID',
		name: 'onuExternalId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'setOnuEthernetPortModeToTransparentByOnuUniqueExternalId',
				],
			},
		},
		default: '',
	},
	{
		displayName: 'Ethernet Port',
		name: 'ethernet_port',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'setOnuEthernetPortModeToTransparentByOnuUniqueExternalId',
				],
			},
		},
		default: '',
		description: 'ONU ethernet port',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'setOnuEthernetPortModeToTransparentByOnuUniqueExternalId',
				],
			},
		},
		placeholder: 'Add Field',
		default: {},
		options: [
			{
				displayName: 'DHCP',
				name: 'dhcp',
				type: 'options',
				default: 'No control',
				description: 'Ethernet port DHCP',
				options: [
					{
						name: 'No control',
						value: 'No control',
					},
					{
						name: 'From ISP',
						value: 'From ISP',
					},
					{
						name: 'From ONU',
						value: 'From ONU',
					},
					{
						name: 'Forbidden',
						value: 'Forbidden',
					},
				],
			},
		],
	},

	/*-------------------------------------------------------------------------- */
	/*       		onu:setOnuWiFiPortModeToLanByOnuUniqueExternalId            	 */
	/* ------------------------------------------------------------------------- */

	{
		displayName: 'ONU External ID',
		name: 'onuExternalId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'setOnuWiFiPortModeToLanByOnuUniqueExternalId',
				],
			},
		},
		default: '',
	},
	{
		displayName: 'WiFi Port',
		name: 'wifi_port',
		type: 'string',
		default: '',
		required: true,
		description: ' ONU WiFi port',
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'setOnuWiFiPortModeToLanByOnuUniqueExternalId',
				],
			},
		},
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'setOnuWiFiPortModeToLanByOnuUniqueExternalId',
				],
			},
		},
		placeholder: 'Add Field',
		default: {},
		options: [
			{
				displayName: 'DHCP',
				name: 'dhcp',
				type: 'options',
				default: '',
				description: 'WiFi port DHCP',
				options: [
					{
						name: 'No control',
						value: 'No control',
					},
					{
						name: 'From ISP',
						value: 'From ISP',
					},
					{
						name: 'From ONU',
						value: 'From ONU',
					},
					{
						name: 'Forbidden',
						value: 'Forbidden',
					},
				],
			},
			{
				displayName: 'SSID',
				name: 'ssid',
				type: 'string',
				default: '',
				description: 'WiFi port SSID',
			},
			{
				displayName: 'Password',
				name: 'password',
				type: 'string',
				default: '',
				description: 'WiFi port password',
			},
			{
				displayName: 'Authentication Mode',
				name: 'authentication_mode',
				type: 'options',
				default: '',
				description: 'WiFi port authentication mode',
				options: [
					{
						name: 'WPA2',
						value: 'WPA2',
					},
					{
						name: 'Open-system',
						value: 'Open-system',
					},
				],
			},
		],
	},

	/*-------------------------------------------------------------------------- */
	/*       		onu:setOnuWifiPortModeToAccessByOnuUniqueExternalId            	 */
	/* ------------------------------------------------------------------------- */

	{
		displayName: 'ONU External ID',
		name: 'onuExternalId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'setOnuWifiPortModeToAccessByOnuUniqueExternalId',
				],
			},
		},
		default: '',
	},
	{
		displayName: 'WiFi Port',
		name: 'wifi_port',
		type: 'string',
		default: '',
		required: true,
		description: ' ONU WiFi port',
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'setOnuWifiPortModeToAccessByOnuUniqueExternalId',
				],
			},
		},
	},
	{
		displayName: 'VLAN',
		name: 'vlan',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'setOnuWifiPortModeToAccessByOnuUniqueExternalId',
				],
			},
		},
		default: 0,
		description: 'WiFi port VLAN-ID',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'setOnuWifiPortModeToAccessByOnuUniqueExternalId',
				],
			},
		},
		placeholder: 'Add Field',
		default: {},
		options: [
			{
				displayName: 'DHCP',
				name: 'dhcp',
				type: 'options',
				default: '',
				description: 'WiFi port DHCP',
				options: [
					{
						name: 'No control',
						value: 'No control',
					},
					{
						name: 'From ISP',
						value: 'From ISP',
					},
					{
						name: 'From ONU',
						value: 'From ONU',
					},
					{
						name: 'Forbidden',
						value: 'Forbidden',
					},
				],
			},
			{
				displayName: 'SSID',
				name: 'ssid',
				type: 'string',
				default: '',
				description: 'WiFi port SSID',
			},
			{
				displayName: 'Password',
				name: 'password',
				type: 'string',
				default: '',
				description: 'WiFi port password',
			},
			{
				displayName: 'Authentication Mode',
				name: 'authentication_mode',
				type: 'options',
				default: '',
				description: 'WiFi port authentication mode',
				options: [
					{
						name: 'WPA2',
						value: 'WPA2',
					},
					{
						name: 'Open-system',
						value: 'Open-system',
					},
				],
			},
		],
	},

	/*-------------------------------------------------------------------------- */
	/*       		onu:shutdownOnuWifiPortByOnuUniqueExernalId            	 */
	/* ------------------------------------------------------------------------- */

	{
		displayName: 'ONU External ID',
		name: 'onuExternalId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'shutdownOnuWifiPortByOnuUniqueExernalId',
				],
			},
		},
		default: '',
	},
	{
		displayName: 'WiFi Port',
		name: 'wifi_port',
		type: 'string',
		default: '',
		required: true,
		description: 'ONU WiFi port',
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'shutdownOnuWifiPortByOnuUniqueExernalId',
				],
			},
		},
	},

	/*-------------------------------------------------------------------------- */
	/*       		onu:rebootOnuByOnuUniqueExternalId            	 */
	/* ------------------------------------------------------------------------- */

	{
		displayName: 'ONU External ID',
		name: 'onuExternalId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'rebootOnuByOnuUniqueExternalId',
				],
			},
		},
		default: '',
	},

	/*-------------------------------------------------------------------------- */
	/*       		onu:resyncOnuConfigByOnuUniqueExternalId            	 */
	/* ------------------------------------------------------------------------- */

	{
		displayName: 'ONU External ID',
		name: 'onuExternalId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'resyncOnuConfigByOnuUniqueExternalId',
				],
			},
		},
	},

	/*-------------------------------------------------------------------------- */
	/*       		onu:deleteOnuByOnuUniqueExternalId            	 */
	/* ------------------------------------------------------------------------- */

	{
		displayName: 'ONU External ID',
		name: 'onuExternalId',
		type: 'string',
		default: '',
		required: true,
		description: 'Comma separated list of ONU unique external IDs. A maximum of 10 ONU unique external IDs are allowed',
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'deleteOnuByOnuUniqueExternalId',
				],
			},
		},
	},

	/*-------------------------------------------------------------------------- */
	/*   	 				onu:disableOnuForASpecifiedOnuUniqueExternalId								 */
	/*   	 							onu:enableOnuByOnuUniqueExternalId											 */
	/*   	 						onu:getOnuStatusByOnuUniqueExternalId											 */
	/*   	 				onu:getOnuAdministrativeStatusByOnuUniqueExternalId						 */
	/*   	 						onu:getOnuSpeedProfilesByOnuUniqueExternalId						 	 */
	/* ------------------------------------------------------------------------- */
	{
		displayName: 'ONU External ID',
		name: 'onuExternalId',
		required: true,
		type: 'string',
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'disableOnuForASpecifiedOnuUniqueExternalId',
					'enableOnuByOnuUniqueExternalId',
					'getOnuStatusByOnuUniqueExternalId',
					'getOnuAdministrativeStatusByOnuUniqueExternalId',
					'getOnuSpeedProfilesByOnuUniqueExternalId',
				],
			},
		},
		default: '',
		description: 'ONU unique external ID. The ONU external ID can contain only alphanumeric characters.',
	},
];
