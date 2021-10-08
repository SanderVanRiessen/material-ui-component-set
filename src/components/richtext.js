(() => ({
  name: 'Richtext',
  type: 'CONTENT_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const { content, linkType, linkTo, linkToExternal, useInnerHtml } = options;
    const { Link } = window.MaterialUI.Core;
    const { env, useText, Link: BLink } = B;
    const isEmpty = content.length === 0;
    const isDev = env === 'dev';
    const isPristine = isEmpty && isDev;

    const Tag = useInnerHtml
      ? 'div'
      : {
          Title1: 'h1',
          Title2: 'h2',
          Title3: 'h3',
          Title4: 'h4',
          Title5: 'h5',
          Title6: 'h6',
          Body1: 'p',
          Body2: 'p',
        }[options.type || 'Body1'];

    const parsedContent = useText(content);
    const hasLink = linkType === 'internal' && linkTo && linkTo.id !== '';
    const hasExternalLink =
      linkType === 'external' && linkToExternal && linkToExternal.id !== '';
    const linkToExternalText =
      (linkToExternal && useText(linkToExternal)) || '';
    let linkedContent = parsedContent;

    if (hasLink || hasExternalLink) {
      linkedContent = (
        <Link
          className={classes.link}
          href={hasExternalLink ? linkToExternalText : undefined}
          component={hasLink ? BLink : undefined}
          endpoint={hasLink ? linkTo : undefined}
        >
          {parsedContent}
        </Link>
      );
    }

    return useInnerHtml && !isDev ? (
      <Tag
        className={classes.content}
        dangerouslySetInnerHTML={{ __html: linkedContent }}
      />
    ) : (
      <Tag className={classes.content}>
        {!isEmpty && linkedContent}
        {isPristine && (
          <span className={classes.placeholder}>Empty content</span>
        )}
      </Tag>
    );
  })(),
  styles: B => t => {
    const { mediaMinWidth, Styling } = B;
    const style = new Styling(t);
    const getSpacing = (idx, device = 'Mobile') =>
      idx === '0' ? '0rem' : style.getSpacing(idx, device);

    const getPath = (path, data) =>
      path.reduce((acc, next) => {
        if (acc === undefined || acc[next] === undefined) {
          return undefined;
        }
        return acc[next];
      }, data);

    return {
      content: {
        display: 'block',
        marginTop: ({ options: { outerSpacing } }) =>
          getSpacing(outerSpacing[0]),
        marginRight: ({ options: { outerSpacing } }) =>
          getSpacing(outerSpacing[1]),
        marginBottom: ({ options: { outerSpacing } }) =>
          getSpacing(outerSpacing[2]),
        marginLeft: ({ options: { outerSpacing } }) =>
          getSpacing(outerSpacing[3]),
        textAlign: ({ options: { textAlignment } }) => textAlignment,
        padding: 0,
        whiteSpace: 'pre-wrap',
        color: ({ options: { textColor, type, styles } }) =>
          styles
            ? style.getColor(textColor)
            : getPath(['theme', 'typography', type, 'color'], style),
        fontFamily: ({ options: { type } }) => style.getFontFamily(type),
        fontSize: ({ options: { type } }) => style.getFontSize(type),
        fontWeight: ({ options: { fontWeight, type, styles } }) =>
          styles
            ? fontWeight
            : getPath(['theme', 'typography', type, 'fontWeight'], style),
        textTransform: ({ options: { type } }) => style.getTextTransform(type),
        letterSpacing: ({ options: { type } }) => style.getLetterSpacing(type),
        '& pre': {
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          fontFamily: 'Inconsolata, Menlo, Consolas, monospace',
          fontSize: 16,
          padding: 20,
        },
        '& blockquote': {
          borderLeft: '5px solid #eee',
          color: '#666',
          fontFamily: 'Hoefler Text, Georgia, serif',
          padding: '10px 20px',
          marginTop: 0,
          marginBottom: 0,
        },
        '& h1': {
          fontSize: style.getFontSize('Title1'),
          margin: 0,
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
        '& h2': {
          fontSize: style.getFontSize('Title2'),
          margin: 0,
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
        '& h3': {
          fontSize: style.getFontSize('Title3'),
          margin: 0,
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
        '& h4': {
          fontSize: style.getFontSize('Title4'),
          margin: 0,
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
        '& h5': {
          fontSize: style.getFontSize('Title5'),
          margin: 0,
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
        '& h6': {
          fontSize: style.getFontSize('Title6'),
          margin: 0,
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
        [`@media ${mediaMinWidth(600)}`]: {
          marginTop: ({ options: { outerSpacing } }) =>
            getSpacing(outerSpacing[0], 'Portrait'),
          marginRight: ({ options: { outerSpacing } }) =>
            getSpacing(outerSpacing[1], 'Portrait'),
          marginBottom: ({ options: { outerSpacing } }) =>
            getSpacing(outerSpacing[2], 'Portrait'),
          marginLeft: ({ options: { outerSpacing } }) =>
            getSpacing(outerSpacing[3], 'Portrait'),
          fontSize: ({ options: { type } }) =>
            style.getFontSize(type, 'Portrait'),
        },
        [`@media ${mediaMinWidth(960)}`]: {
          marginTop: ({ options: { outerSpacing } }) =>
            getSpacing(outerSpacing[0], 'Landscape'),
          marginRight: ({ options: { outerSpacing } }) =>
            getSpacing(outerSpacing[1], 'Landscape'),
          marginBottom: ({ options: { outerSpacing } }) =>
            getSpacing(outerSpacing[2], 'Landscape'),
          marginLeft: ({ options: { outerSpacing } }) =>
            getSpacing(outerSpacing[3], 'Landscape'),
          fontSize: ({ options: { type } }) =>
            style.getFontSize(type, 'Landscape'),
        },
        [`@media ${mediaMinWidth(1280)}`]: {
          marginTop: ({ options: { outerSpacing } }) =>
            getSpacing(outerSpacing[0], 'Desktop'),
          marginRight: ({ options: { outerSpacing } }) =>
            getSpacing(outerSpacing[1], 'Desktop'),
          marginBottom: ({ options: { outerSpacing } }) =>
            getSpacing(outerSpacing[2], 'Desktop'),
          marginLeft: ({ options: { outerSpacing } }) =>
            getSpacing(outerSpacing[3], 'Desktop'),
          fontSize: ({ options: { type } }) =>
            style.getFontSize(type, 'Desktop'),
        },
      },
      link: {
        textDecoration: ['none', '!important'],
        color: ['inherit', '!important'],
      },
      placeholder: {
        color: '#dadde4',
      },
    };
  },
}))();
