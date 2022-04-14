(() => ({
  name: 'calendar',
  type: 'BODY_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const { env, useAllQuery, getProperty } = B;
    const isDev = env === 'dev';
    const { model, titleProperty, startProperty, endProperty } = options;
    const { name: calendarTitle } = getProperty(titleProperty) || {};
    const { name: calendarStart } = getProperty(startProperty) || {};
    const { name: calendarEnd } = getProperty(endProperty) || {};
    const [results, setResults] = useState([]);

    const { loading, error, data } =
      model &&
      useAllQuery(model, {
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
          const Newobject = {
            title: dataObject[calendarTitle],
            start: dataObject[calendarStart],
            end: dataObject[calendarEnd],
          };
          newArray.push(Newobject);
        }
        setResults(newArray);
      }
    }, [data]);

    if (loading) {
      return <div>Loading...</div>;
    }
    if (error) {
      return (
        <div>
          Something went wrong.
          <br />
          {error.message}
        </div>
      );
    }
    const { FullCalendar, dayGridPlugin, interactionPlugin, timeGridPlugin } =
      window.MaterialUI;

    const handleDateClick = () => {};

    const headerToolbar = {
      left: 'timeGridWeek,timeGridDay',
      center: 'title',
      right: 'prev,today,next',
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

    const newDate = new Date();
    let date = newDate.getDate('DD');
    if (date < 10) {
      date = `0${date}`;
    }
    let month = (newDate.getMonth('MM') + 1).toString();
    if (month < 10) {
      month = `0${month}`;
    }
    const year = newDate.getFullYear().toString();
    const today = `${year}-${month}-${date}`;

    let selectAllow = {};
    if (selectAllow === today) {
      selectAllow = true;
    }
    return isDev ? (
      <div className={classes.root}>
        <>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin]}
            initialView="timeGridWeek"
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
        <>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
            initialView="timeGridWeek"
            allDaySlot={false}
            slotMinTime="07:00:00"
            slotMaxTime="21:00:00"
            slotLabelFormat={slotLabelFormat}
            // slotDuration="00:15:00"
            // slotLabelInterval="00:60:00"
            weekends={false}
            nowIndicator
            headerToolbar={headerToolbar}
            // validRange={validRange}
            selectable
            select={handleDateClick}
            events={results}
            selectAllow={selectAllow}
          />
        </>
      </div>
    );
  })(),
  styles: () => () => {
    return {
      root: {},
    };
  },
}))();
