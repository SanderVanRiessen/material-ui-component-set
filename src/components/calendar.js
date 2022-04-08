(() => ({
  name: 'calendar',
  type: 'BODY_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    // eslint-disable-next-line no-debugger
    debugger;
    const { env } = B;
    const isDev = env === 'dev';
    const { useAllQuery } = B;
    const { model } = options;
    // const where = useFilter(filter);
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
        setResults(data.results);
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
    console.log(results);
    if (isDev) {
      return (
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
      );
    }
    return (
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
            selectable
            select={handleDateClick}
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
