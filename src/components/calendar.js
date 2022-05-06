(() => ({
  name: 'calendar',
  type: 'BODY_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const { env, useAllQuery, getProperty } = B;
    const isDev = env === 'dev';
    const { model, roomProperty, startProperty, endProperty } = options;
    const { name: calendarRoom } = getProperty(roomProperty) || {};
    const { name: calendarStart } = getProperty(startProperty) || {};
    const { name: calendarEnd } = getProperty(endProperty) || {};
    const [results, setResults] = useState([]);

    const { loading, error, data } =
      model &&
      useAllQuery(model, {
        take: 200,
        onCompleted(res) {
          const hasResult = res && res.result && res.result.length > 0;
          if (hasResult) {
            B.triggerEvent('onSuccess', res.results);
          } else {
            B.triggerEvent('onNoResults');
          }
        },
        onError(resp) {
          // if (!displayError) {
          B.triggerEvent('onError', resp);
          // }
        },
      });

    useEffect(() => {
      if (!isDev && data) {
        const newArray = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const dataObject of data.results) {
          let colorRoom;
          switch (dataObject[calendarRoom]) {
            case 'Auditorium':
              colorRoom = '#3759e3';
              break;
            case 'Bordeel':
              colorRoom = '#e50e4e';
              break;
            case 'Brink':
              colorRoom = '#38bde3';
              break;
            case 'Huiskamer':
              colorRoom = '#e06b13';
              break;
            case 'Kurk':
              colorRoom = '#e2389a';
              break;
            case 'Matrix':
              colorRoom = '#fac319';
              break;
            case 'Serverhok':
              colorRoom = '#414897';
              break;
            case 'Washok':
              colorRoom = '#39b6a6';
              break;
            default:
          }
          const Newobject = {
            title: dataObject[calendarRoom],
            start: dataObject[calendarStart],
            end: dataObject[calendarEnd],
            color: colorRoom,
          };
          newArray.push(Newobject);
        }
        setResults(newArray);
      }
    }, [data]);

    // const filterRoom = () => {
    //   console.log('hi');
    // };

    const headerToolbar = {
      left: 'timeGridWeek,timeGridDay',
      center: 'title',
      right: 'prev,today,next',
    };

    const footerToolbar = {
      content: '<div><p>Hallo</p></div>',
    };
    const PageBuilderHeaderToolbar = {
      left: '',
      center: 'title',
      right: '',
    };
    const slotLabelFormat = {
      hour: 'numeric',
      minute: '2-digit',
      omitZeroMinute: false,
      meridiem: false,
      hour12: false,
    };
    const today = new Date().toISOString().slice(0, 10);
    // const validRange = {
    //   start: today,
    // };

    const newDate = new Date();
    let date = newDate.getDate('DD');
    if (date < 10) {
      date = `0${date}`;
    }
    let month = (newDate.getMonth('MM') + 1).toString();
    if (month < 10) {
      month = `0${month}`;
    }
    // const year = newDate.getFullYear().toString();
    // const today = `${year}-${month}-${date}`;
    // const selectAllow = (selectInfo) => {
    //   const moment = today;
    //   return moment().diff(selectInfo.start) <= 0;
    // };

    const eventClick = (info) => {
      alert('Event :', info.event.title);
    };
    const selectConstraint = {
      start: today,
      // end: '2022-04-15',
    };

    console.log(results);
    console.log(today);
    return isDev ? (
      <div className={classes.root}>
        <>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView="timeGridWeek"
            contentHeight="auto"
            headerToolbar={PageBuilderHeaderToolbar}
            weekends={false}
            allDaySlot={false}
            slotMinTime="07:00:00"
            slotMaxTime="21:00:00"
            slotLabelFormat={slotLabelFormat}
          />
        </>
      </div>
    ) : (
      <div className={classes.root}>
        <div className="top-header">
          <select
            onChange="filterRoom(value)"
            className="fc-button selectroom"
            id="room"
            name="room"
          >
            <option selected="">-- Select room --</option>
            <option value="Auditorium">Auditorium</option>
            <option value="Bordeel">Bordeel (cap. 8)</option>
            <option value="Brink">Brink (cap. 8)</option>
            <option value="Huiskamer">Huiskamer (cap. 4)</option>
            <option value="Kurk">Kurk</option>
            <option value="Matrix">Matrix (cap. 8)</option>
            <option value="Serverhok">Serverhok (cap. 8)</option>
            <option value="Washok">Washok (cap. 8)</option>
          </select>

          <div className="switch-container">
            <div className="switch-grp">
              <p className="switch-label">Only show my meetings</p>
              <p className="switch">
                <input type="checkbox" data-my-switch />
                <span className="slider round" />
              </p>
            </div>
          </div>
        </div>

        <>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
            initialView="timeGridWeek"
            contentHeight="auto"
            allDaySlot={false}
            slotMinTime="07:00:00"
            slotMaxTime="21:00:00"
            slotLabelFormat={slotLabelFormat}
            // slotDuration="00:15:00"
            // slotLabelInterval="00:60:00"
            weekends={false}
            nowIndicator
            headerToolbar={headerToolbar}
            footerToolbar={footerToolbar}
            // validRange={validRange}
            selectable
            select={handleDateClick}
            events={results}
            // selectAllow={selectAllow}
            eventClick={eventClick}
            selectConstraint={selectConstraint}
          />
        </>
        <div className="legend">
          <div className="legendbox">
            <div className="legenditem">
              <div
                className="colorBlock"
                style={{ backgroundColor: '#3759e3' }}
              />
              <p>Auditorium</p>
            </div>
          </div>
          <div className="legendbox">
            <div className="legenditem">
              <div
                className="colorBlock"
                style={{ backgroundColor: '#e50e4e' }}
              />
              <p>Bordeel</p>
            </div>
          </div>
          <div className="legendbox">
            <div className="legenditem">
              <div
                className="colorBlock"
                style={{ backgroundColor: '#38bde3' }}
              />
              <p>Brink</p>
            </div>
          </div>
          <div className="legendbox">
            <div className="legenditem">
              <div
                className="colorBlock"
                style={{ backgroundColor: '#e06b13' }}
              />
              <p>Huiskamer</p>
            </div>
          </div>
          <div className="legendbox">
            <div className="legenditem">
              <div
                className="colorBlock"
                style={{ backgroundColor: '#e2389a' }}
              />
              <p>Kurk</p>
            </div>
          </div>
          <div className="legendbox">
            <div className="legenditem">
              <div
                className="colorBlock"
                style={{ backgroundColor: '#fac319' }}
              />
              <p>Matrix</p>
            </div>
          </div>
          <div className="legendbox">
            <div className="legenditem">
              <div
                className="colorBlock"
                style={{ backgroundColor: '#414897' }}
              />
              <p>Serverhok</p>
            </div>
          </div>
          <div className="legendbox">
            <div className="legenditem">
              <div
                className="colorBlock"
                style={{ backgroundColor: '#39b6a6' }}
              />
              <p>Washok</p>
            </div>
          </div>
        </div>
      </div>
    );
  })(),
  styles: () => () => {
    return {
      root: {
        '& element': {
          '& .style': {
            cursor: 'pointer',
          },
        },
        '& td': {
          '& .fc-day-past': {
            backgroundColor: '#f2f2f2',
          },
        },
        '& .fc-event-past': {
          filter: 'brightness(50%)',
        },
        '& h2': {
          fontFamily: 'Merriweather, serif',
        },
        '& .colorBlock': {
          flexShrink: 0,
          marginRight: '10px',
          height: '15px',
          width: '15px',
          borderRadius: '3px',
        },
        '& .legendbox': {
          width: '20%',
          float: 'left',
          paddingLeft: '2.5%',
          paddingRight: '2.5%',
        },
        '& .legenditem': {
          margin: '5px, 0px, 5px, 0px',
          display: 'flex',
          alignItems: 'center',
        },
        '& .fc-button': {
          display: 'inline-block',
          minHeight: '36px',
          minWidth: '88px',
          lineHeight: '36px',
          verticalAlign: 'middle',
          alignItems: 'center',
          textAlign: 'center',
          borderRadius: '2px',
          userSelect: 'none',
          outline: 'none',
          border: '0',
          letterSpacing: '.01em',
          background: 'transparent',
          color: 'currentColor',
          fontWeight: '500',
          fontStyle: 'inherit',
          fontVariant: 'inherit',
          fontFamily: 'inherit',
          textDecoration: 'none',
          overflow: 'hidden',
        },
        '& .top-header': {
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
        },
        '& .selectroom': {
          cursor: 'pointer',
        },
        '& .switch-container': {
          display: 'flex',
          alignItems: 'center',
        },
        '& .switch-grp': {},
        '& .fc-timegrid-event-harness': {
          cursor: 'pointer',
        },
      },
    };
  },
}))();
