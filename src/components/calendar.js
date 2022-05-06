(() => ({
  name: 'calendar',
  type: 'BODY_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const { env, useAllQuery, getProperty } = B;
    const { FullCalendar, dayGridPlugin, interactionPlugin, timeGridPlugin } =
      window.MaterialUI;
    const isDev = env === 'dev';
    const { model, roomProperty, startProperty, endProperty } = options;
    const { name: calendarRoom } = getProperty(roomProperty) || {};
    const { name: calendarStart } = getProperty(startProperty) || {};
    const { name: calendarEnd } = getProperty(endProperty) || {};
    const [results, setResults] = useState([]);

    const calendarRef = React.useRef();

    const currentWeekFilter = () => {
      const curr = new Date();
      curr.setHours(0, 0, 0, 0);

      const first = curr.getDate() - curr.getDay() + 1;
      const last = first + 4;

      const firstDay = new Date(curr.setDate(first));
      const lastDay = new Date(curr.setDate(last));
      lastDay.setHours(23, 59, 59, 59);

      const startTime = {};
      startTime[calendarStart] = { gteq: firstDay };

      const endTime = {};
      endTime[calendarEnd] = { lteq: lastDay };
      return {
        ...startTime,
        ...endTime,
      };
    };

    const currentWeek = currentWeekFilter();
    const [filter, setFilter] = useState(currentWeek);

    const weekFilter = (start, end) => {
      const startTime = {};
      startTime[calendarStart] = { gteq: start };

      const endTime = {};
      endTime[calendarEnd] = { lteq: end };

      setFilter({
        ...startTime,
        ...endTime,
      });
    };

    const { data } =
      model &&
      useAllQuery(model, {
        rawFilter: filter,
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

    const customButtons = {
      prev: {
        click: () => {
          const calendar = calendarRef.current.getApi();
          calendar.prev();
          weekFilter(calendar.view.activeStart, calendar.view.activeEnd);
        },
      },
      next: {
        click: () => {
          const calendar = calendarRef.current.getApi();
          calendar.next();
          weekFilter(calendar.view.activeStart, calendar.view.activeEnd);
        },
      },
      today: {
        text: 'today',
        click: () => {
          const calendar = calendarRef.current.getApi();
          calendar.today();
          weekFilter(calendar.view.activeStart, calendar.view.activeEnd);
        },
      },
    };

    const eventClick = (info) => {
      alert('Event :', info.event.title);
    };

    const handleDateClick = () => {};

    const today = new Date().toISOString().slice(0, 10);

    const selectConstraint = {
      start: today,
    };

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
          {/* select */}
          {/* switch */}
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
            selectable
            select={handleDateClick}
            events={results}
            eventClick={eventClick}
            selectConstraint={selectConstraint}
            customButtons={customButtons}
            ref={calendarRef}
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
        '& .fc': {
          fontFamily: 'Ubuntu, sans-serif',
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
          fontFamily: 'Ubuntu, sans-serif',
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
          maxHeight: '40px',
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
          fontStyle: 'inherit !important',
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
        '& .fc-timegrid-event-harness': {
          cursor: 'pointer',
        },
        '& .fc-button-primary:disabled': {
          color: 'inherit',
          backgroundColor: 'inherit',
          borderColor: 'inherit',
        },
        '& .fc-button:hover': {
          backgroundColor: 'rgba(158,158,158,0.2)',
          color: 'inherit',
        },
        '& .fc-button:acitve': {
          backgroundColor: 'rgba(158,158,158,0.2)',
          color: 'inherit',
        },
        '& .fc .fc-button-primary:not(:disabled):active, .fc .fc-button-primary:not(:disabled).fc-button-active':
          {
            color: 'inherit',
            backgroundColor: 'rgba(158,158,158,0.2)',
            borderColor: 'inherit',
          },
        '& .fc .fc-button-primary:not(:disabled):active:focus, .fc .fc-button-primary:not(:disabled).fc-button-active:focus':
          {
            boxShadow: 'none',
          },
        '& .fc-button:focus': {
          boxShadow: 'none',
        },
      },
    };
  },
}))();
