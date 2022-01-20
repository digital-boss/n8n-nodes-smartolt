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
				name: 'Get All Unconfigured By OLT Unique ID',
				value: 'getAllUnconfiguredByOltUniqueId',
				description: 'Gets a list of all unconfigured ONUs for a specified OLT unique ID',
			},
			{
				name: 'Authorize',
				value: 'authorize',
				description: 'Authorizes an ONU on the provided OLT. If board or port are left empty then the ONU is saved for later authorization.',
			},
			{
				name: 'Update ONU Speed Profiles By ONU Unique External ID',
				value: 'updateOnuSpeedProfilesByOnuUniqueExternalId',
			},
			{
				name: 'Get ONU Full Status Info By ONU Unique External ID',
				value: 'getOnuFullStatusInfoByOnuUniqueExternalID',
			},
			{
				name: 'Set ONU Ethernet Port Mode To Transparent By ONU Unique External ID',
				value: 'setOnuEthernetPortModeToTransparentByOnuUniqueExternalId',
			},
			{
				name: 'Get All ONUs Details',
				value: 'getAllOnusDetails',
				description: 'Gets all the ONUs details for a specified OLT ID, board, PON port or zone. If no OLT ID, board, PON port or zone is specified, then all the ONUs details on all OLTs will be returned.\n' +
					'The "Get all ONUs details" method is equivalent to an export of the entire database of ONU details and therefore it is not recommended to be used repeatedly, as the contained information does not change so often.\n' +
					'Maximum recommended calls for "Get all ONUs details": 3 per hour (calls are blocked after the limit is reached).',
			},
			{
				name: 'Get All ONUs Signals',
				value: 'getAllOnusSignals',
				description: 'Gets all the ONUs signals for a specified OLT ID, board, PON port or zone. If no OLT ID, board, PON port or zone is specified, then all the ONUs signals on all OLTs will be returned.',
			},
			{
				name: 'Get ONU Traffic Graph By ONU Unique External ID',
				value: 'getOnuTrafficGraphByOnuUniqueExternalId',
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
	/*                 	 onu:getAllUnconfiguredByOltUniqueId        			 */
	/* ------------------------------------------------------------------------- */

	{
		displayName: 'OLT ID',
		name: 'oltId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: [
					'onu',
				],
				operation: [
					'getAllUnconfiguredByOltUniqueId',
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
					'getAllUnconfiguredByOltUniqueId',
				],
			},
		},
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
	/*                                onu:authorize                            	 */
	/* ------------------------------------------------------------------------- */

	{
		displayName: 'OLT ID',
		name: 'olt_id',
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
			},
			{
				displayName: 'Download Speed Profile Name',
				name: 'download_speed_profile_name',
				type: 'string',
				default: '',
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
		default: {},
		options: [
			{
				displayName: 'Upload Speed Profile Name',
				name: 'upload_speed_profile_name',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Download Speed Profile Name',
				name: 'download_speed_profile_name',
				type: 'string',
				default: '',
			},
		],
	},

	/*-------------------------------------------------------------------------- */
	/*     			onu:getOnuFullStatusInfoByOnuUniqueExternalID           	 */
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

];