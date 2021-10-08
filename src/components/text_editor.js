(() => ({
  name: 'TextEditor',
  type: 'BODY_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const {
      customModelAttribute: customModelAttributeObj,
      placeholder,
      image,
    } = options;
    const { env, getCustomModelAttribute, useText } = B;
    const isDev = env === 'dev';
    const {
      Editor,
      EditorState,
      RichUtils,
      convertFromHTML,
      ContentState,
      CompositeDecorator,
      AtomicBlockUtils,
      KeyBindingUtil,
    } = window.Draft;
    const {
      FormatBold,
      FormatUnderlined,
      FormatItalic,
      StrikethroughS,
      FormatListBulleted,
      FormatListNumbered,
      FormatQuote,
      Code,
      Title,
      Image: ImageIcon,
      Done: DoneIcon,
      Close: CloseIcon,
      Link: LinkIcon,
    } = window.MaterialUI.Icons;
    const {
      InputLabel,
      Menu,
      Button,
      TextField,
      Grid,
      Popover,
      InputAdornment,
    } = window.MaterialUI.Core;
    const { stateToHTML } = window.ExportHtml;

    const {
      id: customModelAttributeId,
      label = [],
      value: defaultValue = [],
    } = customModelAttributeObj;
    const labelText = useText(label);
    const customModelAttribute = getCustomModelAttribute(
      customModelAttributeId,
    );
    const currentValue = useText(defaultValue);
    const placeholderText = useText(placeholder);
    const { name: customModelAttributeName, validations: { required } = {} } =
      customModelAttribute || {};

    function findLinkEntities(contentBlock, callback, contentState) {
      contentBlock.findEntityRanges(character => {
        const entityKey = character.getEntity();
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === 'LINK'
        );
      }, callback);
    }

    const Link = props => {
      const { contentState, entityKey, children } = props;
      const { url } = contentState.getEntity(entityKey).getData();
      return <a href={url}>{children}</a>;
    };

    function findImageEntities(contentBlock, callback, contentState) {
      contentBlock.findEntityRanges(character => {
        const entityKey = character.getEntity();
        return (
          entityKey !== null &&
          contentState.getEntity(entityKey).getType() === 'IMAGE'
        );
      }, callback);
    }

    const Image = props => {
      const { contentState, entityKey } = props;
      const { url, width, height } = contentState
        .getEntity(entityKey)
        .getData();
      return <img alt="" src={url} width={width} height={height} />;
    };

    const decorator = new CompositeDecorator([
      {
        strategy: findLinkEntities,
        component: Link,
      },
      {
        strategy: findImageEntities,
        component: Image,
      },
    ]);

    function RichEditorExample() {
      const [editorState, setEditorState] = React.useState(() =>
        EditorState.createEmpty(),
      );
      const [htmlContent, setHtmlContent] = useState(null);

      const handleOnBlur = () => {
        const contentstate = editorState.getCurrentContent();
        const options = {
          entityStyleFn: entity => {
            const entityType = entity.get('type').toLowerCase();
            if (entityType === 'Link') {
              const data = entity.getData();
              return {
                element: 'a',
                attributes: {
                  href: data.url,
                },
              };
            }
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
        const html = stateToHTML(contentstate, options);
        const strip = html.replace(/[\r\n]+/gm, '');
        setHtmlContent(strip);
      };

      useEffect(() => {
        handleOnBlur();
      }, [editorState]);

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
        const contentHTML = convertFromHTML(currentValue);
        const state = customContentStateConverter(
          ContentState.createFromBlockArray(contentHTML),
        );
        const HtmlValue = EditorState.createWithContent(state, decorator);
        setEditorState(HtmlValue);
      }, []);

      B.defineFunction('Clear', () =>
        setEditorState(EditorState.createEmpty()),
      );

      const handleKeyCommand = command => {
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
          setEditorState(newState);
          return true;
        }
        return false;
      };
      const handleReturn = event => {
        if (KeyBindingUtil.isSoftNewlineEvent(event)) {
          setEditorState(RichUtils.insertSoftNewline(editorState));
          return true;
        }

        return false;
      };
      const onTab = e => {
        const maxDepth = 4;
        const nextState = RichUtils.onTab(e, editorState, maxDepth);
        setEditorState(nextState);
      };
      const toggleBlockType = type => {
        const nextState = RichUtils.toggleBlockType(editorState, type);
        setEditorState(nextState);
      };
      const toggleInlineStyle = style => {
        const nextState = RichUtils.toggleInlineStyle(editorState, style);
        setEditorState(nextState);
      };

      const styleMap = {
        CODE: {
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
          fontSize: 16,
          padding: 2,
        },
        STRIKETHROUGH: {
          textDecoration: 'line-through',
        },
      };

      function getBlockStyle(block) {
        switch (block.getType()) {
          case 'blockquote':
            return 'RichEditor-blockquote';
          case 'unstyled':
            return classes.RichEditorP;
          default:
            return null;
        }
      }

      const StyleButton = props => {
        const { active, label: buttonLabel } = props;
        const onToggle = e => {
          e.preventDefault();
          props.onToggle(props.style);
        };

        let buttonClass = `${classes.RichEditorStyleButton}`;
        if (active) {
          buttonClass += `${classes.RichEditorActiveButton}`;
        }

        return (
          <span
            className={buttonClass}
            onMouseDown={onToggle}
            tabIndex="0"
            role="button"
          >
            {buttonLabel}
          </span>
        );
      };

      const TITLE_TYPES = [
        { label: 'H1', style: 'header-one' },
        { label: 'H2', style: 'header-two' },
        { label: 'H3', style: 'header-three' },
        { label: 'H4', style: 'header-four' },
        { label: 'H5', style: 'header-five' },
        { label: 'H6', style: 'header-six' },
      ];

      const TitleControls = props => {
        const { editorState: state } = props;
        const selection = state.getSelection();
        const blockType = state
          .getCurrentContent()
          .getBlockForKey(selection.getStartKey())
          .getType();
        const [anchorEl, setAnchorEl] = React.useState(null);

        const handleClick = event => {
          setAnchorEl(event.currentTarget);
        };

        const handleClose = () => {
          setAnchorEl(null);
        };

        return (
          <div className={classes.RichEditorControls}>
            <span
              className={classes.RichEditorStyleButton}
              onMouseDown={handleClick}
              tabIndex="0"
              role="button"
            >
              <Title />
            </span>
            <Menu
              className={classes.TitleMenu}
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {TITLE_TYPES.map(type => (
                <StyleButton
                  key={type.label}
                  active={type.style === blockType}
                  label={type.label}
                  onToggle={props.onToggle}
                  style={type.style}
                  onClick={handleClose}
                />
              ))}
            </Menu>
          </div>
        );
      };

      let BLOCK_TYPES = [
        {
          name: 'quote',
          value: null,
          label: <FormatQuote />,
          style: 'blockquote',
        },
        {
          name: 'bulletList',
          value: null,
          label: <FormatListBulleted />,
          style: 'unordered-list-item',
        },
        {
          name: 'numberList',
          value: null,
          label: <FormatListNumbered />,
          style: 'ordered-list-item',
        },
        {
          name: 'code',
          value: null,
          label: <Code />,
          style: 'code-block',
        },
      ];
      BLOCK_TYPES = BLOCK_TYPES.map(element => {
        const find = Object.entries(options).find(e => e[0] === element.name);
        return {
          name: element.name,
          value: find[1],
          label: element.label,
          style: element.style,
        };
      });

      const BlockStyleControls = props => {
        const { editorState: state } = props;
        const selection = state.getSelection();
        const blockType = state
          .getCurrentContent()
          .getBlockForKey(selection.getStartKey())
          .getType();

        return (
          <div className={classes.RichEditorControls}>
            {BLOCK_TYPES.filter(e => e.value === true).map(type => (
              <StyleButton
                key={type.label}
                active={type.style === blockType}
                label={type.label}
                onToggle={props.onToggle}
                style={type.style}
              />
            ))}
          </div>
        );
      };

      let INLINE_STYLES = [
        { name: 'bold', value: null, label: <FormatBold />, style: 'BOLD' },
        {
          name: 'italic',
          value: null,
          label: <FormatItalic />,
          style: 'ITALIC',
        },
        {
          name: 'underline',
          value: null,
          label: <FormatUnderlined />,
          style: 'UNDERLINE',
        },
        {
          name: 'strikethrough',
          value: null,
          label: <StrikethroughS />,
          style: 'STRIKETHROUGH',
        },
      ];
      INLINE_STYLES = INLINE_STYLES.map(element => {
        const find = Object.entries(options).find(e => e[0] === element.name);
        return {
          name: element.name,
          value: find[1],
          label: element.label,
          style: element.style,
        };
      });

      const InlineStyleControls = props => {
        const { onToggle } = props;
        const currentStyle = editorState.getCurrentInlineStyle();
        return (
          <div className={classes.RichEditorControls}>
            {INLINE_STYLES.filter(e => e.value === true).map(type => (
              <StyleButton
                key={type.label}
                active={currentStyle.has(type.style)}
                label={type.label}
                onToggle={onToggle}
                style={type.style}
              />
            ))}
          </div>
        );
      };

      const LinkControl = () => {
        const [anchorEl, setAnchorEl] = useState(null);
        let buttonClass = `${classes.RichEditorStyleButton}`;
        const selection = editorState.getSelection();
        if (!selection.isCollapsed()) {
          const contentState = editorState.getCurrentContent();
          const startKey = editorState.getSelection().getStartKey();
          const startOffset = editorState.getSelection().getStartOffset();
          const blockWithLinkAtBeginning = contentState.getBlockForKey(
            startKey,
          );
          const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);
          if (linkKey) {
            buttonClass += `${classes.RichEditorActiveButton}`;
          }
        }

        const [urlInput, setUrlInput] = useState({
          showURLInput: false,
          urlValue: '',
        });
        const onURLChange = e => setUrlInput({ urlValue: e.target.value });

        const promptForLink = e => {
          e.preventDefault();
          if (!selection.isCollapsed()) {
            const contentState = editorState.getCurrentContent();
            const startKey = editorState.getSelection().getStartKey();
            const startOffset = editorState.getSelection().getStartOffset();
            const blockWithLinkAtBeginning = contentState.getBlockForKey(
              startKey,
            );
            const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);
            let url = '';
            if (linkKey) {
              const linkInstance = contentState.getEntity(linkKey);
              const urldata = linkInstance.getData().url;
              url = urldata;
            }
            setUrlInput({
              showURLInput: true,
              urlValue: url,
            });
            setAnchorEl(e.currentTarget);
          }
        };
        const confirmLink = e => {
          e.preventDefault();
          const { urlValue } = urlInput;
          const contentState = editorState.getCurrentContent();

          const contentStateWithEntity = contentState.createEntity(
            'LINK',
            'MUTABLE',
            { url: urlValue },
          );
          const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

          let nextEditorState = EditorState.set(editorState, {
            currentContent: contentStateWithEntity,
            decorator,
          });

          nextEditorState = RichUtils.toggleLink(
            nextEditorState,
            nextEditorState.getSelection(),
            entityKey,
          );

          setEditorState(nextEditorState);
          setUrlInput({
            showURLInput: false,
            urlValue: '',
          });
          editorState.current.blur();
        };

        const removeLink = e => {
          e.preventDefault();
          if (!selection.isCollapsed()) {
            setEditorState(RichUtils.toggleLink(editorState, selection, null));
          }
        };

        const handleClose = () => {
          setAnchorEl(null);
        };

        const open = Boolean(anchorEl);
        return (
          <div>
            <span
              className={buttonClass}
              onMouseDown={promptForLink}
              tabIndex="0"
              role="button"
            >
              <LinkIcon />
            </span>
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              classes={{ paper: classes.PaperPropsLinkControl }}
            >
              <InputLabel className={classes.LabelControl}>
                Url input:
              </InputLabel>
              <Grid container spacing={2}>
                <Grid container item xs={12} justify="center">
                  <TextField
                    classes={{ root: classes.urlInputRoot }}
                    onChange={onURLChange}
                    type="text"
                    defaultValue={urlInput.urlValue}
                  />
                </Grid>
                <Grid container item xs={12} justify="flex-end">
                  <Button onClick={removeLink}>
                    <CloseIcon />
                  </Button>
                  <Button onClick={confirmLink}>
                    <DoneIcon />
                  </Button>
                </Grid>
              </Grid>
            </Popover>
          </div>
        );
      };
      const ImgControl = () => {
        const [anchorEl, setAnchorEl] = useState(null);
        let buttonClass = `${classes.RichEditorStyleButton}`;
        const selection = editorState.getSelection();
        if (!selection.isCollapsed()) {
          const contentState = editorState.getCurrentContent();
          const startKey = editorState.getSelection().getStartKey();
          const startOffset = editorState.getSelection().getStartOffset();
          const blockWithLinkAtBeginning = contentState.getBlockForKey(
            startKey,
          );
          const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);
          if (linkKey) {
            buttonClass += `${classes.RichEditorActiveButton}`;
          }
        }

        const [imgInput, setImgInput] = useState({
          showIMGInput: false,
          urlValue: '',
          widthValue: 'auto',
          heightValue: 'auto',
        });
        const onURLChange = e =>
          setImgInput({ ...imgInput, urlValue: e.target.value });
        const onWIDTHChange = e =>
          setImgInput({ ...imgInput, widthValue: e.target.value });
        const onHEIGHTChange = e =>
          setImgInput({ ...imgInput, heightValue: e.target.value });

        const promptForLink = e => {
          e.preventDefault();
          const contentState = editorState.getCurrentContent();
          const startKey = editorState.getSelection().getStartKey();
          const startOffset = editorState.getSelection().getStartOffset();
          const blockWithLinkAtBeginning = contentState.getBlockForKey(
            startKey,
          );
          const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);
          let url = '';
          let width = 'auto';
          let height = 'auto';
          if (linkKey) {
            const linkInstance = contentState.getEntity(linkKey);
            const urldata = linkInstance.getData().url;
            const widthdata = linkInstance.getData().width;
            const heightdata = linkInstance.getData().height;
            url = urldata;
            width = widthdata;
            height = heightdata;
          }
          setImgInput({
            showIMGInput: true,
            urlValue: url,
            widthValue: width,
            heightValue: height,
          });
          setAnchorEl(e.currentTarget);
        };
        const confirmLink = e => {
          e.preventDefault();
          const { urlValue, widthValue, heightValue } = imgInput;
          const contentState = editorState.getCurrentContent();

          const contentStateWithEntity = contentState.createEntity(
            'IMAGE',
            'MUTABLE',
            { url: urlValue, width: widthValue, height: heightValue },
          );
          const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

          const nextEditorState = EditorState.set(editorState, {
            currentContent: contentStateWithEntity,
            decorator,
          });

          setEditorState(
            AtomicBlockUtils.insertAtomicBlock(nextEditorState, entityKey, ' '),
          );

          setImgInput({
            showIMGInput: false,
            urlValue: '',
          });
        };

        const removeLink = e => {
          e.preventDefault();
          if (!selection.isCollapsed()) {
            setEditorState(RichUtils.toggleLink(editorState, selection, null));
          }
        };

        const handleClose = () => {
          setAnchorEl(null);
        };

        const open = Boolean(anchorEl);
        return (
          <div>
            <span
              className={buttonClass}
              onMouseDown={promptForLink}
              tabIndex="0"
              role="button"
            >
              <ImageIcon />
            </span>
            <Popover
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              classes={{ paper: classes.PaperPropsImageControl }}
            >
              <InputLabel className={classes.LabelControl}>
                Image input:
              </InputLabel>
              <Grid container spacing={2}>
                <Grid container item xs={12} justify="center">
                  <TextField
                    onChange={onURLChange}
                    type="text"
                    placeholder="Link"
                    defaultValue={imgInput.urlValue}
                    className={classes.ImageUrlInput}
                  />
                </Grid>
                <Grid container item xs={6} justify="center">
                  <TextField
                    onChange={onWIDTHChange}
                    type="text"
                    defaultValue={imgInput.widthValue}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">px</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid container item xs={6} justify="center">
                  <TextField
                    onChange={onHEIGHTChange}
                    type="text"
                    defaultValue={imgInput.heightValue}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">px</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item container xs={12} justify="flex-end">
                  <Button onClick={removeLink}>
                    <CloseIcon />
                  </Button>
                  <Button onClick={confirmLink}>
                    <DoneIcon />
                  </Button>
                </Grid>
              </Grid>
            </Popover>
          </div>
        );
      };

      return (
        <div className={classes.root}>
          <div className={classes.RichEditorRoot}>
            <InputLabel classes={{ root: classes.label }}>
              <span>{labelText}</span>
            </InputLabel>
            <span className={classes.toolbar}>
              <TitleControls
                editorState={editorState}
                onToggle={toggleBlockType}
              />
              <InlineStyleControls
                editorState={editorState}
                onToggle={toggleInlineStyle}
              />
              <BlockStyleControls
                editorState={editorState}
                onToggle={toggleBlockType}
              />
              <LinkControl />
              {image ? <ImgControl /> : null}
            </span>
            <div className={classes.RichEditor}>
              <Editor
                blockStyleFn={getBlockStyle}
                customStyleMap={styleMap}
                editorState={editorState}
                handleKeyCommand={handleKeyCommand}
                onChange={setEditorState}
                onTab={onTab}
                placeholder={placeholderText}
                ref={editorState}
                handleReturn={handleReturn}
              />
            </div>
            <div>
              <input
                type="hidden"
                name={customModelAttributeName}
                value={htmlContent}
                required={required}
              />
            </div>
          </div>
        </div>
      );
    }

    return isDev ? (
      <div className={classes.dev}>
        <RichEditorExample />
      </div>
    ) : (
      <RichEditorExample />
    );
  })(),
  styles: B => theme => {
    const { mediaMinWidth, Styling } = B;
    const style = new Styling(theme);
    const convertSizes = sizes =>
      sizes.map(size => style.getSpacing(size)).join(' ');
    return {
      root: {
        padding: ({ options: { margin } }) => convertSizes(margin),
      },
      dev: {
        '& > *': {
          pointerEvents: 'none',
        },
      },
      RichEditorRoot: {
        border: '1px solid',
        borderRadius: '5px',
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
          '& .public-DraftEditorPlaceholder-root': {
            display: 'none',
          },
        },
      },
      RichEditor: {
        borderTop: '1px solid rgb(245, 245, 245)',
        cursor: 'text',
        padding: 15,
        '& .DraftEditor-root .DraftEditor-editorContainer .public-DraftEditor-content': {
          overflow: 'auto',
          minHeight: 100,
          maxHeight: ({ options: { maxHeight } }) => maxHeight || 'auto',
        },
        '& .DraftEditor-root .public-DraftEditorPlaceholder-root': {
          position: 'absolute',
        },
        '& .DraftEditor-root .DraftEditor-editorContainer .public-DraftEditor-content .public-DraftStyleDefault-pre': {
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          fontFamily: 'Inconsolata, Menlo, Consolas, monospace',
          fontSize: 16,
          padding: 20,
        },
        '& .DraftEditor-root .DraftEditor-editorContainer .public-DraftEditor-content .RichEditor-blockquote': {
          borderLeft: '5px solid #eee',
          color: '#666',
          fontFamily: 'Hoefler Text, Georgia, serif',
          padding: '10px 20px',
          marginTop: 0,
          marginBottom: 0,
        },
        '& .DraftEditor-root .DraftEditor-editorContainer .public-DraftEditor-content h1': {
          margin: 0,
          fontSize: style.getFontSize('Title1'),
          [`@media ${mediaMinWidth(600)}`]: {
            fontSize: style.getFontSize('Title1', 'Portrait'),
          },
          [`@media ${mediaMinWidth(960)}`]: {
            fontSize: style.getFontSize('Title1', 'Landscape'),
          },
          [`@media ${mediaMinWidth(1280)}`]: {
            fontSize: style.getFontSize('Title1', 'Desktop'),
          },
          fontFamily: style.getFontFamily('Title1'),
          textTransform: style.getTextTransform('Title1'),
          letterSpacing: style.getLetterSpacing('Title1'),
          fontWeight: style.getFontWeight('Title1'),
        },
        '& .DraftEditor-root .DraftEditor-editorContainer .public-DraftEditor-content h2': {
          margin: 0,
          fontSize: style.getFontSize('Title2'),
          [`@media ${mediaMinWidth(600)}`]: {
            fontSize: style.getFontSize('Title2', 'Portrait'),
          },
          [`@media ${mediaMinWidth(960)}`]: {
            fontSize: style.getFontSize('Title2', 'Landscape'),
          },
          [`@media ${mediaMinWidth(1280)}`]: {
            fontSize: style.getFontSize('Title2', 'Desktop'),
          },
          fontFamily: style.getFontFamily('Title2'),
          textTransform: style.getTextTransform('Title2'),
          letterSpacing: style.getLetterSpacing('Title2'),
          fontWeight: style.getFontWeight('Title2'),
        },
        '& .DraftEditor-root .DraftEditor-editorContainer .public-DraftEditor-content h3': {
          margin: 0,
          fontSize: style.getFontSize('Title3'),
          [`@media ${mediaMinWidth(600)}`]: {
            fontSize: style.getFontSize('Title3', 'Portrait'),
          },
          [`@media ${mediaMinWidth(960)}`]: {
            fontSize: style.getFontSize('Title3', 'Landscape'),
          },
          [`@media ${mediaMinWidth(1280)}`]: {
            fontSize: style.getFontSize('Title3', 'Desktop'),
          },
          fontFamily: style.getFontFamily('Title3'),
          textTransform: style.getTextTransform('Title3'),
          letterSpacing: style.getLetterSpacing('Title3'),
          fontWeight: style.getFontWeight('Title3'),
        },
        '& .DraftEditor-root .DraftEditor-editorContainer .public-DraftEditor-content h4': {
          margin: 0,
          fontSize: style.getFontSize('Title4'),
          [`@media ${mediaMinWidth(600)}`]: {
            fontSize: style.getFontSize('Title4', 'Portrait'),
          },
          [`@media ${mediaMinWidth(960)}`]: {
            fontSize: style.getFontSize('Title4', 'Landscape'),
          },
          [`@media ${mediaMinWidth(1280)}`]: {
            fontSize: style.getFontSize('Title4', 'Desktop'),
          },
          fontFamily: style.getFontFamily('Title4'),
          textTransform: style.getTextTransform('Title4'),
          letterSpacing: style.getLetterSpacing('Title4'),
          fontWeight: style.getFontWeight('Title4'),
        },
        '& .DraftEditor-root .DraftEditor-editorContainer .public-DraftEditor-content h5': {
          margin: 0,
          fontSize: style.getFontSize('Title5'),
          [`@media ${mediaMinWidth(600)}`]: {
            fontSize: style.getFontSize('Title5', 'Portrait'),
          },
          [`@media ${mediaMinWidth(960)}`]: {
            fontSize: style.getFontSize('Title5', 'Landscape'),
          },
          [`@media ${mediaMinWidth(1280)}`]: {
            fontSize: style.getFontSize('Title5', 'Desktop'),
          },
          fontFamily: style.getFontFamily('Title5'),
          textTransform: style.getTextTransform('Title5'),
          letterSpacing: style.getLetterSpacing('Title5'),
          fontWeight: style.getFontWeight('Title5'),
        },
        '& .DraftEditor-root .DraftEditor-editorContainer .public-DraftEditor-content h6': {
          margin: 0,
          fontSize: style.getFontSize('Title6'),
          [`@media ${mediaMinWidth(600)}`]: {
            fontSize: style.getFontSize('Title6', 'Portrait'),
          },
          [`@media ${mediaMinWidth(960)}`]: {
            fontSize: style.getFontSize('Title6', 'Landscape'),
          },
          [`@media ${mediaMinWidth(1280)}`]: {
            fontSize: style.getFontSize('Title6', 'Desktop'),
          },
          fontFamily: style.getFontFamily('Title6'),
          textTransform: style.getTextTransform('Title6'),
          letterSpacing: style.getLetterSpacing('Title6'),
          fontWeight: style.getFontWeight('Title6'),
        },
      },
      RichEditorControls: {
        userSelect: 'none',
      },
      RichEditorStyleButton: {
        color: ({ options: { iconColor } }) => [style.getColor(iconColor)],
        cursor: 'pointer',
        marginRight: 16,
        padding: '2px 0px',
        display: 'inline-block',
      },
      RichEditorActiveButton: {
        color: ({ options: { optionSelected } }) => [
          style.getColor(optionSelected),
        ],
      },
      toolbar: {
        display: 'flex',
        margin: '0 0 5px 5px',
      },
      label: {
        transform: 'translate(9px, -6px) scale(0.75)',
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
      TitleMenu: {
        inset: '40px 0px !important',
        '& .MuiList-padding': {
          paddingLeft: 8,
        },
      },
      PaperPropsLinkControl: {
        width: 200,
        padding: '18.5px 18.5px 15px',
      },
      PaperPropsImageControl: {
        width: 250,
        padding: '18.5px 18.5px 15px 18.5px',
      },
      LabelControl: {
        fontSize: '0.9rem !important',
      },
      ImageUrlInput: {
        width: '100%',
      },
      urlInputRoot: {
        width: '100%',
      },
      RichEditorP: {
        marginBottom: 16,
      },
    };
  },
}))();
