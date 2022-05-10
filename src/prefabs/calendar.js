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
          value: '',
          label: 'Model',
          key: 'model',
          type: 'MODEL_AND_RELATION',
        },
        {
          value: '',
          label: 'Calendar Room',
          key: 'roomProperty',
          type: 'PROPERTY',
          configuration: {
            dependsOn: 'model',
          },
        },
        {
          value: '',
          label: 'Calendar Start Time',
          key: 'startProperty',
          type: 'PROPERTY',
          configuration: {
            dependsOn: 'model',
          },
        },
        {
          value: '',
          label: 'Calendar End Time',
          key: 'endProperty',
          type: 'PROPERTY',
          configuration: {
            dependsOn: 'model',
          },
        },
        {
          value: false,
          label: 'Advanced settings',
          key: 'advancedSettings',
          type: 'TOGGLE',
        },
        {
          value: '',
          label: 'Model',
          key: 'model2',
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
          label: 'Room name',
          key: 'roomNameProperty',
          type: 'PROPERTY',
          configuration: {
            dependsOn: 'model2',
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
          label: 'Room color',
          key: 'roomColorProperty',
          type: 'PROPERTY',
          configuration: {
            dependsOn: 'model2',
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
