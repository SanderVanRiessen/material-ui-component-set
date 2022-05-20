(() => ({
  name: 'calendar',
  type: 'BODY_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const { env, useAllQuery, getProperty, useFilter } = B;
    const { FullCalendar, dayGridPlugin, interactionPlugin, timeGridPlugin } =
      window.MaterialUI;
    const isDev = env === 'dev';
    const {
      model,
      nameProperty,
      startProperty,
      endProperty,
      colorProperty,
      modelAdvanced,
      eventNameProperty,
      eventColorProperty,
      filter,
      visible,
    } = options;
    const { name: calendarname } = getProperty(nameProperty) || {};
    const { name: calendarStart } = getProperty(startProperty) || {};
    const { name: calendarEnd } = getProperty(endProperty) || {};
    const { name: calendarColor } = getProperty(colorProperty) || {};
    const { name: eventName } = getProperty(eventNameProperty) || {};
    const { name: eventColor } = getProperty(eventColorProperty) || {};

    const [results, setResults] = useState([]);
    const [resultsEvent, setResultsEvent] = useState([]);
    const [interactionFilter, setInteractionFilter] = useState({});
    const [isVisible, setIsVisible] = useState(true);

    const calendarRef = React.useRef();

    const transformValue = (value) => {
      if (value instanceof Date) {
        return value.toISOString();
      }

      return value;
    };

    const deepMerge = (...objects) => {
      const isObject = (item) =>
        item && typeof item === 'object' && !Array.isArray(item);

      return objects.reduce((accumulator, object) => {
        Object.keys(object).forEach((key) => {
          const accumulatorValue = accumulator[key];
          const value = object[key];

          if (Array.isArray(accumulatorValue) && Array.isArray(value)) {
            accumulator[key] = accumulatorValue.concat(value);
          } else if (isObject(accumulatorValue) && isObject(value)) {
            accumulator[key] = deepMerge(accumulatorValue, value);
          } else {
            accumulator[key] = value;
          }
        });
        return accumulator;
      }, {});
    };

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
    const [eventfilter, setEventFilter] = useState(currentWeek);

    const weekFilter = (start, end) => {
      const startTime = {};
      startTime[calendarStart] = { gteq: start };

      const endTime = {};
      endTime[calendarEnd] = { lteq: end };

      setEventFilter({
        ...startTime,
        ...endTime,
      });
    };

    let interactionFilters = {};

    const isEmptyValue = (value) =>
      !value || (Array.isArray(value) && value.length === 0);

    const clauses = Object.entries(interactionFilter)
      .filter(([, { value }]) => !isEmptyValue(value))
      .map(([, { property, value }]) =>
        property.id.reduceRight((acc, field, index, arr) => {
          const isLast = index === arr.length - 1;
          if (isLast) {
            return Array.isArray(value)
              ? {
                  // _or: value.map((el) => ({
                  [field]: { [property.operator]: value[0] },
                  // })),
                }
              : { [field]: { [property.operator]: value } };
          }

          return { [field]: acc };
        }, {}),
      );
    interactionFilters =
      clauses.length > 1 ? { _and: clauses } : clauses[0] || {};

    const where = useFilter(interactionFilters);
    const optionfilter = useFilter(filter);

    const completeFilter = deepMerge(eventfilter, where, optionfilter);

    const { data, refetch } =
      model &&
      useAllQuery(model, {
        rawFilter: completeFilter,
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
          B.triggerEvent('onError', resp);
        },
      });

    useEffect(() => {
      if (!isDev && data) {
        const newArray = [];
        data.results.forEach((dataObject) => {
          const Newobject = {
            title: dataObject[calendarname],
            start: dataObject[calendarStart],
            end: dataObject[calendarEnd],
            color: dataObject[calendarColor],
          };
          newArray.push(Newobject);
        });
        setResults(newArray);
      }
    }, [data]);

    const { data: eventData } =
      modelAdvanced &&
      useAllQuery(modelAdvanced, {
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
          B.triggerEvent('onError', resp);
        },
      });

    useEffect(() => {
      if (!isDev && eventData) {
        const legendArray = [];
        eventData.results.forEach((dataObject) => {
          const legendObject = {
            title: dataObject[eventName],
            color: dataObject[eventColor],
            id: dataObject.id,
          };

          legendArray.push(legendObject);
        });
        setResultsEvent(legendArray);
      }
    }, [eventData]);

    useEffect(() => {
      setIsVisible(visible);
    }, []);

    useEffect(() => {
      B.defineFunction('Hide', () => setIsVisible(false));
      B.defineFunction('Show', () => setIsVisible(true));
      B.defineFunction('Show/Hide', () => setIsVisible((s) => !s));
      B.defineFunction('Refetch', () => refetch());

      /**
       * @name Filter
       * @param {Property} property
       * @returns {Void}
       */
      B.defineFunction('Filter', ({ event, property, interactionId }) => {
        setInteractionFilter((s) => ({
          ...s,
          [interactionId]: {
            property,
            value: event.target ? event.target.value : transformValue(event),
          },
        }));
      });

      B.defineFunction('ResetFilter', () => {
        setInteractionFilter({});
      });
    }, []);
    console.log('results:', results);

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

    const selectHandler = (selectionInfo) => {
      alert(selectionInfo.start);
      alert(selectionInfo.end);
    };

    const today = new Date().toISOString().slice(0, 10);

    const selectConstraint = {
      start: today,
    };

    // eslint-disable-next-line no-nested-ternary
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
    ) : isVisible ? (
      <div className={classes.root}>
        <div className="top-header" />
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
            select={selectHandler}
            eventClick={eventClick}
            events={results}
            selectConstraint={selectConstraint}
            customButtons={customButtons}
            ref={calendarRef}
          />
        </>

        <div className="legend">
          {resultsEvent.map((legend) => (
            <div key={legend.id} className="legendbox">
              <div className="legenditem">
                <div
                  className="colorBlock"
                  style={{ backgroundColor: legend.color }}
                />
                <p>{legend.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <p />
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
          overflow: 'auto !important',
          height: 'auto !important',
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
