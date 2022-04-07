(() => ({
  name: 'calendar',
  type: 'BODY_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const { FullCalendar, dayGridPlugin, interactionPlugin, timeGridPlugin } =
      window.MaterialUI;
    const { env } = B;

    const handleDateClick = () => {};

    const isDev = env === 'dev';

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
