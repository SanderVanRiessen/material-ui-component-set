(() => ({
  name: 'sliderInput',
  type: 'CONTENT_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const { Slider, InputLabel } = window.MaterialUI.Core;
    const { env, getCustomModelAttribute, useText } = B;
    const isDev = env === 'dev';
    const {
      startNumber,
      endNumber,
      stepNumber,
      customModelAttribute: customModelAttributeObj,
      marks,
      border,
      disable,
    } = options;
    const {
      id: customModelAttributeId,
      label = [],
      value: defaultValue = [],
    } = customModelAttributeObj;
    const [currentValue, setCurrentValue] = useState(useText(defaultValue));
    const labelText = useText(label);
    const customModelAttribute = getCustomModelAttribute(
      customModelAttributeId,
    );
    const withBorder = border === 'withBorder';

    const { name: customModelAttributeName = {} } = customModelAttribute || {};
    function setValue(_event, value) {
      setCurrentValue(value);
    }

    const sliderInput = (
      <div className={classes.spacing}>
        <div className={withBorder ? classes.root : classes.rootWithoutBorder}>
          {labelText && (
            <InputLabel
              classes={{
                root: withBorder ? classes.label : classes.labelWithBorder,
              }}
            >
              <span>{labelText}</span>
            </InputLabel>
          )}
          <div
            className={
              withBorder ? classes.content : classes.contentWithoutBorder
            }
          >
            <Slider
              name={customModelAttributeName}
              defaultValue={currentValue}
              valueLabelDisplay={disable ? 'on' : 'auto'}
              step={stepNumber}
              min={startNumber}
              max={endNumber}
              marks={stepNumber ? marks : false}
              onChange={setValue}
              disabled={isDev || disable}
              classes={{
                root: classes.sliderRoot,
                colorPrimary: classes.slider,
                thumb: classes.thumb,
                focusVisible: classes.thumbFocusVisible,
              }}
            />
          </div>
        </div>
      </div>
    );
    return !isDev ? (
      sliderInput
    ) : (
      <div className={classes.dev}>{sliderInput}</div>
    );
  })(),
  styles: B => t => {
    const { Styling } = B;
    const style = new Styling(t);
    const convertSizes = sizes =>
      sizes.map(size => style.getSpacing(size)).join(' ');
    return {
      dev: {
        '& > *': {
          pointerEvents: 'none',
        },
      },
      spacing: {
        padding: ({ options: { outerSpacing } }) => convertSizes(outerSpacing),
      },
      root: {
        border: '1px solid',
        borderRadius: '5px',
        borderColor: ({ options: { borderColor } }) => [
          style.getColor(borderColor),
        ],
        '&:hover': {
          borderColor: ({ options: { borderHoverColor } }) => [
            style.getColor(borderHoverColor),
            '!important',
          ],
        },
        '&:focus-within': {
          borderColor: ({ options: { borderFocusColor } }) => [
            style.getColor(borderFocusColor),
            '!important',
          ],
        },
      },
      rootWithoutBorder: {
        borderBottom: '1px solid',
        borderColor: ({ options: { borderColor } }) => [
          style.getColor(borderColor),
        ],
        '&:hover': {
          borderColor: ({ options: { borderHoverColor } }) => [
            style.getColor(borderHoverColor),
            '!important',
          ],
        },
        '&:focus-within': {
          borderColor: ({ options: { borderFocusColor } }) => [
            style.getColor(borderFocusColor),
            '!important',
          ],
        },
      },
      sliderRoot: {
        width: '100%',
        padding: '20px 0px !important',
      },
      content: {
        padding: '0px 20px !important',
      },
      contentWithoutBorder: {
        padding: '0px 6px !important',
      },
      slider: {
        color: ({ options: { sliderColor } }) => [
          style.getColor(sliderColor),
          '!important',
        ],
        '& .MuiSlider-thumb:hover': {
          boxShadow: '0px 0px 0px 8px rgb(128,128,128, 0.3) !important',
        },
      },
      thumbFocusVisible: {
        boxShadow: '0px 0px 0px 8px rgb(128,128,128, 0.3) !important',
      },
      label: {
        transform: 'translate(14px, -6px) scale(0.75)',
        height: 10,
        '& span': {
          padding: '0px 5px',
          width: 'auto',
          backgroundColor: 'white',
        },
        color: ({ options: { labelColor } }) => [
          style.getColor(labelColor),
          '!important',
        ],
      },
      labelWithBorder: {
        transform: 'translate(0px, -6px) scale(0.75)',
        height: 10,
        '& span': {
          width: 'auto',
          backgroundColor: 'white',
        },
        color: ({ options: { labelColor } }) => [
          style.getColor(labelColor),
          '!important',
        ],
      },
    };
  },
}))();