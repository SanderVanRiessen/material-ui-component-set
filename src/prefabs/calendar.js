(() => ({
  name: 'Calendar Component',
  icon: 'DataContainer',
  category: 'CONTENT',
  structure: [
    {
      name: 'calendar',
      options: [
        {
          type: 'TOGGLE',
          label: 'Toggle Visibility',
          key: 'visibility',
          value: true,
          configuration: {
            as: 'VISIBILITY',
          },
        },
      ],
      descendants: [],
    },
  ],
}))();
