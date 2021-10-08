(() => ({
  name: 'BottomNavigation',
  type: 'BODY_COMPONENT',
  allowedTypes: ['NAV_COMPONENT'],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const { BottomNavigation, BottomNavigationAction } = window.MaterialUI.Core;
    const { Icons } = window.MaterialUI;
    const { env, Children } = B;
    const { defaultValue } = options;
    const isDev = env === 'dev';
    const [value, setValue] = useState(parseInt(defaultValue - 1, 10) || 0);
    const [navData, setNavData] = useState({});

    const handleChange = (_, newValue) => {
      setValue(newValue);
    };

    const setSelectedNav = index => {
      setValue(index);
    };

    const bottomNavComponent = (
      <div className={[isDev ? classes.dev : '', classes.root].join(' ')}>
        <BottomNavigation
          showLabels={!(children.length > 3)}
          onChange={handleChange}
          value={value}
        >
          {React.Children.map(children, (child, index) => {
            const { options } = child.props;
            const {
              label = navData[`label${index}`] || [`Item`],
              icon = navData[`icon${index}`] || 'Add',
            } = isDev ? {} : options;
            return (
              <BottomNavigationAction
                icon={
                  icon !== 'None' ? React.createElement(Icons[icon]) : undefined
                }
                label={label}
              />
            );
          })}
        </BottomNavigation>
      </div>
    );

    const NavGroup = (
      <div>
        {bottomNavComponent}
        {React.Children.map(children, (child, index) => {
          const { options: childOptions = {} } = child.props || {};

          return (
            <Children
              index={index}
              value={value}
              navData={navData}
              setNavData={setNavData}
              setSelectedNav={setSelectedNav}
            >
              {React.cloneElement(child, { ...childOptions })}
            </Children>
          );
        })}
      </div>
    );

    return isDev ? <div className={classes.wrapper}>{NavGroup}</div> : NavGroup;
  })(),
  styles: B => t => {
    const { Styling } = B;
    const style = new Styling(t);
    return {
      wrapper: {
        height: ({ options: { height } }) => height,
        '& .MuiBottomNavigation-root > button': {
          pointerEvents: 'none',
        },
        position: 'fixed',
        bottom: '0px',
        right: '0px',
        left: '329px',
      },
      root: {
        position: 'fixed',
        bottom: '0px',
        width: '100%',
        zIndex: '1201 !important',
        '& .MuiBottomNavigation-root': {
          height: ({ options: { height } }) => height,
          backgroundColor: ({ options: { backgroundColor } }) => [
            style.getColor(backgroundColor),
            '!important',
          ],
          justifyContent: 'space-around',
          alignItems: 'center',
          '& .MuiBottomNavigationAction-root.Mui-selected': {
            color: ({ options: { activeColor } }) =>
              style.getColor(activeColor),
          },
        },
      },
      dev: {
        left: '329px',
        right: '0',
        width: 'auto',
      },
    };
  },
}))();
