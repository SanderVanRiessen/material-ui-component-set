import * as Core from '@material-ui/core';
import * as Lab from '@material-ui/lab';
import * as Pickers from '@material-ui/pickers';
import * as Styles from '@material-ui/styles';
import DateFnsUtils from '@date-io/date-fns';
import enLocale from 'date-fns/locale/en-US';
import nlLocale from 'date-fns/locale/nl';
import * as ExportHtml from 'draft-js-export-html';
import * as Draft from 'draft-js';

import Icons from './icons';

window.ExportHtml = ExportHtml;
window.Draft = Draft;

export default {
  Core,
  Icons,
  Lab,
  Pickers,
  Styles,
  DateFnsUtils,
  DateLocales: { enLocale, nlLocale },
  Draft,
  ExportHtml,
};
