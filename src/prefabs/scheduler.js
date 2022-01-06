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
          value: {},
          label: 'Event Filter',
          key: 'filter',
          type: 'FILTER',
          configuration: {
            dependsOn: 'eventModel',
          },
        },
        {
          type: 'TOGGLE',
          label: 'Ignore rRule filter',
          key: 'filterOnly',
          value: false,
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
          label: 'Block edit if blocked',
          key: 'blockEdit',
          value: true,
        },
        {
          type: 'TOGGLE',
          label: 'Show webuser name',
          key: 'showWebuser',
          value: false,
        },
        {
          type: 'TOGGLE',
          label: 'Show activity',
          key: 'showActivity',
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
          type: 'VARIABLE',
          label: 'Landing date',
          key: 'dynamicLandingDate',
          value: [''],
        },
        {
          type: 'VARIABLE',
          label: 'Webuser ID',
          key: 'dynamicWebuserId',
          value: [''],
        },
        {
          type: 'TOGGLE',
          label: 'Show category',
          key: 'showCategory',
          value: true,
        },
        {
          type: 'VARIABLE',
          label: 'Default category',
          key: 'defaultCategory',
          value: [''],
          configuration: {
            dependsOn: 'eventModel',
            condition: {
              type: 'SHOW',
              option: 'showCategory',
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
          type: 'TEXT',
          label: 'Zakelijk color',
          key: 'colorZakelijk',
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
          label: 'Prive color',
          key: 'colorPrive',
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
          value: 'Niet beschikbaar',
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
        {
          type: 'TOGGLE',
          label: 'Disable past',
          key: 'disabledPast',
          value: false,
        },
        {
          label: 'Language',
          key: 'locale',
          value: 'nl',
          type: 'CUSTOM',
          configuration: {
            as: 'BUTTONGROUP',
            dataType: 'string',
            allowedInput: [
              { name: 'English', value: 'en' },
              { name: 'Dutch', value: 'nl' },
            ],
          },
        },
      ],
      descendants: [],
    },
  ],
}))();
