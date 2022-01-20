import {
	INodeProperties,
} from 'n8n-workflow';

export const oltOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		displayOptions: {
			show: {
				resource: [
					'olt',
				],
			},
		},
		options: [
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get a list of all OLTs names, IPs, telnet ports, SNMP ports and unique IDs',
			},
		],
		default: 'getAll',
	},
];

export const oltFields: INodeProperties[] = [
	/*-------------------------------------------------------------------------- */
	/*                                olt:getAll                            	 */
	/* ------------------------------------------------------------------------- */

	// No fields are needed for this operation

];