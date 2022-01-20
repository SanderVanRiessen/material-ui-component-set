(() => ({
  name: 'Scheduler',
  icon: 'DatePickerIcon',
  category: 'CONTENT',
  structure: [
    {
      name: 'Scheduler',
      options: [
        {
          type: 'MODEL',
          label: 'Event Model',
          key: 'eventModel',
          value: '',
        },
        {
          type: 'CUSTOM',
          label: 'Custom Scheduler Type',
          key: 'customSchedulerType',
          value: 'none',
          configuration: {
            as: 'BUTTONGROUP',
            dataType: 'string',
            allowedInput: [
              { name: 'None', value: 'none' },
              { name: 'Rooms', value: 'room' },
              { name: 'Cars', value: 'car' },
            ],
          },
        },
        {
          value: '',
          label: 'Action',
          key: 'actionId',
          type: 'ACTION',
          configuration: {
            apiVersion: 'v1',
          },
        },
        {
          type: 'TOGGLE',
          label: 'Show webuser name',
          key: 'showWebuser',
          value: false,
        },
        {
          type: 'TOGGLE',
          label: 'Enable tooltip',
          key: 'enableTooltip',
          value: true,
        },
        {
          type: 'TOGGLE',
          label: 'Enable build in form',
          key: 'enableForm',
          value: true,
        },
        {
          type: 'TOGGLE',
          label: 'Show custom form',
          key: 'showCustomForm',
          value: true,
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'enableForm',
              comparator: 'EQ',
              value: true,
            },
          },
        },
        {
          type: 'TOGGLE',
          label: 'Use event color',
          key: 'useEventColor',
          value: false,
        },
        {
          type: 'TOGGLE',
          label: 'Disable past',
          key: 'disabledPast',
          value: false,
        },
        {
          type: 'VARIABLE',
          label: 'Webuser ID',
          key: 'dynamicWebuserId',
          value: [''],
        },
        {
          type: 'TEXT',
          label: 'Business color',
          key: 'colorBusiness',
          value: '#20659A',
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'useEventColor',
              comparator: 'EQ',
              value: false,
            },
          },
        },
        {
          type: 'TEXT',
          label: 'Private color',
          key: 'colorPrivate',
          value: '#E69125',
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'useEventColor',
              comparator: 'EQ',
              value: false,
            },
          },
        },
        {
          type: 'TEXT',
          label: 'Default event Title',
          key: 'defaultTitle',
          value: 'Not available',
        },
        {
          type: 'NUMBER',
          label: 'Start time',
          key: 'startTime',
          value: 9,
        },
        {
          type: 'NUMBER',
          label: 'End time',
          key: 'endTime',
          value: 17,
        },
      ],
      descendants: [],
    },
  ],
}))();
