(() => ({
  name: 'BottomNavigationAction',
  type: 'NAV_COMPONENT',
  allowedTypes: [],
  orientation: 'VERTICAL',
  jsx: (() => {
    const { BottomNavigationAction } = window.MaterialUI.Core;

    const {
      label,
      icon,
      linkType,
      linkTo,
      linkToExternal,
      openLinkToExternal,
    } = options;
    const { env, Link: BLink, useText } = B;
    const isDev = env === 'dev';
    const hasLink = linkTo && linkTo.id !== '';
    const hasExternalLink = linkToExternal && linkToExternal.id !== '';
    const linkToExternalVariable =
      (linkToExternal && useText(linkToExternal)) || '';
    const { value, navData, setNavData, setSelectedNav, index } = parent;

    const doSetNav = () => {
      setSelectedNav(index);
    };

    B.defineFunction('SelectNav', doSetNav);

    const labelChanged = () => {
      const currentLabel = navData[`label${index}`]
        ? useText(navData[`label${index}`])
        : '';
      return currentLabel !== useText(label);
    };

    const iconChanged = () => navData[`icon${index}`] !== icon;

    const hasChange = () => labelChanged() || iconChanged();

    useEffect(() => {
      if (setNavData && hasChange()) {
        setNavData({
          ...navData,
          [`label${index}`]: label,
          [`icon${index}`]: icon,
        });
      }
    }, [index, setNavData, navData, label, icon]);

    const generalProps = {
      tabindex: isDev && -1,
      target:
        linkType === 'external' && hasExternalLink
          ? openLinkToExternal
          : undefined,
      href:
        linkType === 'external' && hasExternalLink
          ? linkToExternalVariable
          : undefined,
      component: linkType === 'internal' && hasLink ? BLink : undefined,
      endpoint: linkType === 'internal' && hasLink ? linkTo : undefined,
    };

    const BasicButtonComponent = (
      <BottomNavigationAction
        {...generalProps}
        // showLabel
        // icon={icon !== 'None' && React.createElement(Icons[icon])}
        // label={label}
        className={classes.bottomNavAction}
      />
    );

    console.log('VALUE: ', value);

    return isDev ? (
      <div className={classes.wrapper}>{BasicButtonComponent}</div>
    ) : (
      { BasicButtonComponent }
    );
  })(),
  styles: B => t => {
    const { Styling, env } = B;
    const isDev = env === 'dev';
    const style = new Styling(t);
    return {
      wrapper: {
        height: config => {
          const {
            options: { height },
            parent: { index, value },
          } = config;

          return index === value ? height : 0;
        },
        width: config => {
          const {
            options: { width },
            parent: { index, value },
          } = config;

          return index === value ? width : 0;
        },
      },
      root: {
        height: ({ options: { height } }) => (isDev ? '100%' : height),
        width: ({ options: { width } }) => (isDev ? '100%' : width),
      },
      bottomNavAction: {
        '& .MuiBottomNavigationAction-wrapper': {
          color: ({ options: { textColor } }) => style.getColor(textColor),
        },
      },
    };
  },
}))();
