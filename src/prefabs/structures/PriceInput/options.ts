import { option, text, variable } from '@betty-blocks/component-sdk';
import { PartialBy } from '../../../utils';
import { advanced } from '../TextInput/options/advanced';
import { styles as defaultStyles } from '../TextInput/options/styles';
import { validation } from '../TextInput/options/validation';

const styles = { ...defaultStyles };

// TODO: make a typed function to omit keys from an object
delete (<PartialBy<typeof styles, 'adornmentIcon'>>styles).adornmentIcon;

export const options = {
  actionProperty: option('ACTION_JS_PROPERTY', {
    label: 'Property',
    value: '',
  }),

  label: variable('Label', { value: [''] }),
  value: variable('Value', { value: [''] }),

  ...validation,

  adornment: text('Currency', {
    value: '€',
  }),

  ...styles,
  ...advanced,
};
