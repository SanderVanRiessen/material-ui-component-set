(() => ({
  name: 'Text Editor',
  icon: 'ParagraphIcon',
  category: 'CONTENT',
  structure: [
    {
      name: 'TextEditor',
      options: [
        {
          value: { label: ['textEditor'], value: [] },
          label: 'Label',
          key: 'customModelAttribute',
          type: 'CUSTOM_MODEL_ATTRIBUTE',
          configuration: {
            allowedTypes: ['string'],
          },
        },
        {
          value: ['Type your text here...'],
          label: 'Placeholder',
          key: 'placeholder',
          type: 'VARIABLE',
        },
        {
          value: false,
          label: 'Editor options',
          key: 'editorOptions',
          type: 'TOGGLE',
        },
        {
          type: 'TOGGLE',
          label: 'Bold',
          key: 'bold',
          value: true,
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'editorOptions',
              comparator: 'EQ',
              value: true,
            },
          },
        },
        {
          type: 'TOGGLE',
          label: 'Italic',
          key: 'italic',
          value: true,
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'editorOptions',
              comparator: 'EQ',
              value: true,
            },
          },
        },
        {
          type: 'TOGGLE',
          label: 'Underline',
          key: 'underline',
          value: true,
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'editorOptions',
              comparator: 'EQ',
              value: true,
            },
          },
        },
        {
          type: 'TOGGLE',
          label: 'Strikethrough',
          key: 'strikethrough',
          value: true,
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'editorOptions',
              comparator: 'EQ',
              value: true,
            },
          },
        },
        {
          type: 'TOGGLE',
          label: 'Link',
          key: 'link',
          value: true,
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'editorOptions',
              comparator: 'EQ',
              value: true,
            },
          },
        },
        {
          type: 'TOGGLE',
          label: 'Numberlist',
          key: 'numberList',
          value: true,
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'editorOptions',
              comparator: 'EQ',
              value: true,
            },
          },
        },
        {
          type: 'TOGGLE',
          label: 'Bulletlist',
          key: 'bulletList',
          value: true,
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'editorOptions',
              comparator: 'EQ',
              value: true,
            },
          },
        },
        {
          type: 'TOGGLE',
          label: 'Quote',
          key: 'quote',
          value: true,
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'editorOptions',
              comparator: 'EQ',
              value: true,
            },
          },
        },
        {
          type: 'TOGGLE',
          label: 'Code',
          key: 'code',
          value: true,
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'editorOptions',
              comparator: 'EQ',
              value: true,
            },
          },
        },
        {
          type: 'TOGGLE',
          label: 'Image',
          key: 'image',
          value: true,
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'editorOptions',
              comparator: 'EQ',
              value: true,
            },
          },
        },
        {
          value: false,
          label: 'Styles',
          key: 'styles',
          type: 'TOGGLE',
        },
        {
          type: 'COLOR',
          label: 'Border color',
          key: 'borderColor',
          value: 'Accent1',
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'styles',
              comparator: 'EQ',
              value: true,
            },
          },
        },
        {
          type: 'COLOR',
          label: 'Border color (hover)',
          key: 'borderHoverColor',
          value: 'Black',
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'styles',
              comparator: 'EQ',
              value: true,
            },
          },
        },
        {
          type: 'COLOR',
          label: 'Border color (focus)',
          key: 'borderFocusColor',
          value: 'Primary',
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'styles',
              comparator: 'EQ',
              value: true,
            },
          },
        },
        {
          type: 'COLOR',
          label: 'Label color',
          key: 'labelColor',
          value: 'Accent3',
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'styles',
              comparator: 'EQ',
              value: true,
            },
          },
        },
        {
          type: 'COLOR',
          label: 'Icon color',
          key: 'iconColor',
          value: 'Accent2',
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'styles',
              comparator: 'EQ',
              value: true,
            },
          },
        },
        {
          type: 'COLOR',
          label: 'Editor option selected color',
          key: 'optionSelected',
          value: 'Black',
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'styles',
              comparator: 'EQ',
              value: true,
            },
          },
        },
        {
          type: 'SIZE',
          label: 'MaxHeight',
          key: 'maxHeight',
          value: '200px',
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'styles',
              comparator: 'EQ',
              value: true,
            },
            as: 'UNIT',
          },
        },
        {
          value: false,
          label: 'Hide label',
          key: 'hideLabel',
          type: 'TOGGLE',
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'styles',
              comparator: 'EQ',
              value: true,
            },
          },
        },
        {
          type: 'SIZES',
          label: 'Outer Space',
          key: 'margin',
          value: ['M', '0rem', 'M', '0rem'],
        },
      ],
      descendants: [],
    },
  ],
}))();
