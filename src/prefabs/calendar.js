(() => ({
  name: 'Calendar Component',
  icon: 'DataContainer',
  category: 'CONTENT',
  actions: [],
  interactions: [],
  structure: [
    {
      name: 'calendar',
      options: [
        {
          label: 'Toggle visibility',
          key: 'visible',
          value: true,
          type: 'TOGGLE',
          configuration: {
            as: 'VISIBILITY',
          },
        },
        {
          value: '',
          label: 'Model',
          key: 'model',
          type: 'MODEL_AND_RELATION',
        },
        {
          value: {},
          label: 'Filter',
          key: 'filter',
          type: 'FILTER',
          configuration: {
            dependsOn: 'model',
          },
        },
        {
          value: '',
          label: 'Calendar Event Name',
          key: 'nameProperty',
          type: 'PROPERTY',
          configuration: {
            dependsOn: 'model',
          },
        },
        {
          value: '',
          label: 'Calendar Event Start Time',
          key: 'startProperty',
          type: 'PROPERTY',
          configuration: {
            dependsOn: 'model',
          },
        },
        {
          value: '',
          label: 'Calendar Event End Time',
          key: 'endProperty',
          type: 'PROPERTY',
          configuration: {
            dependsOn: 'model',
          },
        },
        {
          value: '',
          label: 'Calendar Event Color',
          key: 'colorProperty',
          type: 'PROPERTY',
          configuration: {
            dependsOn: 'model',
          },
        },
        {
          value: false,
          label: 'Slot Options',
          key: 'slotSettings',
          type: 'TOGGLE',
        },
        {
          type: 'TEXT',
          label: 'slot Min Time',
          key: 'slotMinTime',
          value: '07:00:00',
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'slotSettings',
              comparator: 'EQ',
              value: true,
            },
          },
        },
        {
          type: 'TEXT',
          label: 'slot Max Time',
          key: 'slotMaxTime',
          value: '21:00:00',
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'slotSettings',
              comparator: 'EQ',
              value: true,
            },
          },
        },
        {
          type: 'TEXT',
          label: 'slot Duration',
          key: 'slotDuration',
          value: '00:30:00',
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'slotSettings',
              comparator: 'EQ',
              value: true,
            },
          },
        },
        {
          type: 'TEXT',
          label: 'slot Label Interval',
          key: 'slotLabelInterval',
          value: '01:00:00',
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'slotSettings',
              comparator: 'EQ',
              value: true,
            },
          },
        },
        {
          value: false,
          label: 'Legend Options',
          key: 'advancedSettings',
          type: 'TOGGLE',
        },
        {
          value: '',
          label: 'Model',
          key: 'modelAdvanced',
          type: 'MODEL_AND_RELATION',
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'advancedSettings',
              comparator: 'EQ',
              value: true,
            },
          },
        },
        {
          value: '',
          label: 'Event name',
          key: 'eventNameProperty',
          type: 'PROPERTY',
          configuration: {
            dependsOn: 'modelAdvanced',
            condition: {
              type: 'SHOW',
              option: 'advancedSettings',
              comparator: 'EQ',
              value: true,
            },
          },
        },
        {
          value: '',
          label: 'Event color',
          key: 'eventColorProperty',
          type: 'PROPERTY',
          configuration: {
            dependsOn: 'modelAdvanced',
            condition: {
              type: 'SHOW',
              option: 'advancedSettings',
              comparator: 'EQ',
              value: true,
            },
          },
        },
      ],
      descendants: [
        {
          name: 'Dialog',
          ref: {
            id: '#dialog',
          },
          options: [
            {
              label: 'Toggle visibility',
              key: 'isVisible',
              value: true,
              type: 'TOGGLE',
              configuration: {
                as: 'VISIBILITY',
              },
            },
            {
              type: 'TOGGLE',
              label: 'Fullscreen',
              key: 'isFullscreen',
              value: false,
            },
            {
              type: 'TOGGLE',
              label: 'Disable backdrop click',
              key: 'disableClick',
              value: false,
            },
            {
              value: 'sm',
              label: 'Width',
              key: 'width',
              type: 'CUSTOM',
              configuration: {
                as: 'DROPDOWN',
                dataType: 'string',
                allowedInput: [
                  { name: 'Extra-small', value: 'xs' },
                  { name: 'Small', value: 'sm' },
                  { name: 'Medium', value: 'md' },
                  { name: 'Large', value: 'lg' },
                  { name: 'Extra-large', value: 'xl' },
                ],
              },
            },
            {
              value: false,
              label: 'Advanced settings',
              key: 'advancedSettings',
              type: 'TOGGLE',
            },
            {
              type: 'VARIABLE',
              label: 'Test attribute',
              key: 'dataComponentAttribute',
              value: ['Dialog'],
              configuration: {
                condition: {
                  type: 'SHOW',
                  option: 'advancedSettings',
                  comparator: 'EQ',
                  value: true,
                },
              },
            },
          ],
          descendants: [],
        },
      ],
    },
  ],
}))();
