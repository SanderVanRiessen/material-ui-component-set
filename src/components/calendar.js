(() => ({
  name: 'calendar',
  type: 'BODY_COMPONENT',
  allowedTypes: [],
  orientation: 'HORIZONTAL',
  jsx: (() => {
    const { FullCalendar, dayGridPlugin, interactionPlugin, timeGridPlugin } =
      window.MaterialUI;

    const handleDateClick = () => {
      // bind with an arrow function
    };

    const headerToolbar = {
      left: 'timeGridWeek,timeGridDay',
      center: 'title',
      right: 'prev,today,next',
    };

    return (
      <div className={classes.root}>
        <>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
            initialView="timeGridWeek"
            weekends={false}
            nowIndicator
            headerToolbar={headerToolbar}
            dateClick={handleDateClick}
            selectable
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
