(() => ({
  name: 'textEditor',
  type: 'BODY_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const {
      customModelAttribute: customModelAttributeObj,
      type,
      placeholder,
      hideLabel,
      variant,
    } = options;
    const { env, useFileUpload, getCustomModelAttribute, useText } = B;
    const isDev = env === 'dev';
    const { MUIRichTextEditor, Draft, ExportHtml } = window;
    const { convertFromHTML, ContentState, convertToRaw } = Draft;
    const { stateToHTML } = ExportHtml;
    const isTop = type === 'top';
    const isOutlined = variant === 'outlined';
    const placeholderText = useText(placeholder);
    const {
      Done: DoneIcon,
      Close: CloseIcon,
      AttachFile: AttachFileIcon,
      Backup,
    } = window.MaterialUI.Icons;
    const {
      Grid,
      Popover,
      TextField,
      IconButton,
      Button,
      InputLabel,
    } = window.MaterialUI.Core;

    const [htmlContent, setHtmlContent] = useState(null);
    const [uploads, setUploads] = useState({
      files: [],
    });
    const [anchor, setAnchor] = useState(null);

    const { files } = uploads;
    const acceptedValue = 'image/*';
    const acceptList = acceptedValue.split(',').map(item => item.trim());
    const arFiles = [];
    const optionArray = [];

    const {
      id: customModelAttributeId,
      label = [],
      value: defaultValue = [],
    } = customModelAttributeObj;
    const labelText = useText(label);
    const customModelAttribute = getCustomModelAttribute(
      customModelAttributeId,
    );
    const [currentValue, setCurrentValue] = useState(useText(defaultValue));
    const { name: customModelAttributeName, validations: { required } = {} } =
      customModelAttribute || {};

    const [preHtmlValue, setPreHtmlValue] = useState('');

    function rootClasses() {
      switch (variant) {
        case 'outlined':
          return classes.editorRoot;
        case 'standard':
          if (isTop) {
            return classes.editorRootStandard;
          }
          if (hideLabel) {
            return `${classes.editorRootStandardBottom} ${classes.muithemeContainerStandard}`;
          }
          return classes.editorRootStandardBottom;
        default:
          if (isTop) {
            return classes.editorRootFilled;
          }
          if (hideLabel) {
            return `${classes.editorRootFilledBottom} ${classes.muithemeContainerStandard}`;
          }
          return classes.editorRootFilledBottom;
      }
    }

    function editorClasses() {
      let StyleContainer = '';
      let StyleEditor = '';
      let StyleToolbar = '';
      let StylePlaceholder = '';
      switch (variant) {
        case 'outlined':
          if (isTop) {
            StylePlaceholder = classes.muithemePlaceholder;
            StyleContainer = classes.muithemeContainer;
            StyleEditor = classes.muithemeEditor;
            if (hideLabel) {
              StyleToolbar = `${classes.muithemeToolbarHideLabel} ${classes.muithemeToolbar}`;
            } else {
              StyleToolbar = classes.muithemeToolbar;
            }
          } else {
            StyleContainer = classes.muithemeContainerBottom;
            StyleEditor = classes.muithemeEditor;
            StyleToolbar = classes.muithemeToolbarBottom;
            StylePlaceholder = classes.muithemePlaceholderBottom;
          }
          break;
        default:
          if (isTop) {
            StyleEditor = classes.muithemeEditorStandard;
            StyleToolbar = classes.muithemeToolbarStandard;
            StylePlaceholder = classes.muithemePlaceholderStandard;
            if (hideLabel) {
              StyleContainer = classes.muithemeContainerStandard;
            } else {
              StyleContainer = classes.muithemeContainer;
            }
          } else {
            StyleToolbar = classes.muithemeToolbarStandard;
            StyleEditor = classes.muithemeEditorStandardBottom;
            StylePlaceholder = classes.muithemePlaceholderStandardBottom;
            StyleContainer = classes.muithemeContainerBottom;
          }
          break;
      }
      return {
        root: classes.muithemeRoot,
        container: StyleContainer,
        editor: StyleEditor,
        editorContainer: classes.muithemeEditorContainer,
        toolbar: StyleToolbar,
        placeHolder: StylePlaceholder,
        anchorLink: classes.muithemeAnchorlink,
      };
    }

    const customContentStateConverter = contentState => {
      const newBlockMap = contentState.getBlockMap().map(block => {
        const entityKey = block.getEntityAt(0);
        if (entityKey !== null) {
          const entityBlock = contentState.getEntity(entityKey);
          const entityType = entityBlock.getType();
          switch (entityType) {
            case 'IMAGE': {
              const newEntity = {
                url: entityBlock.data.src,
              };
              const newBlock = block.merge({
                text: ' ',
              });
              contentState.mergeEntityData(entityKey, newEntity);
              return newBlock;
            }
            default:
              return block;
          }
        }
        return block;
      });
      const newContentState = contentState.set('blockMap', newBlockMap);
      return newContentState;
    };

    useEffect(() => {
      if (!preHtmlValue) {
        const contentHTML = convertFromHTML(currentValue);
        const state = customContentStateConverter(
          ContentState.createFromBlockArray(
            contentHTML.contentBlocks,
            contentHTML.entityMap,
          ),
        );
        const HtmlValue = JSON.stringify(convertToRaw(state));
        setPreHtmlValue(HtmlValue);
      }
    }, [preHtmlValue]);

    let order = [
      { name: 'title', value: null },
      { name: 'bold', value: null },
      { name: 'italic', value: null },
      { name: 'underline', value: null },
      { name: 'strikethrough', value: null },
      { name: 'undo', value: null },
      { name: 'redo', value: null },
      { name: 'link', value: null },
      { name: 'numberList', value: null },
      { name: 'bulletList', value: null },
      { name: 'quote', value: null },
      { name: 'code', value: null },
      { name: 'media', value: null },
      { name: 'imgupload', value: null },
    ];

    order = order.map(element => {
      const find = Object.entries(options).find(e => e[0] === element.name);
      return { name: element.name, value: find[1] };
    });

    const tempFileUpload = e => {
      setUploads({
        ...uploads,
        files: e,
      });
    };

    useEffect(() => {
      if (isDev) {
        setCurrentValue(useText(defaultValue));
      }
    }, [isDev, defaultValue]);

    const [uploadFile] = useFileUpload({
      options: {
        variables: {
          fileList: Array.from(files),
          mimeType: acceptList,
        },
      },
    });

    function uploadImageToServer() {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(uploadFile());
        }, 2000);
      });
    }

    const uploadImage = file =>
      new Promise(async (resolve, reject) => {
        tempFileUpload(arFiles);
        const url = await uploadImageToServer(file);
        if (!url) {
          reject();
          return;
        }
        resolve({
          data: {
            url: url.data.uploadFiles[0].url,
            width: '',
            height: '',
            alignment: 'left',
            type: 'image',
          },
        });
      });

    useEffect(() => {
      if (files.length > 0) {
        uploadFile();
      }
    }, [files]);

    const UploadImagePopover = props => {
      const [state, setState] = useState({
        anchor: null,
        isCancelled: false,
      });
      const [data, setData] = useState({});

      useEffect(() => {
        setState({
          anchor: props.anchor,
          isCancelled: false,
        });
        setData({
          file: undefined,
        });
      }, [props]);

      return (
        <Popover
          anchorEl={state.anchor}
          open={state.anchor !== null}
          onExited={() => {
            props.onSubmit(data, !state.isCancelled);
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Grid container>
            <Grid item xs={10} className={classes.imgUploadRoot}>
              <TextField
                className={classes.imgUploadTextField}
                disabled
                value={data.file ? data.file.name : ''}
                placeholder="Click icon to attach image"
              />
            </Grid>
            <Grid item xs={2}>
              <label htmlFor="contained-button-file">
                <input
                  accept="image/*"
                  className={classes.imgUploadInput}
                  id="contained-button-file"
                  type="file"
                  onChange={event => {
                    setData({
                      ...data,
                      file: event.target.files[0],
                    });
                  }}
                />

                <IconButton
                  color="primary"
                  aria-label="upload image"
                  component="span"
                >
                  <AttachFileIcon />
                </IconButton>
              </label>
            </Grid>
            <Grid item container xs={12} justify="flex-end">
              <Button
                onClick={() => {
                  setState({
                    anchor: null,
                    isCancelled: true,
                  });
                }}
              >
                <CloseIcon />
              </Button>
              <Button
                onClick={() => {
                  setState({
                    anchor: null,
                    isCancelled: false,
                  });
                }}
              >
                <DoneIcon />
              </Button>
            </Grid>
          </Grid>
        </Popover>
      );
    };

    const onChange = event => {
      const options = {
        entityStyleFn: entity => {
          const entityType = entity.get('type').toLowerCase();
          if (entityType === 'image') {
            const data = entity.getData();
            return {
              element: 'img',
              attributes: {
                src: data.url,
                height: data.height,
                width: data.width,
              },
            };
          }
          return undefined;
        },
      };

      const htmlRaw = stateToHTML(event.getCurrentContent(), options);
      setHtmlContent(htmlRaw);
    };

    const ref = useRef(null);

    const handleFileUpload = file => {
      arFiles.push(file);
      ref.current.insertAtomicBlockAsync(
        'IMAGE',
        uploadImage(file),
        'Uploading now...',
      );
    };

    const editor = (
      <div className={classes.root}>
        <UploadImagePopover
          anchor={anchor}
          onSubmit={(data, insert) => {
            if (insert && data.file) {
              handleFileUpload(data.file);
            }
            setAnchor(null);
          }}
        />
        <div className={rootClasses()}>
          {!hideLabel && (
            <InputLabel
              classes={{
                root: isOutlined ? classes.label : classes.labelStandard,
              }}
            >
              <span>{labelText}</span>
            </InputLabel>
          )}

          <MUIRichTextEditor
            classes={editorClasses()}
            defaultValue={preHtmlValue}
            label={placeholderText}
            // inlineToolbar={true}
            ref={ref}
            onChange={onChange}
            readOnly={isDev}
            controls={
              (order.map(element =>
                element.value ? optionArray.push(element.name) : '',
              ),
              optionArray)
            }
            customControls={[
              {
                name: 'imgupload',
                icon: <Backup />,
                type: 'callback',
                onClick: (_editorState, _name, toggel) => {
                  setAnchor(toggel);
                },
              },
            ]}
            draftEditorProps={{
              handleDroppedFiles: (_selectionState, file) => {
                if (file.length && file[0].name !== undefined) {
                  handleFileUpload(file[0]);
                  return 'handled';
                }
                return 'not-handled';
              },
            }}
          />
        </div>
        <div>
          <input
            type="hidden"
            name={customModelAttributeName}
            value={isDev ? currentValue || '{{ hidden input }}' : htmlContent}
            required={required}
          />
        </div>
      </div>
    );

    return isDev ? <div className={classes.dev}>{editor}</div> : editor;
  })(),
  styles: B => theme => {
    const { Styling } = B;
    const style = new Styling(theme);
    const convertSizes = sizes =>
      sizes.map(size => style.getSpacing(size)).join(' ');
    return {
      border: {
        border: '1px solid yellow',
      },
      dev: {
        '& > *': {
          pointerEvents: 'none',
        },
      },
      imgUploadRoot: {
        padding: 10,
        maxWidth: 350,
      },
      imgUploadTextField: {
        width: '100%',
      },
      imgUploadInput: {
        display: 'none',
      },
      root: {
        padding: ({ options: { margin } }) => convertSizes(margin),
      },
      editorRoot: {
        height: 'auto',
        width: 'auto',
        border: '1px solid',
        borderRadius: 5,
        borderColor: ({ options: { borderColor } }) => [
          style.getColor(borderColor),
          '!important',
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
          '& .MuiInputLabel-root': {
            color: ({ options: { borderFocusColor } }) => [
              style.getColor(borderFocusColor),
              '!important',
            ],
          },
        },
      },
      editorRootStandard: {
        height: 'auto',
        width: 'auto',
        borderBottom: '1px solid',
        borderColor: ({ options: { borderColor } }) => [
          style.getColor(borderColor),
          '!important',
        ],
        '&:hover': {
          borderColor: ({ options: { borderHoverColor } }) => [
            style.getColor(borderHoverColor),
            '!important',
          ],
          '& #mui-rte-toolbar': {
            borderColor: ({ options: { borderHoverColor } }) => [
              style.getColor(borderHoverColor),
            ],
          },
        },
        '&:focus-within': {
          borderColor: ({ options: { borderFocusColor } }) => [
            style.getColor(borderFocusColor),
            '!important',
          ],
          '& #mui-rte-toolbar': {
            borderColor: ({ options: { borderFocusColor } }) => [
              style.getColor(borderFocusColor),
              '!important',
            ],
          },
          '& .MuiInputLabel-root': {
            color: ({ options: { borderFocusColor } }) => [
              style.getColor(borderFocusColor),
              '!important',
            ],
          },
        },
      },
      editorRootStandardBottom: {
        height: 'auto',
        width: 'auto',
        '&:hover': {
          '& #mui-rte-toolbar': {
            borderColor: ({ options: { borderHoverColor } }) => [
              style.getColor(borderHoverColor),
            ],
          },
        },
        '&:focus-within': {
          '& #mui-rte-toolbar': {
            borderColor: ({ options: { borderFocusColor } }) => [
              style.getColor(borderFocusColor),
              '!important',
            ],
          },
          '& .MuiInputLabel-root': {
            color: ({ options: { borderFocusColor } }) => [
              style.getColor(borderFocusColor),
              '!important',
            ],
          },
        },
      },
      editorRootFilled: {
        padding: '0px 12px',
        height: 'auto',
        width: 'auto',
        borderBottom: '1px solid',
        borderColor: ({ options: { borderColor } }) => [
          style.getColor(borderColor),
          '!important',
        ],
        '&:hover': {
          borderColor: ({ options: { borderHoverColor } }) => [
            style.getColor(borderHoverColor),
            '!important',
          ],
          '& #mui-rte-toolbar': {
            borderColor: ({ options: { borderHoverColor } }) => [
              style.getColor(borderHoverColor),
            ],
          },
        },
        '&:focus-within': {
          borderColor: ({ options: { borderFocusColor } }) => [
            style.getColor(borderFocusColor),
            '!important',
          ],
          '& #mui-rte-toolbar': {
            borderColor: ({ options: { borderFocusColor } }) => [
              style.getColor(borderFocusColor),
              '!important',
            ],
          },
          '& .MuiInputLabel-root': {
            color: ({ options: { borderFocusColor } }) => [
              style.getColor(borderFocusColor),
              '!important',
            ],
          },
        },
      },
      editorRootFilledBottom: {
        padding: '0px 12px',
        height: 'auto',
        width: 'auto',
        '&:hover': {
          '& #mui-rte-toolbar': {
            borderColor: ({ options: { borderHoverColor } }) => [
              style.getColor(borderHoverColor),
            ],
          },
        },
        '&:focus-within': {
          '& #mui-rte-toolbar': {
            borderColor: ({ options: { borderFocusColor } }) => [
              style.getColor(borderFocusColor),
              '!important',
            ],
          },
          '& .MuiInputLabel-root': {
            color: ({ options: { borderFocusColor } }) => [
              style.getColor(borderFocusColor),
              '!important',
            ],
          },
        },
      },
      muithemeRoot: {
        marginTop: -20,
      },
      muithemeContainer: {
        height: 'auto',
        width: 'auto',
      },
      muithemeContainerStandard: {
        paddingTop: 12,
      },
      muithemeContainerBottom: {
        display: 'flex',
        flexDirection: 'column-reverse',
      },
      muithemeEditor: {
        overflow: 'auto',
        minHeight: '100px',
        maxHeight: ({ options: { maxHeight } }) => maxHeight || 'auto',
        margin: '18.5px 14px !important',
      },
      muithemeEditorStandard: {
        overflow: 'auto',
        minHeight: '100px',
        maxHeight: ({ options: { maxHeight } }) => maxHeight || 'auto',
        margin: '18.5px 0px !important',
      },
      muithemeEditorStandardBottom: {
        overflow: 'auto',
        minHeight: '100px',
        maxHeight: ({ options: { maxHeight } }) => maxHeight || 'auto',
        margin: '0px 0px 18.5px !important',
      },
      muithemeEditorContainer: {
        width: 'auto !important',
        margin: '0px !important',
        padding: '0px !important',
      },
      muithemeToolbar: {
        borderBottom: '1px solid rgb(245, 245, 245)',
        width: 'auto',
        '& .MuiIconButton-root': {
          color: ({ options: { iconColor } }) => [style.getColor(iconColor)],
        },
        '& .Mui-disabled': {
          color: ({ options: { iconColor } }) => [
            style.getColor(iconColor),
            '!important',
          ],
          opacity: '0.26',
        },
        '& .MuiIconButton-colorPrimary': {
          color: ({ options: { optionSelected } }) => [
            style.getColor(optionSelected),
          ],
        },
      },
      muithemeToolbarStandard: {
        border: '1px solid',
        borderColor: ({ options: { borderColor } }) => [
          style.getColor(borderColor),
        ],
        width: 'auto',
        '& .MuiIconButton-root': {
          color: ({ options: { iconColor } }) => [style.getColor(iconColor)],
        },
        '& .Mui-disabled': {
          color: ({ options: { iconColor } }) => [
            style.getColor(iconColor),
            '!important',
          ],
          opacity: '0.26',
        },
        '& .MuiIconButton-colorPrimary': {
          color: ({ options: { optionSelected } }) => [
            style.getColor(optionSelected),
          ],
        },
      },
      muithemeToolbarHideLabel: {
        paddingTop: 12,
      },
      muithemeToolbarBottom: {
        borderTop: '1px solid rgb(245, 245, 245)',
        '& .MuiIconButton-root': {
          color: ({ options: { iconColor } }) => [style.getColor(iconColor)],
        },
        '& .Mui-disabled': {
          color: ({ options: { iconColor } }) => [
            style.getColor(iconColor),
            '!important',
          ],
          opacity: '0.26',
        },
        '& .MuiIconButton-colorPrimary': {
          color: ({ options: { optionSelected } }) => [
            style.getColor(optionSelected),
          ],
        },
      },
      muithemePlaceholder: {
        margin: '18.5px 14px !important',
      },
      muithemePlaceholderStandard: {
        margin: '18.5px 0px !important',
      },
      muithemePlaceholderBottom: {
        margin: '18.5px 14px !important',
        top: '0px',
      },
      muithemePlaceholderStandardBottom: {
        top: '0px',
      },
      muithemeAnchorlink: {
        color: '#333333 !important',
        textDecoration: 'underline',
      },
      label: {
        transform: 'translate(14px, -6px) scale(0.75)',
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
      labelStandard: {
        transform: 'scale(0.75)',
        paddingBottom: ' 15px !important',
      },
    };
  },
}))();
